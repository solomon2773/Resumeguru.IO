import {
    mongodbInsertNewResume,
    mongodbUpdateResume
} from '../mongodb/pages/api/resume';



export async function rewriteMyResumeApi(rewriteMyResumeDataBody) {
    try {

        const postData = rewriteMyResumeDataBody.data;

        let lastInsertedId = "";

        const resumeInsertId = await mongodbInsertNewResume({
            resumeTemplateName: postData.resumeTemplateName,
            postData,
        },  rewriteMyResumeDataBody.userId);
        

        const startTime = Date.now();



        ///Microsoft openai JD info extract
        const postBodyJDInfoExtract = {
            //model: "text-davinci-003",
            //prompt: promptTextResume,
            messages: [
                {
                    "role": "system",
                    "content": "Based on the provided job description, get the '{companyName}','{jobTitle}' ,  {keyResponsibilities} , {requiredSkills},{qualifications} as mentioned in the job description. Return needs to be in JSON format.\nInstructions:\n{companyName}: String,\n{jobTitle}: String,\n{keyResponsibilities}:[\nkeyResponsibilities1, keyResponsibilities2\n],\n{requiredSkills}:[requiredSkills1, requiredSkills2\n],\n{qualifications} :[qualifications1, qualifications2]"
                },
                {   "role": "user",
                    "content": postData.futureJobDescription},

            ],
            temperature: 1,
            max_tokens: 4096,
            // top_p: 1.0,
            // frequency_penalty: 0.1,
            // presence_penalty: 0.0,
            user: rewriteMyResumeDataBody.userId
        };
        const responseMicrosoftJDInfoExtract = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT, {
            method: 'POST',
            body: JSON.stringify(postBodyJDInfoExtract),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY,
            }
        });
        const microsoftOpenAIResultJDInfoExtract = await responseMicrosoftJDInfoExtract.json();
        console.log("microsoftOpenAIResultJDInfoExtract: ", microsoftOpenAIResultJDInfoExtract);

        if (microsoftOpenAIResultJDInfoExtract && !microsoftOpenAIResultJDInfoExtract.choices){
            res.status(200).json({
                    status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultJDInfoExtract,
                })
        }
        const JDInfoExtractMessageContent = await JSON.parse( microsoftOpenAIResultJDInfoExtract.choices[0].message.content);
        console.log("JDInfoExtractMessageContent: ", JDInfoExtractMessageContent);

        ///Microsoft openai Resume rewriter - Overview
        const postBodyResumeOverviewRewrite = {
            //model: "text-davinci-003",
            //prompt: promptTextResume,
            messages: [
                {
                    "role":"system",
                    "content":"Based on the provided {jobTitle} ,  {keyResponsibilities} , {requiredSkills},{qualifications} , {currentResumeOverview} rewrite overview and overview title to highlight skills and experiences that align with the '{Job Title}' position. Focus on showcasing your {Key Responsibilities} as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your ability to {Key Responsibilities}. \"\n" +
                        "The return needs to be in JSON format.\n" +
                        "Instructions:\n" +
                        "{overviewRewrite}: String,\n" +
                        "{overviewRewriteTitle}: String,"
                },
                {   "role": "user",
                    "content":
                        JSON.stringify({
                            "companyName": JDInfoExtractMessageContent.companyName,
                            "jobTitle": JDInfoExtractMessageContent.jobTitle,
                            "keyResponsibilities":JDInfoExtractMessageContent.keyResponsibilities,
                            "requiredSkills": JDInfoExtractMessageContent.requiredSkills,
                            "qualifications":JDInfoExtractMessageContent.qualifications,
                            "overview":postData.overview
                        })
                        },

            ],
            temperature: 1,
            max_tokens: 4096,
            // top_p: 1.0,
            // frequency_penalty: 0.1,
            // presence_penalty: 0.0,
            user: rewriteMyResumeDataBody.userId
        };

        const responseMicrosoftOverviewRewrite = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT, {
            method: 'POST',
            body: JSON.stringify(postBodyResumeOverviewRewrite),
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MICROSOFT_OPENAI_API_KEY,
            }
        });
        const microsoftOpenAIResultOverviewRewrite = await responseMicrosoftOverviewRewrite.json();
        console.log("microsoftOpenAIResultOverviewRewrite: ", microsoftOpenAIResultOverviewRewrite);

        if (microsoftOpenAIResultOverviewRewrite.error){
            res.status(200).json({
                status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultOverviewRewrite.error,
            })
        }
        const overviewRewriteMessageContent = JSON.parse(microsoftOpenAIResultOverviewRewrite.choices[0].message.content);
        console.log("JDInfoExtractMessageContent: ", overviewRewriteMessageContent);


        

        const endTime = Date.now();


        const fetchTime = endTime - startTime;
        // if (checkJsonReturn) {
        //     const choiceJson = await JSON.parse(choiceFixed)
        const resumeUpdate = await mongodbUpdateResume({
            // futureJobDescription:choiceJson.futureJobDescription,
            // futureJobCompanyName:choiceJson.futureJobCompanyName,
            // futureJobPosition:choiceJson.futureJobPosition,
            // futureJobImportantHighlight:choiceJson.futureJobImportantHighlight,
            overview:overviewRewriteMessageContent,
            // qualificationsAndSkills:choiceJson.qualificationsAndSkills,
            // professionalExperiences:choiceJson.professionalExperiences,
            // education:choiceJson.education,
            fetchTime: fetchTime,
            microsoftOpenAIResultJDInfoExtract,
            microsoftOpenAIResultOverviewRewrite,
            // microsoftOpenAIResultCoverLetterResult,
            postData,
            postBodyJDInfoExtract,
            postBodyResumeOverviewRewrite

        },  rewriteMyResumeDataBody.userId, resumeInsertId);

        lastInsertedId = resumeInsertId;


        return {
            jdInfoExtractMessageContent:JDInfoExtractMessageContent,
            overviewRewriteMessageContent,
            lastInsertedId
        }
            
    } catch (error) {
        console.error("error while excecuting  rewriteMyResumeApi function :", error);
        return false;
    }
}


