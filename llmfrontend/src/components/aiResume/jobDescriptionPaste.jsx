import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
import { toast } from "react-toastify";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import { estimateTokenCount } from "../../utils/openAi";
import {Combobox, Menu, Transition} from '@headlessui/react'
import {CheckIcon, ChevronDownIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import fieldOrDomains from "../../utils/staticObjects/fieldOrDomains";
import experienceLevels from "../../utils/staticObjects/experienceLevels";
import {useSelector} from "react-redux";
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const JobDescriptionPaste = ({jobDescription, jobDescriptionClick,resumeProgressSelect}) => {

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);
  const [generating, setGenerating] = useState(false);
  const jobDescriptionRef = useRef("");
  const jobDescriptionTemplateNameRef = useRef("");
  const [jobDescriptionExtract, setJobDescriptionExtract] = useState("");

  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
  const [templateList, setTemplateList] = useState([]);

  // console.log("templateList", templateList);

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
        console.log(error)

        toast.error("User template loading error .. ")

      }
    }
    if (user && user.userId){
      loadUserTemplate().then((r) => {
        // console.log("loadUserTemplate", r)
      })

    }
  },[user]);

  useEffect(() => {

    if (jobDescription){
      jobDescriptionRef.current.value = jobDescription;
      estimateTokenCount(jobDescription, 1.0).then((result) => {
        setJobDescriptionTokenCount(result);
      });

    }
  },[jobDescription])



  const [selectedTemplateOption, setSelectedTemplateOption] = useState('');

  const handleSelectTemplateChange = (event,docId, name) => {

    const selectedTemplateOptionId = docId;
    if (selectedTemplateOptionId === "0"){
      setSelectedTemplateOption("");
      return;
    } else {
      const selectedTemplateOptionData = templateList.filter((item) => item.docID === selectedTemplateOptionId);
      const selectedTemplateData = selectedTemplateOptionData[0];
      setSelectedTemplateOption(name);
      estimateTokenCount(selectedTemplateData.documents[0].postBodyJDInfoExtract.futureJobDescription, 1.0).then((result) => {
        setJobDescriptionTokenCount(result);
      });
      jobDescriptionTemplateNameRef.current.value = selectedTemplateData.documents[0].jdTemplateName;
      jobDescriptionRef.current.value = selectedTemplateData.documents[0].postBodyJDInfoExtract.futureJobDescription;
      setJobDescriptionExtract(selectedTemplateData.documents[0] && selectedTemplateData.documents[0].JDInfoExtractMessageContent ? selectedTemplateData.documents[0].JDInfoExtractMessageContent : "");


    }

  };
  // console.log(templateList)
  // console.log(selectedTemplateOption)
  const handleExtract = async (e) => {
    e.preventDefault();

    if (!user){
      openOverlay();
      return;
    }


    const jdExtractorSubmitOriginalData = {
      selectedTemplateOption:selectedTemplateOption,
      jobDescriptionTemplateNameRef:jobDescriptionTemplateNameRef && jobDescriptionTemplateNameRef.current.value ? jobDescriptionTemplateNameRef.current.value : "",
      futureJobDescription:jobDescriptionRef.current.value,
      JDInfoExtractMessageContent:jobDescriptionExtract,
    }

    if (jdExtractorSubmitOriginalData.jobDescriptionTemplateNameRef === ""){
      return toast.error("Please enter a template name")
    }
    if (jdExtractorSubmitOriginalData.futureJobDescription === ""){
      return toast.error("Please copy and paste a job description")
    }
    // console.log( "jdExtractorSubmitOriginalData", jdExtractorSubmitOriginalData);
    jobDescriptionClick(jdExtractorSubmitOriginalData);

    resumeProgressSelect("resumeCreate");

  }


  const [jobDescriptionTokenCount, setJobDescriptionTokenCount] = useState(0);
  const handleJobDescriptionChange = (event) => {
    estimateTokenCount(event.target.value, 1).then((result) => {
        setJobDescriptionTokenCount(result);
    });

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
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">

      <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 pt-4 pb-4">


        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">

          <div className="mt-2">
            <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
              Resume Template Name
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
          <div className="mt-2">
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
          </div>
          <div className="mt-2">
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
          </div>
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">




            <div className="mt-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <div>
                <div className="mt-2">
                  <label htmlFor="jdTemplateSelect" className="block text-sm font-medium leading-6 text-gray-900">
                    Saved Job Description List
                  </label>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {selectedTemplateOption ? selectedTemplateOption : "Select a saved JD" }
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
                      <Menu.Items className="absolute  z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {templateList.length > 0 && templateList.map((template, index) => {
                              return (
                                  <Menu.Item key={"saved_jd_dropdown_"+index}>
                                    {({ active }) => (
                                        <div
                                            onClick={(e) => handleSelectTemplateChange(e, template.docID, template._id)}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                          {template._id}
                                        </div>
                                    )}
                                  </Menu.Item>
                              );
                            })
                            }
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>


                </div>
                <div>
                  <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                    Job Description Template Name
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
                          <h2 className="sr-only">Job description/</h2>
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
                                onChange={(e)=>{ handleJobDescriptionChange(e)}}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

            <div className="mt-8 lg:col-span-12">
              {generating ? (<div
                className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                Next...
                </div>) : (
                  <div
                    onClick={handleExtract}
                    className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                  >

                    Next
                    </div>
                )}







            </div>
          </div>


        </div>

    </div>
      </div>
  )
}
export default JobDescriptionPaste;
