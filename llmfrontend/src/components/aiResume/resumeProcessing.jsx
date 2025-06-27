import React ,{useContext, useEffect, useRef, useState} from 'react'
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
//import { animateScroll as scroll } from 'react-scroll';
import {ChatPromptTemplate} from "langchain/prompts";
// import createResumeSteps from "../../helpers/staticFunction/dashboard/createResumeSteps";

import {
  overviewSummaryCreatePrompt,
  overviewSummaryAdvancedCreatePrompt,
  overviewSummaryAITargetPrompt, overviewSummaryAdvancedAITargetPrompt
} from "../../helpers/langChain/prompts/myResumeEdit/overviewSummary";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {overviewSummaryModel} from "../../helpers/langChain/functions/myResumeEdit/overviewSummary";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {
  mongodbCreateMyResumeOverviewStreaming,
  mongodbCreateMyResumeProfessionalExperienceRewriteStreaming,
  mongodbUpdateMyResumeSkillsStreaming,
} from "../../helpers/mongodb/pages/createMyResume";
import {
  resumeRewriteAdvancePrompt,
  resumeRewriteBulletPointsAdvancePrompt,
  resumeRewriteBulletPointsPrompt,
  resumeRewritePrompt,
  resumeCreatePrompt,
  resumeCreateAdvancePrompt,
  resumeCreateBulletPointsPrompt,
  resumeCreateBulletPointsAdvancePrompt,
  resumeAiTargetSkillsPrompt,
  resumeRegularSkillsPrompt,

} from "../../helpers/langChain/prompts/myResume/resume";
// import { mongodbAddNewSkill, mongodbMoveResumeDetailsSkills} from "../../helpers/mongodb/components/myResume/Edit/skillBlock";
import {updateResumeDetailsSkillsAll} from "../../store/resumeEditReducer";
import {resumeBulletPointsModel, resumeModel, resumeAiTargetSkillsModel} from "../../helpers/langChain/functions/myResume/resume";
import SkillsBlock from "./skillsBlock";
import {Button, Blockquote, Spinner} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import CertificationBlock from "./certificationBlock";

import {jdInfoExtractLangChainApi} from "../../helpers/helperApis/jdInfoExtractLangChain";

const ResumeProcessing = ({resumeBasicInfo, resumeDetailData, advanceFeature, resumeProgressSelect, setTemplateData}) => {
  const dispatch = useDispatch();
  // const router = useRouter()
  const {  totalCredits, updateCredits } = useAuth()
  const user = useSelector(state => state.user.profile);
  const [professionalExperienceRewriteProcessing, setProfessionalExperienceRewriteProcessing] = useState(true)
  // const [rewriteResult, setRewriteResult] = useState(false)
  const [jdExtractResult, setJdExtractResult] = useState(false)
  const [resumeResult, setResumeResult] = useState({overviewRewrite:"", professionalExperienceRewrite:"", educationRewrite:"", skillsRewrite:{}})
  const [upsertedId, setUpsertedId] = useState(false)
  const [overviewRewriteProcessing, setOverviewRewriteProcessing] = useState(false)
  const [aiTemputate, setAiTemputate] = useState(0.8);
  const overviewProcessingFlagRef = useRef(false);
    const professionalExperienceProcessingFlagRef = useRef(false);
  // console.log('upsertedId', upsertedId)
  // console.log('user', user)
  //console.log('resumeDetailData', resumeDetailData)
  //  console.log('resumeBasicInfo', resumeBasicInfo)
  // console.log('jdExtractResult', jdExtractResult)
 //  console.log('resumeResult', resumeResult)
  useEffect(() => {
    async function extractJd(){

      const apiData = await jdInfoExtractLangChainApi({
        userId: user.userId,
        data : resumeBasicInfo,
      });

      if (!apiData) {
        // setGenerating(false);
        // setJobDescription(null);

        return toast.error("Error . Please try again later.")
      }
        return apiData;
    }
    if (resumeBasicInfo.aiTargetResume && user && user.userId ){
      if (resumeBasicInfo && resumeBasicInfo.JDInfoExtractMessageContent !== "" && resumeBasicInfo.JDInfoExtractMessageContent !== null && resumeBasicInfo.JDInfoExtractMessageContent !== undefined){

        setJdExtractResult(resumeBasicInfo.JDInfoExtractMessageContent);
      } else {

        extractJd().then(result => {

          setJdExtractResult(result.JDInfoExtractMessageContent);
        });
      }
    }
  }, [resumeBasicInfo])

  useEffect( () => {

    async function overviewRewriteStreaming(){
      const startTime = Date.now();

      try{
        setOverviewRewriteProcessing(true);
        overviewProcessingFlagRef.current = true;
        // console.log(advanceFeature)
        // console.log(streamInputData)
        const modelParams = {
          temperature: aiTemputate,
          // top_p: 1.0,
          // frequency_penalty: 0.1,
          // presence_penalty: 0.0,
          user: user.userId,
          stream: true,
          modelName: advanceFeature.selectedAiModel.modelNameId,
          //openAIApiKey: process.env.OPENAI_API_KEY,
          azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
          azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
          azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
        };

        let chatPrompt;
        let streamInputData , advanceStreamInputData;
          chatPrompt = advanceFeature.advanceSection ? new ChatPromptTemplate(overviewSummaryAdvancedCreatePrompt) : new ChatPromptTemplate(overviewSummaryCreatePrompt);

          advanceStreamInputData = {
            "jobDescription":{
              jobTitle:resumeBasicInfo.jobTitle ? resumeBasicInfo.jobTitle : "",
              companyName:resumeBasicInfo.companyName ? resumeBasicInfo.companyName : "",
              resumeExperienceLevel:resumeBasicInfo.name ? resumeBasicInfo.name : "",
              resumeWorkingField:resumeBasicInfo.name ? resumeBasicInfo.name : "",
            },
            overviewExtraPromptRef:advanceFeature.overviewExtraPromptRef ,

          };
        streamInputData = {
          "jobDescription":{
            jobTitle:resumeBasicInfo.jobTitle ? resumeBasicInfo.jobTitle : "",
            companyName:resumeBasicInfo.companyName ? resumeBasicInfo.companyName : "",
            resumeExperienceLevel:resumeBasicInfo.name ? resumeBasicInfo.name : "",
            resumeWorkingField:resumeBasicInfo.name ? resumeBasicInfo.name : "",
          },
          paragraphLength:advanceFeature.paragraphLength,
          writingTone:advanceFeature.writingTone,
        };


        const modelOpenAI = new ChatOpenAI(modelParams).bind(overviewSummaryModel);
        const chat = chatPrompt
            .pipe(modelOpenAI)
            .pipe(new JsonOutputFunctionsParser());

        const stream = await chat.stream({inputData: JSON.stringify(advanceFeature.advanceSection ? advanceStreamInputData : streamInputData)});
        let overviewRewriteBuf = "";
        for await (const chunk of stream) {
          // console.log("chunk", chunk);
          overviewRewriteBuf = chunk;
          setResumeResult((resumeResult) => ({
            ...resumeResult,
            overviewRewrite: {
              ...resumeResult.overviewRewrite,
              overviewRewrite: chunk.overviewRewrite,
              overviewRewriteTitle: chunk.overviewRewriteTitle,
            },
          }));

        }
        updateCredits(user.userId);
        const endTime = Date.now();
        const fetchTime = endTime - startTime;
        ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
        mongodbCreateMyResumeOverviewStreaming({
          userId:user.userId,
          fetchTime,
          streamInputData,
          chatPrompt,
          resumeBasicInfo,
          modelVersion: advanceFeature.selectedAiModel.modelNameId,
          provider: advanceFeature.selectedAiModel.provider,
          modelParams,
          resumeDetailData,
          jdExtractResult,
          advanceFeature,
          overviewRewrite :overviewRewriteBuf,
        }).then((result)=>{
          setOverviewRewriteProcessing(false);
          overviewProcessingFlagRef.current = false;
          const resultparsed = JSON.parse(result);
          setUpsertedId(resultparsed.upsertedId);
        });
      } catch (e) {
        //console.log('overviewRewriteStreamingError:', e);
        setOverviewRewriteProcessing(false);
        overviewProcessingFlagRef.current = false;
        return toast.error("Overview Rewrite Error. Please go back and try again later.  ")

      }


    }
    async function overviewAITargetRewriteStreaming(){
      const startTime = Date.now();
      overviewProcessingFlagRef.current = true;
      try{
        setOverviewRewriteProcessing(true);

        // console.log(advanceFeature)
        // console.log(streamInputData)
        const modelParams = {
          temperature: aiTemputate,
          // top_p: 1.0,
          // frequency_penalty: 0.1,
          // presence_penalty: 0.0,
          user: user.userId,
          stream: true,
          modelName: advanceFeature.selectedAiModel.modelNameId,
          //openAIApiKey: process.env.OPENAI_API_KEY,
          azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
          azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
          azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
        };

        let chatPrompt;
        let streamInputData;
          chatPrompt = advanceFeature.advanceSection ? new ChatPromptTemplate(overviewSummaryAdvancedAITargetPrompt) : new ChatPromptTemplate(overviewSummaryAITargetPrompt);
           streamInputData = {
             "jobDescription":{
               jobTitle: jdExtractResult.jobTitle,
               conpanyName: jdExtractResult.companyName,
               keyResponsibilities: jdExtractResult.keyResponsibilities,
               requiredSkills: jdExtractResult.requiredSkills,
               qualifications: jdExtractResult.qualifications,
             },
            educations: resumeDetailData.education,
            professionalExperiences: resumeDetailData.professionalExperience,
            currentResumeOverview: resumeDetailData.overview,
            overviewExtraPromptRef:advanceFeature.overviewExtraPromptRef ,
            paragraphLength:advanceFeature.paragraphLength,
            writingTone:advanceFeature.writingTone,
          };


        const modelOpenAI = new ChatOpenAI(modelParams).bind(overviewSummaryModel);
        const chat = chatPrompt
            .pipe(modelOpenAI)
            .pipe(new JsonOutputFunctionsParser());

        const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
        let overviewRewriteBuf = "";
        for await (const chunk of stream) {
          // console.log("chunk", chunk);
          overviewRewriteBuf = chunk;
          setResumeResult((resumeResult) => ({
            ...resumeResult,
            overviewRewrite: {
              ...resumeResult.overviewRewrite,
              overviewRewrite: chunk.overviewRewrite,
              overviewRewriteTitle: chunk.overviewRewriteTitle,
            },
          }));

        }
        updateCredits(user.userId);
        const endTime = Date.now();
        const fetchTime = endTime - startTime;
        ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
        mongodbCreateMyResumeOverviewStreaming({
          userId:user.userId,
          fetchTime,
          streamInputData,
          chatPrompt,
          resumeBasicInfo,
          modelVersion: advanceFeature.selectedAiModel.modelNameId,
          provider: advanceFeature.selectedAiModel.provider,
          modelParams,
          resumeDetailData,
          jdExtractResult,
          advanceFeature,
          overviewRewrite :overviewRewriteBuf,
        }).then((result)=>{
          setOverviewRewriteProcessing(false);
          overviewProcessingFlagRef.current = false;
          const resultparsed = JSON.parse(result);
          setUpsertedId(resultparsed.upsertedId);
        });
      } catch (e) {
       // console.log('overviewRewriteStreamingError:', e);
        setOverviewRewriteProcessing(false);
        overviewProcessingFlagRef.current = false;
        return toast.error("Overview Rewrite Error. Please go back and try again later.  ")

      }


    }

    if (resumeDetailData && resumeDetailData.overview && resumeResult.overviewRewrite === "" && resumeBasicInfo && user && user.userId && !overviewProcessingFlagRef.current){
      if (totalCredits < 500){
        handelCreditUsage(
            userId,
            {
              type: "overview_resumeProcessing",
              creditUsed: "",
              creditLeft: totalCredits,
              notEnoughCredit: true,
            }
        );
          toast.error("You don't have enough credits to generate overview. ");
      } else {
        // if (process.env.DEV){
        //   console.log('overviewRewriteStreamingStart')
        // }


        if (resumeBasicInfo.aiTargetResume){
            if (jdExtractResult ){
                overviewAITargetRewriteStreaming();
            }
        } else {
            overviewRewriteStreaming();
        }

      }
    }
  }, [resumeBasicInfo, jdExtractResult])
  //console.log('resumeResult', resumeResult)
  //console.log(resumeDetailData)

  useEffect(() => {

    async function resumeCreateForFieldAndLevelStreamingLangChain() {

      // console.log(jdExtractResult)
      try {
        const startTime = Date.now();
        professionalExperienceProcessingFlagRef.current = true;
        setProfessionalExperienceRewriteProcessing(true);
        let resumeRewritePromptNormal = resumeCreatePrompt;
        let resumeModelNormal = resumeModel;
        if (advanceFeature.workExperienceParagraphLayout === 'bullet') {
          if (advanceFeature.advanceSection){
            resumeRewritePromptNormal = resumeCreateBulletPointsAdvancePrompt;
          } else {
            resumeRewritePromptNormal = resumeCreateBulletPointsPrompt;
          }

          resumeModelNormal = resumeBulletPointsModel;
        } else if (advanceFeature.workExperienceParagraphLayout === 'paragraph') {
          if (advanceFeature.advanceSection){
            resumeRewritePromptNormal = resumeCreateAdvancePrompt;
          }

        }

        const chatPrompt = advanceFeature.advanceSection ? new ChatPromptTemplate(resumeRewritePromptNormal) : new ChatPromptTemplate(resumeRewritePromptNormal);
        const modelOpenAI = new ChatOpenAI({
          temperature: aiTemputate,
          // maxConcurrency: 3,
          top_p: 0.95,
          frequency_penalty: 0.1,
          presence_penalty: 0.0,
          max_tokens: 16000,
          user: user.userId,
          stream: true,
          //   modelName: advanceFeature.selectedAiModel.modelNameId,
          //   openAIApiKey: process.env.OPENAI_API_KEY,
          azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
          azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
          azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
        }).bind(resumeModelNormal);

        // console.log(resumeData.professionalExperienceRewrite)
        const chat = chatPrompt
            .pipe(modelOpenAI)
            .pipe(new JsonOutputFunctionsParser())  ;

        const userContent = {
          "futureJobBasicInfo":{
            jobTitle:resumeBasicInfo.jobTitle ? resumeBasicInfo.jobTitle : "",
            companyName:resumeBasicInfo.companyName ? resumeBasicInfo.companyName : "",
            resumeExperienceLevel:resumeBasicInfo.name ? resumeBasicInfo.name : "",
            resumeWorkingField:resumeBasicInfo.name ? resumeBasicInfo.name : "",
          },
          "professionalExperiences": resumeDetailData.professionalExperiences,
          "education": resumeDetailData.education,
          "skills": resumeDetailData.skills,
          "certifications": resumeDetailData.certifications,
          "bulletPointsCount": advanceFeature.bulletPointsCount ? parseInt(advanceFeature.bulletPointsCount, 10) : 0,
          "paragraphLength": advanceFeature.paragraphLength,
          "writingTone": advanceFeature.writingTone,
        };
        const userContentAdvanced = {
          "futureJobBasicInfo":{
            jobTitle:resumeBasicInfo.jobTitle ? resumeBasicInfo.jobTitle : "",
            companyName:resumeBasicInfo.companyName ? resumeBasicInfo.companyName : "",
            resumeExperienceLevel:resumeBasicInfo.name ? resumeBasicInfo.name : "",
            resumeWorkingField:resumeBasicInfo.name ? resumeBasicInfo.name : "",
          },
          "professionalExperiences": resumeDetailData.professionalExperiences,
          "education": resumeDetailData.education,
          "skills": resumeDetailData.skills,
          "certifications": resumeDetailData.certifications,
          "professionalExperienceAdvancedPrompt": advanceFeature.professionalExperienceAdvancedPrompt ? advanceFeature.professionalExperienceAdvancedPrompt : (advanceFeature.professionalExperienceRef ? advanceFeature.professionalExperienceRef : ""),

        };
        // if (process.env.DEV){
        //   console.log( advanceFeature)
        //   console.log( userContent)
        // }

        const finalUserContent = advanceFeature.advanceSection ? userContentAdvanced : userContent;
        const streamData = await chat.stream({inputData: JSON.stringify(finalUserContent)});

        let output = {professionalExperienceRewrite: []};
        for await (const chunk of streamData) {

          output.professionalExperienceRewrite = chunk.professionalExperienceRewrite;
          //console.log( parsedOutput.professionalExperienceRewrite ? parsedOutput.professionalExperienceRewrite : "");
          setResumeResult((resumeResult) => ({
            ...resumeResult,
            professionalExperienceRewrite: chunk.professionalExperienceRewrite ? chunk.professionalExperienceRewrite : "",
          }));

        }

        const endTime = Date.now();
        const fetchTime = endTime - startTime;

        ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
        await mongodbCreateMyResumeProfessionalExperienceRewriteStreaming({
          fetchTime: fetchTime,
          userId: user.userId,
          resumeObjectId: upsertedId,
          modelVersion: advanceFeature.selectedAiModel.modelNameId,
          provider: advanceFeature.selectedAiModel.provider,
          chatPrompt: chatPrompt,
          userContent: finalUserContent,
          advanceFeature,
          parsedOutput: output,

        }).then((result) => {
         //  console.log(result)
          setProfessionalExperienceRewriteProcessing(false);
          professionalExperienceProcessingFlagRef.current = false;
          updateCredits(user.userId);
        }).catch((err) => {
          //  console.log("professionalExperienceRewriteStreaming", err)
          toast.error("Professional Experience processing network error 1001...");
        });
      } catch (e) {
        // if (process.env.DEV) {
        //     console.log('professionalExperienceRewriteStreaming', e);
        // }
        setProfessionalExperienceRewriteProcessing(false);
        professionalExperienceProcessingFlagRef.current = false;
        return toast.error("Professional Experience Rewrite Error. Please go back and try again later. ")

      }
    }
    async function professionalExperienceRewriteStreamingLangChain() {
      // console.log(jdExtractResult)
      try {
        const startTime = Date.now();
        professionalExperienceProcessingFlagRef.current = true;
        setProfessionalExperienceRewriteProcessing(true);
        let resumeRewritePromptNormal = resumeRewritePrompt;
        let resumeModelNormal = resumeModel;
        if (advanceFeature.workExperienceParagraphLayout === 'bullet') {
          if (advanceFeature.advanceSection){
            resumeRewritePromptNormal = resumeRewriteBulletPointsAdvancePrompt;
          } else {
            resumeRewritePromptNormal = resumeRewriteBulletPointsPrompt;
          }

          resumeModelNormal = resumeBulletPointsModel;
        } else if (advanceFeature.workExperienceParagraphLayout === 'paragraph') {
          if (advanceFeature.advanceSection){
            resumeRewritePromptNormal = resumeRewriteAdvancePrompt;
          }

        }

        const chatPrompt = advanceFeature.advanceSection ? new ChatPromptTemplate(resumeRewritePromptNormal) : new ChatPromptTemplate(resumeRewritePromptNormal);
        const modelOpenAI = new ChatOpenAI({
          temperature: aiTemputate,
          // maxConcurrency: 3,
          top_p: 0.95,
          frequency_penalty: 0.1,
          presence_penalty: 0.0,
          max_tokens: 16000,
         user: user.userId,
         stream: true,
       //   modelName: advanceFeature.selectedAiModel.modelNameId,
       //   openAIApiKey: process.env.OPENAI_API_KEY,
          azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
          azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
          azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
        }).bind(resumeModelNormal);

        // console.log(resumeData.professionalExperienceRewrite)
        const chat = chatPrompt
            .pipe(modelOpenAI)
            .pipe(new JsonOutputFunctionsParser())  ;

        const userContent = {
          "jobDescription":{ "companyName": jdExtractResult.companyName,
            "jobTitle": jdExtractResult.jobTitle,
            "keyResponsibilities": jdExtractResult.keyResponsibilities,
            "requiredSkills": jdExtractResult.requiredSkills,
            "qualifications": jdExtractResult.qualifications,},
          "professionalExperiences": resumeDetailData.professionalExperiences,
          "bulletPointsCount": advanceFeature.bulletPointsCount ? parseInt(advanceFeature.bulletPointsCount, 10) : 0,
          "education": resumeDetailData.education,
          "skills": resumeDetailData.skills,
          "certifications": resumeDetailData.certifications,
          "paragraphLength": advanceFeature.paragraphLength,
          "writingTone": advanceFeature.writingTone,
        };
        const userContentAdvanced = {
          "jobDescription":{ "companyName": jdExtractResult.companyName,
            "jobTitle": jdExtractResult.jobTitle,
            "keyResponsibilities": jdExtractResult.keyResponsibilities,
            "requiredSkills": jdExtractResult.requiredSkills,
            "qualifications": jdExtractResult.qualifications,},
          "professionalExperiences": resumeDetailData.professionalExperiences,
          "education": resumeDetailData.education,
          "skills": resumeDetailData.skills,
          "certifications": resumeDetailData.certifications,
          "professionalExperienceAdvancedPrompt": advanceFeature.professionalExperienceAdvancedPrompt ? advanceFeature.professionalExperienceAdvancedPrompt : (advanceFeature.professionalExperienceRef ? advanceFeature.professionalExperienceRef : ""),

        };
        // if (process.env.DEV){
        //   console.log( advanceFeature)
        //   console.log( userContent)
        // }

        const finalUserContent = advanceFeature.advanceSection ? userContentAdvanced : userContent;
        const streamData = await chat.stream({inputData: JSON.stringify(finalUserContent)});

        let output = {professionalExperienceRewrite: []};
        for await (const chunk of streamData) {

          output.professionalExperienceRewrite = chunk.professionalExperienceRewrite;
          //console.log( parsedOutput.professionalExperienceRewrite ? parsedOutput.professionalExperienceRewrite : "");
          setResumeResult((resumeResult) => ({
            ...resumeResult,
            professionalExperienceRewrite: chunk.professionalExperienceRewrite ? chunk.professionalExperienceRewrite : "",
          }));

        }

        const endTime = Date.now();
        const fetchTime = endTime - startTime;

        ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
        await mongodbCreateMyResumeProfessionalExperienceRewriteStreaming({
          fetchTime: fetchTime,
          userId: user.userId,
          resumeObjectId: upsertedId,
          modelVersion: advanceFeature.selectedAiModel.modelNameId,
          provider: advanceFeature.selectedAiModel.provider,
          chatPrompt: chatPrompt,
          userContent: finalUserContent,
          advanceFeature,
          parsedOutput: output,

        }).then((result) => {
          // console.log(result)
          setProfessionalExperienceRewriteProcessing(false);
          professionalExperienceProcessingFlagRef.current = false;
          updateCredits(user.userId);
        }).catch((err) => {
        //  console.log("professionalExperienceRewriteStreaming", err)
          toast.error("Professional Experience processing network error 1001...");
        });
      } catch (e) {
        // if (process.env.DEV){
        //   console.log('professionalExperienceRewriteStreaming', e);
        // }
        setProfessionalExperienceRewriteProcessing(false);
        professionalExperienceProcessingFlagRef.current = false;
        return toast.error("Professional Experience Rewrite Error. Please go back and try again later. ")

      }
    }


     if (resumeResult && resumeResult.professionalExperienceRewrite === "" && resumeResult.overviewRewrite && upsertedId && user && user.userId && !professionalExperienceProcessingFlagRef.current){

      if (totalCredits < 1000){
        handelCreditUsage(
            userId,
            {
              type: "experience_resumeProcessing",
              creditUsed: "",
              creditLeft: totalCredits,
              notEnoughCredit: true,
            }
        );
        toast.error("You don't have enough credits to generate professional experience rewrite. ")
      } else {
        if (process.env.DEV){
          console.log("professionalExperienceRewriteStart")
        }

        if (resumeBasicInfo.aiTargetResume){
          if (jdExtractResult ){
            professionalExperienceRewriteStreamingLangChain();
          }
        } else {
          resumeCreateForFieldAndLevelStreamingLangChain();
        }
      }
    } else {
      //console.log("professionalExperienceRewriteNotStart")
    }

  },[jdExtractResult, upsertedId])

  const [skillsAnalyzeProcessingFlag , setSkillsAnalyzeProcessingFlag] = useState(false);
  useEffect(()=>{

    async function resumeAiTargetSkillsLangChain() {
        if (totalCredits < 200){
          handelCreditUsage(
              userId,
              {
                type: "skills_resumeProcessing",
                creditUsed: "",
                creditLeft: totalCredits,
                notEnoughCredit: true,
              }
          );
          toast.error("You don't have enough credits to analyze skills. ")
        }
        try {
          setSkillsAnalyzeProcessingFlag(true);
          const startTime = Date.now();
          const chatPrompt = new ChatPromptTemplate(resumeBasicInfo.aiTargetResume ? resumeAiTargetSkillsPrompt : resumeRegularSkillsPrompt);
          const modelOpenAI = new ChatOpenAI({
            temperature: aiTemputate,
            // maxConcurrency: 3,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
            // max_tokens: 6000,
            user: user.userId,
            stream: true,
            //   openAIApiKey: process.env.OPENAI_API_KEY,
            azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
            azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
            azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
          }).bind(resumeAiTargetSkillsModel);

          // console.log(resumeData.professionalExperienceRewrite)
          const chat = chatPrompt
              .pipe(modelOpenAI)
              .pipe(new JsonOutputFunctionsParser());
          const skillDataAiTarget = {
            "jobDescription": {
              "companyName": jdExtractResult.companyName,
              "jobTitle": jdExtractResult.jobTitle,
              "keyResponsibilities": jdExtractResult.keyResponsibilities,
              "requiredSkills": jdExtractResult.requiredSkills,
              "qualifications": jdExtractResult.qualifications,
            },
            "existingSkills": resumeDetailData.skills,
            // "certifications": resumeDetailData.certifications,
          };
          const skillDataRegular = {
            "targetedIndustry": resumeBasicInfo.resumeWorkingField.name,
            "jobTitle": resumeBasicInfo.jobTitle,
            "experienceLevel": resumeBasicInfo.resumeExperienceLevel.name,
            "existingSkills": resumeDetailData.skills,
            // "certifications": resumeDetailData.certifications,
          };
          const skillStreamData = await chat.stream({inputData: JSON.stringify(resumeBasicInfo.aiTargetResume ? skillDataAiTarget : skillDataRegular)});

          let skillOutput = {};
          for await (const chunk of skillStreamData) {

            skillOutput = chunk;
          //  console.log("skillsAnalyzeStreaming", chunk)
           // if (chunk.existingSkills && chunk.existingSkills.length > 0) {
              dispatch(updateResumeDetailsSkillsAll( chunk));
          //  }


            setResumeResult((resumeResult) => ({
              ...resumeResult,
              skillsRewrite: {
                ...resumeResult.skillsRewrite,
                existingSkills: chunk.existingSkills,
                missingSkills: chunk.missingSkills,
                recommendedSkills: chunk.recommendedSkills,
              },
            }));


          }


          const endTime = Date.now();
          const fetchTime = endTime - startTime;

          ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
          await mongodbUpdateMyResumeSkillsStreaming({
          fetchTime: fetchTime,
          userId: user.userId,
          resumeObjectId: upsertedId,
          modelVersion: advanceFeature.selectedAiModel.modelNameId,
          provider: advanceFeature.selectedAiModel.provider,
          chatPrompt: chatPrompt,
          userContent: resumeBasicInfo.aiTargetResume ? skillDataAiTarget : skillDataRegular,
          advanceFeature,
          parsedOutput: skillOutput,
            resumeTemplateName: resumeDetailData.resumeTemplateName,
          }).then((result) => {
         // console.log(result)
            setSkillsAnalyzeProcessingFlag(false);
          updateCredits(user.userId);
          }).catch((err) => {
            setSkillsAnalyzeProcessingFlag(false);
          toast.error("Skills processing network error 1001...");
          });

        } catch (e) {
            if (process.env.DEV){
                console.log('resumeAiTargetSkillsLangChain', e);
            }
          setSkillsAnalyzeProcessingFlag(false);
            return toast.error("Skills Processing Error. Please go back and try again later. ")

        }

    }


    if (resumeResult && upsertedId && user && user.userId && !skillsAnalyzeProcessingFlag){

      if (totalCredits < 200){
        handelCreditUsage(
            userId,
            {
              type: "skills_resumeProcessing",
              creditUsed: "",
              creditLeft: totalCredits,
              notEnoughCredit: true,
            }
        );
        toast.error("You don't have enough credits to analyze skills. ")
      } else {
        if (resumeBasicInfo.aiTargetResume){
            if (jdExtractResult ){
                resumeAiTargetSkillsLangChain();
            }
        } else {
          resumeAiTargetSkillsLangChain();
        }

      }
    } else {
      //console.log("professionalExperienceRewriteNotStart")
    }

  },[jdExtractResult, upsertedId])


  // const [skillsUpdateFromChild, setSkillsUpdateFromChild] = useState({});
  // const skillsUpdateFromChildComponent = (skills) => {
  //   //console.log(skills)
  //   setSkillsUpdateFromChild((skillsUpdate) => ({
  //     ...skillsUpdate,
  //
  //       existingSkills: skills.existingSkills,
  //       missingSkills: skills.missingSkills,
  //       recommendedSkills: skills.recommendedSkills,
  //
  //   }));
  // }


  // const handleSelectTemplate = async (e) => {
  //   // Read the Word document template
  //   e.preventDefault();
  //   // Set the template data
  //   const data = {
  //     "firstName": user.firstName,
  //     "lastName": user.lastName,
  //     "email": user.email,
  //     "phoneNo":user.phoneNumber? user.phoneNumber : "123-123-1234",
  //     "city":user.city? user.city : "My Location",
  //     "jobTitle":resumeResult.jobTitle? resumeResult.jobTitle : "",
  //     "overviewRewriteTitle":resumeResult.overviewRewrite.overviewRewriteTitle,
  //     "overviewRewrite":resumeResult.overviewRewrite.overviewRewrite,
  //     "professionalExperience": resumeResult.professionalExperienceRewrite,
  //     "education": resumeDetailData.education,
  //     "qualificationsAndSkills": resumeDetailData.qualificationsAndSkills,
  //     "certifications": resumeDetailData.certifications,
  //     "languages": resumeDetailData.languages,
  //     "skills": skillsUpdateFromChild && skillsUpdateFromChild.existingSkills ? skillsUpdateFromChild.existingSkills.map(skill => ({ skillName: skill.skillName })) : resumeResult.skillsRewrite && resumeResult.skillsRewrite.existingSkills ? resumeResult.skillsRewrite.existingSkills.map(skill => skill.skillName) : resumeDetailData.skills,
  //     "skillsExist":!!(skillsUpdateFromChild && skillsUpdateFromChild.existingSkills && skillsUpdateFromChild.existingSkills.length > 0),
  //     "certificationsExist":!!resumeDetailData.certifications,
  //   };
  //   setTemplateData(data);
  //   resumeProgressSelect(createResumeSteps[6]);
  // }

  const editButtonRef = useRef(null);

  useEffect(() => {
    // Automatically click the button after 5 seconds
    if ( resumeResult && resumeResult.professionalExperienceRewrite && resumeResult.overviewRewrite && !professionalExperienceRewriteProcessing  && !skillsAnalyzeProcessingFlag ){
      const timer = setTimeout(() => {
        if (editButtonRef.current) {
          editButtonRef.current.click();
        }
      }, 5000);

      // Cleanup the timer if the component is unmounted
      return () => clearTimeout(timer);
    }

  }, []);

  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">

        <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 p-4">

          {/**Edit / Download Section***/}
          <div className="p-3">

            {resumeResult && resumeResult.professionalExperienceRewrite && resumeResult.overviewRewrite && !professionalExperienceRewriteProcessing  && !skillsAnalyzeProcessingFlag ? (

                <div>
                  <Blockquote>

                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Click on the edit button to make changes, regenerate new content and more.
                    </p>
                  </Blockquote>
                  <div className="flex flex-wrap gap-2 mr-0"
                  >

                    <Button outline
                            ref={editButtonRef}
                            onClick={()=>{
                              window.location.href = process.env.SITE_URL+"/user/dashboard/myResume/"+upsertedId
                            }}
                            gradientDuoTone="cyanToBlue">
                      Edit
                    </Button>
                    {/*<Button outline*/}
                    {/*        onClick={handleSelectTemplate}*/}
                    {/*        gradientDuoTone="purpleToBlue">*/}
                    {/*  Select Template*/}
                    {/*</Button>*/}

                  </div>

                </div>

            ) :(
                <div className="mb-2 block text-center">
                  <Spinner aria-label="Skills Processing" size="xl" />
                </div>
            )}

          </div>
          <div className="mx-auto max-w-7xl p-4  bg-white "

             >

            <div className="border-b-2 border-black-500">
              <div className="flex flex-row items-end gap-4 pb-2 px-[1.4cm]">
                <div className="grow">
                  <h1 className="font-bold text-center text-[1.65em] leading-inherit text-[#2E3D50] font-serif">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex flex-row flex-wrap gap-1 items-center pt-[2px] justify-center text-[#2E3D50] font-light text-[0.75em]">
                    <div className="flex flex-row gap-1 items-center mr-1">
                      <div className="after:content-[,]">
                        {user.city ? user.city : "My Location"}
                      </div>
                    </div>
                    <span className="flex flex-row gap-1 items-center mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M20.016 8.016V6L12 11.016 3.984 6v2.016L12 12.985zm0-4.032q.797 0 1.383.609t.586 1.406v12q0 .797-.586 1.406t-1.383.609H3.985q-.797 0-1.383-.609t-.586-1.406v-12q0-.797.586-1.406t1.383-.609z"></path></svg>
              <div>{user.email}</div>
            </span>
                    <span className="flex flex-row gap-1 items-center mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M19.5 0h-15A1.5 1.5 0 0 0 3 1.5v21A1.5 1.5 0 0 0 4.5 24h15a1.5 1.5 0 0 0 1.5-1.5v-21A1.5 1.5 0 0 0 19.5 0M18 18H6V3h12z"></path></svg>
              <div>{user.phoneNumber ? user.phoneNumber : "123-123-1234"}</div>
            </span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mt-3 mb-3 font-bold text-xl"> Overview</h2>
            {resumeResult && resumeResult.overviewRewrite ? (


                      <div className="flex flex-col space-y-1">
                        {resumeResult && resumeResult.overviewRewrite && (
                            <>
                              <div className="font-medium">
                                {resumeResult.overviewRewrite.overviewRewriteTitle}
                              </div>
                              <div className="p-2">
                                {resumeResult.overviewRewrite.overviewRewrite}
                              </div>
                            </>
                        )}



                    </div>

            ):(
                <div className="text-center align-middle mt-5">
                  {overviewRewriteProcessing ? (
                      <>
                        <div
                            className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                      <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                        </div>
                        Processing Overview/Summary rewrite ...
                      </>
                  ) :(
                      <>
                        <div
                            className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                      <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                        </div>
                        Preprocessing data ...
                      </>
                  )}

                </div>

            )}

            <h2 className="mt-3 mb-3 font-bold text-xl">Professional Experience</h2>

            {resumeResult && resumeResult.professionalExperienceRewrite && resumeResult.professionalExperienceRewrite.map(
                (item, index) => (

                    <div key={"professionalExperienceRewrite-"+index} className="pt-2 pb-2 space-y-2 ">
                      <div>
                        <div className="font-medium">
                          {item.professionalExperienceTitle}&nbsp;&nbsp;&nbsp;&nbsp;
                          {item.companyName ? item.companyName+ "\u00A0\u00A0\u00A0\u00A0" : ""}
                          {item.jobStartDate ? item.jobStartDate : ""}
                          {item.jobEndDate && item.jobStartDate ? " - "+item.jobEndDate : ""}
                          {!item.jobEndDate && item.jobStartDate ? " - Present" : ""}
                        </div>
                      </div>

                        <div className="flex flex-col space-y-1">
                          {advanceFeature.workExperienceParagraphLayout === 'bullet' && (
                              <div key={"professionalExperienceDescription-"+index} className="flex flex-col p-2">
                                <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                {item.professionalExperienceDescriptionBulletPoints && item.professionalExperienceDescriptionBulletPoints.map((
                                    bulletPointItem, bulletPointIndex
                                    )=>(
                                        <React.Fragment key={"professionalExperienceDescription-"+index+"-bulletPoints-"+bulletPointIndex}>
                                          <li >

                                            {bulletPointItem}
                                          </li>
                                        </React.Fragment>

                                    )

                                )}
                                </ul>
                              </div>
                          )}
                          {advanceFeature.workExperienceParagraphLayout === 'paragraph' && (
                              <div key={"professionalExperienceDescription-"+index} className="flex flex-col p-2">
                                {item.professionalExperienceDescription}
                              </div>
                          )}


                        </div>
                    </div>
                )
            )}
            {professionalExperienceRewriteProcessing &&
            (
                <div className="text-center align-middle mt-5">
                  <div
                      className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                  </div>
                  {overviewRewriteProcessing ? (
                       <>
                       processing overview / summary rewrite ...<br/>
                       </>
                  ) :(
                      <>
                      processing professional experience rewrite ...<br/>
                    it can take up to 1-5 minutes, please wait...
                    </>
                  )}

                </div>

            )}

            {resumeResult && upsertedId && user && user.userId && (
                <SkillsBlock upsertedId={upsertedId} experienceProcessing={professionalExperienceRewriteProcessing} skillProcessing={skillsAnalyzeProcessingFlag}/>

            )}

            {/*{resumeDetailData && resumeDetailData.certifications && resumeDetailData.certifications.length > 0 && (*/}
            {/*    <h2 className="mt-3 mb-3 font-bold text-xl">Qualifications / Certifications</h2>*/}
            {/*)}*/}

            <div className="p-2">
              <CertificationBlock addNewEnable={false}/>
            </div>

            <h2 className="mt-3 mb-3 font-bold text-xl">Education</h2>
            <div className="p-2">
              {resumeDetailData && resumeDetailData.education && resumeDetailData.education.map(
                  (item, index) => (

                      <div key={"education-"+index}>
                        {item.degree && item.fieldOfStudy && (
                           <>{item.degree} in {item.fieldOfStudy}</>
                        )}
                        {item.degree && !item.fieldOfStudy && (
                            <>{item.degree}</>
                        )}
                        {item.fieldOfStudy && !item.degree && (
                            <>{item.fieldOfStudy}</>
                        )}
                        {item.school && item.endDate && (
                            <> , {item.school} {item.endDate} </>
                        )}

                      </div>

                  )
              )}
            </div>


            </div>


        </div>

      </div>
  )
}
export default ResumeProcessing;


