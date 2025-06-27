// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumeprofessionalExperience } from '../mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";

export async function professionalExperienceRewriteApi(professionalExperienceDataBody) {
    try {
        const startTime = Date.now();

        ///Microsoft openai JD info extract
        const postBodyProfessionalExperience = {
            //model: "text-davinci-003",
            //prompt: promptTextResume,
            messages: [
                {
                    "role": "system",
                    "content": " You are a resume-rewriting chatbot. Based on the provided {jobDescription}, {professionalExperienceTitle},{professionalExperienceDescription}, {education} rewrite {professionalExperienceDescription} to highlight skills and experiences that align with the provided position. The output needs to be in the first person and omit using \"I\" anywhere.\n" +
                        "The return needs to be in JSON format.\n" +
                        " Instructions:\n" +
                        " The return object has the following properties:\n" +
                        " {professionalExperienceTitle}: String,\n" +
                        " {professionalExperienceDescription}: String,\n" +
                        " {jobStartDate}: String,\n" +
                        " {jobEndDate}: String,"


                },
                {
                    "role": "user",
                    "content": JSON.stringify({
                        "jobDescription" : {
                            "companyName": professionalExperienceDataBody.jdExtractResult.JDInfoExtractMessageContent.companyName,
                            "jobTitle": professionalExperienceDataBody.jdExtractResult.JDInfoExtractMessageContent.jobTitle,
                            "keyResponsibilities": professionalExperienceDataBody.jdExtractResult.JDInfoExtractMessageContent.keyResponsibilities,
                            "requiredSkills": professionalExperienceDataBody.jdExtractResult.JDInfoExtractMessageContent.requiredSkills,
                            "qualifications": professionalExperienceDataBody.jdExtractResult.JDInfoExtractMessageContent.qualifications,
                        },

                        "professionalExperience": professionalExperienceDataBody.professionalExperience,
                        "education": professionalExperienceDataBody.education,
                    })
                },

            ],
            temperature: 0.7,
            max_tokens: 11000,
            // top_p: 1.0,
            // frequency_penalty: 0.1,
            // presence_penalty: 0.0,
            user: professionalExperienceDataBody.userId
        };
        const responseMicrosoftProfessionalExperience = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT, {
            method: 'POST',
            body: JSON.stringify(postBodyProfessionalExperience),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY,
            }
        });
        const microsoftOpenAIResultProfessionalExperienceRewrite = await responseMicrosoftProfessionalExperience.json();
        //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultProfessionalExperienceRewrite);

        if (microsoftOpenAIResultProfessionalExperienceRewrite && !microsoftOpenAIResultProfessionalExperienceRewrite.choices) {
            res.status(200).json({
                status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultProfessionalExperienceRewrite,
            })
        }
        const professionalExperienceMessageContent = await JSON.parse(microsoftOpenAIResultProfessionalExperienceRewrite.choices[0].message.content);
        //console.log("ProfessionalExperienceMessageContent: ", professionalExperienceMessageContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;
        // if (checkJsonReturn) {
            //  const choiceJson = await JSON.parse(choiceFixed)
            const professionalExperienceUpdate = await mongodbUpdateResumeprofessionalExperience({

                fetchTime: fetchTime,
                microsoftOpenAIResultProfessionalExperienceRewrite,
                professionalExperienceDataBody,

            }, professionalExperienceDataBody.userId, professionalExperienceDataBody.upsertedId);

        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: professionalExperienceDataBody.userId,
            resumeObjectId: professionalExperienceDataBody.objectId,
            credit: microsoftOpenAIResultProfessionalExperienceRewrite.usage.total_tokens,
            apiCallPostData: professionalExperienceDataBody,
            apiCallResult: microsoftOpenAIResultProfessionalExperienceRewrite,
            creditUsageType: "professionalExperienceRewrite",
            detailName: "Generate Professional Experiences",
            detailText: "Generate Professional Experiences API Call",
        });

        return {
            professionalExperienceMessageContent: professionalExperienceMessageContent.professionalExperienceRewrite,
            lastUpdateResult: professionalExperienceUpdate,
        }

    } catch (error) {
        console.error("error while excecuting  professionalExperienceRewrite function :", error);
        return false;
    }
}

