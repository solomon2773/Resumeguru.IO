
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {toast} from "react-toastify";
import {ChatPromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";

import {
    mongodbGetResumeJobDescriptionByUserIdAndDocId,
    } from "../../../helpers/mongodb/pages/user/resume";
import {
    mongodbGenerateInterviewQuestionToAskStreaming,
    mongodbGetInterviewQuestionToAskByResumeIdVersion
} from "../../../helpers/mongodb/pages/user/interviewQuestionToAsk";
import {
    interviewQuestionToAskAITargetPrompt,
    interviewQuestionToAskPrompt
} from "../../../helpers/langChain/prompts/interviewQuestionToAsk/questionToAsk";
import defaultAdvancedFeatureInterviewQuestionToAsk from "../../../utils/staticObjects/interviewQuestionToAsk/defaultAdvancedFeatureInterviewQuestionToAsk";
import {interviewQuestionsToAskModel} from "../../../helpers/langChain/functions/interviewQuestionToAsk/interviewQuestionToAsk";
import {useSelector} from "react-redux";

const QuestionToAskBlock = ({resumeObjectId, resumeVersion}) => {

    const {   totalCredits, updateCredits } = useAuth()
    const user = useSelector(state => state.user.profile);
    const [aiTemputate , setAiTemputate] = useState(0.8);
    const [maxConcurrency , setMaxConcurrency] = useState(3);
    const [ advanceFeatureInterviewQuestion, setAdvanceFeatureInterviewQuestion] = useState(defaultAdvancedFeatureInterviewQuestionToAsk);
    const [resumeJobDescription, setResumeJobDescription] = useState({})
    const [interviewQuestionsGenerateToAsk , setInterviewQuestionsGenerateToAsk] = useState(false)
    const [interviewQuestionData, setInterviewQuestionData] = useState([])

    const userInfo = {
        "firstName": user.firstName ? user.firstName : "firstName",
        "lastName": user.lastName ? user.lastName : "firstName",
        "email": user.email ? user.email : "email",
        "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
        "city":user.city ? user.city : "City",
        "state":user.region ? user.region : "Texas",};

    //console.log(interviewQuestionData)
    useEffect(() => {
        if (user.userId && resumeObjectId && resumeVersion){
           // console.log(user.userId+"-"+ resumeObjectId+"-"+ resumeVersion)
            mongodbGetInterviewQuestionToAskByResumeIdVersion(user.userId, resumeObjectId, resumeVersion).then((result) => {
                if (result){
                    //console.log(result)
                    setInterviewQuestionData(result)
                } else {
                    setInterviewQuestionData([])
                }
            })
            mongodbGetResumeJobDescriptionByUserIdAndDocId(user.userId, resumeObjectId).then((result) => {
                if (result){
                    setResumeJobDescription(result)
                } else {
                    setResumeJobDescription({})

                }
            })
        }
    },[user, resumeVersion, resumeObjectId]);

    const generateInterviewQuestionsToAsk = async (e) => {
        if (totalCredits < 200){
            return toast.error("You don't have enough credits to generate questions to ask during interview. ")
        }
        setInterviewQuestionsGenerateToAsk(true)


        try {
            const startTime = Date.now();
            const chatPrompt = new ChatPromptTemplate(resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume ? interviewQuestionToAskAITargetPrompt : interviewQuestionToAskPrompt) ;
            const modelOpenAI = new ChatOpenAI({
                temperature: aiTemputate,
                maxConcurrency: maxConcurrency,
                user: user.userId,
                stream: true,
                modelName: advanceFeatureInterviewQuestion.selectedAiModel.modelNameId,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(interviewQuestionsToAskModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            let finalUserContent = {}
            if (resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume){
                finalUserContent = {
                    "applicantName": user.firstName+" "+user.lastName,
                    "jobInformation": {
                        "jobTitle": resumeJobDescription.postBodyJDInfoExtract.jobTitle,
                        "companyName": resumeJobDescription.postBodyJDInfoExtract.companyName,
                        "keyResponsibilities": resumeJobDescription.postBodyJDInfoExtract.keyResponsibilities,
                        "requiredSkills": resumeJobDescription.postBodyJDInfoExtract.requiredSkills,
                    }

                };
            } else {
                finalUserContent = {
                    "applicantName": user.firstName+" "+user.lastName,
                    "jobInformation": {
                        "jobTitle": resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.jobTitle ? resumeJobDescription.resumeBasicInfo.jobTitle : "a random job title",
                        "companyName": resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.companyName ? resumeJobDescription.resumeBasicInfo.companyName : "a random company name",
                        "experienceLevel": resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.resumeExperienceLevel ? resumeJobDescription.resumeBasicInfo.resumeExperienceLevel.name : "a random experience level",
                        //"workingField": resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.resumeWorkingField ? resumeJobDescription.resumeBasicInfo.resumeWorkingField.name : "a random working field",
                    }

                };
            }
            const stream = await chat.stream( {inputData: JSON.stringify(finalUserContent)} );

            let output =  [] ;
            let isNewObjectCreated = false;
            // console.log(initialInterviewQuestionDataBlock)
            interviewQuestionData.push({
                parsedOutput:[]
            });
            let lastInterviewQuestionBlock = interviewQuestionData.length;
            for await (const chunk of stream) {
                // Assume output.interviewQuestions is an array

                output = chunk.interviewQuestionToAsk;
                    setInterviewQuestionData((interviewQuestionsResult) => {
                        // Assuming interviewQuestionsResult is an array
                        if (!isNewObjectCreated) {
                            // Add empty objects only if no new object has been added yet
                            for (let i = 0; i < 5; i++) {
                                interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput.push({ question: "", uuid: "" });
                            }
                            isNewObjectCreated = true;
                        } else if (chunk.interviewQuestionToAsk !== null) {
                            // Update the last 5 objects in the array with new data
                            for (let i = 0; i < 5; i++) {
                                if (chunk.interviewQuestionToAsk && chunk.interviewQuestionToAsk[i] && chunk.interviewQuestionToAsk[i].question){
                                    interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput[i].question = chunk.interviewQuestionToAsk[i]?.question || "";
                                }
                                if (chunk.interviewQuestionToAsk && chunk.interviewQuestionToAsk[i] && chunk.interviewQuestionToAsk[i].uuid){
                                    interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput[ i].uuid = chunk.interviewQuestionToAsk[i]?.uuid || "";
                                }
                            }
                        }
                        return [...interviewQuestionsResult];
                    });
            }
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            await mongodbGenerateInterviewQuestionToAskStreaming({
                fetchTime: fetchTime,
                userId: user.userId,
                jobDescriptionObjectId: resumeJobDescription.postBodyJDInfoExtract && resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId ? resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId : "",
                resumeObjectId : resumeObjectId ? resumeObjectId : "",
                resumeVersion: resumeVersion ? parseInt(resumeVersion, 10) : "",
                modelVersion: advanceFeatureInterviewQuestion.selectedAiModel.modelNameId,
                provider:advanceFeatureInterviewQuestion.selectedAiModel.provider,
                modelParams: {
                    temperature: aiTemputate,
                    maxConcurrency: maxConcurrency
                },
                chatPrompt : chatPrompt,
                userContent: finalUserContent,
                resumeBasicInfo:resumeJobDescription.resumeBasicInfo,
                parsedOutput:output,
                advanceFeature: advanceFeatureInterviewQuestion,
                userInformation: userInfo,

            }).then((result) => {

            }).catch((err) => {
                toast.error("Generate Interview Question To Ask Error 2...")  ;
            })

            updateCredits(user.userId);
            setInterviewQuestionsGenerateToAsk(false)
        } catch (error) {
             console.log(error)
            toast.error("Generate interview questions to ask error ...")
            setInterviewQuestionsGenerateToAsk(false)
        }
    }

    return (
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">


                    {interviewQuestionsGenerateToAsk ? (
                        <div className="text-center align-middle mt-5">
                            <div
                                className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                                          <span
                                                              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                          >Generating Interview Questions To ask...</span
                                                          >
                            </div>
                            Generating Interview Questions To ask...
                        </div>

                    ):(
                        <>
                            { interviewQuestionData && interviewQuestionData.length > 5 ? (
                                <>
                                    {interviewQuestionData && interviewQuestionData.length < 50 ? (
                                        <button
                                            onClick={generateInterviewQuestionsToAsk}
                                            type="submit"
                                            className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                        >
                                            ReGenerate Interview Questions To ask
                                        </button>
                                    ) :(
                                        <div>
                                            Maximum 50 Interview Questions To ask can be generated for each resume...
                                        </div>
                                    )}
                                </>
                            ):(
                                <button
                                    onClick={generateInterviewQuestionsToAsk}
                                    type="submit"
                                    className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                >
                                    Generate Interview Questions To ask
                                </button>

                            )}
                        </>


                    )}
                </li>
                <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">


                        {interviewQuestionData && interviewQuestionData.length > 0 && interviewQuestionData.map((questionSet, questionSetIndex) => (
                            <React.Fragment key={"interview_question_to_ask_set_"+questionSetIndex}>
                                {questionSet && questionSet.parsedOutput.length > 0 && questionSet.parsedOutput.map((question, questionIndex)=>(
                                    <div key={"interview_question_to_ask_line_"+questionSetIndex+"_"+questionIndex}>
                                        <>{(questionSetIndex*5)+questionIndex+1}. </>
                                        <>{question.question}</>

                                    </div>
                                    ))}

                            </React.Fragment>

                        ))}



                    </div>
                </li>
            </ul>
        </dd>

    );
}

export default QuestionToAskBlock;
