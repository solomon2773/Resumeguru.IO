
import React, {useRef, useEffect, useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {toast} from "react-toastify";
import {ChatPromptTemplate} from "langchain/prompts";
import {linkedinConnectionMessagePrompt,
    linkedinConnectionMessageAITargetPrompt,
    linkedinConnectionMessageEasyModePrompt,
    linkedinConnectionMessageManualPrompt
} from "../../../helpers/langChain/prompts/linkedinMessage/linkedinMessage";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {linkedinConnectionMessageModel} from "../../../helpers/langChain/functions/linkedinMessage/linkedinMessage";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {
    mongodbGetLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion,
    mongodbRegenerateConnectionMessageStreaming
} from "../../../helpers/mongodb/pages/user/linkedinMessage";
import {
    mongodbGetResumeJobDescriptionByUserIdAndDocId,
    } from "../../../helpers/mongodb/pages/user/resume";
import defaultAdvancedFeatureConnectionMessage from "../../../utils/staticObjects/linkedinConnectionMessage/defaultAdvancedFeatureConnectionMessage";
import {Combobox, Menu, Transition} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import AdvanceFeatureCoverLetter from "../../aiResume/advanceFeatureCoverLetter";
import {estimateTokenCount} from "../../../utils/openAi";
import {useSelector} from "react-redux";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const LinkedinMessageBlock = ({resumeObjectId, resumeVersion, dataInputType}) => {

    const {   totalCredits, updateCredits } = useAuth();
    const user = useSelector((state) => state.user.profile);

    const [linkedinConnectionMessageGenerate , setLinkedinConnectionMessageGenerate] = useState([])
    const [linkedinConnectionMessageGenerateInProcess , setLinkedinConnectionMessageGenerateInProcess] = useState(false)
    const [aiTemputate , setAiTemputate] = useState(0.8);
    const [maxConcurrency , setMaxConcurrency] = useState(3);
    const [ advanceFeatureConnectionMessage, setAdvanceFeatureConnectionMessage] = useState(defaultAdvancedFeatureConnectionMessage);
    const [connectionMessageOptionBlock, setConnectionMessageOptionClickBlock] = useState(false)
    const [resumeJobDescription, setResumeJobDescription] = useState({})

    useEffect(() => {
        if (user.userId && resumeObjectId && resumeVersion){
           // console.log(user.userId+"-"+ resumeObjectId+"-"+ resumeVersion)
            mongodbGetLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion(user.userId, resumeObjectId, resumeVersion).then((result) => {
                if (result ){
                    setLinkedinConnectionMessageGenerate(result)
                }
            })
            mongodbGetResumeJobDescriptionByUserIdAndDocId(user.userId, resumeObjectId).then((result) => {
                if (result ){
                    setResumeJobDescription(result)
                }
            })
        }
    },[user, resumeVersion, resumeObjectId]);


    const generateLinkedinConnectionnMessageStandAloneStreaming = async (e) => {

        if (totalCredits < 100){
            return toast.error("You don't have enough credits to generate connection message. ")
        }
        if (connectionMessageType === "easyMode") {
            if (jdCopyPasteToggle ){
                if (selectedJDTemplateOption.docID === "0"){
                    return toast.error("Please select a job description to generate a connection message.")
                }


            } else {
                setFieldValidationCSS({...fieldValidationCSS,
                    jobDescription: jobDescriptionRef.current.value === "" ? "border-red-500 border-1" : "border-0",
                })
                if (jobDescriptionRef.current.value === ""){

                    return toast.error("Please paste a job description to generate a connection message.")
                }

            }

        } else {
            setFieldValidationCSS({...fieldValidationCSS,
                connectionMessageInfo: connectionMessageInfoRef.current.value === "" ? "border-red-500 border-1" : "border-0",
            })
            if (connectionMessageInfoRef.current.value === ""){

                return toast.error("Please enter some details to generate a connection message.")
            }


        }

        setLinkedinConnectionMessageGenerateInProcess(true)

        try {
            const startTime = Date.now();
            const chatPrompt = new ChatPromptTemplate(connectionMessageType === "easyMode" ? linkedinConnectionMessageEasyModePrompt : linkedinConnectionMessageManualPrompt);
            const modelOpenAI = new ChatOpenAI({
                temperature: aiTemputate,
                maxConcurrency: maxConcurrency,
                user: user.userId,
                stream: true,
                // modelName: advanceFeatureConnectionMessage.selectedAiModel.modelNameId,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(linkedinConnectionMessageModel);

            // console.log(resumeData.professionalExperienceRewrite)
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            let finalUserContent = {}

            if (connectionMessageType === "easyMode"){
                finalUserContent = {
                    "applicantName": user.firstName+" "+user.lastName,
                    "savedJobDescriptionDetail": {
                        "jobTitle": jdCopyPasteToggle ? selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent.jobTitle : "N/A",
                        "companyName": jdCopyPasteToggle ? selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent.companyName : "N/A",
                        "keyResponsibilities": jdCopyPasteToggle ? selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent.keyResponsibilities : "N/A",
                        "requiredSkills": jdCopyPasteToggle ? selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent.requiredSkills : "N/A",
                    },
                    "jobDescriptionPrompt": jobDescriptionRef.current && jobDescriptionRef.current.value ? jobDescriptionRef.current.value :  "N/A",

                };
            } else {
                finalUserContent = {
                    "applicantName": user.firstName+" "+user.lastName,
                    "promptExtraInfo": connectionMessageInfoRef.current.value, // This is the extra information that the user provides
                };
            }

            // console.log(finalUserContent)
            const stream = await chat.stream( {inputData: JSON.stringify(finalUserContent)});
            // Assume this variable is defined in the scope of your stream processing

            let output = "";
            let isNewObjectCreated = false;
            let linkedinConnectionMessageResultLength = 0;
            for await (const chunk of stream) {
                output = chunk;
                const chunkPart = chunk.linkedinConnectionMessage ? chunk.linkedinConnectionMessage : null;
                await setLinkedinConnectionMessageGenerate((connectionMessageResult) => {
                    // Directly work with coverLetterResult, which is assumed to be an array

                    if (chunkPart !== null && !isNewObjectCreated) {
                        // Add new object if chunkPart is not null and no new object has been created yet
                        connectionMessageResult.push({
                            parsedOutput: {
                                linkedinConnectionMessage: chunkPart,
                            },
                        });
                        isNewObjectCreated = true;
                        linkedinConnectionMessageResultLength = connectionMessageResult.length; // Update the length after adding a new object
                    } else if (chunkPart !== null && isNewObjectCreated) {
                        // Update the last object in the array if a new object has been created and chunkPart is not null
                        let lastObject = connectionMessageResult[linkedinConnectionMessageResultLength - 1]; // Use the updated length to access the last object
                        lastObject.parsedOutput.linkedinConnectionMessage = chunkPart;
                    }


                    return [...connectionMessageResult]; // Return the updated result directly
                });
            }
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            // mongodbRegenerateConnectionMessageStreaming({
            //     fetchTime: fetchTime,
            //     userId: user.userId,
            //     jobDescriptionObjectId: resumeJobDescription.postBodyJDInfoExtract && resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId ? resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId : "",
            //     resumeObjectId : resumeObjectId ? resumeObjectId : "",
            //     resumeVersion:resumeVersion ? parseInt(resumeVersion, 10) : "",
            //     modelVersion: advanceFeatureConnectionMessage.selectedAiModel.modelNameId,
            //     provider:advanceFeatureConnectionMessage.selectedAiModel.provider,
            //     modelParams: {
            //         temperature: aiTemputate,
            //         maxConcurrency: maxConcurrency
            //     },
            //     chatPrompt : chatPrompt,
            //     userContent: finalUserContent,
            //     parsedOutput:output,
            //     advanceFeature: advanceFeatureConnectionMessage,
            //     resumeBasicInfo:resumeJobDescription.resumeBasicInfo,
            //     userInformation: {
            //         "firstName": user.firstName ? user.firstName : "firstName",
            //         "lastName": user.lastName ? user.lastName : "firstName",
            //         "email": user.email ? user.email : "email",
            //         "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
            //         "city":user.city ? user.city : "City",
            //         "state":user.region ? user.region : "Texas",},
            //
            // }).then((result) => {
            //
            // }).catch((err) => {
            //     console.log("Linkedin Connectionn Message", err)
            //     toast.error("Regenerate Linkedin Connectionn Message Error 1001...")  ;
            // })

            updateCredits(user.userId);
            setLinkedinConnectionMessageGenerateInProcess(false)
        } catch (error) {
          //  console.log(error)
            toast.error("Generate connection message error ... ")
            setLinkedinConnectionMessageGenerateInProcess(false)
        }
    }
    const generateLinkedinConnectionnMessageStreaming = async (e) => {
        //console.log(resumeJobDescription)
        if (resumeJobDescription && !resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume && !resumeJobDescription.postBodyJDInfoExtract){
            return toast.error("Please add job description to your resume to generate connection message. ")
        }
        if (totalCredits < 100){
            return toast.error("You don't have enough credits to generate connection message. ")
        }
        setLinkedinConnectionMessageGenerateInProcess(true)

        try {
            const startTime = Date.now();
            const chatPrompt = new ChatPromptTemplate(resumeJobDescription && resumeJobDescription.resumeBasicInfo && resumeJobDescription.resumeBasicInfo.aiTargetResume ? linkedinConnectionMessageAITargetPrompt : linkedinConnectionMessagePrompt);
            const modelOpenAI = new ChatOpenAI({
                temperature: aiTemputate,
                maxConcurrency: maxConcurrency,
                user: user.userId,
                stream: true,
                modelName: advanceFeatureConnectionMessage.selectedAiModel.modelNameId,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(linkedinConnectionMessageModel);

            // console.log(resumeData.professionalExperienceRewrite)
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


            const stream = await chat.stream( {inputData: JSON.stringify(finalUserContent)});
            // Assume this variable is defined in the scope of your stream processing

            let output = "";
            let isNewObjectCreated = false;
            let linkedinConnectionMessageResultLength = 0;
            for await (const chunk of stream) {
                output = chunk;
                const chunkPart = chunk.linkedinConnectionMessage ? chunk.linkedinConnectionMessage : null;
                await setLinkedinConnectionMessageGenerate((connectionMessageResult) => {
                    // Directly work with coverLetterResult, which is assumed to be an array

                    if (chunkPart !== null && !isNewObjectCreated) {
                        // Add new object if chunkPart is not null and no new object has been created yet
                        connectionMessageResult.push({
                            parsedOutput: {
                                linkedinConnectionMessage: chunkPart,
                            },
                        });
                        isNewObjectCreated = true;
                        linkedinConnectionMessageResultLength = connectionMessageResult.length; // Update the length after adding a new object
                    } else if (chunkPart !== null && isNewObjectCreated) {
                        // Update the last object in the array if a new object has been created and chunkPart is not null
                        let lastObject = connectionMessageResult[linkedinConnectionMessageResultLength - 1]; // Use the updated length to access the last object
                        lastObject.parsedOutput.linkedinConnectionMessage = chunkPart;
                    }


                    return [...connectionMessageResult]; // Return the updated result directly
                });
            }
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            mongodbRegenerateConnectionMessageStreaming({
                fetchTime: fetchTime,
                userId: user.userId,
                jobDescriptionObjectId: resumeJobDescription.postBodyJDInfoExtract && resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId ? resumeJobDescription.postBodyJDInfoExtract.jobDescriptionObjectId : "",
                resumeObjectId : resumeObjectId ? resumeObjectId : "",
                resumeVersion:resumeVersion ? parseInt(resumeVersion, 10) : "",
                modelVersion: advanceFeatureConnectionMessage.selectedAiModel.modelNameId,
                provider:advanceFeatureConnectionMessage.selectedAiModel.provider,
                modelParams: {
                    temperature: aiTemputate,
                    maxConcurrency: maxConcurrency
                },
                chatPrompt : chatPrompt,
                userContent: finalUserContent,
                parsedOutput:output,
                advanceFeature: advanceFeatureConnectionMessage,
                resumeBasicInfo:resumeJobDescription.resumeBasicInfo,
                userInformation: {
                    "firstName": user.firstName ? user.firstName : "firstName",
                    "lastName": user.lastName ? user.lastName : "firstName",
                    "email": user.email ? user.email : "email",
                    "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
                    "city":user.city ? user.city : "City",
                    "state":user.region ? user.region : "Texas",},

            }).then((result) => {

            }).catch((err) => {
               // console.log("Linkedin Connectionn Message", err)
                toast.error("Regenerate Linkedin Connectionn Message Error 1001...")  ;
            })

            updateCredits(user.userId);
            setLinkedinConnectionMessageGenerateInProcess(false)
        } catch (error) {
           // console.log(error)
            toast.error("Generate connection message error ... ")
            setLinkedinConnectionMessageGenerateInProcess(false)
        }
    }
    const [connectionMessageType, setConnectionMessageType] = useState("easyMode");
    const connectionMessageWritingTypes = [
        { id: "easyMode", title: "Easy Intelligent Mode" },
        { id: "manualMode", title: "Manually enter information" },

    ];

    const handleCoverLetterType = (value) => {
        setConnectionMessageType(value);
    }
    const [jobDescriptionList, setJobDescriptionList] = useState([]);
    const [selectedJDTemplateOption, setSelectedJDTemplateOption] = useState({docID:"0", _id:"Select a Job Description Template"});
    const [queryJobDescriptionTemplate, setQueryJobDescriptionTemplate] = useState('')
    const jobDescriptionListItem = jobDescriptionList;
    const filteredJDList =
        queryJobDescriptionTemplate === ''
            ? jobDescriptionListItem
            : jobDescriptionListItem.filter((jdList) => {
                return jdList._id.toLowerCase().includes(queryJobDescriptionTemplate.toLowerCase())
            })
   // console.log(jobDescriptionList)
   // console.log(selectedJDTemplateOption)
    useEffect(()=>{
        async function loadUserTemplate(){
            try {
                const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/resumeapi', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.userId ,
                        action: 'getJdInfoTemplateByUserId',

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
                    }
                });
                const result = await response.json();
                setJobDescriptionList(result.result);
                if (!result.success) {

                    return toast.error("User template loading error ...")
                }

            } catch (error) {
               // console.log(error)
                toast.error("User template loading error .. ")

            }
        }
        if (user && user.userId && dataInputType === "standAlone"){
            loadUserTemplate().then((r) => {
                // console.log("loadUserTemplate", r)
            })

        }
    },[user, dataInputType ]);
    const [jdCopyPasteToggle, setJdCopyPasteToggle] = useState(true);
    const jobDescriptionRef = useRef(null);
    const [jobDescriptionTokenCount, setJobDescriptionTokenCount] = useState(0);
    const handleJobDescriptionChange = (value) => {
        estimateTokenCount(value, 1).then((result) => {
            setJobDescriptionTokenCount(result);
        });
    }


    const connectionMessageInfoRef = useRef(null);
    const [connectionMessageTokenCount, setConnectionMessageTokenCount] = useState(0);
    const handleConnectionMessageChange = (value) => {
        estimateTokenCount(value, 1).then((result) => {
            setConnectionMessageTokenCount(result);
        });
    }
    const [fieldValidationCSS, setFieldValidationCSS] = useState({
          jobDescription: "border-0",
        connectionMessageInfo: "border-0",
    });
    return (
        <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0">
                <div className=" justify-between p-2  text-sm leading-6">
                    {linkedinConnectionMessageGenerateInProcess ? (
                        <div className="text-center align-middle mt-5">
                            <div
                                className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                                          <span
                                                              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                          >Generating Connection Message...</span
                                                          >
                            </div>
                            Generating Connection Message ...
                        </div>

                    ):(
                        <div>
                            {dataInputType === "standAlone" && (
                                <div>
                                    <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900">
                                        <div className="">



                                            <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                                <div className="pt-4">
                                                    <h3 className="block text-sm font-medium leading-6 text-gray-900">Creating Mode : </h3>
                                                    {/*<p className="text-sm text-gray-500"></p>*/}
                                                    <fieldset className="mt-4">
                                                        <legend className="sr-only">Creating Mode : </legend>
                                                        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                            {connectionMessageWritingTypes.map((connectionMessageWritingType) => (
                                                                <div key={"connectionMessageWritingType_div_"+connectionMessageWritingType.id} className="inline-block items-center">
                                                                    <input
                                                                        id={connectionMessageWritingType.id}
                                                                        name="connectionMessageWritingType"
                                                                        type="radio"
                                                                        value={connectionMessageWritingType.id}
                                                                        onChange={(e) => {
                                                                            // setWritingTone(e.target.value);
                                                                            handleCoverLetterType(e.target.value);
                                                                        } }
                                                                        defaultChecked={connectionMessageWritingType.id === connectionMessageType}
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                    />
                                                                    <label htmlFor={"writingType_"+connectionMessageWritingType.id} className="ml-2 mr-2 text-sm font-medium leading-6 text-gray-900">
                                                                        {connectionMessageWritingType.title}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-4 ">

                                                    {connectionMessageType === "easyMode" && (
                                                        <div className="mt-2 mb-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-2 ">
                                                            <blockquote
                                                                id="standalone_connectionMessage_blockquote"
                                                                className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                                                                <p className="text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">"In simple mode, we'll use details from the job description to automatically create a LinkedIn connection message for you. If there’s nothing in your saved list, simply copy and paste the job description to get started."</p>
                                                            </blockquote>
                                                            <label className="inline-flex items-center cursor-pointer">
                                                                <span className=" text-sm font-medium text-gray-900 dark:text-gray-300 mr-3">Job description from saved list or copy/paste</span>
                                                                <input type="checkbox" checked={jdCopyPasteToggle} className="sr-only peer"
                                                                       onChange={(e) => {
                                                                           setJdCopyPasteToggle(e.target.checked);
                                                                       }}
                                                                />
                                                                <div
                                                                    className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                            {jdCopyPasteToggle ? (
                                                                <Combobox as="div" value={selectedJDTemplateOption} onChange={setSelectedJDTemplateOption}>
                                                                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Saved Job Description List</Combobox.Label>
                                                                    <div className="relative mt-2">
                                                                        <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">

                                                                            <Combobox.Input
                                                                                id="connectionMessageSavedJDList-sel"
                                                                                readOnly
                                                                                className="cursor-default w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                                onChange={(event) => {
                                                                                    setQueryJobDescriptionTemplate(event.target.value);

                                                                                }}
                                                                                displayValue={(jdTemplate) => {
                                                                                    return jdTemplate?._id;
                                                                                }}
                                                                            />
                                                                        </Combobox.Button>
                                                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                        </Combobox.Button>

                                                                        {filteredJDList.length > 0 && (
                                                                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                {filteredJDList.map((level) => (
                                                                                    <Combobox.Option
                                                                                        key={"jdList_"+level.docID}
                                                                                        value={level}
                                                                                        className={({ active }) =>
                                                                                            classNames(
                                                                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {({ active, selected }) => (
                                                                                            <>
                                                                                                <span className={classNames('block truncate', selected && 'font-semibold')}>{level._id}</span>

                                                                                                {selected && (
                                                                                                    <span
                                                                                                        className={classNames(
                                                                                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                                                            active ? 'text-white' : 'text-indigo-600'
                                                                                                        )}
                                                                                                    >
                                                                                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                                    </span>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    </Combobox.Option>
                                                                                ))}
                                                                            </Combobox.Options>
                                                                        )}
                                                                    </div>
                                                                </Combobox>
                                                            ) : (
                                                                <div className="grid grid-cols-1  lg:gap-8">
                                                                    <div className="">
                                                                        {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                                                                        {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                                                                        <fieldset className="">


                                                                            <div className="space-y-2 sm:block  w-full h-auto">

                                                                                <div className="">

                                                                                    <div className="mt-2">
                                                                                        <div>
                                                                                            <h2 className="sr-only">Job description</h2>
                                                                                            <label htmlFor="jobDescirption" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                                To start, enter some details here for our system to understand what job and recruiter you are trying to connect.
                                                                                                Don't have a job in mind yet? Try using a job description from a job board like Indeed or LinkedIn.
                                                                                            </label>
                                                                                            <div className="">
                                                                                                    <textarea
                                                                                                        rows={8}
                                                                                                        name="jobDescirption"
                                                                                                        id="jobDescirption"
                                                                                                        ref={jobDescriptionRef}
                                                                                                        onChange={(e)=>{ handleJobDescriptionChange(e.target.value)}}
                                                                                                        className={`${fieldValidationCSS.jobDescription} p-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                                                                                        placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                                                                                                    />
                                                                                                <div>Token Count : {jobDescriptionTokenCount ? jobDescriptionTokenCount : "0"}</div>
                                                                                            </div>



                                                                                        </div>
                                                                                    </div>


                                                                                </div>

                                                                            </div>




                                                                        </fieldset>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    )}
                                                    {connectionMessageType === "manualMode" && (
                                                        <div className="mt-2 mb-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-2 ">
                                                            <blockquote
                                                                id="standalone_connectionMessage_blockquote"
                                                                className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                                                                <p className="text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">"In simple mode, we'll use details from the job description to automatically create a LinkedIn connection message for you. If there’s nothing in your saved list, simply copy and paste the job description to get started."</p>
                                                            </blockquote>
                                                            <div className="grid grid-cols-1  lg:gap-8">
                                                                <div className="">
                                                                    {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                                                                    {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                                                                    <fieldset className="">
                                                                        <div className="space-y-2 sm:block  w-full h-auto">

                                                                            <div className="">

                                                                                <div className="">
                                                                                    <div>
                                                                                        <h2 className="sr-only">Connecting Message Information</h2>

                                                                                        <div className="">
                                                                                                    <textarea
                                                                                                        rows={4}
                                                                                                        name="connectionMessageManualInfo"
                                                                                                        id="connectionMessageManualInfo"
                                                                                                        ref={connectionMessageInfoRef}
                                                                                                        onChange={(e)=>{ handleConnectionMessageChange(e.target.value)}}
                                                                                                        className={`${fieldValidationCSS.connectionMessageInfo} p-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                                                                                        placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                                                                                                    />
                                                                                            <div>Token Count : {connectionMessageTokenCount ? connectionMessageTokenCount : "0"}</div>
                                                                                        </div>



                                                                                    </div>
                                                                                </div>


                                                                            </div>

                                                                        </div>




                                                                    </fieldset>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )}

                                                </div>
                                                {/*<div className="col-start-1 col-end-13 mt-2">*/}
                                                {/*    <AdvanceFeatureCoverLetter*/}
                                                {/*        onSelectionChange={handleAdvanceFeatureData}*/}
                                                {/*        advanceFeatureInitial={advanceFeatureData}/>*/}
                                                {/*</div>*/}

                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={generateLinkedinConnectionnMessageStandAloneStreaming}
                                        type="submit"
                                        className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                    >
                                        {linkedinConnectionMessageGenerate && linkedinConnectionMessageGenerate.length > 0 ? (
                                            <>ReGenerate Connection Message</>
                                        ) :(
                                            <>Generate Connection Message</>
                                        )}
                                    </button>
                                    <p>On-demand message will not be saved, please make sure you copy it before you close this popup</p>
                                </div>
                            )}



                            {dataInputType === "aiResume" && (

                                <button
                                    onClick={generateLinkedinConnectionnMessageStreaming}
                                    type="submit"
                                    className="group inline-flex items-center w-full cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                >
                                    {linkedinConnectionMessageGenerate && linkedinConnectionMessageGenerate.length > 0 ? (
                                        <>ReGenerate Connection Message</>
                                    ) :(
                                        <>Generate Connection Message</>
                                    )}
                                </button>
                            )}


                        </div>


                    )}
                </div>

                {linkedinConnectionMessageGenerate && linkedinConnectionMessageGenerate.length > 0 &&  linkedinConnectionMessageGenerate.map((message, connectionMessageIndex)=>{
                    return(
                        <React.Fragment key={"linkedin_msg_block_"+connectionMessageIndex}>
                            <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6 border border-gray-200 ">
                                <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">

                                    <p  className="indent-8 mb-4">{connectionMessageIndex+1}. {message.parsedOutput.linkedinConnectionMessage}</p>
                                </div>
                            </li>
                        </React.Fragment>

                    )
                })}
                {/*{resumeData && resumeData.linkedinConnectionMessageAiGenerate && resumeData.linkedinConnectionMessageAiGenerate.map((message, index) => (*/}
                {/*// Rendering each line as a separate paragraph*/}
                {/*    <li key={"linkedinConnectionMessageAiGenerate_"+index} className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6 border border-gray-200 ">*/}
                {/*        <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">*/}
                {/*            <p  className="indent-8 mb-4">{message}</p>*/}
                {/*        </div>*/}
                {/*    </li>*/}
                {/*))}*/}




        </div>

    );
}

export default LinkedinMessageBlock;
