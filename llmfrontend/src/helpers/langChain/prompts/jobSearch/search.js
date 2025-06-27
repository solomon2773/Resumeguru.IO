import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const jobSearchQueryPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a job search assistant. Your task is to extract key data from a job search query by under stand the query string => {jobSearchQuery}" +
            "Please ensure that the return is structured correctly in a JSON format and contains the following fields:"+
            "query: The job title being searched for ."+
            "location: The country or city where the job is located."+
            "distance: Distance from the search query location (in miles or kilometers)."+
            "language: Language code for the search query ."+
            "remoteOnly: Whether the job is remote only (true or false)."+
            "datePosted: How new the post is (e.g., last 24 hours, last 7 days, last 30 days)."+
            "employment: Employment type (fulltime or parttime)."


        ),
        HumanMessagePromptTemplate.fromTemplate("{jobSearchQuery}"),
    ],
    inputVariables: ["jobSearchQuery"],
};

