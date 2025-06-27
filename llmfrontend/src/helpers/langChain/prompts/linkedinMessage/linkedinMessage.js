import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const linkedinConnectionMessagePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a linkedin connection message expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "As a job seeker, you are the best candidate for an open role, you are highly qualified, and you are connecting with the recruiter / hiring manager on linkedin. Please write 250 characters or less LinkedIn connection request messages for the person to accept the connection." +
            "Make sure to be short and sweet with the job's jobTitle, companyName and put my experienceLevel into consideration. Everytime generate a different greeting based on the job." +
            "The return needs to be in JSON format.Instructions:" +
            "Create a text that can be directly inserted into a JSON object under the key 'linkedinConnectionMessage'. "


        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};



export  const linkedinConnectionMessageAITargetPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a linkedin connection message expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "As a job seeker, you are the best candidate for an open role, you are highly qualified, and you are connecting with the recruiter / hiring manager on linkedin. " +
            "Please write 250 characters or less LinkedIn connection request messages for the person to accept the connection." +
            "Make sure to be short and sweet with the job's jobTitle, companyName and emphasize the seeker's match to the job's keyResponsibilities and requiredSkills. Everytime generate a different greeting based on the job." +
            "The return needs to be in JSON format.Instructions:" +
            "Create a text that can be directly inserted into a JSON object under the key 'linkedinConnectionMessage'. "


        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

export  const linkedinConnectionMessageEasyModePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a linkedin connection message expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "As a job seeker, you are the best candidate for an open role, you are highly qualified, and you are connecting with the recruiter / hiring manager on linkedin. Please write 250 characters or less LinkedIn connection request messages for the person to accept the connection." +
            "Make sure to be short and sweet with the job's jobTitle, companyName. Use either savedJobDescriptionDetail or jobDescriptionPrompt as the main input data to be consider." +
            "Everytime generate a different greeting based on the job. If the info is not enough just put 'Not enough information provided' for the output." +
            "The return needs to be in JSON format with the key name 'linkedinConnectionMessage'."



        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};



export  const linkedinConnectionMessageManualPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a linkedin connection message expert.  Convert the input {inputData} string into json object first and understand the json object data." +
            "As a job seeker, you are the best candidate for an open role, you are highly qualified, and you are connecting with the recruiter / hiring manager on linkedin. " +
            "Please write 250 characters or less LinkedIn connection request messages for the person to accept the connection." +
            "Use promptExtraInfo as extra info to generate a message, if the info is not enough just put 'Not enough information provided' for the output." +
            "The return needs to be in JSON format.Instructions:" +
            "Create a text that can be directly inserted into a JSON object under the key 'linkedinConnectionMessage'. "


        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
