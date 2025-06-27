// import openai from '@/helpers/openAI/openai';
import { mongodbUpdateResumePossibleInterviewQuestionAnswer } from '../mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";



export async function generateInterviewQuestionAnswerApi(possibleInterviewQuestionAnswer) {
    try {

        const startTime = Date.now();

        const requestDataPossibleInterviewQuestionAnswer = {
            messages: [
                {
                    "role":"system",
                    "content":"Act as a resume expert. Create a professional yet creative interview question answer draft based on the provided job description details such as [jobTitle],  [keyResponsibilities], [requiredSkills],[qualifications],[professionalExperience] tailored for a candidate. Start by collecting all the relevant details about the candidate, such as their job experience, educational qualifications, core competencies, and any special achievements in the field, and incorporate with values, mission, products, or from the job description highlighting the essential skills and experience required for the job based on the job description with a minimum of 350 words.\n" +
                        "Suggestion on how to answer an interview question using STAR method.\n"+
                        "Instructions:\n" +
                        "Create a text that can be directly inserted into a JSON object under the key 'interviewQuestionAnswer' and an array of object with key name 'situation', 'task', 'action', 'result'.\n " +
                        "The text should follow JSON string rules, ensuring proper escaping of special characters, No empty spaces.\n" +
                        "Generate a JSON object with the following structure without any JSON tag :\n" +
                        "{" +
                        "\"interviewQuestionAnswer\":\"[{\"situation\":\"Generated Answer Text Here\"},{\"task\":\"Generated Answer Text Here\"},{\"action\":\"Generated Answer Text Here\"},{\"result\":\"Generated Answer Text Here\"}]\"" +
                        "}"

                },
                {   "role": "user",
                    "content": JSON.stringify({
                        "interviewQuestion": possibleInterviewQuestionAnswer.question,
                        "applicantName": possibleInterviewQuestionAnswer.applicantName,
                        "jobTitle": possibleInterviewQuestionAnswer.jobTitle,
                        "companyName": possibleInterviewQuestionAnswer.companyName,
                        "keyResponsibilities":possibleInterviewQuestionAnswer.keyResponsibilities,
                        "requiredSkills": possibleInterviewQuestionAnswer.requiredSkills,
                        // "qualifications":possibleInterviewQuestionAnswer.jDInfoExtractMessageContent.qualifications,
                        "professionalExperience":possibleInterviewQuestionAnswer.professionalExperiences,
                    })},

            ],

            temperature: 0.8,
            max_tokens: 4096,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            user: possibleInterviewQuestionAnswer.userId
        };
        const responseMicrosoftPossibleInterviewQuestionAnswer = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K, {
            method: 'POST',
            body: JSON.stringify(requestDataPossibleInterviewQuestionAnswer),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            }
        });
        const microsoftOpenAIResultPossibleInterviewQuestionAnswer = await responseMicrosoftPossibleInterviewQuestionAnswer.json();
        //console.log("microsoftOpenAIResultProfessionalExperience: ", microsoftOpenAIResultInterviewQuestionsToAsk);

        if (microsoftOpenAIResultPossibleInterviewQuestionAnswer && !microsoftOpenAIResultPossibleInterviewQuestionAnswer.choices){
            res.status(200).json({
                    status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultPossibleInterviewQuestionAnswer,
                })
        }
        //console.log(microsoftOpenAIResultPossibleInterviewQuestionAnswer.choices[0].message.content)
        const possibleInterviewQuestionAnswerContent = await JSON.parse( microsoftOpenAIResultPossibleInterviewQuestionAnswer.choices[0].message.content);
        //console.log("possibleInterviewQuestionAnswerContent: ", possibleInterviewQuestionAnswerContent);

        const endTime = Date.now();

        const fetchTime = endTime - startTime;

        const possibleInterviewQuestionsUpdate = await mongodbUpdateResumePossibleInterviewQuestionAnswer({
            fetchTime: fetchTime,
            // microsoftOpenAIResultPossibleInterviewQuestionAnswer:microsoftOpenAIResultPossibleInterviewQuestionAnswer.choices[0].message.content,
            questionUUID: possibleInterviewQuestionAnswer.questionUUID,
            requestDataPossibleInterviewQuestionAnswer,
            possibleInterviewQuestionAnswer:possibleInterviewQuestionAnswerContent.interviewQuestionAnswer,
        },  possibleInterviewQuestionAnswer.userId, possibleInterviewQuestionAnswer.objectId);

        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: possibleInterviewQuestionAnswer.userId,
            resumeObjectId: possibleInterviewQuestionAnswer.objectId,
            credit: microsoftOpenAIResultPossibleInterviewQuestionAnswer.usage.total_tokens,
            apiCallPostData: possibleInterviewQuestionAnswer,
            apiCallResult: microsoftOpenAIResultPossibleInterviewQuestionAnswer,
            creditUsageType: "interviewQuestionAnswers",
            detailName: "Generate Interview Question Answer",
            detailText: "Generate Interview Question Answers API Call - "+possibleInterviewQuestionAnswer.questionUUID,
        });
        // console.log("linkedinConnectionMessageUpdate: ", linkedinConnectionMessageUpdate)
        if (creditUsageInsert && possibleInterviewQuestionsUpdate){
            return {
                interviewQuestionAnswerContent:possibleInterviewQuestionAnswerContent.interviewQuestionAnswer,
                lastUpdateResult: possibleInterviewQuestionsUpdate, 
            }
        } else {
            return {
                interviewQuestionAnswerContent:possibleInterviewQuestionAnswerContent.interviewQuestionAnswer,
                lastUpdateResult: possibleInterviewQuestionsUpdate,
            }
        }

    } catch (error) {
        console.error("error  in generating interview questions and answer:", error);
        return [];
    }
}

