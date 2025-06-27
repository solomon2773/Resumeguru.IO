import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const jobSearchModel = {
    functions: [
        {
            name: "jobSearchModel",
            description: "Job Search query model",
            parameters: zodToJsonSchema(z.object({

                query: z.string().describe("The job title being searched for"),
                location: z.string().describe("The country or city where the job is located"),
                distance: z.string().describe("Distance from the search query location (in miles or kilometers)"),
                language: z.string().describe("Language code for the search query"),
                remoteOnly: z.boolean().describe("Whether the job is remote only (true or false)"),
                datePosted: z.string().describe("How new the post is (e.g., last 24 hours, last 7 days, last 30 days)"),
                employment: z.string().describe("Employment type (fulltime or parttime)"),
            })),
        },
    ],
    function_call: { name: "jobSearchModel" },
};


