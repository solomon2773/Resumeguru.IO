import {
    mongodbInsertNewJobDescription,
    mongodbUpdateJobDescription,

} from '../mongodb/pages/api/resume';
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
} from "langchain/prompts";

import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";


export async function jdInfoExtractLangChainApi(jdInfoExtractBody) {
    try {
        const postData = jdInfoExtractBody.data;

        const startTime = Date.now();

        /// JD info extract
        const outputSchema = z.object({
            companyName: z.string().describe("The name of the company from the job description"),
            jobTitle: z.string().describe("The job title from the job description"),
            keyResponsibilities: z.array(z.string())
                .describe("An array of keyResponsibilities mentioned in the job description"),
            requiredSkills: z.array(z.string())
                .describe("An array of requiredSkills mentioned in the job description"),
            qualifications: z.array(z.string())
                .describe("An array of qualifications mentioned in the job description"),

        });
        const chatPrompt = new ChatPromptTemplate({
            promptMessages: [
                SystemMessagePromptTemplate.fromTemplate(
                    "Based on the provided job description, get the 'companyName','jobTitle' ,  'keyResponsibilities' , 'requiredSkills','qualifications' as mentioned in the job description."
                ),
                HumanMessagePromptTemplate.fromTemplate("{inputJDText}"),
            ],
            inputVariables: ["inputJDText"],
        });


        const modelOpenAI = new ChatOpenAI({
            temperature: 1,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const chain = new createStructuredOutputChainFromZod(outputSchema,{
            llm: modelOpenAI,
            prompt: chatPrompt,
        });

        const llmCasllResult = await chain.call({
            inputJDText: postData.futureJobDescription,
        });
        const llmCasllResultJson = await llmCasllResult.output;
        //console.log(llmCasllResultJson)
        //console.log(JSON.stringify(llmCasllResult.output, null, 2));
        // TODO: adding token tracking

        // console.log("postData",postData)
        const endTime = Date.now();
        const fetchTime = endTime - startTime;
        // if (checkJsonReturn) {
        //     const choiceJson = await JSON.parse(choiceFixed)
            const jdExtractResult =   await mongodbUpdateJobDescription({
                jdTemplateName: postData.jobDescriptionTemplateNameRef ? postData.jobDescriptionTemplateNameRef : llmCasllResultJson.jobTitle + " @ " + llmCasllResultJson.companyName,
                postData,
                JDInfoExtractMessageContent:llmCasllResultJson,
                fetchTime: fetchTime,
                prompt: chatPrompt,
            },  jdInfoExtractBody.userId);

        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: jdInfoExtractBody.userId,
            resumeObjectId: postData.objectId,
            credit: 100,
            apiCallPostData: postData,
            apiCallResult: llmCasllResult,
            creditUsageType: "jdInfoExtractLangChain",
            detailName: "Generate Job Description Info",
            detailText: "Generate Job Description Info API Call",
        });

        return {
            JDInfoExtractMessageContent:llmCasllResultJson,
            lastInsertedId:jdExtractResult
        }
    } catch (error) {
        console.error("error while excecuting  jdInfoExtractLangChainApi function :", error);
        return false;
    }
}

