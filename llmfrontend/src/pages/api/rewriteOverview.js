import openai from '../../helpers/openAI/openai';
import {
    mongodbInsertUpdateResume,

} from '../../helpers/mongodb/pages/api/resume';
import {mongodbUserCreditUsageInsert} from "../../helpers/mongodb/user/creditUsage";



export default async function handler(req, res) {
    const { authorization } = req.headers

    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
                const postData = req.body.data;

                const startTime = Date.now();
                // console.log(postData.jdExtractResult)
                ///Microsoft openai Resume rewriter - Overview
                const postBodyResumeOverviewRewrite = {

                    messages: [
                        {
                            "role":"system",
                            "content":"Based on the provided [jobTitle] ,  [keyResponsibilities] , [requiredSkills],[qualifications] ,[educations],  [currentResumeOverview] rewrite overview and overview title to highlight skills and experiences that align with the '{Job Title}' position. Focus on showcasing your {Key Responsibilities} as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your ability to [Key Responsibilities]. \"\n" +
                                "Generate a JSON object with the following structure with out any JSON tag and make sure the return is a plain JSON:\n" +
                                "{" +
                                "{overviewRewrite}: String," +
                                "{overviewRewriteTitle}: String," +
                                "}"
                        },
                        {   "role": "user",
                            "content":
                                JSON.stringify({
                                    "companyName": postData.jdExtractResult.JDInfoExtractMessageContent.companyName,
                                    "jobTitle": postData.jdExtractResult.JDInfoExtractMessageContent.jobTitle,
                                    "keyResponsibilities":postData.jdExtractResult.JDInfoExtractMessageContent.keyResponsibilities,
                                    "requiredSkills": postData.jdExtractResult.JDInfoExtractMessageContent.requiredSkills,
                                    "qualifications":postData.jdExtractResult.JDInfoExtractMessageContent.qualifications,
                                    "overview":postData.overview,
                                    "educations":postData.resumeDetailData.education,
                                })
                                },

                    ],
                    response_format : { "type": "json_object" },
                    temperature: 0.8,
                    max_tokens: 4096,
                    // top_p: 1.0,
                    // frequency_penalty: 0.1,
                    // presence_penalty: 0.0,
                    user: req.body.userId
                };

                const responseMicrosoftOverviewRewrite = await fetch(process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4, {
                    method: 'POST',
                    body: JSON.stringify(postBodyResumeOverviewRewrite),
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.MICROSOFT_OPENAI_API_KEY,
                    }
                });
                const microsoftOpenAIResultOverviewRewrite = await responseMicrosoftOverviewRewrite.json();
                // console.log("microsoftOpenAIResultOverviewRewrite: ", microsoftOpenAIResultOverviewRewrite);

                if (microsoftOpenAIResultOverviewRewrite.error){
                    res.status(200).json({
                        status: false,
                        microsoftOpenAIResultError: microsoftOpenAIResultOverviewRewrite.error,
                    })
                }
                //console.log(microsoftOpenAIResultOverviewRewrite.choices[0].message.content)
                const overviewRewriteMessageContent = JSON.parse(microsoftOpenAIResultOverviewRewrite.choices[0].message.content);
                //console.log("JDInfoExtractMessageContent: ", overviewRewriteMessageContent);


                const endTime = Date.now();


                const fetchTime = endTime - startTime;
                // if (checkJsonReturn) {
                //     const choiceJson = await JSON.parse(choiceFixed)
                    const resumeOverviewUpdate = await mongodbInsertUpdateResume({
                        fetchTimeOverview: fetchTime,
                        overview:overviewRewriteMessageContent,
                        microsoftOpenAIResultOverviewRewrite,
                        postData,
                        postBodyResumeOverviewRewrite

                    },  req.body.userId);

                const creditUsageInsert = await mongodbUserCreditUsageInsert({
                    userId: req.body.userId,
                    resumeObjectId: postData.objectId,
                    credit: microsoftOpenAIResultOverviewRewrite.usage.total_tokens,
                    apiCallPostData: req.body,
                    apiCallResult: microsoftOpenAIResultOverviewRewrite,
                    creditUsageType: "rewriteOverview",
                    detailName: "Generate Overview / Summary",
                    detailText: "Generate Overview / Summary API Call",
                });
                res.status(200).json({
                    status: true,
                    overviewRewriteMessageContent,
                    lastUpdateResult:resumeOverviewUpdate,

                })

            } else {
                res.status(401).send('Unauthorized');
            }




    } else {
        res.status(405).send('Method not allowed');
    }
}


