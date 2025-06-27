// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumePossibleInterviewQuestions } from '../mongodb/pages/api/resume';


export async function generateInterviewQuestionsApi(possibleInterviewQuestions) {
    try {
        const startTime = Date.now();

        ///Microsoft openai Generate Linkedin Connection Message
        const requestDataPossibleInterviewQuestions = {

            messages: [
                {
                    "role":"system",
                    "content":"Create a list of 5 interview questions for a [Job Title] position. Include 1 to 2 general or behavioral questions that explore interpersonal skills and work ethic. The remaining questions should be specific to the role, focusing on [key responsibilities], [required skills], and scenarios that reflect my professional experiences in [your professional field].\n" +
                        "Please keep the answers succinct without an overly professional or stiff tone.\n"+
                        "Instructions:\n" +
                        "Create a text that can be directly inserted into a JSON object under the key 'interviewQuestions'. The text should follow JSON string rules, ensuring proper escaping of special characters.No empty spaces.\\n" +
                        "An array of object with key name interviewQuestions, each object has [Generated Interview Question 1 Text] inside with a key name question and a version 4 UUID for each object with a key name uuid"+
                        "The return needs to be a correct JSON string,No empty spaces, No special characters.\n" +
                        "Generate a JSON object with the following structure with out any JSON tag and make sure the return is a plain JSON:\n" +
                        "{" +
                        "\"interviewQuestions\": \\\"[{\\\"question\\\":\\\"Generated Interview Question 1 Here\\\", \\\"uuid\\\":\\\"Version 4 UUID Here\\\"},{\\\"question\\\":\\\"Generated Interview Question 2 Here\\\", \\\"uuid\\\":\\\"Version 4 UUID Here\\\"},{\\\"question\\\":\\\"Generated Interview Question 3 Here\\\", \\\"uuid\\\":\\\"Version 4 UUID Here\\\"},{\\\"question\\\":\\\"Generated Interview Question 4 Here\\\", \\\"uuid\\\":\\\"Version 4 UUID Here\\\"},{\\\"question\\\":\\\"Generated Interview Question 5 Here\\\", \\\"uuid\":\\\"Version 4 UUID Here\\\"}]\\\"" +
                        "}"

                },
                {   "role": "user",
                    "content": JSON.stringify({
                        "applicantName": possibleInterviewQuestions.applicantName,
                        "jobTitle": possibleInterviewQuestions.jobTitle,
                        "companyName": possibleInterviewQuestions.companyName,
                        "keyResponsibilities":possibleInterviewQuestions.keyResponsibilities,
                        "requiredSkills": possibleInterviewQuestions.requiredSkills,
                        // "qualifications":possibleInterviewQuestions.jDInfoExtractMessageContent.qualifications,
                        "professionalExperience":possibleInterviewQuestions.professionalExperiences,
                    })},

            ],
            temperature: 0.8,
            max_tokens: 4096,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            user: possibleInterviewQuestions.userId
        };
        const responseMicrosoftPossibleInterviewQuestions = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
            method: 'POST',
            body: JSON.stringify(requestDataPossibleInterviewQuestions),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            }
        });
        const microsoftOpenAIResultPossibleInterviewQuestions = await responseMicrosoftPossibleInterviewQuestions.json();
        //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultInterviewQuestionsToAsk);

        if (microsoftOpenAIResultPossibleInterviewQuestions && !microsoftOpenAIResultPossibleInterviewQuestions.choices){
            res.status(200).json({
                    status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultPossibleInterviewQuestions,
                })
        }
        //console.log(microsoftOpenAIResultPossibleInterviewQuestions.choices[0].message.content)
        const possibleInterviewQuestionsContent = await JSON.parse( microsoftOpenAIResultPossibleInterviewQuestions.choices[0].message.content);
        //console.log("possibleInterviewQuestionsContent: ", possibleInterviewQuestionsContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;

        const possibleInterviewQuestionsUpdate = await mongodbUpdateResumePossibleInterviewQuestions({
            fetchTime: fetchTime,
            microsoftOpenAIResultPossibleInterviewQuestions,
            requestDataPossibleInterviewQuestions,
            possibleInterviewQuestionsAiGenerate:possibleInterviewQuestionsContent.interviewQuestions,
        },  possibleInterviewQuestions.userId, possibleInterviewQuestions.objectId);


        // console.log("linkedinConnectionMessageUpdate: ", linkedinConnectionMessageUpdate)
        if (creditUsageInsert && possibleInterviewQuestionsUpdate){
           return {
                interviewQuestionsContent:possibleInterviewQuestionsContent.interviewQuestions,
                lastUpdateResult: possibleInterviewQuestionsUpdate,
           }
        } else {
            return {
                interviewQuestionsContent:possibleInterviewQuestionsContent.interviewQuestions,
                lastUpdateResult: possibleInterviewQuestionsUpdate,
            }
        }
    } catch (error) {
        console.error("Error during interview questions :", error);
        return [];
    }

}

