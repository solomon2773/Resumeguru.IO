import React, { useState, useEffect } from 'react'
import defaultAdvancedFeatures from '../../../utils/staticObjects/coverLetter/defaultAdvancedFeatures';
import {toast} from "react-toastify";
import {useAuth} from "../../../context/AuthContext";
import {coverLetterModel} from "../../../helpers/langChain/functions/coverLetter";
import {coverLetterAdvancedPrompt, coverLetterPrompt} from "../../../helpers/langChain/prompts/coverLetter";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {ChatOpenAI} from "langchain/chat_models/openai";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import {useDispatch, useSelector} from 'react-redux';

import { ChatPromptTemplate } from "langchain/prompts";
import AdvanceFeatureCoverLetter from "../../aiResume/advanceFeatureCoverLetter";
import { setClData } from "../../../store/coverLetterReducer";

import { PaperClipIcon , ChevronDoubleRightIcon, ChevronDoubleDownIcon, UserIcon, RocketLaunchIcon, ChevronDownIcon} from '@heroicons/react/20/solid'

import {
    mongodbGenerateCoverLetterStreaming,
    mongodbGetLast24HoursCoverLetterData
} from "../../../helpers/mongodb/pages/user/coverLetter";


const EditCoverLetterBlock = ({coverLetters, coverLetterData, setCoverLetterData, resumeData, userInfo, setClTemplateData, setClTemplateSelectProgress}) => {

    const [aiTemputate, setAiTemputate] = useState(0.8);
    const [coverLetterCnt , setCoverLetterCnt] = useState(coverLetters.length)
    const [coverLetterGenerate, setCoverLetterGenerate] = useState(false);
    const [last24HoursCoverLetterUsage, setLast24HoursCoverLetterUsage] = useState(false);
    const [ advanceFeatureDataCoverLetter, setAdvanceFeatureDataCoverLetter] = useState(defaultAdvancedFeatures);
    const [coverLetterOptionBlock, setCoverLetterOptionClickBlock] = useState(false);

    const {  updateCredits } = useAuth();
    const user = useSelector((state) => state.user.profile);

    const dispatch = useDispatch();

    function getLast24HoursCoverLetterData(userId){
        mongodbGetLast24HoursCoverLetterData(userId).then((result)=>{
            if (result.length > 0) {
                setLast24HoursCoverLetterUsage(result);
            }
        })

    }

    const handleAdvanceFeatureData = (data) => {
        setAdvanceFeatureDataCoverLetter(data)
    }

    const generateCoverLetterStreamingLangChain = async (e) => {
        if (process.env.DEV) {
            console.log('generateCoverLetterStreamingLangChain-1:',resumeData)
        }
        // if (totalCredits < 1000){
        //     return toast.error("You don't have enough credits to generate cover letter. ")
        // }
        getLast24HoursCoverLetterData(user.userId);

        if (last24HoursCoverLetterUsage.length >= 3 && user && !user.paidCustomer){
            return toast.error("You have reached the maximum number of cover letter generation for the last 24 hours. ")
        }
        setCoverLetterGenerate(true)


        try {
            const startTime = Date.now();

            const chatPrompt = advanceFeatureDataCoverLetter.advanceSection ? new ChatPromptTemplate(coverLetterAdvancedPrompt) : new ChatPromptTemplate(coverLetterPrompt);
            const modelOpenAI = new ChatOpenAI({
                temperature: aiTemputate,
                maxConcurrency: 5,
                user: user.userId,
                stream: true,
                modelName: advanceFeatureDataCoverLetter.selectedAiModel.modelNameId,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(coverLetterModel);

            // console.log(resumeData.professionalExperienceRewrite)
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const userContent = {
                jobTitle: resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.jobTitle ? resumeData.resumeBasicInfo.jobTitle : resumeData.postBodyJDInfoExtract.jobTitle,
                companyName : resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.companyName ? resumeData.resumeBasicInfo.companyName : resumeData.postBodyJDInfoExtract.companyName,
                keyResponsibilities: resumeData.postBodyJDInfoExtract.keyResponsibilities,
                requiredSkills: resumeData.postBodyJDInfoExtract.requiredSkills,
                qualifications: resumeData.postBodyJDInfoExtract.qualifications,
                //  educations: resumeData.resumeOriginalData.education,
                //  professionalExperiences: resumeData.professionalExperienceRewrite,
                applicantName: user.firstName + " " + user.lastName,

                paragraphLength: advanceFeatureDataCoverLetter.paragraphLength,
                writingTone: advanceFeatureDataCoverLetter.writingTone,
                contentTemplatePrompt: advanceFeatureDataCoverLetter.selectedContentTemplate.promptExample,
            };
            const userContentAdvanced = {
                jobTitle: resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.jobTitle ? resumeData.resumeBasicInfo.jobTitle : resumeData.postBodyJDInfoExtract.jobTitle,
                companyName : resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.companyName ? resumeData.resumeBasicInfo.companyName : resumeData.postBodyJDInfoExtract.companyName,
                keyResponsibilities: resumeData.postBodyJDInfoExtract.keyResponsibilities,
                requiredSkills: resumeData.postBodyJDInfoExtract.requiredSkills,
                qualifications: resumeData.postBodyJDInfoExtract.qualifications,
                //  educations: resumeData.resumeOriginalData.education,
                //  professionalExperiences: resumeData.professionalExperienceRewrite,
                applicantName: user.firstName + " " + user.lastName,

                coverletterExtraPromptRef: advanceFeatureDataCoverLetter.coverletterExtraPromptRef,
            };


            const stream = await chat.stream(advanceFeatureDataCoverLetter.advanceSection ? userContentAdvanced : userContent );
            let output = {coverLetterAiGenerate:"",coverLetterCandidateStrengthAiGenerate:[]};
            // Assume this variable is defined in the scope of your stream processing
            let isNewObjectCreated = false;
            let coverLetterResultLength = 0; // This variable will keep track of the length of coverLetterResult

            for await (const chunk of stream) {
                output.coverLetterAiGenerate = chunk.coverLetterAiGenerate;
                output.coverLetterCandidateStrengthAiGenerate = chunk.coverLetterCandidateStrengthAiGenerate;
                const chunkPart = chunk.coverLetterAiGenerate ? chunk.coverLetterAiGenerate : null;
                let chunkCandidateStrength = chunk.coverLetterCandidateStrengthAiGenerate ? chunk.coverLetterCandidateStrengthAiGenerate : [];
                // Ensure chunkCandidateStrength is an array
                chunkCandidateStrength = Array.isArray(chunkCandidateStrength) ? chunkCandidateStrength : [chunkCandidateStrength];

                await setCoverLetterData((coverLetterResult) => {
                    // Directly work with coverLetterResult, which is assumed to be an array

                    if (chunkPart !== null && !isNewObjectCreated) {
                        // Add new object if chunkPart is not null and no new object has been created yet
                        coverLetterResult.push({
                            parsedOutput: {
                                coverLetterAiGenerate: chunkPart,
                                coverLetterCandidateStrengthAiGenerate: chunkCandidateStrength,
                            },
                        });
                        isNewObjectCreated = true;
                        coverLetterResultLength = coverLetterResult.length; // Update the length after adding a new object
                    } else if (chunkPart !== null && isNewObjectCreated) {
                        // Update the last object in the array if a new object has been created and chunkPart is not null
                        let lastObject = coverLetterResult[coverLetterResultLength - 1]; // Use the updated length to access the last object
                        lastObject.parsedOutput.coverLetterAiGenerate = chunkPart;
                        lastObject.parsedOutput.coverLetterCandidateStrengthAiGenerate = chunkCandidateStrength;
                    }


                    return [...coverLetterResult]; // Return the updated result directly
                });
            }



            setCoverLetterCnt(coverLetterCnt+1)



            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            await mongodbGenerateCoverLetterStreaming({
                fetchTime: fetchTime,
                userId: user.userId,
                jobDescriptionObjectId: resumeData.postBodyJDInfoExtract.selectedTemplateOption ? resumeData.postBodyJDInfoExtract.selectedTemplateOption : "",
                resumeObjectId : resumeData._id ? resumeData._id : "",
                resumeVersion:resumeData.version ? resumeData.version : "",
                modelVersion: advanceFeatureDataCoverLetter.selectedAiModel.modelNameId,
                provider:advanceFeatureDataCoverLetter.selectedAiModel.provider,
                modelParams: {
                    temperature: aiTemputate,
                    maxConcurrency: 5
                },
                chatPrompt : chatPrompt,
                userContent: userContent,
                parsedOutput:output,
                advanceFeature: advanceFeatureDataCoverLetter,
                userInformation: userInfo,
            }).then((result) => {
                setCoverLetterGenerate(false)
            }).catch((err) => {
                if (process.env.DEV){
                    console.log("Regenerate cover letter Error", err)
                }
                console.log("Regenerate cover letter Error", err)
                toast.error("Regenerate cover letter Error...")  ;
            })

            updateCredits(user.userId);
            setCoverLetterGenerate(false)
        } catch (error) {
            if (process.env.DEV){
            console.log(error)
            }
            console.log(error)
            toast.error("Generate cover letter error ...")
            setCoverLetterGenerate(false)
        }
    }

    const handleSelectTemplate = async (e) => {
        const coverLetterVersion = e.target.getAttribute("data-version");
        if (!coverLetterVersion){
            toast ("Cover letter version not found");
            return;
        }

        const coverLetterLines = coverLetterData[coverLetterVersion].parsedOutput.coverLetterAiGenerate.replace(/Dear Hiring Manager,[\n\n|\n\s]*/g, "").replace(/\\n|\n\n|\n/g, "\n").split(/\\n|\n\n|\n/).map((line, index) => {
            return {  line };
        });

        const top4Strengths = coverLetterData[coverLetterVersion].parsedOutput.coverLetterCandidateStrengthAiGenerate.slice(0, 4).map((strength, index) => {
            return {  strength };
        });;

        //console.log("coverLetterLines", coverLetterLines)
        // Set the template data
        const data = {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phoneNo":user.phoneNumber? user.phoneNumber : "123-123-1234",
            "city":user.city? user.city : "My Location",
            "coverLetterAiGenerate":coverLetterLines,
            "coverLetterVersion":coverLetterVersion,
            "coverLetterCandidateStrengthMessageContent":top4Strengths,
        };
        dispatch(setClData(data));
        setClTemplateSelectProgress(2);
        setClTemplateData(data);
    }

    const handleCoverLetterDownload = async (e) => {
        const coverLetterVersion = e.target.getAttribute("data-version");
        if (!coverLetterVersion){
            toast ("Cover letter version not found");
            return;
        }
        // Read the Word document template
        const response = await fetch(process.env.SITE_URL +'/templates/coverletter/modern-cover-letter-template-1.docx');
        const template = await response.arrayBuffer();


        // Create a new instance of the Docxtemplater library
        const doc = new Docxtemplater();

        // Load the template using PizZip
        const zip = new PizZip(template);
        doc.loadZip(zip);
        const coverLetterLines = coverLetterData[coverLetterVersion].parsedOutput.coverLetterAiGenerate.replace(/Dear Hiring Manager,[\n\n|\n\s]*/g, "").replace(/\\n|\n\n|\n/g, "\n").split(/\\n|\n\n|\n/).map((line, index) => {
            return {  line };
        });

        const top4Strengths = coverLetterData[coverLetterVersion].parsedOutput.coverLetterCandidateStrengthAiGenerate.slice(0, 4).map((strength, index) => {
            return {  strength };
        });;

        //console.log("coverLetterLines", coverLetterLines)
        // Set the template data
        const data = {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phoneNo":user.phoneNumber? user.phoneNumber : "123-123-1234",
            "city":user.city? user.city : "My Location",
            "coverLetterAiGenerate":coverLetterLines,
            "coverLetterVersion":coverLetterVersion,
            "coverLetterCandidateStrengthMessageContent":top4Strengths,

        };
        doc.setData(data);

        // Render the document
        doc.render();

        // Generate the Word document
        const generatedDoc = doc.getZip().generate({ type: 'blob' });
        // Trigger the file download

        saveAs(generatedDoc, "ResumeGuruIO_"+user.firstName+user.lastName+"_"+encodeURI(resumeData.resumeTemplateName.replace(/\s+/g, ''))+"_v"+(coverLetterVersion+1)+".docx");
    }

    const coverLetterOptionClick = ()=>{
        setCoverLetterOptionClickBlock(!coverLetterOptionBlock)
    }


  return (
    <div className="px-4 py-2 ">
        {/*AI Cover Letter*/}
        <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">AI Cover Letter</h3>
            <p className="mt-1 max-w-7xl text-sm leading-6 text-gray-500">Craft the perfect cover letter tailored specifically to the job you're applying for with our AI Cover Letter feature. This tool analyzes the job description to create a highly personalized cover letter that aligns precisely with the employer's requirements. For more nuanced control over the output, engage the 'Advanced Options' to fine-tune the AI-generated content. Adjust the prompt settings, select your desired writing tone—Professional, Casual, Enthusiastic, or Informational—and choose the paragraph length from Short, Medium, or Long options. You can also select from a variety of content templates or add extra prompts to incorporate specific achievements or skills. These comprehensive features ensure that your cover letter not only meets but exceeds expectations, reflecting your unique qualifications and professional tone. Elevate your application and make a memorable first impression!</p>
        </div>
        <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0">
            <div role="list" className="divide-y rounded-md">

                {coverLetterData && coverLetterData.length > 0 && coverLetterData.map((coverletter, clIndex)=>{
                    return(
                        <React.Fragment key={"coverletter_block_"+clIndex}>
                            <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6 border border-gray-200">
                                <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">
                                    <div className="ml-4 flex flex-shrink-0 space-x-4">

                                        {coverLetterGenerate && (clIndex === coverLetterCnt ) ? (
                                            <div
                                                className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status">
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                    >generating cover letter...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <button
                                                    type="button"
                                                    data-version={clIndex}
                                                    onClick={handleSelectTemplate}
                                                    className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                >
                                                    Select Download Template (V.{clIndex+1})
                                                </button>
                                            </>

                                        )}


                                    </div>



                                    <div className="mt-2"> </div>
                                    {coverletter.parsedOutput && coverletter.parsedOutput.coverLetterAiGenerate && coverletter.parsedOutput.coverLetterAiGenerate.split(/\\n|\n/).map((line, index) => (
                                        <React.Fragment key={"coverletter_line_"+clIndex+"_"+index}>

                                            <p key={"coverLetterAiGenerate_"+index} className="indent-8 mb-4">{line}</p>
                                        </React.Fragment>

                                    ))}

                                    <div className="flex flex-wrap justify-start ">
                                        <div className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate[0]}</div>
                                        <div className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate[1]}</div>
                                        <div className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate[2]}</div>
                                        <div className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate[3]}</div>
                                        {/*{coverletter.parsedOutput && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate && coverletter.parsedOutput.coverLetterCandidateStrengthAiGenerate.map((candidateStrength,candidateStrengthIndex)=>{*/}
                                        {/*    return(*/}
                                        {/*        <div className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{candidateStrength}</div>*/}
                                        {/*    )*/}
                                        {/*})}*/}
                                    </div>


                                </div>
                            </li>
                        </React.Fragment>

                    )

                })}


                {!coverLetterGenerate && (

                    <>
                        <div>
                            <div className="flex items-center cursor-pointer" onClick={coverLetterOptionClick}>
                                {coverLetterOptionBlock ? (
                                    <ChevronDoubleDownIcon className="h-5 w-5 text-blue-700 cursor-pointer"/>
                                ) : (
                                    <ChevronDoubleRightIcon className="h-5 w-5 text-blue-700 cursor-pointer"/>
                                )}
                                <label htmlFor="coverLetterOption" className="cursor-pointer m-2 inline text-l font-medium leading-6 text-blue-700">
                                    Advanced Options
                                </label>
                            </div>

                            {coverLetterOptionBlock && (
                                <div className="m-2 " name="coverLetterOption" id="coverLetterOption">
                                    <AdvanceFeatureCoverLetter
                                        onSelectionChange={handleAdvanceFeatureData}
                                        advanceFeatureInitial={advanceFeatureDataCoverLetter}/>
                                </div>
                            )}



                        </div>
                        <button
                            onClick={generateCoverLetterStreamingLangChain}
                            type="submit"
                            className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                        >
                            {resumeData && resumeData.coverLetterAiGenerate ? (
                                <>ReGenerate Cover Letter</>
                            ) :(
                                <>Generate Cover Letter</>
                            )}
                        </button>
                    </>


                )}



            </div>
        </div>
    </div>
  )
}
export default EditCoverLetterBlock;
