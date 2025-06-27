import React, {useEffect, useState} from 'react'
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import { FaGripVertical, FaBars, FaRegQuestionCircle} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {Datepicker, Dropdown, DropdownItem} from 'flowbite-react';
import {TextInput, Tooltip, Button, Modal, Label, Spinner, Textarea} from "flowbite-react";
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import {
    removeResumeDetailsExperience,
    updateResumeDetailsExperience,
    updateResumeDetailsExperienceHistory,
    updateResumeDetailsExperienceOrder,
    updateResumeDetailsExperienceHistoryOrder,
    addNewResumeDetailsExperience,
    updateResumeDetailsExperienceVersion,
    rewriteResumeDetailsExperienceBulletPoint,
} from "../../../store/resumeEditReducer";
import {
    mongodbRemoveResumeExperience,
    mongodbUpdateExperienceRewrite,
    mongodbUpdateResumeExperienceOrder,
    mongodbAddNewExperienceRewrite,
    mongodbUpdateExperienceVersion,
    mongodbRegenerateExperienceBulletPointStreamingCredtInsert,
    mongodbRegenerateExperienceParagraphStreamingCredtInsert,
} from "../../../helpers/mongodb/components/myResume/Edit/experienceBlock";
import {
    updateWorkExperienceOrder,
    addNewWorkExperienceScore
} from "../../../store/resumeScoreReducer";
import {PiStarFourFill} from "react-icons/pi";
import {ChatPromptTemplate} from "langchain/prompts";
import {
    experienceBulletPointReGeneratePrompt,
    experienceReGeneratePrompt,
    experienceNewGeneratePrompt,
    experienceBulletPointNewGeneratePrompt,
} from "../../../helpers/langChain/prompts/myResumeEdit/experience";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {experienceBulletPointModel, experienceParagraphModel} from "../../../helpers/langChain/functions/myResumeEdit/experience";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {QuestionMarkCircleIcon} from "@heroicons/react/24/outline";

const ExperienceBlock = () => {
    const parseDate = async (dateString) => {
        if (!dateString) return null;
        const [year, month] = dateString.split('-');
        return new Date(year, month - 1); // Month is 0-indexed in JS Date
    };
    const formatDate =  (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
        //   const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
        const year = date.getFullYear();
        return `${year}-${month}`; //`${month}-${day}-${year}`;
    };
    const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)
    const resumeScore = useSelector(state => state.resumeScore)
    const user = useSelector(state => state.user)
    const skillsHighlight = useSelector(state => state.resumeEdit.skillsHighlight)
    const [experienceEditRemoveModal, setExperienceEditRemoveModal] = useState(false);
    const [experienceEditModal, setExperienceEditModal] = useState(false);
    const [experienceEditIndex, setExperienceEditIndex] = useState(0);
    const [experienceEditDetails, setExperienceEditDetails] = useState({});
    const [experienceEditEndDate, setExperienceEditEndDate] = useState(null);
    const [experienceEditStartDate, setExperienceEditStartDate] = useState(null);
    const [updateExperienceProcessing , setUpdateExperienceProcessing] = useState(false);
    const [experienceRemoveProcessing , setExperienceRemoveProcessing] = useState(false);
    const [experienceAddNewModal, setExperienceAddNewModal] = useState(false);
    const [addNewExperienceProcessing , setAddNewExperienceProcessing] = useState(false);
    const [experienceAddNewContent , setExperienceAddNewContent] = useState("");
    const [experienceAddNewContentBullet, setExperienceAddNewContentBullet] = useState([]);


    const [experienceAddNewStartDate, setExperienceAddNewStartDate] = useState(null);
    const [experienceAddNewEndDate , setExperienceAddNewEndDate] = useState(null);
    const [experienceEditContentBullet, setExperienceEditContentBullet] = useState([]);
    const [experienceEditContent, setExperienceEditContent] = useState("");
    const [experienceEditMatchingSkills, setExperienceEditMatchingSkills] = useState([]);

    const removeExperienceHandler = async (index)=> {
        setExperienceRemoveProcessing(true);
        dispatch(removeResumeDetailsExperience({index: index}))
        await mongodbRemoveResumeExperience(resumeDetails._id, index).then((response) => {
            setExperienceEditRemoveModal(false);
            setExperienceRemoveProcessing(false);
        }).catch((error) => {
            setExperienceRemoveProcessing(false);
            toast.error("Error removing experience")
        })



    }


    const professionalExperienceEditClickHandler = (experience, experienceIndex) => {
        // console.log(resumeData)
        setExperienceEditModal(true);
        setExperienceEditIndex(experienceIndex);
        setExperienceEditMatchingSkills(experience.matchingSkills ? experience.matchingSkills : []);
        if (resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet") {

            setExperienceEditContentBullet(experience.professionalExperienceDescriptionBulletPoints ? experience.professionalExperienceDescriptionBulletPoints : []);
        } else {
            setExperienceEditContent(experience.professionalExperienceDescription ? experience.professionalExperienceDescription : "");
        }

    }
    const addBulletPointHandler = () => {

        setExperienceEditContentBullet([...experienceEditContentBullet, ""])
    }
    const addBulletPointAddNewHandler = () => {

        setExperienceAddNewContentBullet([...experienceAddNewContentBullet, ""])
    }
    const [isBulletPointUpdate , setIsBulletPointUpdate] = useState(false);
    const [isAddNewBulletPointUpdate , setIsAddNewBulletPointUpdate] = useState(false);
    useEffect(() => {
        if(isBulletPointUpdate){
            setIsBulletPointUpdate(false);
        }
        if (isAddNewBulletPointUpdate){
            setIsAddNewBulletPointUpdate(false);
        }

    },[experienceEditContentBullet, experienceAddNewContentBullet])
    const removeBulletPointHandler =  (index) => {
        setExperienceEditContentBullet((prevContent) => [
            ...prevContent.slice(0, index),
            ...prevContent.slice(index + 1)
        ]);
        setIsBulletPointUpdate(true);
    }
    const removeAddNewBulletPointHandler =  (index) => {
        setExperienceAddNewContentBullet((prevContent) => [
            ...prevContent.slice(0, index),
            ...prevContent.slice(index + 1)
        ]);
        setIsAddNewBulletPointUpdate(true);
    }
    const updateExperienceHandler = async () => {
        setUpdateExperienceProcessing(true);
        // setIsBulletPointUpdate(true);

        const updatedExperience = {
            professionalExperienceTitle: document.getElementById("experienceEditTitle").value,
            professionalExperienceContentSytle : resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout,
            professionalExperienceDescription: experienceEditContent ? experienceEditContent :"",
            professionalExperienceDescriptionBulletPoints: experienceEditContentBullet ? experienceEditContentBullet : [],
            matchingSkills: experienceEditMatchingSkills,
            jobStartDate: document.getElementById("experienceEditStartDate").value,
            jobEndDate: document.getElementById("experienceEditEndDate").value,
            companyName: document.getElementById("experienceCompanyName").value,
        }


        dispatch(updateResumeDetailsExperience({
            index: experienceEditIndex,
            data: updatedExperience
        }))

        dispatch(updateResumeDetailsExperienceHistory({
            index: experienceEditIndex,
            data: updatedExperience
        }))


        await mongodbUpdateExperienceRewrite({
            resumeObjectId: resumeDetails._id,
            experienceEditIndex: experienceEditIndex,
            professionalExperienceTitle: updatedExperience.professionalExperienceTitle,
            professionalExperienceContentSytle: updatedExperience.professionalExperienceContentSytle,
            matchingSkills: experienceEditMatchingSkills,
            professionalExperienceDescription: updatedExperience.professionalExperienceDescription,
            professionalExperienceDescriptionBulletPoints: updatedExperience.professionalExperienceDescriptionBulletPoints,
            selectedVersion: resumeDetails.professionalExperienceRewriteHistory[experienceEditIndex].length,
            jobStartDate: updatedExperience.jobStartDate ? updatedExperience.jobStartDate : "",
            jobEndDate: updatedExperience.jobEndDate ? updatedExperience.jobEndDate : "",
            companyName: updatedExperience.companyName,

        })
            .then((result) => {
                setUpdateExperienceProcessing(false);
                setExperienceEditModal(false);
                dispatch(updateResumeDetailsExperienceVersion(
                    {
                        experienceIndex: experienceEditIndex,
                        versionIndex: resumeDetails.professionalExperienceRewriteHistory[experienceEditIndex].length,
                    }
                ))


            }).catch((error) => {

                setUpdateExperienceProcessing(false);
                setExperienceEditModal(false);
                toast.error("Update experience error ...")
            })


    }

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        dispatch(updateResumeDetailsExperienceOrder({oldIndex: source.index, newIndex: destination.index})) ;
        dispatch(updateResumeDetailsExperienceHistoryOrder({oldIndex: source.index, newIndex: destination.index})) ;
        dispatch(updateWorkExperienceOrder({oldIndex: source.index, newIndex: destination.index}));
        mongodbUpdateResumeExperienceOrder(resumeDetails._id, source.index, destination.index).then((response) => {
          // console.log(response)
        }).catch((error) => {
            console.log(error)

        })
    };

    const addNewExperienceHandler = async () => {
        setAddNewExperienceProcessing(true);
        const newExperience = {
            companyName: document.getElementById("experienceAddNewCompanyName").value ? document.getElementById("experienceAddNewCompanyName").value : "",
            professionalExperienceTitle: document.getElementById("experienceAddNewTitle").value ? document.getElementById("experienceAddNewTitle").value : "",
            professionalExperienceContentSytle : resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout ? resumeDetails.advancedPromptFeature.workExperienceParagraphLayout : "bullet",
            professionalExperienceDescription: experienceAddNewContent ? experienceAddNewContent : "",
            professionalExperienceDescriptionBulletPoints: experienceAddNewContentBullet ? experienceAddNewContentBullet : [],
            matchingSkills: experienceEditMatchingSkills,
            selectedVersion: 0,
            jobStartDate: document.getElementById("experienceAddNewStartDate").value ? document.getElementById("experienceAddNewStartDate").value : "",
            jobEndDate: document.getElementById("experienceAddNewEndDate").value ? document.getElementById("experienceAddNewEndDate").value : ""  ,
            uuid: uuidv4(),

        }
        dispatch(addNewResumeDetailsExperience(newExperience));
        dispatch(addNewWorkExperienceScore({
            workExperience:[],
            workExperienceTotalScore: 0,
        }));

        mongodbAddNewExperienceRewrite(resumeDetails._id, newExperience).then((response) => {
            setAddNewExperienceProcessing(false);
            setExperienceAddNewModal(false);
            // dispatch(updateResumeDetailsExperienceVersion(
            //     {
            //         experienceIndex: experienceEditIndex,
            //         versionIndex: resumeDetails.professionalExperienceRewriteHistory[experienceEditIndex].length,
            //     }
            // ))
        }).catch((error) => {
            setAddNewExperienceProcessing(false);
            setExperienceAddNewModal(false);
            toast.error("Error adding new experience")

        })
    }
    // console.log(resumeDetails._id)
    const [experienceVersion, setExperienceVersion] = useState([]);
    useEffect(() => {
        if (resumeDetails && resumeDetails.professionalExperienceRewriteHistory ){
            const experienceVersion = [];
            for (const [outerKey, nestedObject] of Object.entries(resumeDetails.professionalExperienceRewriteHistory)) {
                if (nestedObject && nestedObject.length > 0){
                    const version = "Version : " + (nestedObject.length );
                    experienceVersion.push(version);
                } else {
                    experienceVersion.push("Version : 0");
                }

            }
            setExperienceVersion(experienceVersion);
        }

    },[resumeDetails])
    //  console.log(experienceVersion)


    const experienceVersionChangeHandler = (experienceIndex, versionIndex) => {

       // console.log(experienceIndex, versionIndex)
        dispatch(updateResumeDetailsExperienceVersion(
            {
                experienceIndex: experienceIndex,
                versionIndex: versionIndex,

            }
        ))

        mongodbUpdateExperienceVersion(resumeDetails._id, experienceIndex, versionIndex).then((response) => {
            console.log(response)
        }).catch((error) => {

            toast.error("Error updating experience version")
        })


    }

    const [bulletPointAIGenerateProcessing, setBulletPointAIGenerateProcessing] = useState(false);
    const handleBulletPointAIGenerate = async ( bulletPointIndex) => {

        setBulletPointAIGenerateProcessing(true);
        const bulletPointText = resumeDetails.professionalExperienceRewrite[experienceEditIndex].professionalExperienceDescriptionBulletPoints[bulletPointIndex];
        const startTime = Date.now();
        try{
            const modelParams = {
                temperature: user.aiParams.temperature,
                user: user.profile.userId,
                stream: true,
                modelName: user.aiParams.defaultModel,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            };

            let chatPrompt;
            let streamInputData;
            chatPrompt = new ChatPromptTemplate(experienceBulletPointReGeneratePrompt);
            streamInputData = {
                "jobDescription":{
                    // jobTitle: resumeDetails.postBodyJDInfoExtract.jobTitle,
                    // conpanyName: resumeDetails.postBodyJDInfoExtract.companyName,
                    keyResponsibilities: resumeDetails.postBodyJDInfoExtract.keyResponsibilities,
                    requiredSkills: resumeDetails.postBodyJDInfoExtract.requiredSkills,
                    // qualifications: resumeDetails.postBodyJDInfoExtract.qualifications,
                },
                professionalExperience: bulletPointText,
                paragraphLength:resumeDetails.advancedPromptFeature.paragraphLength,
                writingTone:resumeDetails.advancedPromptFeature.writingTone,
            };
            const modelOpenAI = new ChatOpenAI(modelParams).bind(experienceBulletPointModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
            let experienceBulletPointBuf = "";
            for await (const chunk of stream) {

                experienceBulletPointBuf = chunk;
                document.getElementById("experienceEditContentBullet_"+bulletPointIndex).value = experienceBulletPointBuf.experienceRewrite;

            }
            let temp = [...experienceEditContentBullet];
            temp[bulletPointIndex] = experienceBulletPointBuf.experienceRewrite;
            setExperienceEditContentBullet(temp);
            let tempSkills = [...experienceEditMatchingSkills];
            tempSkills[bulletPointIndex] = experienceBulletPointBuf.matchingSkills;
            setExperienceEditMatchingSkills(tempSkills);

            // updateCredits(user.profile.userId);
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            setBulletPointAIGenerateProcessing(false);
            mongodbRegenerateExperienceBulletPointStreamingCredtInsert({
                userId: user.profile.userId,
                resumeObjectId: resumeDetails._id,
                modelVersion: user.aiParams.defaultModel,
                provider: user.aiParams.currentAiModel,
                chatPrompt : chatPrompt,
                userContent: streamInputData,
                parsedOutput: experienceBulletPointBuf,

            }).then((result)=>{

            });

        } catch (e) {
            console.log('experienceBulletPoint Generate:', e);
            setBulletPointAIGenerateProcessing(false);
            return toast.error("Experience Bullet Point Generate Error. Please go back and try again later.  ")

        }

    }

    const handleBulletPointAIGenerateNew = async ( bulletPointIndex) => {

        setBulletPointAIGenerateProcessing(true);
        const bulletPointText = document.getElementById("experienceAddNewContentBullet_"+bulletPointIndex) && document.getElementById("experienceAddNewContentBullet_"+bulletPointIndex).value ? document.getElementById("experienceAddNewContentBullet_"+bulletPointIndex).value : "";
        if (bulletPointText === ""){
            setBulletPointAIGenerateProcessing(false);
            return toast.error("Please enter your work experience")
        }
        const startTime = Date.now();
        try{
            const modelParams = {
                temperature: user.aiParams.temperature,
                user: user.profile.userId,
                stream: true,
                modelName: user.aiParams.defaultModel,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            };

            let chatPrompt;
            let streamInputData;
            chatPrompt = new ChatPromptTemplate(experienceBulletPointNewGeneratePrompt );
            streamInputData = {
                "jobDescription":{
                    // jobTitle: resumeDetails.postBodyJDInfoExtract.jobTitle,
                    // conpanyName: resumeDetails.postBodyJDInfoExtract.companyName,
                    keyResponsibilities: resumeDetails.postBodyJDInfoExtract.keyResponsibilities,
                    requiredSkills: resumeDetails.postBodyJDInfoExtract.requiredSkills,
                    // qualifications: resumeDetails.postBodyJDInfoExtract.qualifications,
                },
                professionalExperience: bulletPointText,
                paragraphLength:resumeDetails.advancedPromptFeature.paragraphLength,
                writingTone:resumeDetails.advancedPromptFeature.writingTone,
            };
            const modelOpenAI = new ChatOpenAI(modelParams).bind(experienceBulletPointModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
            let experienceBulletPointBuf = "";
            for await (const chunk of stream) {

                experienceBulletPointBuf = chunk;
                document.getElementById("experienceAddNewContentBullet_"+bulletPointIndex).value = experienceBulletPointBuf.experienceRewrite;

            }
            let temp = [...experienceAddNewContentBullet];
            temp[bulletPointIndex] = experienceBulletPointBuf.experienceRewrite;
            setExperienceAddNewContentBullet(temp);
            let tempSkills = [...experienceEditMatchingSkills];
            tempSkills[bulletPointIndex] = experienceBulletPointBuf.matchingSkills;
            setExperienceEditMatchingSkills(tempSkills);
            // updateCredits(user.profile.userId);
            const endTime = Date.now();
            const fetchTime = endTime - startTime;
            setBulletPointAIGenerateProcessing(false);
            mongodbRegenerateExperienceBulletPointStreamingCredtInsert({
                userId: user.profile.userId,
                resumeObjectId: resumeDetails._id,
                modelVersion: user.aiParams.defaultModel,
                provider: user.aiParams.currentAiModel,
                chatPrompt : chatPrompt,
                userContent: streamInputData,
                parsedOutput: experienceBulletPointBuf,

            }).then((result)=>{

            });

        } catch (e) {
            console.log('experienceBulletPoint Generate:', e);
            setBulletPointAIGenerateProcessing(false);
            return toast.error("Experience Bullet Point Generate Error. Please go back and try again later.  ")

        }

    }
    const [textareaAiGenerateProcessing, setTextareaAiGenerateProcessing] = useState(false);
    const handleTextareaAiGenerate = async () => {
        setTextareaAiGenerateProcessing(true);
    const experienceText = resumeDetails.professionalExperienceRewrite[experienceEditIndex].professionalExperienceDescription;
            const startTime = Date.now();
            try {
                const modelParams = {
                    temperature: user.aiParams.temperature,
                    user: user.profile.userId,
                    stream: true,
                    modelName: user.aiParams.defaultModel,
                    azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
                };

                let chatPrompt;
                let streamInputData;
                chatPrompt = new ChatPromptTemplate(experienceReGeneratePrompt);
                streamInputData = {
                    "jobDescription":{
                        // jobTitle: resumeDetails.postBodyJDInfoExtract.jobTitle,
                        // conpanyName: resumeDetails.postBodyJDInfoExtract.companyName,
                        keyResponsibilities: resumeDetails.postBodyJDInfoExtract.keyResponsibilities,
                        requiredSkills: resumeDetails.postBodyJDInfoExtract.requiredSkills,
                        // qualifications: resumeDetails.postBodyJDInfoExtract.qualifications,
                    },
                    professionalExperience: experienceText,
                    paragraphLength: resumeDetails.advancedPromptFeature.paragraphLength,
                    writingTone: resumeDetails.advancedPromptFeature.writingTone,
                };
                const modelOpenAI = new ChatOpenAI(modelParams).bind(experienceParagraphModel);
                const chat = chatPrompt
                    .pipe(modelOpenAI)
                    .pipe(new JsonOutputFunctionsParser());

                const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
                let experienceBuf = "";
                for await (const chunk of stream) {

                    experienceBuf = chunk;
                    document.getElementById("experienceEditParagraphContent" ).value = experienceBuf.experienceRewrite;
                }
                setExperienceEditMatchingSkills(experienceBuf.matchingSkills);
                setExperienceEditContent(experienceBuf.experienceRewrite);
                setTextareaAiGenerateProcessing(false);
                mongodbRegenerateExperienceParagraphStreamingCredtInsert
                ({
                    userId: user.profile.userId,
                    resumeObjectId: resumeDetails._id,
                    modelVersion: user.aiParams.defaultModel,
                    provider: user.aiParams.currentAiModel,
                    chatPrompt : chatPrompt,
                    userContent: streamInputData,
                    parsedOutput: experienceBuf,
                }).then((result)=>{

                });



            } catch (e) {
                setTextareaAiGenerateProcessing(false);
                console.log('experience Generate:', e);
                return toast.error("Experience Generate Error. Please go back and try again later.  ")
            }
    }
    const handleTextareaAiGenerateNew = async () => {
        setTextareaAiGenerateProcessing(true);
        const experienceText = document.getElementById("experienceAddNewContent" ) && document.getElementById("experienceAddNewContent" ).value ? document.getElementById("experienceAddNewContent" ).value : (resumeDetails.professionalExperienceRewrite && resumeDetails.professionalExperienceRewrite[experienceEditIndex] && resumeDetails.professionalExperienceRewrite[experienceEditIndex].professionalExperienceDescription ? resumeDetails.professionalExperienceRewrite[experienceEditIndex].professionalExperienceDescription : "");
        if (!experienceText) {
            setTextareaAiGenerateProcessing(false);
            return toast.error("Please enter the content to generate");
        }
        const startTime = Date.now();
        try {
            const modelParams = {
                temperature: user.aiParams.temperature,
                user: user.profile.userId,
                stream: true,
                modelName: user.aiParams.defaultModel,
                azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            };

            let chatPrompt;
            let streamInputData;
            chatPrompt = new ChatPromptTemplate(experienceNewGeneratePrompt);
            streamInputData = {
                "jobDescription":{
                    // jobTitle: resumeDetails.postBodyJDInfoExtract.jobTitle,
                    // conpanyName: resumeDetails.postBodyJDInfoExtract.companyName,
                    keyResponsibilities: resumeDetails.postBodyJDInfoExtract.keyResponsibilities,
                    requiredSkills: resumeDetails.postBodyJDInfoExtract.requiredSkills,
                    // qualifications: resumeDetails.postBodyJDInfoExtract.qualifications,
                },
                professionalExperience: experienceText,
                paragraphLength: resumeDetails.advancedPromptFeature.paragraphLength,
                writingTone: resumeDetails.advancedPromptFeature.writingTone,
            };
            const modelOpenAI = new ChatOpenAI(modelParams).bind(experienceParagraphModel);
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
            let experienceBuf = "";
            for await (const chunk of stream) {

                experienceBuf = chunk;
                document.getElementById("experienceAddNewContent" ).value = experienceBuf.experienceRewrite;
            }
            setExperienceEditMatchingSkills(experienceBuf.matchingSkills);
            setExperienceAddNewContent(experienceBuf.experienceRewrite);
            setTextareaAiGenerateProcessing(false);
            mongodbRegenerateExperienceParagraphStreamingCredtInsert
            ({
                userId: user.profile.userId,
                resumeObjectId: resumeDetails._id,
                modelVersion: user.aiParams.defaultModel,
                provider: user.aiParams.currentAiModel,
                chatPrompt : chatPrompt,
                userContent: streamInputData,
                parsedOutput: experienceBuf,
            }).then((result)=>{

            });



        } catch (e) {
            setTextareaAiGenerateProcessing(false);
            console.log('experience Generate:', e);
            return toast.error("Experience Generate Error. Please go back and try again later.  ")
        }
    }
    const highlightText = (paragraph, matchingSkills) => {
        const words = paragraph.split(' '); // Split paragraph into words
        return words.map((word, index) => {
            // Clean word to ignore punctuation and lowercase it for comparison
            const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();

            // Check if any of the matching skills are included in the word
            const isMatchingSkill = matchingSkills.some(skill => cleanWord.includes(skill.toLowerCase()));

            // If the word includes any matching skill, highlight it
            if (isMatchingSkill) {
                return (
                    <span
                        key={index}
                        style={{
                            backgroundColor: 'yellow',
                            fontWeight: 'bold',
                        }}
                    >
          {word}{' '}
        </span>
                );
            }

            // If it's not a matching skill, return the word as is
            return `${word} `;
        });
    };


    return(

        <div>
            <div className="py-2 sm:px-0 m-2">
                <h2 className=" text-xl flex">
                <div className="text-xl font-large leading-6 text-black-900 ">
                    <div className="font-bold">
                        Professional Experience
                    </div>
                </div>
                    <Tooltip content="You can add new Experience/Project here and edit .  " style="light" placement="top" className=""><QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer flex"/></Tooltip>

                    <div className="block">
                        <div className="inline-block m-2">
                            <Button color="light" size="xs"  onClick={() => setExperienceAddNewModal(true)}>Add New Experience</Button>
                        </div>
                    </div>
                </h2>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="experienceHistoryDragDropContext">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {resumeDetails && resumeDetails.professionalExperienceRewrite && resumeDetails.professionalExperienceRewrite.map((professionalExperience, professionalExperienceIndex) => (
                                    <Draggable key={professionalExperienceIndex} draggableId={professionalExperienceIndex.toString()} index={professionalExperienceIndex}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="m-1 text-sm leading-2 text-black-900 sm:mt-0 p-2 bg-white rounded shadow relative border border-transparent hover:border-gray-600 hover:bg-gray-50 cursor-grabbing"
                                            >
                                                <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                                    <div className="flex items-center space-x-2">
                                                        <FaGripVertical />
                                                        {/*Experience version control*/}
                                                        <div className="text-sm font-medium leading-6 text-gray-900 ">

                                                            <div className=" flex text-sm leading-2 text-black-900 sm:mt-0 ">
                                                                        <span className="flex-grow">

                                                                          {resumeDetails.professionalExperienceRewriteHistory && resumeDetails.professionalExperienceRewriteHistory.length > 0 && (
                                                                              <div className="inline-block p-2 m-1">
                                                                                  <div className="flex items-center  ">
                                                                                      <Dropdown
                                                                                          label={parseInt(professionalExperience.selectedVersion) >= 0 ? "Version : "+ (parseInt(professionalExperience.selectedVersion) + 1) : "Version : 1"}
                                                                                          dismissOnClick={true}
                                                                                          id={"experienceVersionDropdown-"+professionalExperienceIndex}
                                                                                          name={"experienceVersionDropdown-"+professionalExperienceIndex}
                                                                                          size="xs"
                                                                                          className="bg-green-50"
                                                                                          style={{ borderRadius: '9999px',borderColor: '#047857', borderWidth:"1px", color:'#047857', backgroundColor:'#ECFDF5',  fontWeight:"500", padding:"0px"}}
                                                                                      >
                                                                                          {resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex].map((experienceVersion, experienceVersionIndex) => (
                                                                                              <Dropdown.Item
                                                                                                  key={"experienceVersion-"+experienceVersionIndex}
                                                                                                  className=" items-center  bg-green-50 px-6 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 "
                                                                                                  onClick={(e) => {
                                                                                                      experienceVersionChangeHandler(professionalExperienceIndex, (resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex].length - experienceVersionIndex - 1));

                                                                                                  }}
                                                                                              > Version : {resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex].length - experienceVersionIndex }</Dropdown.Item>

                                                                                          ))}
                                                                                      </Dropdown>
                                                                                  </div>


                                                                              </div>
                                                                          )}


                                                                      </span>
                                                            </div>

                                                        </div>
                                                        <div className="cursor-pointer p-2 m-1">
                                                            {resumeScore && resumeScore.contentQuality && resumeScore.contentQuality.workExperience &&  resumeScore.contentQuality.workExperience[professionalExperienceIndex] && resumeScore.contentQuality.workExperience[professionalExperienceIndex].score > 0 && (
                                                                <Button size="xs" className="flex items-center space-x-2" outline gradientDuoTone="tealToLime">
                                                                    SectionScore :  { resumeScore.contentQuality.workExperience[professionalExperienceIndex].score}

                                                                </Button>

                                                            )}
                                                        </div>
                                                        <div className="absolute right-2 cursor-pointer">
                                                            <Dropdown inline placement="bottom" renderTrigger={() => <span><FaBars/></span>} size="sm">
                                                                <DropdownItem onClick={() =>  {
                                                                    setExperienceEditModal(true);
                                                                    setExperienceEditIndex(professionalExperienceIndex);
                                                                    setExperienceEditDetails(professionalExperience);
                                                                    professionalExperienceEditClickHandler(professionalExperience, professionalExperienceIndex)
                                                                }}>Edit</DropdownItem>
                                                                <DropdownItem onClick={() =>  {
                                                                    setExperienceEditIndex(professionalExperienceIndex);
                                                                    setExperienceEditRemoveModal(true);
                                                                }}>Remove</DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </div>


                                                </div>

                                                <div
                                                    key={`experienceAI_dt_${professionalExperienceIndex}`}
                                                    className=" p-2 text-sm leading-6 text-gray-700 sm:mt-0 "
                                                >
                                                    {/*experience title*/}
                                                    <div
                                                        // onClick={() => {professionalExperienceEditClickHandler(professionalExperience, professionalExperienceIndex);} }
                                                        className="mt-2  text-sm leading-6 text-black-900  sm:mt-0 ">
                                                                    <span className="font-bold ">
                                                                    {professionalExperience.professionalExperienceTitle} {professionalExperience.companyName}  ( {professionalExperience.jobStartDate} {professionalExperience.jobEndDate ? " - "+professionalExperience.jobEndDate : ' - Present'})
                                                                    </span>
                                                    </div>
                                                    {/*experience details*/}
                                                    <div key={"professionalExperienceRewrite_dd_"+professionalExperienceIndex} className="mt-1 text-sm leading-6 text-black-900  sm:mt-0">
                                                        {resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === 'bullet' && (
                                                            <div
                                                                className="ps-2 space-y-1 p-2  ">
                                                                {skillsHighlight && professionalExperience.selectedVersion !== undefined
                                                                && professionalExperience.selectedVersion >= 0
                                                                && professionalExperience.professionalExperienceDescriptionBulletPoints
                                                                && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex]
                                                                && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion]
                                                                && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].matchingSkills
                                                                && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].matchingSkills.length > 0 ? resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].professionalExperienceDescriptionBulletPoints.map((
                                                                    bulletPointItem, bulletPointIndex
                                                                    )=>(
                                                                        <div key={"bullet_point_"+professionalExperienceIndex+"_"+bulletPointIndex}>

                                                                            -  {resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].matchingSkills[bulletPointIndex] ? highlightText(bulletPointItem,resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].matchingSkills[bulletPointIndex]) : bulletPointItem}
                                                                        </div>
                                                                    )
                                                                ) : professionalExperience.professionalExperienceDescriptionBulletPoints.map((
                                                                    bulletPointItem, bulletPointIndex
                                                                    )=>(
                                                                        <div key={"bullet_point_"+professionalExperienceIndex+"_"+bulletPointIndex}>

                                                                            -  {bulletPointItem}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                        {resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === 'paragraph' && (
                                                            <div
                                                                className="ps-2 space-y-1 p-2  ">
                                                                {skillsHighlight && professionalExperience.selectedVersion !== undefined && professionalExperience.selectedVersion >= 0 && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex] && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion] && resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].professionalExperienceDescription ?
                                                                    highlightText(resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].professionalExperienceDescription, resumeDetails.professionalExperienceRewriteHistory[professionalExperienceIndex][professionalExperience.selectedVersion].matchingSkills)
                                                                    :
                                                                    professionalExperience.professionalExperienceDescription}
                                                            </div>
                                                        )}
                                                        {!resumeDetails.advancedPromptFeature && (
                                                            <div
                                                                className="ps-2 space-y-1 p-2  ">
                                                                {professionalExperience.professionalExperienceDescription}
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>


                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>
            <Modal show={experienceEditModal} onClose={() => setExperienceEditModal(false)}
            >
                <Modal.Header>Edit Experience</Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="experienceCompanyName" value="Company Name" />
                        </div>
                        <TextInput
                            id="experienceCompanyName"
                            name="experienceCompanyName"
                            defaultValue={experienceEditDetails.companyName}
                            required/>
                        <div className="mb-2 block">
                            <Label htmlFor="experienceEditTitle" value="Title" />
                        </div>
                        <TextInput
                            id="experienceEditTitle"
                            name="experienceEditTitle"
                            defaultValue={experienceEditDetails.professionalExperienceTitle}
                            required/>
                        <div className="mb-2 block">
                            <div className="inline-block ">
                                <Label htmlFor="experienceEditContent"  value="Experience" />
                            </div>

                            {resumeDetails && resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet" ? (
                                <div className="inline-block m-2">
                                    <Button color="blue" size="xs"  onClick={() => addBulletPointHandler()}>Add Bullet Point</Button>

                                </div>
                            ):(
                                <>
                                </>
                            )}
                        </div>
                        {resumeDetails && resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet" ? (
                            <>
                                {
                                    !isBulletPointUpdate && experienceEditContentBullet.length > 0 ? experienceEditContentBullet.map((bullet, index) => (
                                        <div key={"experienceEditContentBullet_"+index} className="pb-2">
                                            <Textarea
                                                id={"experienceEditContentBullet_"+index}
                                                name={"experienceEditContentBullet_"+index}
                                                defaultValue={bullet}
                                                onChange={(e) => {
                                                    let temp = [...experienceEditContentBullet];

                                                    // Modify the copied array
                                                    temp[index] = e.target.value;

                                                    // Update the state with the new array
                                                    setExperienceEditContentBullet(temp);
                                                }}
                                                rows={3}
                                                required/>
                                            <div>
                                                <div className="inline-block   m-2">
                                                    <Button outline gradientDuoTone="purpleToBlue"
                                                            size="xs"
                                                            className="flex center "
                                                            onClick={() => {
                                                                if (!bulletPointAIGenerateProcessing){
                                                                    handleBulletPointAIGenerate(index)
                                                                }

                                                            }}
                                                            isProcessing={bulletPointAIGenerateProcessing}

                                                    >
                                                        <PiStarFourFill /> AI Generate
                                                    </Button>


                                                </div>
                                                <div className="p-2 float-right">
                                                    <Button color="red" size="xs" className="mr-0 ml-auto" onClick={() => removeBulletPointHandler(index)}>Remove</Button>
                                                </div>
                                            </div>

                                        </div>
                                    )):(
                                        <div className="text-center">
                                            <p>No bullet points added</p>
                                        </div>
                                    )
                                }

                            </>
                        ) : (
                            <>
                                <Textarea
                                    id="experienceEditParagraphContent"
                                    name="experienceEditParagraphContent"
                                    defaultValue={experienceEditContent}
                                    onChange={(e) => setExperienceEditContent(e.target.value)}
                                    rows={12}
                                    required/>
                                <div className="inline-block m-2">
                                    <Button outline gradientDuoTone="purpleToBlue"
                                            size="xs"
                                            className="flex center "
                                            onClick={() =>{
                                                if (!textareaAiGenerateProcessing){
                                                    handleTextareaAiGenerate()
                                                }
                                                }}
                                            isProcessing={textareaAiGenerateProcessing}

                                    >
                                        <PiStarFourFill /> AI Generate
                                    </Button>


                                </div>
                            </>

                        )}

                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceEditStartDate" value="Start Date" />
                        </div>
                        <DatePicker
                            id="experienceEditStartDate"
                            name="experienceEditStartDate"
                            showMonthYearPicker
                            selected={experienceEditStartDate}
                            className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            dateFormat="yyyy-MMMM"
                            onChange={(date) => {setExperienceEditStartDate(formatDate(date))}}
                        />
                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceEditEndDate" value="End Date" />
                        </div>
                        <DatePicker
                            id="experienceEditEndDate"
                            name="experienceEditEndDate"
                            showMonthYearPicker
                            selected={experienceEditEndDate}
                            className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            dateFormat="yyyy-MMMM"
                            onChange={(date) => {setExperienceEditEndDate(formatDate(date))}}
                        />

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {!updateExperienceProcessing && !textareaAiGenerateProcessing && !bulletPointAIGenerateProcessing ?  (
                    <Button color="blue"
                            onClick={() => updateExperienceHandler()}

                    >Update</Button>
                    ) : (
                        <Button color="blue"
                                isProcessing={updateExperienceProcessing || textareaAiGenerateProcessing || bulletPointAIGenerateProcessing}

                        >Update</Button>
                    )}
                    {!updateExperienceProcessing && !textareaAiGenerateProcessing && !bulletPointAIGenerateProcessing ? (
                        <Button color="gray" onClick={() => setExperienceEditModal(false)}>
                            Close
                        </Button>
                    ):(
                        <Button color="gray"
                                isProcessing={updateExperienceProcessing || textareaAiGenerateProcessing || bulletPointAIGenerateProcessing} >
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
            <Modal show={experienceEditRemoveModal} onClose={() => setExperienceEditRemoveModal(false)}
            >
                <Modal.Header>Remove Experience</Modal.Header>
                <Modal.Body>
                    <div>

                        <div>
                            Are you sure you want to remove this professional experience from your resume?
                        </div>



                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="red"
                            onClick={() => removeExperienceHandler(experienceEditIndex)}
                            isProcessing={experienceRemoveProcessing}

                    >Remove</Button>
                    {!experienceRemoveProcessing && (
                        <Button color="gray" onClick={() => setExperienceEditRemoveModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
            <Modal show={experienceAddNewModal} onClose={() => setExperienceAddNewModal(false)}
            >
                <Modal.Header>Add New Experience</Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceAddNewCompanyName" value="Company Name" />
                        </div>
                        <TextInput
                            id="experienceAddNewCompanyName"
                            name="experienceAddNewCompanyName"
                            required/>
                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceAddNewTitle" value="Title" />
                        </div>
                        <TextInput
                            id="experienceAddNewTitle"
                            name="experienceAddNewTitle"
                            required/>
                        <div className="mb-2 mt-2 block">
                            <div className="inline-block ">
                                <Label htmlFor="experienceAddNewContent"  value="Experience" />
                            </div>

                            {resumeDetails && resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet" ? (
                                <div className="inline-block m-2">
                                    <Button color="blue" size="xs"  onClick={() => addBulletPointAddNewHandler()}>Add Bullet Point</Button>

                                </div>
                            ):(
                                <>
                                </>
                            )}
                        </div>
                        {resumeDetails && resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet" ? (
                            <>
                                {
                                    !isAddNewBulletPointUpdate && experienceAddNewContentBullet.length > 0 ? experienceAddNewContentBullet.map((bullet, index) => (
                                        <div key={"experienceAddNewContentBullet_"+index} className="pb-2">
                                            <Textarea
                                                id={"experienceAddNewContentBullet_"+index}
                                                name={"experienceAddNewContentBullet_"+index}
                                                defaultValue={bullet}
                                                onChange={(e) => {
                                                    let temp = [...experienceAddNewContentBullet];

                                                    // Modify the copied array
                                                    temp[index] = e.target.value;

                                                    // Update the state with the new array
                                                    setExperienceAddNewContentBullet(temp);
                                                }}
                                                rows={3}
                                                required/>
                                            <div className="inline-block   m-2">
                                                <Button outline gradientDuoTone="purpleToBlue"
                                                        size="xs"
                                                        className="flex center "
                                                        onClick={() => {
                                                            if (!bulletPointAIGenerateProcessing){
                                                                handleBulletPointAIGenerateNew(index)
                                                            }

                                                        }}
                                                        isProcessing={bulletPointAIGenerateProcessing}

                                                >
                                                    <PiStarFourFill /> AI Generate
                                                </Button>


                                            </div>
                                            <div className="p-2">
                                                <Button color="red" size="xs" className="mr-0 ml-auto" onClick={() => removeAddNewBulletPointHandler(index)}>Remove</Button>
                                            </div>
                                        </div>
                                    )):(
                                        <div className="text-center">
                                            <p>No bullet points added</p>
                                        </div>
                                    )
                                }

                            </>
                        ) : (
                            <>
                                <Textarea
                                    id="experienceAddNewContent"
                                    name="experienceAddNewContent"
                                    defaultValue={experienceAddNewContent}
                                    onChange={(e) => setExperienceAddNewContent(e.target.value)}
                                    rows={12}
                                    required/>
                                <div className="inline-block   m-2">
                                    <Button outline gradientDuoTone="purpleToBlue"
                                            size="xs"
                                            className="flex center "
                                            onClick={() =>{
                                                if (!textareaAiGenerateProcessing){
                                                    handleTextareaAiGenerateNew()
                                                }
                                            }}
                                            isProcessing={textareaAiGenerateProcessing}

                                    >
                                        <PiStarFourFill /> AI Generate
                                    </Button>


                                </div>
                            </>

                        )}

                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceAddNewStartDate" value="Start Date" />
                        </div>
                        <DatePicker
                            id="experienceAddNewStartDate"
                            name="experienceAddNewStartDate"
                            showMonthYearPicker
                            selected={experienceAddNewStartDate}
                            className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            dateFormat="yyyy-MMMM"
                            onChange={(date) => {setExperienceAddNewStartDate(formatDate(date))}}
                        />
                        <div className="mb-2 mt-2 block">
                            <Label htmlFor="experienceAddNewEndDate" value="End Date" />
                        </div>
                        <DatePicker
                            id="experienceAddNewEndDate"
                            name="experienceAddNewEndDate"
                            showMonthYearPicker
                            selected={experienceAddNewEndDate}
                            className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            dateFormat="yyyy-MMMM"
                            onChange={(date) => {setExperienceAddNewEndDate(formatDate(date))}}
                        />

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue"
                            onClick={() => {
                                if (!textareaAiGenerateProcessing && !bulletPointAIGenerateProcessing && !addNewExperienceProcessing) {
                                    addNewExperienceHandler()
                                }
                            }}
                            isProcessing={addNewExperienceProcessing}

                    >Add</Button>
                    {!addNewExperienceProcessing && (
                        <Button color="gray" onClick={() => setExperienceAddNewModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default ExperienceBlock;
