import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const interviewQuestionsPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as an interview expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "Create a list of 5 interview questions for a position with jobTitle at companyName. Include 1 to 2 general or behavioral questions that explore interpersonal skills and work ethic. " +
            "The remaining questions should be specific to the role, focusing on real-world , hand-on problem and scenarios that reflect the specific experienceLevel.\n" +
            "Please keep the answers succinct without an overly professional or stiff tone.\n"+
            "The output will be an array of object with key name interviewQuestions, each object has [Generated Interview Question 1 Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"



        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

export  const interviewQuestionsAITargetPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as an interview expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "Create a list of 5 interview questions for a position with jobTitle at companyName. Include 1 to 2 general or behavioral questions that explore interpersonal skills and work ethic. " +
            "The remaining questions should be specific to the role, focusing on keyResponsibilities, requiredSkills, and scenarios that reflect my professional experiences.\n" +
            "Maybe include one technical question, if available. For example, if it's a software job, the question can be a coding question related to the keyResponsibilities or requiredSkills." +
            "If it's an accounting job, may include an accounting situation " +
            "Please keep the answers succinct without an overly professional or stiff tone.\n"+
            "The output will be an array of object with key name interviewQuestions, each object has [Generated Interview Question 1 Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

export  const interviewQuestionAnswerPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as an interview expert. Create a professional interview question answer draft based on the provided job title : {jobTitle}, company name : {companyName}, question : {interviewQuestion}. " +
            "Start by collecting all the relevant details about the candidate, such as their job experience, educational qualifications, core competencies, and any special achievements in the field, and incorporate with values, mission, products, or from the job description highlighting the essential skills and experience required for the job based on the job description with a minimum of 250 words, can be more.\n" +
            "Suggestion on how to answer an interview question using STAR method.\n"+
            "Instructions:\n" +
            "Create a text that can be directly inserted into a JSON object under the key 'interviewQuestionAnswer' and an array of objects with key name 'situation', 'task', 'action', 'result'.\n "

        ),
        HumanMessagePromptTemplate.fromTemplate("{jobTitle},{interviewQuestion},{companyName}"),
    ],
    inputVariables: ["jobTitle","interviewQuestion","companyName"],
};


