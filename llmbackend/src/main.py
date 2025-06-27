from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
import asyncio
import uvicorn
from autogen_group_chat import AutogenChat
from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from datetime import datetime
import os

app = FastAPI()
app.autogen_chat = {}
# auth key for the websocket connection - moved to environment variable
AUTH_KEY = os.getenv('WEBSOCKET_AUTH_KEY', 'default-dev-key-change-in-production')

# MongoDB connection - moved to environment variable
uri = os.getenv('MONGODB_URI', 'mongodb+srv://xxxxxx.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=xxxxx')
client = MongoClient(uri,
                     tls=True,
                     tlsCertificateKeyFile=os.getenv('TLS_CERTIFICATE_KEY_FILE'),
                     server_api=ServerApi('1'))
db = client['ResumeGuru']
messages_collection = db['mockInterviewChatLog']
job_descriptions_collection = db['jobDescription']

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[AutogenChat] = []

    async def connect(self, autogen_chat: AutogenChat):
        await autogen_chat.websocket.accept()
        self.active_connections.append(autogen_chat)

    async def disconnect(self, autogen_chat: AutogenChat):
        if autogen_chat in self.active_connections:
            autogen_chat.client_receive_queue.put_nowait("DO_FINISH")
            print(f"autogen_chat {autogen_chat.chat_id} disconnected")
            self.active_connections.remove(autogen_chat)


manager = ConnectionManager()

async def log_message(chat_id: str, user_id:str, direction: str, message: str):
    message_record = {
        "chatId": chat_id,
        "userId": user_id,
        "direction": direction,
        "message": message,
        "timestamp": datetime.utcnow()
    }
    try:
        messages_collection.insert_one(message_record)
    except errors.PyMongoError as e:
        print(f"MongoDB Error: {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")

async def send_to_client(autogen_chat: AutogenChat, user_id:str):
    while True:
        try:
            reply = await autogen_chat.client_receive_queue.get()
            if reply and reply == "DO_FINISH":
                autogen_chat.client_receive_queue.task_done()
                break
            # print(reply)
            await autogen_chat.websocket.send_text(reply)
            await log_message(autogen_chat.chat_id,user_id, "sentToClient", reply)
            autogen_chat.client_receive_queue.task_done()
            await asyncio.sleep(0.05)
        except WebSocketDisconnect:
            break

async def receive_from_client(autogen_chat: AutogenChat, user_id:str ):
    while True:
        try:
            data = await autogen_chat.websocket.receive_text()
            if data and data == "DO_FINISH":
                await autogen_chat.client_receive_queue.put("DO_FINISH")
                await autogen_chat.client_sent_queue.put("DO_FINISH")
                break
            await autogen_chat.client_sent_queue.put(data)
            await log_message(autogen_chat.chat_id,user_id, "receivedFromClient", data)
            await asyncio.sleep(0.05)
        except WebSocketDisconnect:
            break

@app.websocket("/chatMockInterview/{chat_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str,  auth_key: str, user_id: str):
    if auth_key != AUTH_KEY:
        await websocket.close(code=1008, reason="Unauthorized")
        raise HTTPException(status_code=403, detail="Unauthorized")
    try:
        autogen_chat = AutogenChat(chat_id=chat_id, user_id=user_id, websocket=websocket, db=db)
        await manager.connect(autogen_chat)
        # await autogen_chat.websocket.send_text("Hi! I'm Hannah , a mock interview assistant from ResumeGuru.IO. My goal is to help you practice your interview skills. Let's get started by copy and paste a job description here. ")
        data = await autogen_chat.websocket.receive_text()
        await log_message(chat_id, user_id, "receivedFromClient", data)
        future_calls = asyncio.gather(send_to_client(autogen_chat,user_id), receive_from_client(autogen_chat, user_id))
        await autogen_chat.start(data)
        print("DO_FINISHED")
    except Exception as e:
        print("ERROR", str(e))
    finally:
        try:
            await manager.disconnect(autogen_chat)
        except:
            pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
