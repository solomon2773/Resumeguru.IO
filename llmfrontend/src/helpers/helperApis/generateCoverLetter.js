// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumeCoverLetter } from '../mongodb/pages/api/resume';
import { mongodbUserCreditUsageInsert } from '../mongodb/user/creditUsage';


export async function generateCoverLetterApi(coverLetterReqBody) {
    try {
        const startTime = Date.now();

        ///Microsoft openai generate cover letter
        const postDataCoverLetter = {
            //model: "text-davinci-003",
            // response_format : { "type": "json_object" },
            messages: [
                {
                    "role": "system",
                    "content": "Act as a resume expert. Create a professional yet creative cover letter draft based on the provided job description details such as [jobTitle],  [keyResponsibilities], [requiredSkills],[qualifications], tailored for a candidate. Start by collecting all the relevant details about the candidate, such as their job experience, educational qualifications, core competencies, and any special achievements in the field, and incorporate with values, mission, products, or from the job description highlighting the essential skills and experience required for the job based on the job description with a minimum of 350 words.\n" +
                        "Add company name, candidate's name and position to the cover letter.\n"+
                        "Also provide a minimum of candidate's top 4 strengths. Each strength should be less than 4 words\n" +

                        "Create a text that can be directly inserted into a JSON object under the key 'coverLetterAiGenerate'.The text should follow JSON string rules, ensuring proper escaping of special characters.No empty spaces.\n" +
                        "The return needs to be in correct JSON format and only has two keys, 'coverLetterAiGenerate' and 'coverLetterCandidateStrengthAiGenerate' \n"+
                        "Generate a JSON object with the following structure and make sure the return is a plain JSON: \n" +
                        "Instructions:\n" +
                        "{" +
                        "\"coverLetterAiGenerate\": \"[Generated Cover Letter Text Here]\"," +
                        "\"coverLetterCandidateStrengthAiGenerate\": \\\"[\\\"Generated Candidate Strength 1 Here\\\",\\\"Generated Candidate Strength 2 Here\\\",\\\"Generated Candidate Strength 3 Here\\\",\\\"Generated Candidate Strength 4 Here\\\"]\\\"," +
                        "}"

                },
                {
                    "role": "user",
                    "content": JSON.stringify({
                        "companyName": coverLetterReqBody.jDInfoExtractMessageContent.companyName ? coverLetterReqBody.jDInfoExtractMessageContent.companyName : "the Company",
                        "candidateName": coverLetterReqBody.applicantName,
                        "jobTitle": coverLetterReqBody.jDInfoExtractMessageContent.jobTitle,
                        "keyResponsibilities": coverLetterReqBody.jDInfoExtractMessageContent.keyResponsibilities,
                        "requiredSkills": coverLetterReqBody.jDInfoExtractMessageContent.requiredSkills,
                        "qualifications": coverLetterReqBody.jDInfoExtractMessageContent.qualifications,
                        "professionalExperience": coverLetterReqBody.professionalExperiences,
                        "education": coverLetterReqBody.education,
                    })
                },

            ],
            temperature: 0.8,
            max_tokens: 4096,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            user: coverLetterReqBody.userId
        };
        const responseMicrosoftCoverLetter = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
            method: 'POST',
            body: JSON.stringify(postDataCoverLetter),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            }
        });
        const microsoftOpenAIResultCoverLetter = await responseMicrosoftCoverLetter.json();
        //console.log("microsoftOpenAIResultCoverLetter: ", microsoftOpenAIResultCoverLetter);

        if (microsoftOpenAIResultCoverLetter && !microsoftOpenAIResultCoverLetter.choices) {
            res.status(200).json({
                status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultCoverLetter,
            })
        }
        //console.log(microsoftOpenAIResultCoverLetter.choices[0].message.content)
        const coverLetterMessageContent = await JSON.parse(microsoftOpenAIResultCoverLetter.choices[0].message.content);
        //console.log("coverLetterMessageContent: ", coverLetterMessageContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;

        const coverLetterUpdate = await mongodbUpdateResumeCoverLetter({
            fetchTime: fetchTime,
            microsoftOpenAIResultCoverLetter,
            postDataCoverLetter,
            coverLetterAiGenerate: coverLetterMessageContent.coverLetterAiGenerate,
            coverLetterCandidateStrengthMessageContent: coverLetterMessageContent.coverLetterCandidateStrengthAiGenerate,

        }, coverLetterReqBody.userId, coverLetterReqBody.upsertedId);
        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: coverLetterReqBody.userId,
            resumeObjectId: coverLetterReqBody.objectId,
            credit: microsoftOpenAIResultCoverLetter.usage.total_tokens,
            apiCallPostData: coverLetterReqBody,
            apiCallResult: microsoftOpenAIResultCoverLetter,
            creditUsageType: "coverLetterAiGenerate",
            detailName: "Generate Cover Letter",
            detailText: "Generate Cover Letter API Call",
        });

        if (creditUsageInsert && coverLetterUpdate) {
            return {
                coverLetterMessageContent: coverLetterMessageContent.coverLetterAiGenerate,
                coverLetterCandidateStrengthMessageContent: coverLetterMessageContent.coverLetterCandidateStrengthAiGenerate,
                lastUpdateResult: coverLetterUpdate,
            };
        } else {
            return {
                coverLetterMessageContent: coverLetterMessageContent.coverLetterAiGenerate,
                coverLetterCandidateStrengthMessageContent: coverLetterMessageContent.coverLetterCandidateStrengthAiGenerate,
                lastUpdateResult: coverLetterUpdate,
            }
        }

    } catch (error) {
        console.error("Error during generating cover letter:", error);
        return [];
    }

}
