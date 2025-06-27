import React, {   useState } from 'react'
import { toast } from "react-toastify";
import { PiStarFourFill } from "react-icons/pi";
import {Dropdown, DropdownItem, TextInput, Tooltip, Button, Modal, Label, Spinner, Textarea} from "flowbite-react";
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import {updateResumeDetailsOverview, updateResumeDetailsOverviewHistory, updateResumeDetailsOverviewVersion} from "../../../store/resumeEditReducer";
import {    mongodbUpdateResumeOverview,
    mongodbRegenerateOverviewStreaming,
    mongodbOverviewSelectedVersion,
} from "../../../helpers/mongodb/components/myResume/Edit/overviewBlock";
import {ChatPromptTemplate} from "langchain/prompts";
import {
    overviewSummaryAdvancedAITargetPrompt,
    overviewSummaryAdvancedCreatePrompt,
    overviewSummaryAITargetPrompt,
    overviewSummaryCreatePrompt
} from "../../../helpers/langChain/prompts/myResumeEdit/overviewSummary";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {overviewSummaryModel} from "../../../helpers/langChain/functions/myResumeEdit/overviewSummary";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {useAuth} from "../../../context/AuthContext";

const OverviewBlock = () => {
    const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)
    const [aiTemputate, setAiTemputate] = useState(0.8);
    const [currentAiModel, setCurrentAiModel] = useState({
        modelVersion: "gpt-4-32k-0613",
        provider: "AzureOpenAI",
    });
    const {  totalCredits, updateCredits } = useAuth();
    const user = useSelector((state) => state.user.profile);

    const [overviewEditModal, setOverviewEditModal] = useState(false);
    const [overviewEditTitle, setOverviewEditTitle] = useState("");
    const [overviewEditContent, setOverviewEditContent] = useState("");
    const [updateOverviewProcessing , setUpdateOverviewProcessing] = useState(false);
    const [overviewRegenerate , setOverviewRegenerate] = useState(false);
    const [overviewVersion, setOverviewVersion] = useState(resumeDetails.overviewRewrite && (parseInt(resumeDetails.overviewRewrite.selectedVersion)) >= 0 ? "Version : " + (parseInt(resumeDetails.overviewRewrite.selectedVersion) + 1) : (resumeDetails.overviewRewriteHistory && resumeDetails.overviewRewriteHistory.length > 0 ? "Version : " + resumeDetails.overviewRewriteHistory.length : "") );


    const overviewEditClickHandler = (overview) => {
        setOverviewEditTitle(overview.overviewRewriteTitle);
        setOverviewEditContent(overview.overviewRewrite);
        setOverviewEditModal(true);
    }
    const updateOverviewHandler = async () => {
        setUpdateOverviewProcessing(true);
        try {

            dispatch(updateResumeDetailsOverview({
                overviewRewrite: overviewEditContent,
                overviewRewriteTitle: overviewEditTitle,
            }));
            dispatch(updateResumeDetailsOverviewHistory(
                {
                    overviewRewrite: overviewEditContent,
                    overviewRewriteTitle: overviewEditTitle,
                }

            ));
            await mongodbUpdateResumeOverview(
                resumeDetails._id,
            {
                overviewRewrite: overviewEditContent,
                overviewRewriteTitle: overviewEditTitle
            }).then((result) => {
                setOverviewVersion("Version : " + (resumeDetails.overviewRewriteHistory.length + 1));
                setUpdateOverviewProcessing(false);
                setOverviewEditModal(false);

            });
        } catch (error) {
            // console.log(error)
            setUpdateOverviewProcessing(false);
            setOverviewEditModal(false);

            toast.error("Update overview error ...")
        }
    }

    const overviewVersionChangeHandler = ( overviewVersion) => {

        dispatch(updateResumeDetailsOverviewVersion(overviewVersion));
        mongodbOverviewSelectedVersion(resumeDetails._id,
            {
                overviewRewrite: resumeDetails.overviewRewrite.overviewRewrite,
                overviewRewriteTitle: resumeDetails.overviewRewrite.overviewRewriteTitle,
                selectedVersion: overviewVersion
            }).then((result) => {

        })

        setOverviewVersion("Version : " + (Number(overviewVersion)+1));



    };

    // console.log(resumeData)
    const handleOverviewRegenerate = async () => {

        if (totalCredits < 200){

            return toast.error("You don't have enough credits to regenerate resume. Please upgrade your plan.")
        }

        if (resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.aiTargetResume){
            if (resumeDetails.postBodyJDInfoExtract  ){
                overviewAITargetRewriteStreaming();
            }
        } else {
            overviewRewriteStreaming();
        }


    }
    async function overviewRewriteStreaming(){
        const startTime = Date.now();
        const existingOverview = document.getElementById("overviewEditContent") && document.getElementById("overviewEditContent").value;
        if (!existingOverview){
            return toast.error("Please write something to regenerate.")
        }
        try{
            setOverviewRegenerate(true);
            // console.log(advanceFeature)
            // console.log(streamInputData)
            const modelParams = {
                temperature: aiTemputate,
                // top_p: 1.0,
                // frequency_penalty: 0.1,
                // presence_penalty: 0.0,
                user: user.userId,
                stream: true,
                modelName: resumeDetails.advancedPromptFeature.selectedAiModel.modelNameId,
                //openAIApiKey: process.env.OPENAI_API_KEY,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            };

            let chatPrompt;
            let streamInputData , advanceStreamInputData;
            chatPrompt = resumeDetails.advancedPromptFeature.advanceSection ? new ChatPromptTemplate(overviewSummaryAdvancedCreatePrompt) : new ChatPromptTemplate(overviewSummaryCreatePrompt);

            advanceStreamInputData = {
                "jobDescription":{
                    jobTitle:resumeDetails.resumeBasicInfo.jobTitle ? resumeDetails.resumeBasicInfo.jobTitle : "",
                    companyName:resumeDetails.resumeBasicInfo.companyName ? resumeDetails.resumeBasicInfo.companyName : "",
                    resumeExperienceLevel:resumeDetails.resumeBasicInfo.name ? resumeDetails.resumeBasicInfo.name : "",
                    resumeWorkingField:resumeDetails.resumeBasicInfo.name ? resumeDetails.resumeBasicInfo.name : "",
                },
                existingOverview: existingOverview,
                overviewExtraPromptRef:resumeDetails.advancedPromptFeature.overviewExtraPromptRef ,

            };
            streamInputData = {
                "jobDescription":{
                    jobTitle:resumeDetails.resumeBasicInfo.jobTitle ? resumeDetails.resumeBasicInfo.jobTitle : "",
                    companyName:resumeDetails.resumeBasicInfo.companyName ? resumeDetails.resumeBasicInfo.companyName : "",
                    resumeExperienceLevel:resumeDetails.resumeBasicInfo.name ? resumeDetails.resumeBasicInfo.name : "",
                    resumeWorkingField:resumeDetails.resumeBasicInfo.name ? resumeDetails.resumeBasicInfo.name : "",
                },
                existingOverview: existingOverview,
                paragraphLength:resumeDetails.advancedPromptFeature.paragraphLength,
                writingTone:resumeDetails.advancedPromptFeature.writingTone,
            };


            const modelOpenAI = new ChatOpenAI(modelParams).bind(overviewSummaryModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream({inputData: JSON.stringify(resumeDetails.advancedPromptFeature.advanceSection ? advanceStreamInputData : streamInputData)});
            let overviewRewriteBuf = "";
            for await (const chunk of stream) {
                // console.log("chunk", chunk);
                overviewRewriteBuf = chunk;
                //console.log(overviewRewriteBuf)
                setOverviewEditTitle(overviewRewriteBuf.overviewRewriteTitle);
                setOverviewEditContent(overviewRewriteBuf.overviewRewrite);


            }
            setOverviewRegenerate(false);
            updateCredits(user.userId);
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
            mongodbRegenerateOverviewStreaming({
                userId: user.userId,
                resumeObjectId: resumeDetails._id,
                existingOverview: resumeDetails.overviewRewrite,
                modelVersion: currentAiModel.modelVersion,
                provider: currentAiModel.provider,
                modelParams: modelParams,
                chatPrompt : chatPrompt,
                userContent: resumeDetails.advancedPromptFeature.advanceSection ? advanceStreamInputData : streamInputData,
                parsedOutput: overviewRewriteBuf,

            }).then((result)=>{

            });
        } catch (e) {
            //console.log('overviewRewriteStreamingError:', e);
            setOverviewRegenerate(false);
            return toast.error("Overview Rewrite Error. Please go back and try again later.  ")

        }


    }
    async function overviewAITargetRewriteStreaming(){
        const startTime = Date.now();
        const existingOverview = document.getElementById("overviewEditContent") && document.getElementById("overviewEditContent").value;
        if (!existingOverview){
            return toast.error("Please write something to regenerate.")
        }
        try{
            setOverviewRegenerate(true);
            const currentResumeOverview = resumeDetails.overviewRewrite;
            // console.log(advanceFeature)
            // console.log(streamInputData)
            const modelParams = {
                temperature: aiTemputate,
                // top_p: 1.0,
                // frequency_penalty: 0.1,
                // presence_penalty: 0.0,
                user: user.userId,
                stream: true,
                modelName: resumeDetails.advancedPromptFeature ? resumeDetails.advancedPromptFeature.selectedAiModel.modelNameId : "gpt-3.5-turbo",
                //openAIApiKey: process.env.OPENAI_API_KEY,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            };

            let chatPrompt;
            let streamInputData;
            chatPrompt = resumeDetails.advancedPromptFeature.advanceSection ? new ChatPromptTemplate(overviewSummaryAdvancedAITargetPrompt) : new ChatPromptTemplate(overviewSummaryAITargetPrompt);
            streamInputData = {
                "jobDescription":{
                    jobTitle: resumeDetails.postBodyJDInfoExtract.jobTitle,
                    conpanyName: resumeDetails.postBodyJDInfoExtract.companyName,
                    keyResponsibilities: resumeDetails.postBodyJDInfoExtract.keyResponsibilities,
                    requiredSkills: resumeDetails.postBodyJDInfoExtract.requiredSkills,
                    qualifications: resumeDetails.postBodyJDInfoExtract.qualifications,
                },
                educations: resumeDetails.resumeOriginalData && resumeDetails.resumeOriginalData.education ? resumeDetails.resumeOriginalData.education : "",
                professionalExperiences: resumeDetails.professionalExperienceRewrite ? resumeDetails.professionalExperienceRewrite : "",
                existingOverview: existingOverview,
                currentResumeOverview: resumeDetails.overviewRewrite.overviewRewrite,
                overviewExtraPromptRef:resumeDetails.advancedPromptFeature.overviewExtraPromptRef ,
                paragraphLength:resumeDetails.advancedPromptFeature.paragraphLength,
                writingTone:resumeDetails.advancedPromptFeature.writingTone,
            };


            const modelOpenAI = new ChatOpenAI(modelParams).bind(overviewSummaryModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
            let overviewRewriteBuf = "";
            for await (const chunk of stream) {
                //console.log(overviewRewriteBuf)
                overviewRewriteBuf = chunk;
                setOverviewEditTitle(overviewRewriteBuf.overviewRewriteTitle);
                setOverviewEditContent(overviewRewriteBuf.overviewRewrite);

            }
            setOverviewRegenerate(false);
            updateCredits(user.userId);
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            //console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
            mongodbRegenerateOverviewStreaming({
                userId: user.userId,
                resumeObjectId: resumeDetails._id,
                existingOverview: currentResumeOverview,
                modelVersion: currentAiModel.modelVersion,
                provider: currentAiModel.provider,
                modelParams: modelParams,
                chatPrompt : chatPrompt,
                userContent: streamInputData,
                parsedOutput: overviewRewriteBuf,

            }).then((result)=>{

            });
        } catch (e) {
            console.log('overviewRewriteStreamingError:', e);
            setOverviewRegenerate(false);
            return toast.error("Overview Rewrite Error. Please go back and try again later.  ")

        }


    }

    return(

        <div>
            <div className="px-4 py-2 sm:px-0 m-2">
                <div className="text-xl font-large leading-6 text-black-900 ">
                    <div className="font-bold">
                        Overview
                    </div>
                </div>
                {/*Version Control*/}
                {resumeDetails.overviewRewriteHistory && resumeDetails.overviewRewriteHistory.length > 0 && (
                    <div className="inline-block">
                        <div className="flex items-center  ">
                            <Dropdown
                                label={overviewVersion}
                                dismissOnClick={true}
                                id="overviewVersion"
                                name="overviewVersion"
                                size="xs"
                                className="bg-green-50"
                                style={{ borderRadius: '9999px',borderColor: '#047857', borderWidth:"1px", color:'#047857', backgroundColor:'#ECFDF5',  fontWeight:"500", padding:"0px"}}
                            >
                                {resumeDetails.overviewRewriteHistory.map((overviewVersion, overviewVersionIndex) => (
                                    <Dropdown.Item
                                        key={"overviewVersion-"+overviewVersionIndex}
                                        className=" items-center  bg-green-50 px-6 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 "
                                        onClick={(e) => {
                                            overviewVersionChangeHandler(resumeDetails.overviewRewriteHistory.length - overviewVersionIndex - 1);
                                        }}
                                    > Version : {resumeDetails.overviewRewriteHistory.length - overviewVersionIndex}</Dropdown.Item>

                                ))}
                            </Dropdown>
                        </div>

                    </div>
                )}

                <div
                    onClick={() => {overviewEditClickHandler(resumeDetails.overviewRewrite);}}
                    className="m-2 flex text-sm leading-2 text-black-900 sm:mt-0 p-2 border border-transparent hover:border-gray-600 hover:bg-gray-50 cursor-pointer">
                                                      <span className="flex-grow">
                                                          <div
                                                              className="font-bold mt-2 mb-2 text-sm "
                                                          >{resumeDetails.overviewRewrite && (parseInt(resumeDetails.overviewRewrite.selectedVersion)) >= 0 ? resumeDetails.overviewRewriteHistory[resumeDetails.overviewRewrite.selectedVersion].overviewRewrite.overviewRewriteTitle : resumeDetails.overviewRewrite.overviewRewriteTitle}</div>
                                                          <div

                                                              className="mt-2 mb-2 p-2 text-sm ">{resumeDetails.overviewRewrite && (parseInt(resumeDetails.overviewRewrite.selectedVersion)) >= 0 ? resumeDetails.overviewRewriteHistory[resumeDetails.overviewRewrite.selectedVersion].overviewRewrite.overviewRewrite : resumeDetails.overviewRewrite.overviewRewrite}</div>
                                                      </span>
                </div>
            </div>
            <Modal size="2xl" show={overviewEditModal} onClose={() => setOverviewEditModal(false)}
            >
                <Modal.Header>Edit Overview</Modal.Header>
                <Modal.Body>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="overviewEditTitle" value="Overview / Summary Title" />
                        </div>
                        {overviewRegenerate ? (
                            <div className="p-2 border ">
                                {overviewEditTitle}
                            </div>
                        ) :(
                            <TextInput id="overviewEditTitle"
                                       name="overviewEditTitle"
                                       defaultValue={overviewEditTitle}
                                       onChange={(e) => setOverviewEditTitle(e.target.value)}
                                       required/>
                        )}

                        <div className="mb-2 block">
                            <Label htmlFor="overviewEditContent" value="Overview / Summary Content" />
                        </div>
                        {overviewRegenerate ? (
                            <div className="p-2 border ">
                                {overviewEditContent}
                            </div>
                        ) :(
                            <Textarea id="overviewEditContent"
                                      name="overviewEditContent"
                                      defaultValue={overviewEditContent}
                                      onChange={(e) => setOverviewEditContent(e.target.value)}
                                      rows={10}
                                      required/>
                        )}

                        <div className="inline-block  m-2">
                            <Button outline gradientDuoTone="purpleToBlue"
                                    size="xs"
                                    className="flex center "
                                    onClick={() => handleOverviewRegenerate()}
                                    isProcessing={overviewRegenerate}

                            >
                                <PiStarFourFill /> AI Generate
                            </Button>


                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue"
                            onClick={() => updateOverviewHandler()}
                            isProcessing={updateOverviewProcessing}

                    >Update</Button>
                    {!updateOverviewProcessing && (
                        <Button color="gray" onClick={() => setOverviewEditModal(false)}>
                            Close
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </div>

    )
}

export default OverviewBlock;
