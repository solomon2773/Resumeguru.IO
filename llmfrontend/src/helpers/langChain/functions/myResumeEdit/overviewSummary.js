import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const overviewSummaryModel = {
        functions: [
            {
                name: "overviewSummaryModel",
                description: "Generate overview summary model",
                parameters: zodToJsonSchema(z.object({
                    overviewRewrite: z.string(),
                    overviewRewriteTitle: z.string(),
                })),
            },
        ],
        function_call: { name: "overviewSummaryModel" },
    };


