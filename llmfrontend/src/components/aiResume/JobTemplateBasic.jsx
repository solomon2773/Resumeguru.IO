import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
import { toast } from "react-toastify";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import { estimateTokenCount } from "../../utils/openAi";
import {Combobox, Menu, Transition} from '@headlessui/react'
import {CheckIcon, ChevronDownIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import fieldOrDomains from "../../utils/staticObjects/fieldOrDomains";
import experienceLevels from "../../utils/staticObjects/experienceLevels";
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import createResumeSteps from "../../utils/staticObjects/dashboard/createResumeSteps";
import {useSelector} from "react-redux";

const JobTemplateBasic = ({resumeBasicInfo, jobDescriptionClick,resumeProgressSelect}) => {
 // console.log(resumeBasicInfo)

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);

  const jobDescriptionTemplateNameRef = useRef(resumeBasicInfo && resumeBasicInfo.jobDescriptionTemplateNameRef ? resumeBasicInfo.jobDescriptionTemplateNameRef : "");
  const jobDescriptionRef = useRef(resumeBasicInfo && resumeBasicInfo.futureJobDescription ? resumeBasicInfo.futureJobDescription : "");
 // const resumeTemplateNameRef = useRef("");
  const jobTitleRef = useRef(resumeBasicInfo && resumeBasicInfo.jobTitle ? resumeBasicInfo.jobTitle : "");
  const companyNameRef = useRef(resumeBasicInfo && resumeBasicInfo.companyName ? resumeBasicInfo.companyName : "");
  const [jobDescriptionExtract, setJobDescriptionExtract] = useState("");

  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
  const [jobDescriptionList, setJobDescriptionList] = useState([]);

  // console.log("jobDescriptionList", jobDescriptionList);
  const rg_jd_sel = localStorage.getItem("rg_jd_sel");
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
        setJobDescriptionList(result.result);
        if (!result.success) {

          return toast.error("User template loading error ...")
        }

      } catch (error) {
        console.log(error)

        toast.error("User template loading error .. ")

      }
    }
    if (user && user.userId){
      loadUserTemplate().then((r) => {
        // console.log("loadUserTemplate", r)
      })

    }

    async function loadJobDescriptionFromLocalStorage(){
      const jobDescriptionLocalStorage = await JSON.parse(rg_jd_sel);
      //console.log(jobDescriptionLocalStorage)
      jobDescriptionRef.current.value = jobDescriptionLocalStorage.description;
        jobDescriptionTemplateNameRef.current.value = jobDescriptionLocalStorage.company ? jobDescriptionLocalStorage.company : "" +"-"+jobDescriptionLocalStorage.title ? jobDescriptionLocalStorage.title : "";
    }
    if (rg_jd_sel){
      loadJobDescriptionFromLocalStorage().then((r) => {
        localStorage.setItem("rg_jd_sel", "")
      })

    }
  },[user, rg_jd_sel]);

  useEffect(() => {


    if (resumeBasicInfo){
      //setTargetResumeToggle(resumeBasicInfo.aiTargetResume);
      if (resumeBasicInfo.aiTargetResume ){
        setSelectedExperienceLevel(resumeBasicInfo.resumeExperienceLevel);
        setSelectedWorkingField(resumeBasicInfo.resumeWorkingField);

      } else {
        setSelectedExperienceLevel(resumeBasicInfo.resumeExperienceLevel);
        setSelectedWorkingField(resumeBasicInfo.resumeWorkingField);

      }


    }
  },[resumeBasicInfo])

  const [selectedJDTemplateOption, setSelectedJDTemplateOption] = useState({docID:"0", _id:"Select a Job Description Template"});

  useEffect(()=>{

    if (selectedJDTemplateOption){
      const selectedJDTemplateOptionId = selectedJDTemplateOption.docID;
      if (selectedJDTemplateOptionId === "0"){

        return;
      } else {
        handleJobDescriptionChange(selectedJDTemplateOption.documents[0].postBodyJDInfoExtract.futureJobDescription)
        jobDescriptionTemplateNameRef.current.value = selectedJDTemplateOption.documents[0].jdTemplateName;
        jobDescriptionRef.current.value = selectedJDTemplateOption.documents[0].postBodyJDInfoExtract.futureJobDescription;
        setJobDescriptionExtract(selectedJDTemplateOption.documents[0] && selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent ? selectedJDTemplateOption.documents[0].JDInfoExtractMessageContent : "");

      }

    }

  },[selectedJDTemplateOption])
  // console.log(jobDescriptionList)
  // console.log(selectedTemplateOption)



  const [jobDescriptionTokenCount, setJobDescriptionTokenCount] = useState(0);
  const handleJobDescriptionChange = (value) => {
    estimateTokenCount(value, 1).then((result) => {
        setJobDescriptionTokenCount(result);
    });
  }

  const [queryFieldTargetIndustry, setQueryFieldTargetIndustry] = useState('')
  const [selectedWorkingField, setSelectedWorkingField] = useState("")
  const fieldorDomains = fieldOrDomains;
  const filteredFieldForTargetIndustry =
      queryFieldTargetIndustry === ''
          ? fieldorDomains
          : fieldorDomains.filter((field) => {
            return field.name.toLowerCase().includes(queryFieldTargetIndustry.toLowerCase())
          })


  const [queryExperienceLevel, setQueryExperienceLevel] = useState('')
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState({id:0, name:"Please Select Experience Level"})
  const experienceLevel = experienceLevels;
  const filteredExperienceLevel =
      queryExperienceLevel === ''
          ? experienceLevel
          : experienceLevel.filter((experienceLevel) => {
            return experienceLevel.name.toLowerCase().includes(queryExperienceLevel.toLowerCase())
          })

  const [targetResumeToggle, setTargetResumeToggle] = useState(resumeBasicInfo && resumeBasicInfo.aiTargetResume ? resumeBasicInfo.aiTargetResume : true);
  const [queryJobDescriptionTemplate, setQueryJobDescriptionTemplate] = useState('')
  const jobDescriptionListItem = jobDescriptionList;
  const filteredJDList =
      queryJobDescriptionTemplate === ''
          ? jobDescriptionListItem
          : jobDescriptionListItem.filter((jdList) => {
            return jdList._id.toLowerCase().includes(queryJobDescriptionTemplate.toLowerCase())
          })

  const handleNextBtn = async (e) => {
    //e.preventDefault();

    if (!user){
      openOverlay();
      return;
    }

    let resumeBasicOriginalData = {};
    if (targetResumeToggle){
      //AI target resume process
      setFieldValidationCSS({...fieldValidationCSS,
      //  resumeTemplateName:resumeTemplateNameRef.current.value === "" ? "border-red-500 border-1" : "border-0",
        resumeWorkingField:selectedWorkingField.id === 0 ? "border-red-500 border-1" : "border-0",
        resumeExperienceLevel:selectedExperienceLevel.id === 0 ? "border-red-500 border-1" : "border-0",
        jobDescriptionTemplateName:jobDescriptionTemplateNameRef.current.value === "" ? "border-red-500 border-1" : "border-0",
        jobDescription:jobDescriptionRef.current.value === "" ? "border-red-500 border-1" : "border-0",
      });
      resumeBasicOriginalData = {
        aiTargetResume:targetResumeToggle,
      //  resumeTemplateName:resumeTemplateNameRef.current.value ? resumeTemplateNameRef.current.value : "",
        resumeWorkingField:selectedWorkingField,
        resumeExperienceLevel:selectedExperienceLevel,
        selectedJDTemplateOption:selectedJDTemplateOption,
        jobDescriptionTemplateNameRef:jobDescriptionTemplateNameRef && jobDescriptionTemplateNameRef.current.value ? jobDescriptionTemplateNameRef.current.value : "",
        futureJobDescription:jobDescriptionRef.current.value ? jobDescriptionRef.current.value : "",
        JDInfoExtractMessageContent:jobDescriptionExtract,
      }

      if (resumeBasicOriginalData.jobDescriptionTemplateNameRef === "" ||
          resumeBasicOriginalData.futureJobDescription === "" ||
          resumeBasicOriginalData.resumeTemplateName === "" ||
          resumeBasicOriginalData.resumeWorkingField.id === 0 ||
          resumeBasicOriginalData.resumeExperienceLevel.id === 0){
        return toast.error("Please complete all required fields")
      }


    } else {
      // traditional resume process
      setFieldValidationCSS({...fieldValidationCSS,
      //  resumeTemplateName:resumeTemplateNameRef.current.value === "" ? "border-red-500 border-1" : "border-0",
        resumeWorkingField:selectedWorkingField === "" ? "border-red-500 border-1" : "border-0",
        resumeExperienceLevel:selectedExperienceLevel.id === 0 ? "border-red-500 border-1" : "border-0",
        jobTitle:jobTitleRef.current.value === "" ? "border-red-500 border-1" : "border-0",
        companyName: companyNameRef.current.value === "" ? "border-red-500 border-1" : "border-0",
      })
      resumeBasicOriginalData = {
        aiTargetResume:targetResumeToggle,
        jobTitle:jobTitleRef.current.value,
        companyName:companyNameRef.current.value,
        resumeWorkingField:selectedWorkingField,
        resumeExperienceLevel:selectedExperienceLevel,
    }
   // console.log(resumeBasicOriginalData)
      if (resumeBasicOriginalData.resumeTemplateName === "" ||
          resumeBasicOriginalData.resumeWorkingField === "" ||
          resumeBasicOriginalData.resumeExperienceLevel.id === 0 ||
          resumeBasicOriginalData.jobTitle === "" ||
          resumeBasicOriginalData.companyName === ""){
        return toast.error("Please complete all required fields")
      }

    }



    // console.log( "resumeBasicOriginalData", resumeBasicOriginalData);
    jobDescriptionClick(resumeBasicOriginalData);
    resumeProgressSelect(createResumeSteps[1]);
    // if (targetResumeToggle){
    //   resumeProgressSelect(createResumeSteps[1]);
    // } else {
    //   resumeProgressSelect(createResumeSteps[3]);
    // }


  }

  const [fieldValidationCSS, setFieldValidationCSS] = useState({
    resumeTemplateName: "border-0",
    jobDescriptionTemplateName: "border-0",
    jobDescription: "border-0",
    resumeWorkingField: "border-0",
    resumeExperienceLevel: "border-0",
    jobTitle: "border-0",
    companyName: "border-0",

  });


  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">
        <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 pt-4 pb-4">

        <form
            className=""
        >
        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">

        <div className="mt-2">
          <Combobox as="div" value={selectedWorkingField} onChange={setSelectedWorkingField}>
            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Targeted Industry *</Combobox.Label>
            <div className="relative mt-2">
              <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <Combobox.Input
                  id="workFieldInput"
                  readOnly={false}
                  autoComplete="off"
                  className={`${fieldValidationCSS.resumeWorkingField} cursor-default w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  onChange={(event) => setQueryFieldTargetIndustry(event.target.value)}
                  onFocus={() => setQueryFieldTargetIndustry('')}
                  displayValue={(field) => field?.name}
              />
              </Combobox.Button>
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>

              {filteredFieldForTargetIndustry.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredFieldForTargetIndustry.map((level) => (
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
          </div>
          <div className="mt-2">
          <Combobox as="div" value={selectedExperienceLevel} onChange={setSelectedExperienceLevel}>
            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Experience Level *</Combobox.Label>
            <div className="relative mt-2">
              <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">

              <Combobox.Input
                  id="workExperienceLevelInput"
                  readOnly
                  className={`${fieldValidationCSS.resumeExperienceLevel} cursor-default w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  onChange={(event) => setQueryExperienceLevel(event.target.value)}
                  displayValue={(person) => person?.name}
              />
              </Combobox.Button>
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
          </div>
          {!targetResumeToggle && (
              <>
                <div className="mt-2">
                  <label htmlFor="jobTitle" className="block text-sm font-medium leading-6 text-gray-900">
                    Job Title *
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="jobTitle"
                        id="jobTitle"
                        ref={jobTitleRef}
                        className={`${fieldValidationCSS.jobTitle} p-2 block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        placeholder="Project Manager / Software Engineer / Data Analyst / etc."
                        aria-describedby="jobTitle"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">
                    Company Name *
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        ref={companyNameRef}
                        className={`${fieldValidationCSS.companyName} p-2 block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        placeholder="Bank of America / Google / Salesforce / IBM / etc."
                        aria-describedby="companyName"
                    />
                  </div>
                </div>

              </>

            )}

          <div className="mt-3 p-2">
            <label className="inline-flex items-center cursor-pointer">
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-3">AI Target Resume</span>
              <input type="checkbox" checked={targetResumeToggle} className="sr-only peer"
                     onChange={(e) => {
                       setTargetResumeToggle(e.target.checked);
                     }}
              />
              <div
                  className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            {!targetResumeToggle && (
                <blockquote
                    id="target_resume_blockquote"
                    className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                  <p className="text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">"A targeted resume, meticulously tailored for a specific job opening, significantly boosts your chances of securing an interview. Our system employs keyword matching to ensure your resume aligns with the job's requirements, effectively passing Automated Tracking System (ATS) scans. By demonstrating your relevant experience with precision, you stand out as a highly suitable candidate."</p>
                </blockquote>
            )}


          </div>
          {targetResumeToggle && (
              <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">

                <div className="mt-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                  <div>
                    <div className="mt-2">
                      <Combobox as="div" value={selectedJDTemplateOption} onChange={setSelectedJDTemplateOption}>
                        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Saved Job Description List</Combobox.Label>
                        <div className="relative mt-2">
                          <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">

                          <Combobox.Input
                              id="workFieldInput"
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

                          {filteredJDList && filteredJDList.length > 0 && (
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


                    </div>
                    <div className="mt-2">
                      <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                        Job Description Template Name
                      </label>
                      <div className="mt-2">
                        <input
                            type="text"
                            name="jdTemplateName"
                            id="jdTemplateName"
                            ref={jobDescriptionTemplateNameRef}
                            className={`${fieldValidationCSS.jobDescriptionTemplateName} p-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                            placeholder="Ex: Job Description for Software Engineer	- 1"
                            aria-describedby="jd-description"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1  lg:gap-8">
                    <div className="">
                      {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                      {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                      <fieldset className="mt-2">


                        <div className="space-y-2 sm:block  w-full h-auto">

                          <div className="mt-2">

                            {/*Future Job Info*/}

                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              PASTE YOUR JOB DESCRIPTION
                            </label>

                            <div className="p-2 mb-3 border-b-2 ">
                              <div>
                                <h2 className="sr-only">Job description</h2>
                                <label htmlFor="jobDescirption" className="block text-sm font-medium leading-6 text-gray-900">
                                  To start, copy and paste the job description you want to use to rewrite your resume.
                                  Don't have a job in mind yet? Try using a job description from a job board like Indeed or LinkedIn.
                                </label>
                                <div className="mt-2">
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


                </div>


              </div>
          )}

          <div className="mt-8 lg:col-span-12">
               <div
                    onClick={handleNextBtn}
                    className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                >

                  Next
                </div>

          </div>

        </div>
        </form>
    </div>
      </div>
  )
}
export default JobTemplateBasic;
