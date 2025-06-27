import React, {useContext, useEffect, useRef, useState} from 'react'
import { toast } from "react-toastify";

import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {mongodbInsertNewJobDescription, mongodbUpdateJobDescriptionStreaming} from "../../helpers/mongodb/pages/api/resume";
import {useSelector} from "react-redux";

import { jdInfoExtractLangChainApi } from "../../helpers/helperApis/jdInfoExtractLangChain";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const JdExtractor = () => {

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);

  const [jobDescriptionResult, setJobDescription] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [ resumeObjectId, setResumeObjectId] = useState(false);
  const [extractCompleted, setExtractCompleted] = useState(false);

  // console.log("jobDescriptionResult", jobDescriptionResult);
  // console.log("resumeObjectId", resumeObjectId);

  const jobDescriptionRef = useRef("");
  const jobDescriptionTemplateNameRef = useRef("");



  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
  const [templateList, setTemplateList] = useState([]);


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
      loadUserTemplate().then(r => console.log("loadUserTemplate", r))

    }
  },[user]);





  const [selectedTemplateOption, setSelectedTemplateOption] = useState('');


  // console.log(templateList)
  // console.log(selectedTemplateOption)
  const handleExtract = async (e) => {
    e.preventDefault();

    if (!user){
      openOverlay();
      return;
    }


    //console.log( "jdExtractorSubmitOriginalData", jdExtractorSubmitOriginalData);

    try {

      setGenerating(true);
      setJobDescription(null);

      const apiData = await jdInfoExtractLangChainApi({
        userId: user && user.userId ? user.userId : "0",
        data : jdExtractorSubmitOriginalData,
      });

      // console.log(result)
      if (!apiData) {
        setGenerating(false);
        setJobDescription(null);

        return toast.error("Error . Please try again later.")
      }

      setJobDescription(apiData);
      // setResumeObjectId(result.lastInsertedId.insertedId)
      setGenerating(false);

    } catch (error) {
      // console.log(error)
      setGenerating(false);
      setJobDescription(null);

      toast.error("Error .. Please try again later.")

    }
  }
  const handleExtractStreaming = async (e) => {
    e.preventDefault();


    if (!user){
      openOverlay();
      return;
    }

    if (jobDescriptionTemplateNameRef.current.value === ""){
      document.getElementById("jdTemplateName").style.borderWidth = "1px";
      document.getElementById("jdTemplateName").style.borderColor = "red";
    } else {
        document.getElementById("jdTemplateName").style.borderWidth = "0px";
    document.getElementById("jdTemplateName").style.borderColor = "transparent";
    }
    if (jobDescriptionRef.current.value === ""){
      document.getElementById("jobDescription").style.borderWidth = "1px";
      document.getElementById("jobDescription").style.borderColor = "red";
    } else {
        document.getElementById("jobDescription").style.borderWidth = "0px";
    document.getElementById("jobDescription").style.borderColor = "transparent";
    }
    if (jobDescriptionRef.current.value === "" || jobDescriptionTemplateNameRef.current.value === ""){
      toast.error("Please fill all the fields" )
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
      temperature: 0,
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
      await mongodbUpdateJobDescriptionStreaming({
        jdExtractorSubmitOriginalData,
        jobDescriptionResult:streamData,
        fetchTime,
        prompt:chatPrompt,
      }, user.userId);

      setExtractCompleted(true);
      setGenerating(false);

    } catch (error) {
      // console.log(error)
      setGenerating(false);
      setJobDescription(null);

      toast.error("Error .. Please try again later.")

    }
  }



  return (
      <div className="max-w-7xl px-2 py-2 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <form>
    <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900">

      <div className="pb-10 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Job Description Extraction Tool : Help you to understand a job post faster.</h1>
          <h3 className="mt-4 p-2 text-sm md:text-xl">Effortlessly navigate job postings with our AI tool. Just paste an online job description or enter a prompt like "find me an accounting job description" or "entry-level jobs for social work graduates," and our system will quickly extract and highlight the key information for you. Whether it's a detailed job page or a specific inquiry, we've got you covered.</h3>

        </div>


        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">


            <div className="mt-8 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <div>
                <div>
                  <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                    Template Name *
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

                  {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                  {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}


                    <div className="space-y-2 sm:block  w-full h-auto">


                        {/*Future Job Info*/}

                        <div className="mt-2 ">
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


            </div>

            <div className="mt-8 lg:col-span-12">
              {generating ? (<div
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
                Extracting...
                </div>) : (
                    <>
                      {extractCompleted ? (
                          <div>
                            <div className="text-gray-900 text-sm font-semibold">Extracted Information :</div>
                          </div>
                      ): (
                          <div
                              onClick={handleExtractStreaming}
                              className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                          >

                            Extract Key Information
                          </div>
                      )}

                    </>

                )}







            </div>
          </div>

            {/* <h2 className="text-sm font-medium text-gray-900">Recipe</h2> */}

            { jobDescriptionResult && (
                <div className="mt-8 p-4 bg-white">
                <div

                    className="prose prose-sm mt-4 text-black"

                >
                  <h2 className="mt-3 "> Job Description Key information for {jobDescriptionResult && jobDescriptionResult.jdInfoExtractMessageContent && jobDescriptionResult.jdInfoExtractMessageContent.jobTitle && "  "+jobDescriptionResult.jdInfoExtractMessageContent.jobTitle} {jobDescriptionResult && jobDescriptionResult.jdInfoExtractMessageContent && jobDescriptionResult.jdInfoExtractMessageContent.companyName && " @ "+jobDescriptionResult.jdInfoExtractMessageContent.companyName}</h2>
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

                    <div>
                      <h2 className="mt-1 p-2">Qualifications : </h2>
                      <ul role="list" className="list-disc list-inside">
                        {jobDescriptionResult && jobDescriptionResult.qualifications && jobDescriptionResult.qualifications.map((qualification, i) => {
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

                  </div>
                  {/*<div*/}
                  {/*    className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}

                  {/*    onClick={handleWordDownload}*/}
                  {/*>*/}
                  {/*  Download This Resume in Word Format*/}
                  {/*</div>*/}
                  {/*<div>*/}
                  {/*  Download Resume in PDF Format*/}
                  {/*</div>*/}
                </div>
                </div>
            )}

          <p>* Required fields</p>

        </div>
      </div>
    </div>
        </form>
      </div>
  )
}
export default JdExtractor;
