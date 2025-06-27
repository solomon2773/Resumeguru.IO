import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const recommendAnswerModel = {
    functions: [
        {
            name: "recommendAnswerModel",
            description: "Generate recommend answer for a mock interview question model",
            parameters: zodToJsonSchema(z.object({
                recommendAnswer: z.string(),
            })),
        },
    ],
    function_call: { name: "recommendAnswerModel" },
};


