
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {toast} from "react-toastify";
import {ChatPromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import defaultAdvancedFeatureInterviewQuestion from "../../../utils/staticObjects/interviewQuestion/defaultAdvancedFeatureInterviewQuestion";

import {
    interviewQuestionAnswerPrompt,
    interviewQuestionsAITargetPrompt,
    interviewQuestionsPrompt
} from "../../../helpers/langChain/prompts/interviewQuestions/interviewQuestions";
import {
    interviewQuestionAnswerModel,
    interviewQuestionsModel
} from "../../../helpers/langChain/functions/interviewQuestions/interviewQuestions";
import {
    mongodbGenerateInterviewQuestionAnswerStreaming,
    mongodbGenerateInterviewQuestionsStreaming,
    mongodbGetInterviewQuestionByResumeIdVersion
} from "../../../helpers/mongodb/pages/user/interviewQuestions";
import {mongodbGetResumeJobDescriptionByUserIdAndDocId} from "../../../helpers/mongodb/pages/user/resume";
import {useSelector} from "react-redux";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const InterviewQuestionBlock = ({resumeObjectId, resumeVersion}) => {


    const {   totalCredits, updateCredits } = useAuth()
    const user = useSelector((state) => state.user.profile);

    // const [linkedinConnectionMessageGenerateInProcess , setLinkedinConnectionMessageGenerateInProcess] = useState(false)
    const [aiTemputate , setAiTemputate] = useState(0.8);
    const [maxConcurrency , setMaxConcurrency] = useState(3);
    const [ advanceFeatureInterviewQuestion, setAdvanceFeatureInterviewQuestion] = useState(defaultAdvancedFeatureInterviewQuestion);
    const [interviewQuestionData, setInterviewQuestionData] = useState([])
    const [interviewQuestionsGenerate , setInterviewQuestionsGenerate] = useState(false)
    const [resumeJobDescription, setResumeJobDescription] = useState({})

    const userInfo = {
        "firstName": user.firstName ? user.firstName : "firstName",
        "lastName": user.lastName ? user.lastName : "firstName",
        "email": user.email ? user.email : "email",
        "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
        "city":user.city ? user.city : "City",
        "state":user.region ? user.region : "Texas",};


    useEffect(() => {
        if (user.userId && resumeObjectId && resumeVersion){
            mongodbGetInterviewQuestionByResumeIdVersion(user.userId, resumeObjectId, resumeVersion).then((result) => {
                if (result){
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

    // console.log(interviewQuestionData)
    const generateInterviewQuestionsStreaming = async (e) => {

        if (resumeJobDescription && !resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume && !resumeJobDescription.postBodyJDInfoExtract){
            return toast.error("Please add job description to your resume to generate connection message. ")
        }
        if (totalCredits < 500){
            return toast.error("You don't have enough credits to generate interview questions. ")
        }
        setInterviewQuestionsGenerate(true)
        try {
            const startTime = Date.now();
            const chatPrompt = new ChatPromptTemplate(resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume ? interviewQuestionsAITargetPrompt : interviewQuestionsPrompt) ;
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
            }).bind(interviewQuestionsModel);
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

            let interviewQuestionsResultLength = 0;

            let output =  [] ;
            let isNewObjectCreated = false;
            // let initialInterviewQuestionDataBlock = interviewQuestionData.length;
            // console.log(initialInterviewQuestionDataBlock)
            interviewQuestionData.push({
                parsedOutput:[]
            });
            let lastInterviewQuestionBlock = interviewQuestionData.length;
            for await (const chunk of stream) {
                // Assume output.interviewQuestions is an array
                output = chunk.interviewQuestions;
                setInterviewQuestionData((interviewQuestionsResult) => {
                    // Assuming interviewQuestionsResult is an array
                    if (!isNewObjectCreated) {
                        // Add empty objects only if no new object has been added yet
                        for (let i = 0; i < 5; i++) {
                            interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput.push({ question: "", uuid: "" });
                        }
                        isNewObjectCreated = true;
                    } else if (chunk.interviewQuestions !== null) {
                        // Update the last 5 objects in the array with new data
                        for (let i = 0; i < 5; i++) {
                            if (chunk.interviewQuestions && chunk.interviewQuestions[i] && chunk.interviewQuestions[i].question){
                                interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput[i].question = chunk.interviewQuestions[i]?.question || "";
                            }
                            if (chunk.interviewQuestions && chunk.interviewQuestions[i] && chunk.interviewQuestions[i].uuid){
                                interviewQuestionsResult[lastInterviewQuestionBlock-1].parsedOutput[ i].uuid = chunk.interviewQuestions[i]?.uuid || "";
                            }
                        }
                    }
                    return [...interviewQuestionsResult];
                });
            }


            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            await mongodbGenerateInterviewQuestionsStreaming({
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
                toast.error("Generate Interview Questions Error 2...")  ;
            })
            updateCredits(user.userId);
            setInterviewQuestionsGenerate(false)
        } catch (error) {
            console.log(error)
            toast.error("Generate Interview Questions Error 1...")
            setInterviewQuestionsGenerate(false)
        }
    }

    //console.log(interviewQuestionData)
    const generateInterviewQuestionAnswerStreaming = async (e) => {

        if (totalCredits < 500){
            return toast.error("You don't have enough credits to generate interview question answer. ")
        }

        const questionUUID = e.target.getAttribute('data-question-uuid');
        const question = e.target.getAttribute('data-question');
        const questionBlock = e.target.getAttribute('data-question-block');
        const clicked_btn = document.getElementById('suggest_answer_btn_v2_'+questionUUID)
        const clicked_process = document.getElementById('suggest_answer_process_v2_'+questionUUID)


        clicked_btn.style.display = 'none';
        clicked_process.style.display = 'block';
        const startTime = Date.now();
        try {

           // console.log(questionUUID, question, questionBlock)
            const chatPrompt = new ChatPromptTemplate(interviewQuestionAnswerPrompt) ;
            const modelOpenAI = new ChatOpenAI({
                temperature: aiTemputate,
                maxConcurrency: 5,
                user: user.userId,
                stream: true,
                modelName: advanceFeatureInterviewQuestion.selectedAiModel.modelNameId,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(interviewQuestionAnswerModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const userContent = {
                "interviewQuestion": question,
                // "applicantName": reqBodyPossibleInterviewQuestionAnswer.applicantName,
                "jobTitle": resumeJobDescription.postBodyJDInfoExtract.jobTitle,
                "companyName": resumeJobDescription.postBodyJDInfoExtract.companyName,

            };
            const stream = await chat.stream( userContent );
            let output = {};

            for await (const chunk of stream) {
                // console.log(chunk.interviewQuestionAnswer)
                output = chunk.interviewQuestionAnswer;
                setInterviewQuestionData((interviewQuestionsResult) => {
                    const newQuestionAnswer = chunk.interviewQuestionAnswer;
                    // Assuming questionBlock is defined elsewhere and specifies the index of the block to update
                    let blockToUpdate = interviewQuestionsResult[questionBlock];

                    // Check if we have parsedOutput to work with
                    if (blockToUpdate && Array.isArray(blockToUpdate.parsedOutput) && blockToUpdate.parsedOutput.length > 0) {
                        // Update existing questions with new answers where uuid matches
                        const updatedQuestions = blockToUpdate.parsedOutput.map((question) => {
                            if (question.uuid === questionUUID) { // Assuming questionUUID is defined elsewhere
                                if (newQuestionAnswer !== undefined && newQuestionAnswer != null && newQuestionAnswer !== ""){
                                    return {
                                        ...question,
                                        answers: question.answers ? [...question.answers, {answer:newQuestionAnswer}] : [{answer:newQuestionAnswer}],
                                    };
                                }

                            }
                            return question;
                        });

                        // Now, update the block in the original result array
                        interviewQuestionsResult[questionBlock] = {
                            ...blockToUpdate,
                            parsedOutput: updatedQuestions,
                        };
                        // Since we're directly modifying interviewQuestionsResult, we can just return it
                        return [...interviewQuestionsResult];
                    }

                    // If no updates are made, just return the result as is
                    return [...interviewQuestionsResult];
                });

            }

            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            await mongodbGenerateInterviewQuestionAnswerStreaming({
                fetchTime: fetchTime,
                userId: user.userId,
                jobDescriptionObjectId: resumeJobDescription.postBodyJDInfoExtract && resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId ? resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId : "",
                resumeObjectId : resumeObjectId ? resumeObjectId : "",
                resumeVersion: resumeVersion ? parseInt(resumeVersion, 10) : "",
                modelVersion: advanceFeatureInterviewQuestion.selectedAiModel.modelNameId,
                provider:advanceFeatureInterviewQuestion.selectedAiModel.provider,
                modelParams: {
                    temperature: aiTemputate,
                    maxConcurrency: 5
                },
                chatPrompt : chatPrompt,
                userContent: userContent,
                parsedOutput:output,
                questionUUID: questionUUID,
                advanceFeature: advanceFeatureInterviewQuestion,
                userInformation: userInfo,

            }).then((result) => {

            }).catch((err) => {
                console.log(error)
                toast.error("Generate Interview Question Answer Error 2. Please refresh your page.")  ;
            })
            updateCredits(user.userId);
            clicked_process.style.display = 'none';
            clicked_btn.style.display = 'block';
        } catch (error) {
            // console.log(error)
            clicked_process.style.display = 'none';
            toast.error("Generate Interview Question Answer Error 1. Please refresh your page.\"")
            setInterviewQuestionsGenerate(false)
        }
    }

    return (
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    {interviewQuestionsGenerate ? (
                        <div className="text-center align-middle mt-5">
                            <div
                                className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                                          <span
                                                              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                          >Generating 5 Possible Interview Questions...</span
                                                          >
                            </div>
                            Generating 5 Possible Interview Questions...
                        </div>

                    ):(
                        <>
                            { interviewQuestionData && interviewQuestionData.length > 0 ? (

                                <>
                                    {interviewQuestionData && interviewQuestionData.length < 100  ? (
                                        <button
                                            onClick={generateInterviewQuestionsStreaming}
                                            type="submit"
                                            className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                        >ReGenerate 5 Possible Interview Questions</button>
                                    ) :(

                                        <div>
                                            Maximum 100 Possible Interview Questions can be generated...
                                        </div>
                                    )}
                                </>
                            ):(

                                <button
                                    onClick={generateInterviewQuestionsStreaming}
                                    type="submit"
                                    className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                >


                                    <>Generate 5 Possible Interview Questions</>

                                </button>
                            )}
                        </>


                    )}
                </li>
                <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">


                        {interviewQuestionData && interviewQuestionData.length > 0 && interviewQuestionData.map((questionSet, index) => (
                            // Rendering each line as a separate paragraph

                            <div key={"interviewQuestionsToAskAiGenerate_v2_"+index} className=" mb-4">
                                {/*{Object.values(question).map((value, valueIndex) => (*/}

                                {/*    <div key={valueIndex}>*/}
                                {/*        <>{index+1}. </>*/}
                                {/*        <>{value}</>*/}

                                {/*    </div>*/}

                                {/*))}*/}
                                {questionSet && questionSet.parsedOutput.length > 0 && questionSet.parsedOutput.map((question, questionIndex)=>(
                                    <React.Fragment key={"interview_question_block_"+questionIndex}>
                                        <div >
                                            <>{(index*5)+questionIndex+1}. </>
                                            <>{question.question}</>

                                        </div>
                                        <div>
                                            {question.uuid &&  (

                                                <>
                                                    {question.answers && question.answers.length > 0 ? (
                                                        <button
                                                            id={'suggest_answer_btn_v2_'+question.uuid}
                                                            onClick={generateInterviewQuestionAnswerStreaming}
                                                            data-question-uuid={question.uuid}
                                                            data-question={question.question}
                                                            data-question-block={index}
                                                            className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                        >
                                                            <>ReGenerate Suggest Answer</>

                                                        </button>
                                                    ) :(
                                                        <button
                                                            id={'suggest_answer_btn_v2_'+question.uuid}
                                                            onClick={generateInterviewQuestionAnswerStreaming}
                                                            data-question-uuid={question.uuid}
                                                            data-question={question.question}
                                                            data-question-block={index}
                                                            className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                        >
                                                            <>Generate Suggest Answer</>

                                                        </button>
                                                    )}


                                                    <div
                                                        id={'suggest_answer_process_v2_'+question.uuid}
                                                        style={{display: 'none'}}
                                                        className="text-center align-middle mt-5 ">
                                                        <div
                                                            className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                            role="status">
                                                                          <span
                                                                              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                                          >generating a recommended answer...</span>
                                                        </div>
                                                        generating a recommended answer...
                                                    </div>
                                                </>

                                            )}

                                            <div className="p-3">

                                                {question.answers && question.answers[question.answers.length - 1] && question.answers[question.answers.length - 1].answer && question.answers[question.answers.length - 1].answer.length > 0 && question.answers[question.answers.length - 1].answer.map((answer, answerIndex) => (

                                                    <React.Fragment key={"interview_question_answer_"+questionIndex+"_"+answerIndex}>

                                                        {answer.situation && (
                                                            <div className="pb-1">
                                                                <strong>Situation</strong>  : {answer.situation}
                                                            </div>
                                                        )}
                                                        {answer.task && (
                                                            <div className="pb-1">
                                                                <strong>Task</strong> : {answer.task}
                                                            </div>
                                                        )}
                                                        {answer.action && (
                                                            <div className="pb-1">
                                                                <strong>Action</strong> : {answer.action}
                                                            </div>
                                                        )}
                                                        {answer.result && (
                                                            <div className="pb-1">
                                                                <strong>Result</strong> : {answer.result}
                                                            </div>
                                                        )}

                                                    </React.Fragment>
                                                ))}

                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}


                            </div>
                        ))}


                    </div>
                </li>
            </ul>
            <div> <a href="https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/" className="underline">The questions will be answered using STAR method.</a></div>
        </dd>

    );
}

export default InterviewQuestionBlock;
