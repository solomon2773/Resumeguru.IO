import os
import autogen
from user_proxy_webagent import UserProxyWebAgent
from groupchatweb import GroupChatManagerWeb
import asyncio
import json
from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from bson import json_util # Ensure this import is present

# MongoDB connection - moved to environment variable
uri = os.getenv('MONGODB_URI', 'mongodb+srv://xxxxxx.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=xxxxx')
# It's good practice to wrap client initialization in a try-except block
try:
    client = MongoClient(uri,
                         tls=True,
                         tlsCertificateKeyFile=os.getenv('TLS_CERTIFICATE_KEY_FILE'),
                         server_api=ServerApi('1'),
                         connectTimeoutMS=5000, # Optional: Add a connection timeout
                         serverSelectionTimeoutMS=5000 # Optional: Add a server selection timeout
                         )
    # Perform a ping to confirm connection
    client.admin.command('ping')
    print("MongoDB connection successful at script initialization.")
    db2 = client['ResumeGuru']
except Exception as e:
    print(f"FATAL: MongoDB initial connection failed: {e}")
    # Depending on your application, you might want to exit or raise the exception
    # For now, db2 might not be initialized if this fails.
    db2 = None # Ensure db2 is defined even on failure to avoid NameError later, or handle more gracefully

config_list = [
    {
        "model": "gpt-4o",
        "api_type": "azure",
        "api_key": os.getenv('AZURE_OPENAI_API_KEY', 'xxxxxxx'),  # Moved to environment variable
        "base_url": os.getenv('AZURE_OPENAI_BASE_URL', 'https://xxxxxx.openai.azure.com/'),  # Moved to environment variable
        "api_version": "2024-04-01-preview"
    },
]
llm_config_assistant = {
    "temperature": 0,
    "config_list": config_list,
    # "functions": [
    #     {
    #         "name": "search_db_job_description",
    #         "description": "Search database for existing job descriptions",
    #         "parameters": {
    #             "type": "object",
    #             "properties": {
    #                 "userId": {
    #                     "type": "string",
    #                     "description": "User ID",
    #                 }
    #             },
    #             "required": ["userId"],
    #         },
    #     },
    # ],
}
llm_config_proxy = {
    "temperature": 0,
    "config_list": config_list,
}


############################################################################################
# this is where you put your Autogen logic, here I have a simple 2 agents with a function call
class AutogenChat():
    def __init__(self, chat_id=None, user_id=None, websocket=None, db=None): # The 'db' param is not used if db2 is global
        self.db = db # This self.db is not used by search_db_job_description if it uses global db2

        self.websocket = websocket
        self.chat_id = chat_id
        self.user_id = user_id
        self.client_sent_queue = asyncio.Queue()
        self.client_receive_queue = asyncio.Queue()

        self.interviewAgent = autogen.AssistantAgent(
            name="InterviewerAgent",
            llm_config=llm_config_assistant,
            system_message="You are the Interviewer Agent and your name is Hannah. You work for ResumeGuru.IO. "
                           "You ask relevant technical and behavioral questions based on the job description and user input. "
                           "Search database first and list the newest 5 jobs with company name and job title. User can descide which one to start the interview process."
                           "If no job description is found, ask the user to provide the job description."
                           "Each time only ask one question. Do not return any special characters like hashtags or brackets.  ",
            code_execution_config={"use_docker": False}
        )
        self.dbSearchAgent = autogen.AssistantAgent(
            name="DatabaseSearchAgent",
            llm_config=llm_config_assistant,
            # function_map={
            #     "search_db_job_description": self.search_db_job_description
            # },
            # tools=[self.search_db_job_description],
            # reflect_on_tool_use=False,
            system_message="Your job is to search the database for all of the job description based on the user id :" + str(self.user_id) + " and return the result to the user.",
        )
        self.feedbackAgent = autogen.AssistantAgent(
            name="FeedbackAgent",
            llm_config=llm_config_assistant,
            system_message="You provide real-time feedback on the candidate's answers, analyzing them for completeness, relevance, and clarity.",
        )
        self.critic = autogen.AssistantAgent(
            name="critic",
            llm_config=llm_config_assistant,
            system_message="""You are a helpful assistant, you should validate the ideas from the interview agent, once done return the idea to the user"""
        )
        self.user_proxy = UserProxyWebAgent(
            name="UserProxyAgent",
            human_input_mode="ALWAYS",
            system_message="""You ask for a job description or some details about the role the candidate is applying for?""",
            is_termination_msg=lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("TERMINATE"),
            code_execution_config=False,
        )
        self.user_proxy.set_queues(self.client_sent_queue, self.client_receive_queue)
        self.groupchat = autogen.GroupChat(
            agents=[
                self.user_proxy,
                self.interviewAgent,
                self.dbSearchAgent,
                self.critic
            ], messages=[], max_round=20)
        self.manager = GroupChatManagerWeb(
            groupchat=self.groupchat,
            llm_config=llm_config_assistant,
            human_input_mode="ALWAYS" )

    def convert_cursor_to_json_string(cursor_data_list):
        """Converts a list of BSON documents to a JSON string."""
        return json_util.dumps(cursor_data_list)

    def search_db_job_description(self, userId=None):
        print(f"[search_db_job_description] Called with userId: {userId}")

        if db2 is None:
            print("[search_db_job_description] ERROR: Database client (db2) is not initialized.")
            return {"status": "error", "message": "Database client not initialized."}

        cert_path = os.getenv('TLS_CERTIFICATE_KEY_FILE')
        print(f"[search_db_job_description] TLS_CERTIFICATE_KEY_FILE from env: {cert_path}")
        if not cert_path:
            print("[search_db_job_description] ERROR: TLS_CERTIFICATE_KEY_FILE environment variable is not set.")
            return {"status": "error", "message": "Server configuration error: Missing certificate path."}

        if not os.path.exists(cert_path):
            print(f"[search_db_job_description] ERROR: Certificate file not found at path: {cert_path}")
            return {"status": "error", "message": f"Server configuration error: Certificate file missing at {cert_path}."}

        print(f"[search_db_job_description] Certificate file confirmed at: {cert_path}")

        try:
            # Ping the database again before the query to ensure the connection is active
            client.admin.command('ping') # Uses the global 'client'
            print("[search_db_job_description] MongoDB ping successful before query.")

            projection = {
                "JDInfoExtractMessageContent": 1,
                "lastUpdate": 1,
                # "_id" is included by default. json_util handles ObjectId.
            }

            print(f"[search_db_job_description] Querying 'jobDescription' for userId: {userId}")

            cursor = db2['jobDescription'].find(
                {"userId": userId},
                projection
            ).sort("lastUpdate", -1).limit(5)

            print("[search_db_job_description] Query executed. Attempting to convert cursor to list...")
            results_list = list(cursor) # This is a potential hanging point

            print(f"[search_db_job_description] Found {len(results_list)} documents.")

            if not results_list:
                return {
                    "status": "fail",
                    "message": "No job descriptions found for the given user ID"
                }

            # Convert the list of documents to a JSON string
            json_output_string = AutogenChat.convert_cursor_to_json_string(results_list)
            # print(f"[search_db_job_description] JSON output: {json_output_string}") # Uncomment for debugging

            return {
                "status": "success",
                "data": json_output_string # Return JSON string
            }
        except errors.ConnectionFailure as e:
            print(f"[search_db_job_description] MongoDB ConnectionFailure: {e}")
            return {"status": "error", "message": f"Database connection failure: {e}"}
        except errors.OperationFailure as e:
            print(f"[search_db_job_description] MongoDB OperationFailure: {e}. Check MongoDB logs for details (e.g., auth/X.509 issues).")
            return {"status": "error", "message": f"Database operation failure: {e}"}
        except Exception as e:
            print(f"[search_db_job_description] An unexpected error occurred: {e}")
            import traceback
            traceback.print_exc()
            return {
                "status": "error",
                "message": f"An unexpected error occurred: {str(e)}"
            }

    async def start(self, message):
        await self.user_proxy.a_initiate_chat(
            self.manager,
            clear_history=True,
            message=message
        )