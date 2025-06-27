import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const linkedinConnectionMessageModel = {
    functions: [
        {
            name: "linkedinConnectionMessageModel",
            description: "Generate Linkedin Connection Message model",
            parameters: zodToJsonSchema(z.object({
                linkedinConnectionMessage:
                    z.string().describe("Generated Linkedin Connection Message Text Here."),


            })),
        },
    ],
    function_call: { name: "linkedinConnectionMessageModel" },
};

