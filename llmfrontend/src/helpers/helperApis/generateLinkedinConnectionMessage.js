// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumeLinkedinConnectionMessage } from '../mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";

export async function generateLinkedinConnectionMessageApi(linkedinConnectionMessage) {
    try {
        const startTime = Date.now();

        ///Microsoft openai Generate Linkedin Connection Message
        const requestDataLinkedinConnectionMessage = {
            messages: [
                {
                    "role": "system",
                    "content": "Act as a linkedin connection message expert. As a job seeker, you are the best candidate for an open role, you are highly qualified, and you are connecting with the recruiter / hiring manager on linkedin. Please write 350 characters or less LinkedIn connection request messages for the person to accept the connection.\n" +
                        "The job seeker's {professionalExperience}.\n" +
                        "Make sure to be short and sweet with the job's {job title}, {companyName}, {keyResponsibilities}, {requiredSkills}.\n" +
                        "The return needs to be in JSON format.\nInstructions:\n" +
                        "Create a text that can be directly inserted into a JSON object under the key 'linkedinConnectionMessage'. The text should follow JSON string rules, ensuring proper escaping of special characters.No empty spaces.\\n" +
                        "For example, a correct response should look like:\n" +
                        "{\n" +
                        "\"linkedinConnectionMessage\": \"[Generated Linkedin Connection Message Text Here]\"," +
                        "\n}"

                },
                {
                    "role": "user",
                    "content": JSON.stringify({
                        "applicantName": linkedinConnectionMessage.applicantName,
                        "jobTitle": linkedinConnectionMessage.jobTitle,
                        "companyName": linkedinConnectionMessage.companyName,
                        "keyResponsibilities": linkedinConnectionMessage.keyResponsibilities,
                        "requiredSkills": linkedinConnectionMessage.requiredSkills,
                        // "qualifications":linkedinConnectionMessage.jDInfoExtractMessageContent.qualifications,
                        "professionalExperience": linkedinConnectionMessage.professionalExperiences,
                    })
                },

            ],
            temperature: 0.8,
            max_tokens: 4096,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            user: linkedinConnectionMessage.userId
        };
        const responseMicrosoftCoverLetter = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
            method: 'POST',
            body: JSON.stringify(requestDataLinkedinConnectionMessage),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            }
        });
        const microsoftOpenAIResultLinkedinConnectionMessage = await responseMicrosoftCoverLetter.json();
        //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultProfessionalExperienceRewrite);

        if (microsoftOpenAIResultLinkedinConnectionMessage && !microsoftOpenAIResultLinkedinConnectionMessage.choices) {
            res.status(200).json({
                status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultLinkedinConnectionMessage,
            })
        }
        //console.log(microsoftOpenAIResultLinkedinConnectionMessage.choices[0].message.content)
        const linkedinConnectionMessageContent = await JSON.parse(microsoftOpenAIResultLinkedinConnectionMessage.choices[0].message.content);
        //console.log("coverLetterMessageContent: ", coverLetterMessageContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;

        const linkedinConnectionMessageUpdate = await mongodbUpdateResumeLinkedinConnectionMessage({
            fetchTime: fetchTime,
            microsoftOpenAIResultLinkedinConnectionMessage,
            requestDataLinkedinConnectionMessage,
            linkedinConnectionMessageAiGenerate: linkedinConnectionMessageContent.linkedinConnectionMessage,
        }, linkedinConnectionMessage.userId, linkedinConnectionMessage.objectId);

        //console.log("linkedinConnectionMessageUpdate: ", linkedinConnectionMessageUpdate)
        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: linkedinConnectionMessage.userId,
            resumeObjectId: linkedinConnectionMessage.objectId,
            credit: microsoftOpenAIResultLinkedinConnectionMessage.usage.total_tokens,
            apiCallPostData: linkedinConnectionMessage,
            apiCallResult: microsoftOpenAIResultLinkedinConnectionMessage,
            creditUsageType: "linkedinConnectionMessage",
            detailName: "Generate Linkedin Connection Message",
            detailText: "Generate Linkedin Connection Message API Call",
        });
        if (creditUsageInsert && linkedinConnectionMessageUpdate) {
            return {
                linkedinConnectionMessageContent: linkedinConnectionMessageContent.linkedinConnectionMessage,
                lastUpdateResult: linkedinConnectionMessageUpdate,
            }
        } else {
            return {
                linkedinConnectionMessageContent: linkedinConnectionMessageContent.linkedinConnectionMessage,
                lastUpdateResult: linkedinConnectionMessageUpdate,
            }
        }
    } catch (error) {
        console.error("error  in generating iLinkedin Connection Message :", error);
        return [];
    }
}

