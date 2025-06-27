// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumeprofessionalExperiences } from '../mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";

export async function professionalExperienceRewriteAllApi(professionalExperienceDataBody) {
    try {
        const startTime = Date.now();

        ///Microsoft openai JD info extract
        const postBodyProfessionalExperience = {
            //model: "text-davinci-003",
            //prompt: promptTextResume,
            messages: [
                {
                    "role":"system",
                    "content":"You are a resume-rewritten chatbot. Based on the provided {jobTitle} ,  {keyResponsibilities} , {requiredSkills},{qualifications} , {professionalExperienceTitle},{professionalExperienceDescription}, {education} rewrite professional experience to highlight skills and experiences that align with the '{Job Title}' position. " +
                        "Do not change {professionalExperienceTitle}, Focus on showcasing your {Key Responsibilities} as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your ability to {Key Responsibilities}. No working status information in the return. " +
                        "Please provide a list of bullet points from the {professionalExperienceDescription} and save each bullet point as an JSON object then put all bullet points inside {professionalExperienceDescriptionBulletPoints}, with a minim of 100 words"+
                        "professionalExperienceRewrite array count needs to be the same as professionalExperience array count"+
                        "The return needs to be in JSON format and only return the rewrite professional experience.\n" +
                        "Instructions:\n" +
                        "{{professionalExperienceRewrite}:[ Array of objects, each object is one professional experience from a job.]}" +
                        "Each object has the following properties:\n" +
                        "{" +
                        "{id}: generate a unique id," +
                        "{uuid}: string, generate a unique UUID," +
                        "{professionalExperienceTitle}: String," +
                        "{professionalExperienceDescription}: String with a minim of 400 words," +
                        "{professionalExperienceDescriptionBulletPoints}: Array of object and each object is one bullet point," +
                        "{jobStartDate}: String," +
                        "{jobEndDate}: String,"+
                        "}"


                },
                {   "role": "user",
                    "content": JSON.stringify({
                        "companyName": professionalExperienceDataBody.jDInfoExtractMessageContent.companyName,
                        "jobTitle": professionalExperienceDataBody.jDInfoExtractMessageContent.jobTitle,
                        "keyResponsibilities":professionalExperienceDataBody.jDInfoExtractMessageContent.keyResponsibilities,
                        "requiredSkills": professionalExperienceDataBody.jDInfoExtractMessageContent.requiredSkills,
                        "qualifications":professionalExperienceDataBody.jDInfoExtractMessageContent.qualifications,
                        "professionalExperience":professionalExperienceDataBody.professionalExperiences,
                        "education":professionalExperienceDataBody.education,
                    })},

            ],
            temperature: 0.8,
            max_tokens: 4096,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            user: professionalExperienceDataBody.userId
        };
        const responseMicrosoftProfessionalExperience = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
            method: 'POST',
            body: JSON.stringify(postBodyProfessionalExperience),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            }
        });
        const microsoftOpenAIResultProfessionalExperienceRewrite = await responseMicrosoftProfessionalExperience.json();
        //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultProfessionalExperienceRewrite);

        if (microsoftOpenAIResultProfessionalExperienceRewrite && !microsoftOpenAIResultProfessionalExperienceRewrite.choices){
            res.status(200).json({
                    status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultProfessionalExperienceRewrite,
                })
        }
        //console.log(microsoftOpenAIResultProfessionalExperienceRewrite.choices[0].message.content)
        const professionalExperienceMessageContent = await JSON.parse( microsoftOpenAIResultProfessionalExperienceRewrite.choices[0].message.content);
        //console.log("ProfessionalExperienceMessageContent: ", professionalExperienceMessageContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;
        // if (checkJsonReturn) {
        //     const choiceJson = await JSON.parse(choiceFixed)
            const professionalExperienceUpdate = await mongodbUpdateResumeprofessionalExperiences({

                fetchTime: fetchTime,
                microsoftOpenAIResultProfessionalExperienceRewrite,
                professionalExperienceDataBody,
                professionalExperienceRewrite:professionalExperienceMessageContent.professionalExperienceRewrite,
            },  professionalExperienceDataBody.userId, professionalExperienceDataBody.upsertedId);

        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: professionalExperienceDataBody.userId,
            resumeObjectId: professionalExperienceDataBody.objectId,
            credit: microsoftOpenAIResultProfessionalExperienceRewrite.usage.total_tokens,
            apiCallPostData: professionalExperienceDataBody,
            apiCallResult: microsoftOpenAIResultProfessionalExperienceRewrite,
            creditUsageType: "professionalExperienceRewriteAll",
            detailName: "Generate Professional Experiences",
            detailText: "Generate Professional Experiences API Call",
        });
        return {
            professionalExperienceMessageContent:professionalExperienceMessageContent.professionalExperienceRewrite,
            lastUpdateResult: professionalExperienceUpdate,
        }
    } catch (error) {
        console.error("error while excecuting  professionalExperienceRewriteAll function :", error);
        return false;
    }
}






