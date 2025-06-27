import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const coverLetterModel = {
    functions: [
        {
            name: "coverLetterModel",
            description: "Generate cover letter model",
            parameters: zodToJsonSchema(z.object({
                coverLetterAiGenerate: z.string(),
                coverLetterCandidateStrengthAiGenerate: z.array( z.string()),
            })),
        },
    ],
    function_call: { name: "coverLetterModel" },
};


