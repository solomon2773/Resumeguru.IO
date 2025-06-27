import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const interviewQuestionsToAskModel = {
    functions: [
        {
            name: "interviewQuestionsToAskModel",
            description: "Generate interview questions to ask model",
            parameters: zodToJsonSchema(z.object({
                interviewQuestionToAsk: z.array(
                    z.object({
                    question:z.string().describe("A question to be asked during the interview."),
                    uuid:z.string().describe("A version 4 UUID associated with the question."),
                    }),

                ).describe("An object of interview questions to ask, inside the object is an array of objects and each with a question and a UUID."),
            })),
        },
    ],
    function_call: { name: "interviewQuestionsToAskModel" },
};


