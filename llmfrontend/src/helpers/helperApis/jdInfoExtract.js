import {
    mongodbInsertNewJobDescription,
    mongodbUpdateJobDescription,

} from '../mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../mongodb/user/creditUsage";

export async function jdInfoExtractApi(jdInfoExtractBody) {
    try {
        const resumeInsertId = await mongodbInsertNewJobDescription({
                    jdTemplateName: jdInfoExtractBody.jobDescriptionTemplateNameRef,
                    jdInfoExtractBody,
                },  jdInfoExtractBody.userId);


        const startTime = Date.now();


        /// JD info extract

        const postBodyJDInfoExtract = {
            //model: "text-davinci-003",
            //prompt: promptTextResume,
            messages: [
                {
                    "role": "system",
                    "content": "Based on the provided job description, get the {companyName},{jobTitle},{keyResponsibilities},{requiredSkills},{qualifications} as mentioned in the job description. " +
                        "Return needs to be in JSON format.\nInstructions:\n{companyName}: String,\n{jobTitle}: String,\n{keyResponsibilities}:[\nkeyResponsibilities1, keyResponsibilities2\n],\n{requiredSkills}:[requiredSkills1, requiredSkills2\n],\n{qualifications} :[qualifications1, qualifications2]"
                },
                {   "role": "user",
                    "content": jdInfoExtractBody.futureJobDescription},

            ],
            temperature: 1,
            max_tokens: 2048,
            // top_p: 1.0,
            // frequency_penalty: 0.1,
            // presence_penalty: 0.0,
            user: jdInfoExtractBody.userId
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
        //console.log("microsoftOpenAIResultJDInfoExtract: ", microsoftOpenAIResultJDInfoExtract);

        if (microsoftOpenAIResultJDInfoExtract && !microsoftOpenAIResultJDInfoExtract.choices){
            res.status(200).json({
                    status: false,
                microsoftOpenAIResultError: microsoftOpenAIResultJDInfoExtract,
                })
        }
        const JDInfoExtractMessageContent = await JSON.parse( microsoftOpenAIResultJDInfoExtract.choices[0].message.content);
        //console.log("JDInfoExtractMessageContent: ", JDInfoExtractMessageContent);





        const endTime = Date.now();


        const fetchTime = endTime - startTime;
        // if (checkJsonReturn) {
        //     const choiceJson = await JSON.parse(choiceFixed)
            await mongodbUpdateJobDescription({
                jdTemplateName: jdInfoExtractBody.jobDescriptionTemplateNameRef ? jdInfoExtractBody.jobDescriptionTemplateNameRef : JDInfoExtractMessageContent.jobTitle + " @ " + JDInfoExtractMessageContent.companyName,
                JDInfoExtractMessageContent,
                fetchTime: fetchTime,
                microsoftOpenAIResultJDInfoExtract,
                jdInfoExtractBody,
                postBodyJDInfoExtract,

            },  jdInfoExtractBody.userId, resumeInsertId);

        const creditUsageInsert = await mongodbUserCreditUsageInsert({
            userId: jdInfoExtractBody.userId,
            resumeObjectId: jdInfoExtractBody.objectId,
            credit: microsoftOpenAIResultJDInfoExtract.usage.total_tokens,
            apiCallPostData: jdInfoExtractBody,
            apiCallResult: microsoftOpenAIResultJDInfoExtract,
            creditUsageType: "jdInfoExtract",
            detailName: "Generate Job Description Info",
            detailText: "Generate Job Description Info API Call",
        });
        
        return {
            jdInfoExtractMessageContent:JDInfoExtractMessageContent,
            lastInsertedId:resumeInsertId,
        }

    } catch (error) {
        console.error("error while excecuting  jdInfoExtractApi function :", error);
        return [];
    }
}


