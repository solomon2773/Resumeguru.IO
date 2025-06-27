import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export default async function handler(req, res) {
    const { authorization } = req.headers;

    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    if (authorization !== 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
        res.status(401).send('Unauthorized');
        return;
    }

    const postData = req.body.data;
    const outputSchema = z.object({
        companyName: z.string(),
        jobTitle: z.string(),
        keyResponsibilities: z.array(z.string()),
        requiredSkills: z.array(z.string()),
        qualifications: z.array(z.string()),
    });

    const modelParams = {
        functions: [
            {
                name: "jdInfoExtract",
                description: "Extract job information from a job description",
                parameters: zodToJsonSchema(outputSchema),
            },
        ],
        function_call: { name: "jdInfoExtract" },
    };

    const chatPrompt = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(
                "Based on the provided job description, get the [companyName],[jobTitle],[keyResponsibilities],[requiredSkills],[qualifications] as mentioned in the job description."
            ),
            HumanMessagePromptTemplate.fromTemplate("{inputJDText}"),
        ],
        inputVariables: ["inputJDText"],
    });

    const modelOpenAI = new ChatOpenAI({
        temperature: 0,
        stream: true,
        openAIApiKey: process.env.OPENAI_API_KEY,
    }).bind(modelParams);

    const chain = chatPrompt
        .pipe(modelOpenAI)
        .pipe(new JsonOutputFunctionsParser());

    try {
        const stream = await chain.stream({
            inputJDText: postData.futureJobDescription,
        });

        res.status(200).setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        req.on('close', () => {
            res.end();
        });
    } catch (error) {
        console.error('Error during SSE stream:', error);
        res.status(500).send('Internal Server Error');
    }
}



