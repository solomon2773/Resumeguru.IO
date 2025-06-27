// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumeInterviewQuestionsToAsk } from '../mongodb/pages/api/resume';



export async function generateInterviewQuestionsToAskApi(interviewQuestionsToAsk) {
    try {
        const startTime = Date.now();

            ///Microsoft openai Generate Linkedin Connection Message
            const requestDataInterviewQuestionsToAsk = {
                messages: [
                    {
                        "role": "system",
                        "content": "Act as a job seeker. Formulate a well-researched list of 5 insightful questions that you can ask the interviewer to get a better understanding of the [companyName], and its culture. The questions should demonstrate your interest in the company and the position you are interviewing for. Some examples of topics to cover are the company's mission statement, the team's structure and communication processes, company goals and growth potential, the challenges typically faced in the [jobTitle] role, how success is measured, and insights about the [companyName]'s culture. Ensure the questions are open-ended and allow for detailed and informative responses.\n" +
                            "Instructions:\n" +
                            "Create a text that can be directly inserted into a JSON object under the key 'interviewQuestionsToAsk'. The text should follow JSON string rules, ensuring proper escaping of special characters.No empty spaces.\\n" +
                            "An array of object with key name interviewQuestionsToAsk, each object has [Generated Interview Question To Ask 1 Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"+
                            "The return needs to be a correct JSON string,No empty spaces, No special characters. \n" +
                            "Generate a JSON object with the following structure with out any JSON tag :\n" +
                            "{" +
                            "\"interviewQuestionsToAsk\":\"[{Generated Interview Question To Ask 1 Text Here},{Generated Interview Question To Ask 2 Text Here},{Generated Interview Question To Ask 3 Text Here},{Generated Interview Question To Ask 4 Text Here},{Generated Interview Question To Ask 5 Text Here}]\"" +
                            "}"

                    },
                    {
                        "role": "user",
                        "content": JSON.stringify({
                            "applicantName": interviewQuestionsToAsk.applicantName,
                            "jobTitle": interviewQuestionsToAsk.jobTitle ? interviewQuestionsToAsk.jobTitle : "Job Title",
                            "companyName": interviewQuestionsToAsk.companyName ? interviewQuestionsToAsk.companyName : "The Company",
                            "keyResponsibilities": interviewQuestionsToAsk.keyResponsibilities,
                            "requiredSkills": interviewQuestionsToAsk.requiredSkills,
                            // "qualifications":postDataLinkedinConnectionMessage.jDInfoExtractMessageContent.qualifications,
                            "professionalExperience": interviewQuestionsToAsk.professionalExperiences,
                        })
                    },

                ],
                temperature: 0.8,
                max_tokens: 2048,
                top_p: 0.95,
                frequency_penalty: 0.1,
                presence_penalty: 0.0,
                user: interviewQuestionsToAsk.userId
            };
            const responseMicrosoftInterviewQuestionsToAsk = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
                method: 'POST',
                body: JSON.stringify(requestDataInterviewQuestionsToAsk),
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                }
            });
            const microsoftOpenAIResultInterviewQuestionsToAsk = await responseMicrosoftInterviewQuestionsToAsk.json();
            //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultInterviewQuestionsToAsk);

            if (microsoftOpenAIResultInterviewQuestionsToAsk && !microsoftOpenAIResultInterviewQuestionsToAsk.choices) {
                res.status(200).json({
                    status: false,
                    microsoftOpenAIResultError: microsoftOpenAIResultInterviewQuestionsToAsk,
                })
            }
            //console.log(microsoftOpenAIResultInterviewQuestionsToAsk.choices[0].message.content)
            const interviewQuestionsToAskContent = await JSON.parse(microsoftOpenAIResultInterviewQuestionsToAsk.choices[0].message.content);
            //console.log("interviewQuestionsToAskContent: ", interviewQuestionsToAskContent);

            const endTime = Date.now();

            const fetchTime = endTime - startTime;

            const interviewQuestionsToAskUpdate = await mongodbUpdateResumeInterviewQuestionsToAsk({
                fetchTime: fetchTime,
                microsoftOpenAIResultInterviewQuestionsToAsk,
                requestDataInterviewQuestionsToAsk,
                interviewQuestionsToAskAiGenerate: interviewQuestionsToAskContent.interviewQuestionsToAsk,
            }, interviewQuestionsToAsk.userId, interviewQuestionsToAsk.objectId);

            // console.log("linkedinConnectionMessageUpdate: ", linkedinConnectionMessageUpdate)
            if (creditUsageInsert && interviewQuestionsToAskUpdate) {
                return {
                    interviewQuestionsToAskContent: interviewQuestionsToAskContent.interviewQuestionsToAsk,
                    lastUpdateResult: interviewQuestionsToAskUpdate,
                }
            } else {
                return {
                    interviewQuestionsToAskContent: interviewQuestionsToAskContent.interviewQuestionsToAsk,
                    lastUpdateResult: interviewQuestionsToAskUpdate,
                }
            }
    } catch (error) {
        console.error("error  in generating interview questions and answer:", error);
        return [];
    }
}


