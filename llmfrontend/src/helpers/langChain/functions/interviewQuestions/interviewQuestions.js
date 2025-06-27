import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const interviewQuestionsModel = {
    functions: [
        {
            name: "interviewQuestionsModel",
            description: "Generate interview questions model",
            parameters: zodToJsonSchema(z.object({
                interviewQuestions: z.array(
                    z.object({
                    question:z.string().describe("A question to be asked during the interview."),
                    uuid:z.string().describe("A version 4 UUID associated with the question."),
                    }),

                ).describe("An array of interview questions, each with a question and a UUID."),
            })),
        },
    ],
    function_call: { name: "interviewQuestionsModel" },
};


export const interviewQuestionAnswerModel = {
    functions: [
        {
            name: "interviewQuestionAnswerModel",
            description: "Generate an interview question answer model",
            parameters: zodToJsonSchema(z.object({
                interviewQuestionAnswer: z.array(
                    z.object({
                        situation:z.string().describe("Answer using STAR method and put the answer situation here"),
                    }),
                    z.object({
                        task:z.string().describe("Answer using STAR method and put the answer task here"),
                    }),
                    z.object({
                        action:z.string().describe("Answer using STAR method and put the answer action here"),
                    }),
                    z.object({
                        result:z.string().describe("Answer using STAR method and put the answer result here"),
                    }),

                ).describe("An object with key name interviewQuestionAnswer and the value is an array of objects with key name 'situation', 'task', 'action', 'result'."),
            })),
        },
    ],
    function_call: { name: "interviewQuestionAnswerModel" },
};
