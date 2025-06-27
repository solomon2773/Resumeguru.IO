import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const experienceBulletPointModel = {
        functions: [
            {
                name: "experienceBulletPointModel",
                description: "Generate experience bullet point model",
                parameters: zodToJsonSchema(z.object({
                    experienceRewrite: z.string(),
                    matchingSkills: z.array(z.string()),
                })),

            },
        ],
        function_call: { name: "experienceBulletPointModel" },
    };

export const experienceParagraphModel = {
    functions: [
        {
            name: "experienceParagraphModel",
            description: "Generate experience paragraph style model",
            parameters: zodToJsonSchema(z.object({
                experienceRewrite: z.string(),
                matchingSkills: z.array(z.string()),
            })),

        },
    ],
    function_call: { name: "experienceParagraphModel" },
};
