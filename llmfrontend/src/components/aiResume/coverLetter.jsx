import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
import { toast } from "react-toastify";
import {useDispatch, useSelector} from 'react-redux';
import UserQuickCreateContext from '../../context/UserQuickCreateContext'

import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import { mongodbUpdateJobDescriptionStreaming} from "../../helpers/mongodb/pages/api/resume";

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import defaultAdvancedFeatures from '../../utils/staticObjects/coverLetter/defaultAdvancedFeatures';

import {
  mongodbGenerateCoverLetterStreaming,
  mongodbGetLast24HoursCoverLetterData
} from "../../helpers/mongodb/pages/user/coverLetter";
import AdvanceFeatureCoverLetter from "./advanceFeatureCoverLetter";
import {coverLetterPrompt, coverLetterAdvancedPrompt, coverLetterIntelligentPrompt, coverLetterIntelligentAdvancedPrompt} from "../../helpers/langChain/prompts/coverLetter";
import {coverLetterModel} from "../../helpers/langChain/functions/coverLetter";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import fieldOrDomains from "../../utils/staticObjects/fieldOrDomains";
import experienceLevels from "../../utils/staticObjects/experienceLevels";
import { setClData } from "../../store/coverLetterReducer";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const coverLetter = ({setClCreatePrgress, setClTemplateData}) => {

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);
  const dispatch = useDispatch();

  const [jobDescriptionResult, setJobDescription] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [jobDescriptionObjectId, setJobDescriptionObjectId] = useState(false);
  const [coverLetterGenerate,setCoverLetterGenerate] = useState(false);
  const [coverLetterAiGenerate , setCoverLetterAiGenerate] = useState(false);
  const [coverLetterCandidateStrength , setCoverLetterCandidateStrength] = useState([]);
  const [coverLetterGenerateComplete, setCoverLetterGenerateComplete] = useState(false);
  const [jdExtracteComplete, setJdExtracteComplete]= useState(false);
  const [ advanceFeatureData, setAdvanceFeatureData] = useState(defaultAdvancedFeatures);
  const [last24HoursCoverLetterUsage, setLast24HoursCoverLetterUsage] = useState(false);
  // console.log("jobDescriptionResult", jobDescriptionResult);
  // console.log("resumeObjectId", resumeObjectId);
 //console.log(advanceFeatureData);

  const jobDescriptionRef = useRef("");
  const jobDescriptionTemplateNameRef = useRef("");
  const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const emailRef = useRef("");
    const phoneRef = useRef("");
   // const addressRef = useRef("");
    const cityRef = useRef("");
    const stateRef = useRef("");
    const companyNameRef = useRef("");
    const positionRef = useRef("");
   // const zipRef = useRef("");
   // const countryRef = useRef("United States");



  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
  const [templateList, setTemplateList] = useState([]);
  const [aiTemputate, setAiTemputate] = useState(0.8);

  //console.log(last24HoursCoverLetterUsage);
  function getLast24HoursCoverLetterData(userId){
    mongodbGetLast24HoursCoverLetterData(userId).then((result)=>{
      if (result.length > 0) {
        setLast24HoursCoverLetterUsage(result);
      }
    })

  }
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
            Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
          }
        });
        const result = await response.json();
        setTemplateList(result.result);
        if (!result.success) {

          return toast.error("User template loading error ...")
        }


      } catch (error) {
        // console.log(error)

        toast.error("User template loading error .. ")

      }
    }

    if (user && user.userId){
      getLast24HoursCoverLetterData(user.userId);
      loadUserTemplate().then(r => {});

      firstNameRef.current.value = user.firstName ? user.firstName : "First Name";
      lastNameRef.current.value = user.lastName ? user.lastName : "Last Name";
      emailRef.current.value = user.email ? user.email : "";
      phoneRef.current.value = user.phoneNumber ? user.phoneNumber : "";
     // addressRef.current.value = user?.address;
      cityRef.current.value = user.city ? user.city : "";
      stateRef.current.value = user.region ? user.region : "";
     //   countryRef.current.value = user.country ? user.country : "";
    //  zipRef.current.value = user?.zip;

    }
  },[user]);

  const [selectedTemplateOption, setSelectedTemplateOption] = useState('');



  const handleSelectTemplateChange = (event,jdTemplate) => {
    const selectedTemplateOptionId = jdTemplate.docID;//event.target.value;
    if (selectedTemplateOptionId === "0"){
      setSelectedTemplateOption("");
      return;
    } else {
      const selectedTemplateOptionData = templateList.filter((item) => item.docID === selectedTemplateOptionId);
      const selectedTemplateData = selectedTemplateOptionData[0];
        setSelectedTemplateOption(event.target.value);
        // console.log("selectedTemplateData", selectedTemplateData);
        jobDescriptionTemplateNameRef.current.value = selectedTemplateData.documents[0].jdTemplateName;
        jobDescriptionRef.current.value = selectedTemplateData.documents[0].postBodyJDInfoExtract.futureJobDescription;
        setJobDescription({
          companyName: selectedTemplateData.documents[0].JDInfoExtractMessageContent.companyName,
          jobTitle: selectedTemplateData.documents[0].JDInfoExtractMessageContent.jobTitle,
          keyResponsibilities: selectedTemplateData.documents[0].JDInfoExtractMessageContent.keyResponsibilities,
          requiredSkills: selectedTemplateData.documents[0].JDInfoExtractMessageContent.requiredSkills,
          qualifications: selectedTemplateData.documents[0].JDInfoExtractMessageContent.qualifications,
          salaryRange: selectedTemplateData.documents[0].JDInfoExtractMessageContent.salaryRange,
          location: selectedTemplateData.documents[0].JDInfoExtractMessageContent.location,
        });
      setJobDescriptionObjectId(selectedTemplateOptionId);
      setJdExtracteComplete(true);
    }

  };
  // console.log(templateList)
  // console.log(selectedTemplateOption)

  const handleExtractStreaming = async () => {

    if (!user){
      openOverlay();
      return;
    }
    if (jobDescriptionResult){
        setJdExtracteComplete(true);
        return;
    }
    const start = Date.now();
    const jdExtractorSubmitOriginalData = {
      selectedTemplateOption:selectedTemplateOption,
      jobDescriptionTemplateNameRef:jobDescriptionTemplateNameRef && jobDescriptionTemplateNameRef.current.value ? jobDescriptionTemplateNameRef.current.value : "",
      futureJobDescription:jobDescriptionRef.current.value,
    }

    //console.log( "jdExtractorSubmitOriginalData", jdExtractorSubmitOriginalData);
    const outputSchema = z.object({
      companyName: z.string(),
      jobTitle: z.string(),
      keyResponsibilities: z.array(z.string()),
      requiredSkills: z.array(z.string()),
      qualifications: z.array(z.string()),
      salaryRange: z.string(),
      location: z.string(),
    });

    const modelParams = {
      functions: [
        {
          name: "jdInfoExtract",
          description: "Extract job information from a job description",
          parameters: zodToJsonSchema(outputSchema),
        },
      ],
      function_call: { name: "jdInfoExtract" },
    };

    const chatPrompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Based on the provided job description, get the [companyName],[jobTitle],[keyResponsibilities],[requiredSkills],[qualifications],[salaryRange],[location] as mentioned in the job description."
        ),
        HumanMessagePromptTemplate.fromTemplate("{inputJDText}"),
      ],
      inputVariables: ["inputJDText"],
    });

    const modelOpenAI = new ChatOpenAI({
      modelName: advanceFeatureData.selectedAiModel.modelNameId,
      temperature: aiTemputate,
      maxConcurrency: 5,
      stream: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
    }).bind(modelParams);

    const chain = chatPrompt
        .pipe(modelOpenAI)
        .pipe(new JsonOutputFunctionsParser());
    try {

      setGenerating(true);
      setJobDescription({
        companyName: "",
        jobTitle: "",
        keyResponsibilities: [],
        requiredSkills: [],
        qualifications: [],
      });
      const stream = await chain.stream({
        inputJDText: jdExtractorSubmitOriginalData.futureJobDescription,
      });


      let streamData = null;
      for await (const chunk of stream) {
        // console.log("chunk", chunk);
        streamData = chunk;
        setJobDescription({
          companyName: chunk.companyName,
          jobTitle: chunk.jobTitle,
          keyResponsibilities: chunk.keyResponsibilities,
          requiredSkills: chunk.requiredSkills,
          qualifications: chunk.qualifications,
          salaryRange: chunk.salaryRange,
          location: chunk.location,
        });
      }
      const end = Date.now();
      const fetchTime = end - start;
      const jdInsertUpdate = await mongodbUpdateJobDescriptionStreaming({
        jdExtractorSubmitOriginalData,
        jobDescriptionResult:streamData,
        fetchTime,
        prompt:chatPrompt,
      }, user.userId);

      if (jdInsertUpdate.upsertedId) {
        // If a document was inserted, dataUpdate.upsertedId contains the _id
        setJobDescriptionObjectId(jdInsertUpdate.upsertedId.toString());
      }

      setGenerating(false);
      return streamData;

    } catch (error) {
      // console.log(error)
      setGenerating(false);
      setJobDescription(null);

      toast.error("Error .. Please try again later.")

    }
  }
  const generateCoverLetterStreaming = async (jobDescription) => {
    getLast24HoursCoverLetterData(user.userId);

    if (last24HoursCoverLetterUsage.length >= 3 && user && !user.paidCustomer){
        return toast.error("You have reached the maximum number of 3 cover letter generation for the last 24 hours. ")
    }
    // if (selectedAiModel !== "" && totalCredits < 1000){
    //   return toast.error("You don't have enough credits to generate cover letter. ")
    // }
    setCoverLetterGenerate(true)
    const startTime = Date.now();
    const userInfo = {
      "firstName": firstNameRef.current.value,
      "lastName": lastNameRef.current.value,
      "email": emailRef.current.value ? emailRef.current.value : "Your Email" ,
      "phoneNo":phoneRef.current.value ? phoneRef.current.value : "123-123-1234",
      "city":user.city ? user.city : "My Location",
      "state":stateRef.current.value ? stateRef.current.value : "Texas",
    };
    try {
      const chatPrompt = advanceFeatureData.advanceSection ? new ChatPromptTemplate(coverLetterAdvancedPrompt) : new ChatPromptTemplate(coverLetterPrompt);
      const modelOpenAI = new ChatOpenAI({
        temperature: aiTemputate,
        maxConcurrency: 5,
        user: user.userId,
        stream: true,
        modelName: advanceFeatureData.selectedAiModel.modelNameId,
        //openAIApiKey: process.env.OPENAI_API_KEY,
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
        jobTitle: jobDescription.jobTitle,
        keyResponsibilities: jobDescription.keyResponsibilities,
        requiredSkills: jobDescription.requiredSkills,
        qualifications: jobDescription.qualifications,
        //  educations: resumeData.resumeOriginalData.education,
        //  professionalExperiences: resumeData.professionalExperienceRewrite,
        applicantName: firstNameRef.current.value + " " + lastNameRef.current.value,
        companyName : jobDescription.companyName,
        paragraphLength: advanceFeatureData.paragraphLength,
        writingTone: advanceFeatureData.writingTone,
        contentTemplatePrompt: advanceFeatureData.selectedContentTemplate.promptExample,
      };
      const userContentAdvanced = {
        jobTitle: jobDescription.jobTitle,
        keyResponsibilities: jobDescription.keyResponsibilities,
        requiredSkills: jobDescription.requiredSkills,
        qualifications: jobDescription.qualifications,
        //  educations: resumeData.resumeOriginalData.education,
        //  professionalExperiences: resumeData.professionalExperienceRewrite,
        applicantName: firstNameRef.current.value + " " + lastNameRef.current.value,
        companyName : jobDescription.companyName,
        coverletterExtraPromptRef: advanceFeatureData.coverletterExtraPromptRef,
      };
      //console.log( advanceFeatureData)
    //  console.log( userContentAdvanced)
      const stream = await chat.stream(advanceFeatureData.advanceSection ? userContentAdvanced : userContent );
      let output = {coverLetterAiGenerate:"",coverLetterCandidateStrengthAiGenerate:[]};
      for await (const chunk of stream) {
       // console.log("chunk", chunk);
        output.coverLetterAiGenerate = chunk.coverLetterAiGenerate;
        output.coverLetterCandidateStrengthAiGenerate = chunk.coverLetterCandidateStrengthAiGenerate;
        setCoverLetterAiGenerate(chunk.coverLetterAiGenerate);
        setCoverLetterCandidateStrength(chunk.coverLetterCandidateStrengthAiGenerate);
      }

      const endTime = Date.now();
      const fetchTime = endTime - startTime;
      await mongodbGenerateCoverLetterStreaming({
        fetchTime: fetchTime,
        userId: user.userId,
        jobDescriptionObjectId: jobDescriptionObjectId,
        modelVersion: advanceFeatureData.selectedAiModel.modelNameId,
        provider:advanceFeatureData.selectedAiModel.provider,
        modelParams: {
          temperature: aiTemputate,
          maxConcurrency: 5
        },
        chatPrompt : chatPrompt,
        userContent: userContent,
        parsedOutput:output,
        advanceFeature: advanceFeatureData,
        userInformation: userInfo,
        coverletterType: coverletterType,
      });

      setCoverLetterGenerateComplete(true);
      setCoverLetterGenerate(false)
    } catch (error) {
      //console.log(error)
      toast.error("Generate cover letter error ...")
      setCoverLetterGenerate(false)
      setTimeout(function() {
        window.location.reload();
      }, 2000);
    }
  }


  const generateCoverLetterStreamingIntelligentType = async () => {
    getLast24HoursCoverLetterData(user.userId);

    if (last24HoursCoverLetterUsage.length >= 3 && user && !user.paidCustomer){
      return toast.error("You have reached the maximum number of 3 cover letter generation for the last 24 hours. ")
    }

    setCoverLetterGenerate(true)
    const startTime = Date.now();
    const userInfo = {
      "firstName": firstNameRef.current.value,
      "lastName": lastNameRef.current.value,
      "email": emailRef.current.value ? emailRef.current.value : "Your Email" ,
      "phoneNo":phoneRef.current.value ? phoneRef.current.value : "123-123-1234",
      "city":user.city ? user.city : "My Location",
      "state":stateRef.current.value ? stateRef.current.value : "Texas",
    };
    try {
      const chatPrompt = advanceFeatureData.advanceSection ? new ChatPromptTemplate(coverLetterIntelligentAdvancedPrompt) : new ChatPromptTemplate(coverLetterIntelligentPrompt);
      const modelOpenAI = new ChatOpenAI({
        temperature: aiTemputate,
        maxConcurrency: 5,
        user: user.userId,
        stream: true,
        modelName: advanceFeatureData.selectedAiModel.modelNameId,
        //openAIApiKey: process.env.OPENAI_API_KEY,
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

        selectedExperienceLevel: selectedExperienceLevel.name,
        selectedField: selectedField.name,
        applicantName: firstNameRef.current.value + " " + lastNameRef.current.value,
        jobTitle: positionRef.current.value,
        companyName : companyNameRef.current.value,
        paragraphLength: advanceFeatureData.paragraphLength,
        writingTone: advanceFeatureData.writingTone,
        contentTemplatePrompt: advanceFeatureData.selectedContentTemplate.promptExample,
      };
      const userContentAdvanced = {

        selectedExperienceLevel: selectedExperienceLevel.name,
        selectedField: selectedField.name,
        applicantName: firstNameRef.current.value + " " + lastNameRef.current.value,
        jobTitle: positionRef.current.value,
        companyName : companyNameRef.current.value,
        coverletterExtraPromptRef: advanceFeatureData.coverletterExtraPromptRef,
      };
      //console.log( advanceFeatureData)
      //  console.log( userContentAdvanced)
      const stream = await chat.stream(advanceFeatureData.advanceSection ? userContentAdvanced : userContent );
      let output = {coverLetterAiGenerate:"",coverLetterCandidateStrengthAiGenerate:[]};
      for await (const chunk of stream) {
        // console.log("chunk", chunk);
        output.coverLetterAiGenerate = chunk.coverLetterAiGenerate;
        output.coverLetterCandidateStrengthAiGenerate = chunk.coverLetterCandidateStrengthAiGenerate;
        setCoverLetterAiGenerate(chunk.coverLetterAiGenerate);
        setCoverLetterCandidateStrength(chunk.coverLetterCandidateStrengthAiGenerate);
      }

      const endTime = Date.now();
      const fetchTime = endTime - startTime;
      mongodbGenerateCoverLetterStreaming({
        fetchTime: fetchTime,
        userId: user.userId,
        jobDescriptionObjectId: jobDescriptionObjectId,
        modelVersion: advanceFeatureData.selectedAiModel.modelNameId,
        provider:advanceFeatureData.selectedAiModel.provider,
        modelParams: {
          temperature: aiTemputate,
          maxConcurrency: 5
        },
        chatPrompt : chatPrompt,
        userContent: userContent,
        parsedOutput:output,
        advanceFeature: advanceFeatureData,
        userInformation: userInfo,
        coverletterType: coverletterType,
      });

      setCoverLetterGenerateComplete(true);
      setCoverLetterGenerate(false)
    } catch (error) {
      //console.log(error)
      toast.error("Generate cover letter error ...")
      setCoverLetterGenerate(false)
      setTimeout(function() {
       // window.location.reload();
      }, 2000);
    }
  }
  const handleAdvanceFeatureData = (data) => {
    setAdvanceFeatureData(data)
  }

  const handleCoverLetterGenerate = async () => {


    if (coverletterType === "jobDescription"){
        if (jobDescriptionTemplateNameRef.current.value === ""){
          document.getElementById("jdTemplateName").style.borderWidth = "1px";
          document.getElementById("jdTemplateName").style.borderColor = "red";
        }
        if (jobDescriptionRef.current.value === ""){
          document.getElementById("jobDescription").style.borderWidth = "1px";
          document.getElementById("jobDescription").style.borderColor = "red";
        }
        if (jobDescriptionTemplateNameRef.current.value === ""){
          toast.error("Please enter a job description name or select one from the template list first.")
          return;
        } else if (jobDescriptionRef.current.value === ""){
          toast.error("Please copy/paste a job description or manually enter one here.")
          return;

        }
    } else {
        if (selectedExperienceLevel.id === 0 ){
          document.getElementById("workExperienceLevelInput").style.borderWidth = "1px";
          document.getElementById("workExperienceLevelInput").style.borderColor = "red";
        }
        if (selectedField.id === 0 ){
          document.getElementById("workFieldInput").style.borderWidth = "1px";
          document.getElementById("workFieldInput").style.borderColor = "red";
        }
        if (companyNameRef.current.value === ""){
            document.getElementById("company-name").style.borderWidth = "1px";
            document.getElementById("company-name").style.borderColor = "red";
        }
        if (positionRef.current.value === ""){
            document.getElementById("position").style.borderWidth = "1px";
            document.getElementById("position").style.borderColor = "red";
        }
      if (selectedField.id === 0 || selectedExperienceLevel.id === 0 || companyNameRef.current.value ==="" || positionRef.current.value === ""){
        toast.error("Please select your work experience level and field first.")
        return;
      }

    }

    if (firstNameRef.current.value === ""){
        document.getElementById("first-name").style.borderWidth = "1px";
        document.getElementById("first-name").style.borderColor = "red";
    }
    if (lastNameRef.current.value === ""){
      document.getElementById("last-name").style.borderWidth = "1px";
      document.getElementById("last-name").style.borderColor = "red";
    }
    if (emailRef.current.value === ""){
      document.getElementById("email").style.borderWidth = "1px";
      document.getElementById("email").style.borderColor = "red";
    }
    if (phoneRef.current.value === ""){
      document.getElementById("phone").style.borderWidth = "1px";
      document.getElementById("phone").style.borderColor = "red";
    }
    if (cityRef.current.value === ""){
      document.getElementById("city").style.borderWidth = "1px";
      document.getElementById("city").style.borderColor = "red";
    }
    if (stateRef.current.value === ""){
      document.getElementById("state").style.borderWidth = "1px";
      document.getElementById("state").style.borderColor = "red";
    }


   if (firstNameRef.current.value === "" || lastNameRef.current.value === "" || emailRef.current.value === "" || cityRef.current.value === "" || stateRef.current.value === "" || phoneRef.current.value === "" || firstNameRef.current.value === null || lastNameRef.current.value === null || emailRef.current.value === null || cityRef.current.value === null || stateRef.current.value === null || phoneRef.current.value === null ){
        toast.error("Please fill out all the required fields highlighted in red.")
        return;
    } else if (advanceFeatureData.advanceSection && advanceFeatureData.coverletterExtraPromptRef === ""){
      toast.error("Please enter your cover letter extra prompt, select one from the template list first or disable the advanced feature.")
      return;
    }
    if (coverletterType === "jobDescription"){
    document.getElementById("jdTemplateName").style.borderWidth = "0px";
    document.getElementById("jdTemplateName").style.borderColor = "transparent";
    document.getElementById("jobDescription").style.borderWidth = "0px";
    document.getElementById("jobDescription").style.borderColor = "transparent";
    } else {
    document.getElementById("workExperienceLevelInput").style.borderWidth = "0px";
    document.getElementById("workExperienceLevelInput").style.borderColor = "transparent";
    document.getElementById("workFieldInput").style.borderWidth = "0px";
    document.getElementById("workFieldInput").style.borderColor = "transparent";
    document.getElementById("company-name").style.borderWidth = "0px";
    document.getElementById("company-name").style.borderColor = "transparent";
    document.getElementById("position").style.borderWidth = "0px";
    document.getElementById("position").style.borderColor = "transparent";
    }
    document.getElementById("first-name").style.borderWidth = "0px";
    document.getElementById("first-name").style.borderColor = "transparent";
    document.getElementById("last-name").style.borderWidth = "0px";
    document.getElementById("last-name").style.borderColor = "transparent";
    document.getElementById("email").style.borderWidth = "0px";
    document.getElementById("email").style.borderColor = "transparent";
    document.getElementById("city").style.borderWidth = "0px";
    document.getElementById("city").style.borderColor = "transparent";
    document.getElementById("state").style.borderWidth = "0px";
    document.getElementById("state").style.borderColor = "transparent";
    document.getElementById("phone").style.borderWidth = "0px";
    document.getElementById("phone").style.borderColor = "transparent";



    if (!jdExtracteComplete ){
      if (coverletterType === "jobDescription") {
        await handleExtractStreaming().then((result)=> {

            generateCoverLetterStreaming(result);

        }).catch((err) => {
         //console.log(err)
          toast.error("Generate cover letter network error2 ...Plesae try again later.")
          setCoverLetterGenerate(false)
        })
      } else {
        generateCoverLetterStreamingIntelligentType();
      }
    } else if (jdExtracteComplete ){
      if (coverletterType === "jobDescription") {
          await generateCoverLetterStreaming(jobDescriptionResult);
        } else {
          await generateCoverLetterStreamingIntelligentType();
        }
      }
    }

  const handleSelectTemplateClk = async (e) => {

    const coverLetterLines = coverLetterAiGenerate.replace(/Dear Hiring Manager,[\n\n|\n\s]*/g, "").replace(/\\n|\n\n|\n/g, "\n").split(/\\n|\n\n|\n/).map((line, index) => {
      return {  line };
    });
    const top4Strengths = coverLetterCandidateStrength.slice(0, 4).map((strength, index) => {
      return {  strength };
    });


    //console.log("coverLetterLines", coverLetterLines)
    // Set the template data
    const data = {
      "firstName": firstNameRef.current.value,
      "lastName": lastNameRef.current.value,
      "email": emailRef.current.value ? emailRef.current.value : "Your Email" ,
      "phoneNo":phoneRef.current.value ? phoneRef.current.value : "123-123-1234",
      "city":user.city ? user.city : "My Location",
      "coverLetterAiGenerate":coverLetterLines,
      "coverLetterCandidateStrengthMessageContent":top4Strengths,

    };

    dispatch(setClData(data));
    setClCreatePrgress(2),
    setClTemplateData(data);
  }

  const [coverletterType, setCoverletterType] = useState("jobDescription");
  const coverletterWritingTypes = [
    { id: "jobDescription", title: "From a Job Description" },
    { id: "easyMode", title: "Easy Intelligent Mode" },
      ];
  const handleCoverLetterType = (value) => {
    setCoverletterType(value)

  }
  const [queryField, setQueryField] = useState('')
  const [selectedField, setSelectedField] = useState({    id: 0,    name: 'Please select a field or domain',  })
  const fieldorDomains = fieldOrDomains;
  const filteredField =
      queryField === ''
          ? fieldorDomains
          : fieldorDomains.filter((field) => {
            return field.name.toLowerCase().includes(queryField.toLowerCase())
          })


  const [queryExperienceLevel, setQueryExperienceLevel] = useState('')
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState({id:0, name:"Please Select Experience Level"})
  const experienceLevel = experienceLevels;
  const filteredExperienceLevel =
      queryExperienceLevel === ''
          ? experienceLevel
          : experienceLevel.filter((person) => {
            return person.name.toLowerCase().includes(queryExperienceLevel.toLowerCase())
          })


  return (
  <div className="max-w-7xl  sm:px-2 lg:px-4 lg:py-4 mx-auto">
    <form>
      <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900">
      <div className="pb-10 sm:pb-10">



        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:max-w-6xl lg:px-8">
          <div className="pt-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">CoverLetter Writing Type : </label>
            {/*<p className="text-sm text-gray-500"></p>*/}
            <fieldset className="mt-4">
              <legend className="sr-only">Type</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                {coverletterWritingTypes.map((coverletterWritingType) => (
                    <div key={"coverletterWritingType_div_"+coverletterWritingType.id} className="inline-block items-center">
                      <input
                          id={coverletterWritingType.id}
                          name="coverletterWritingType"
                          type="radio"
                          value={coverletterWritingType.id}
                          onChange={(e) => {
                            // setWritingTone(e.target.value);
                            handleCoverLetterType(e.target.value);
                          } }
                          defaultChecked={coverletterWritingType.id === coverletterType}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor={"writingType_"+coverletterWritingType.id} className="ml-2 mr-2 text-sm font-medium leading-6 text-gray-900">
                        {coverletterWritingType.title}
                      </label>
                    </div>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-4 pb-2 border-b-2">

            {coverletterType === "easyMode" && (
                <div className="mt-2 mb-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-2 ">
                  <Combobox as="div" value={selectedField} onChange={setSelectedField}>
                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Working Field</Combobox.Label>
                    <div className="relative mt-2">
                      <Combobox.Input
                          id="workFieldInput"
                          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(event) => setQueryField(event.target.value)}
                          displayValue={(field) => field?.name}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </Combobox.Button>

                      {filteredField.length > 0 && (
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredField.map((level) => (
                                <Combobox.Option
                                    key={level.id}
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
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{level.name}</span>

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

                  <Combobox as="div" value={selectedExperienceLevel} onChange={setSelectedExperienceLevel}>
                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Experience Level</Combobox.Label>
                    <div className="relative mt-2">
                      <Combobox.Input
                          id="workExperienceLevelInput"
                          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(event) => setQueryExperienceLevel(event.target.value)}
                          displayValue={(person) => person?.name}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </Combobox.Button>

                      {filteredExperienceLevel.length > 0 && (
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredExperienceLevel.map((level) => (
                                <Combobox.Option
                                    key={level.id}
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
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{level.name}</span>

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

                  <div className="col-start-1 col-end-5 mt-2">
                    <label htmlFor="company-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Company Name *
                    </label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="company-name"
                          id="company-name"
                          placeholder={"Unity Technologies"}
                          ref={companyNameRef}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="col-start-1 col-end-5 mt-2">
                    <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
                      Position *
                    </label>
                    <div className="mt-2">
                      <input
                          type="text"
                          name="position"
                          id="position"
                          placeholder={"3D Artist"}
                          ref={positionRef}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
            )}

            {coverletterType === "jobDescription" && (
                <div className="mt-2 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                  <div className="col-start-1 col-end-5 mt-2">
                    {templateList && templateList.length > 0 && (
                        <div>

                          <div>
                            <label htmlFor="jdTemplateSelect" className="block text-sm font-medium leading-6 text-gray-900">
                              Saved Job Description List :
                            </label>

                          </div>


                          <Menu as="div"
                                className=" relative inline-block text-left"
                          >
                            <div className="">
                              <Menu.Button
                                  className="inline-flex w-full justify-left gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                {selectedTemplateOption || 'Available Templates'}
                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {templateList.length > 0 && templateList.map((jdTemplate, index) => {
                                    return(
                                        <Menu.Item key={"jdTemplateList_"+index}>
                                          {({ active }) => (
                                              <a
                                                  href="#"
                                                  onClick={(e) => handleSelectTemplateChange(e,jdTemplate)}
                                                  className={classNames(
                                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                      'block px-4 py-2 text-sm'
                                                  )}
                                              >
                                                {jdTemplate._id}
                                              </a>
                                          )}
                                        </Menu.Item>
                                    )
                                  })}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                    )}

                    <div className="mt-2">
                      <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                        Job Description Template Name *
                      </label>
                      <div className="mt-2">
                        <input
                            type="text"
                            name="jdTemplateName"
                            id="jdTemplateName"
                            ref={jobDescriptionTemplateNameRef}
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Ex: Template for Software Engineer	 - 1"
                            aria-describedby="email-description"
                        />
                      </div>
                    </div>

                  </div>
                  <h2 className="sr-only">Details for your job description</h2>
                  <div className="grid grid-cols-1  lg:gap-8">
                    <div className="">
                      {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                      {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                      <fieldset className="mt-2">


                        <div className="space-y-2 sm:block  w-full h-auto">

                          <div className="mt-2">

                            {/*Future Job Info*/}

                            <legend className="sr-only">My Next Job</legend>
                            <div className=" mb-3 border-b-2 ">
                              <div>
                                <legend className="sr-only">Job description</legend>
                                <label htmlFor="jobDescription" className="block text-sm font-medium leading-6 text-gray-900">
                                  Job description *
                                </label>
                                <div className="mt-2">
                            <textarea
                                rows={4}
                                name="jobDescription"
                                id="jobDescription"
                                ref={jobDescriptionRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                            />
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




            <div className="col-start-1 col-end-5 mt-2">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First name *
              </label>
              <div className="mt-2">
                <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    placeholder={"First Name"}
                    ref={firstNameRef}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-start-5 col-end-9 mt-2">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name *
              </label>
              <div className="mt-2">
                <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    placeholder={"Last Name"}
                    ref={lastNameRef}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-start-9 col-end-13 mt-2">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email *
              </label>
              <div className="mt-2">
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={"abc@def.com"}
                    ref={emailRef}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>


            <div className="col-start-1 col-end-5 mt-2">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone No. *
              </label>
              <div className="mt-2">
                <input
                    type="text"
                    name="phone"
                    id="phone"
                    ref={phoneRef}
                    placeholder="123-456-7890"
                    className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />

              </div>
            </div>
            <div className="col-start-5 col-end-9 mt-2">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                  City *
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="city"
                      id="city"
                      ref={cityRef}
                      placeholder="Dallas"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            <div className="col-start-9 col-end-13 mt-2">
                <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                  State *
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="state"
                      id="state"
                      ref={stateRef}
                      placeholder="Texas"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>





          </div>
          <div className="col-start-1 col-end-13 mt-2">
            <AdvanceFeatureCoverLetter
                onSelectionChange={handleAdvanceFeatureData}
                advanceFeatureInitial={advanceFeatureData}/>
          </div>
            { jobDescriptionResult && (
                <div className="mt-8 p-4 bg-white">
                <div

                    className="prose prose-sm mt-4 text-black bg-white"

                >
                  <h2 className="mt-3 font-medium"> Job Description Key information for {jobDescriptionResult && jobDescriptionResult.jobTitle && "  "+jobDescriptionResult.jobTitle} {jobDescriptionResult && jobDescriptionResult.companyName && " @ "+jobDescriptionResult.companyName}</h2>
                  <div className="flex flex-col">
                    <div>
                      <h2 className="mt-1 p-2">Job Title : {jobDescriptionResult.jobTitle}</h2>
                      <h2 className="mt-1 p-2">Company Name : {jobDescriptionResult.companyName}</h2>
                      {jobDescriptionResult.salaryRange && (
                          <h2 className="mt-1 p-2">Salary Range : {jobDescriptionResult.salaryRange}</h2>
                      )}
                      {jobDescriptionResult.location && (
                          <h2 className="mt-1 p-2">Work Location : {jobDescriptionResult.location}</h2>
                      )}

                    </div>

                    <div>
                      <h2 className="mt-1 p-2">Key Responsibilities : </h2>
                      <ul role="list" className="list-disc list-inside">
                        {jobDescriptionResult && jobDescriptionResult.keyResponsibilities && jobDescriptionResult.keyResponsibilities.map((keyResponsibility, i) => {
                          return (
                              <div key={"keyResponsibilities-" + i} className="indent-8">
                                <div>
                                  {i+1 + ". "} {keyResponsibility ?  keyResponsibility : ""}
                                </div>

                              </div>

                          )
                        })}
                      </ul>
                    </div>

                    <div>
                      <h2 className="mt-1 p-2">Required Skills : </h2>
                      <ul role="list" className="list-disc list-inside">
                        {jobDescriptionResult && jobDescriptionResult.requiredSkills && jobDescriptionResult.requiredSkills.map((skill, i) => {
                          return (
                              <div key={"requiredSkills-" + i} className="indent-8">
                                <div>
                                  {i+1 + ". "} {skill ?  skill : ""}
                                </div>

                              </div>

                          )
                        })}
                      </ul>
                    </div>
                    {jobDescriptionResult && jobDescriptionResult.qualifications && jobDescriptionResult.qualifications.length > 0 && (
                    <div>
                      <h2 className="mt-1 p-2">Qualifications : </h2>
                      <ul role="list" className="list-disc list-inside">
                        {jobDescriptionResult.qualifications.map((qualification, i) => {
                          return (
                              <div key={"qualifications-" + i} className="indent-8">
                                <div>
                                  {i+1 + ". "} {qualification ?  qualification : ""}
                                </div>

                              </div>

                          )
                        })}
                      </ul>
                    </div>

                    )}
                  </div>


                </div>
                </div>

            )}

          {coverLetterAiGenerate && (
          <div className="mt-8 p-4 bg-white">
            {coverLetterAiGenerate.split(/\\n|\n/).map((line, index) => (
                <p key={"coverLetterAiGenerate_"+index} className="indent-8 mb-4">{line}</p>
            ))}
            <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex flex-wrap justify-start ">
                {coverLetterCandidateStrength && coverLetterCandidateStrength.map((candidateStrength,candidateStrengthIndex)=>{
                  return(
                      <div key={"coverLetterCandidateStrength_"+candidateStrengthIndex} className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{candidateStrength}</div>
                  )
                })}
              </div>
            </li>
          </div>
          )}

          {coverLetterGenerateComplete && coverLetterCandidateStrength  ? (

              <div className="mt-8 lg:col-span-12">
                {(!generating && !coverLetterGenerate) && (
                    <button
                        type="button"

                        onClick={handleSelectTemplateClk}
                        className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                    >
                      Select Template
                    </button>
                )}

                <div className="mt-8 lg:col-span-12">

                  {(generating || coverLetterGenerate) ? (<div
                      className="w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                  >
                    <svg aria-hidden="true"
                         className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor" />
                      <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill" />
                    </svg>
                    Generating...
                  </div>) : (
                      <div
                          onClick={handleCoverLetterGenerate}
                          className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                      >

                        Re-Generate Cover Letter
                      </div>
                  )}



                </div>
              </div>
          ) :(
            <div className="mt-8 lg:col-span-12">

          {(generating || coverLetterGenerate) ? (<div
            className="w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
            >
            <svg aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor" />
            <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill" />
            </svg>
            Generating...
            </div>) : (
            <div
            onClick={handleCoverLetterGenerate}
            className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
            >

            Generate Cover Letter
            </div>
            )}

              <p>* Required fields</p>

            </div>

          )}




        </div>
      </div>
      </div>
    </form>

  </div>
  )
}
export default coverLetter;
