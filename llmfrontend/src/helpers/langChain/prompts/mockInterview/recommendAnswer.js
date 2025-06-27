import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const recommendAnswerPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a mock interview expert. Convert the input {inputData} string into json object first and understand the json object data.\n" +
            "Based on jobDescription and groupChatReplyQuestion to provide a professional answer for the question. \n"+
            "If the information provided is missing important metric or non related topic, reply back ***Not enough data to generate a recommended answer.***" +
            "The output will be an object with recommendAnswer ."

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData",],
};

