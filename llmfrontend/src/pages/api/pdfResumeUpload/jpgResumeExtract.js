import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {z} from "zod";






export default async function handler(req, res) {
    const { authorization } = req.headers

    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {

                const postData = req.body;
                //console.log(postData)
                const startTime = Date.now();
                try{
                    const messageSystem = new SystemMessage({
                        content: "You are an AI assistant that extracts data from documents and returns them as structured JSON objects. Do not return as a code block."
                    })
                    const messageHuman = new HumanMessage({
                        content: postData.resumePDFImages
                    });
                    // console.log('Converted images:', resumePDFImages);
                    const modelParams = {
                        // max_tokens: 8192,
                        user: postData.userId,
                        stream: true,
                        modelName: "gpt-4o",
                        openAIApiKey: process.env.OPENAI_API_KEY,
                        // azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                        // azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                        // azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                        // azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
                    };

                    const structure =  z.object({

                        uuid: z.string().describe("A version 4 unique UUID"),
                        name: z.string().describe("Name of the person"),
                        email: z.string().email().describe("Email of the person"),
                        phone: z.string().describe("Phone number of the person"),
                        address: z.string().describe("Address of the person"),
                        overview: z.string().describe("Summary or overview of the resume"),
                        skills: z.array(z.string()).describe("Skills array"),
                        certifications: z.array(z.string()).describe("Certifications array"),
                        professionalExperiences: z.array(
                            z.object({
                                companyName: z.string().describe("Company Name"),
                                professionalExperienceTitle: z.string().describe("Title of the professional experience"),
                                professionalExperienceDescription: z.string().describe("Professional Experience Description"),
                                jobStartDate: z.string().describe("Job Start Date"),
                                jobEndDate: z.string().describe("Job End Date with the format 'yyyy-MM'"),
                                jobLocation: z.string().describe("Job Location with the format 'yyyy-MM'"),

                            })
                        ).describe("Professional Experiences array of objects. Each object is a professional experience."),
                        education: z.array(
                            z.object({
                                school: z.string().describe("School Name"),
                                degree: z.string().describe("Degree"),
                                fieldOfStudy: z.string().describe("Field of Study"),
                                grade: z.string().describe("Grade"),
                                activitiesAndSocieties: z.string().describe("Activities and Societies"),
                                startDate: z.string().describe("Start Date with the format 'yyyy-MM'"),
                                endDate: z.string().describe("End Date with the format 'yyyy-MM'"),
                            })
                        ),



                    });
                    const modelOpenAI = new ChatOpenAI(modelParams).withStructuredOutput(structure);

                    const extractorResult = await modelOpenAI.invoke([messageSystem, messageHuman]);
                    const endTime = Date.now();


                    const fetchTime = endTime - startTime;
                  //  console.log('Time taken:', fetchTime);

                    res.status(200).json({
                        status: true,
                        response: extractorResult,

                    })
                } catch (error) {
                    console.log('Error:', error);
                    res.status(200).json({
                        status: false,
                        error: error,
                    });
                }


            }
            // else {
            //     res.status(401).send('Unauthorized');
            // }




    } else {
        res.status(405).send('Method not allowed');
    }
}


