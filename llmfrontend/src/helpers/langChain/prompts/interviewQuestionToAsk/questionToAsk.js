import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const interviewQuestionToAskPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
        "Act as a job seeker. Convert the input {inputData} string into json object first and understand the json object data." +
            "Formulate a well-researched list of 5 insightful questions that you can ask the interviewer to get a better understanding of the company, and its culture. " +
            "The questions should demonstrate your interest in the company and the position you are interviewing for. Some examples of topics to cover are the company's mission statement, the team's structure and communication processes, company goals and growth potential, the challenges typically faced in the role, how success is measured, and insights about the company's culture. " +
            "Ensure the questions are open-ended and allow for detailed and informative responses.\n" +
            "The output will be an object with key name interviewQuestionsToAsk, and the value will be an array of objects and each object has [Generated Interview Question To Ask Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

export  const interviewQuestionToAskAITargetPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a job seeker. Convert the input {inputData} string into json object first and understand the json object data." +
            "Formulate a well-researched list of 5 insightful questions that you can ask the interviewer to get a better understanding of the company, and its culture. " +
            "The questions should demonstrate your interest in the company and the position you are interviewing for. Some examples of topics to cover are the company's mission statement, the team's structure and communication processes, company goals and growth potential, the challenges typically faced in the role, how success is measured, and insights about the company's culture. " +
            "Ensure the questions are open-ended and allow for detailed and informative responses. Also keep keyResponsibilities and requiredSkills into considerations." +
            "The output will be an object with key name interviewQuestionsToAsk, and the value will be an array of objects and each object has [Generated Interview Question To Ask Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

