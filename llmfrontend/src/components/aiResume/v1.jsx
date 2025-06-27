import {useContext, useEffect, useRef, useState} from 'react'
import { toast } from "react-toastify";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import {useSelector} from "react-redux";
import { professionalExperienceRewriteApi } from "../../helpers/helperApis/professionalExperienceRewrite";
import { rewriteMyResumeApi } from "../../helpers/helperApis/rewriteMyResume";
import { searchResumesApi } from "../../helpers/helperApis/searchResumes";
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const V1 = () => {

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);

  const [resumeResult, setResumeResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [ resumeObjectId, setResumeObjectId] = useState(false);

  console.log("resumeResult", resumeResult);
  console.log("resumeObjectId", resumeObjectId);

  const jobDescriptionRef = useRef("");
  const overviewRef = useRef("");
  const qualificationsAndSkillsRef = useRef("");
  const futureJobCompanyNameRef = useRef("");
  const futureJobPositionRef = useRef("");
  const futureJobImportantHighlightRef = useRef("");
  const resumeTemplateNameRef = useRef("");

  const [professionalExperienceFields, setProfessionalExperienceFields] = useState([{
    companyName: '',
    professionalExperienceTitle: '',
    ProfessionalExperienceDescription: '',
    jobStartDate: '',
    jobEndDate: '',
    jobLocation: '',
    jobLocationType: '',
    currentlyWorkingHere: false,

}]);
  const [educationFields, setEducationFields] = useState([{
    degree: '',
    school: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    activitiesAndSocieties: '',
    description: '',}]);

  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
  const [jDInfoExtractMessageContent,setJDInfoExtractMessageContent] = useState(null);
  const [templateList, setTemplateList] = useState([]);


  useEffect(()=>{

    async function loadUserTemplate(){
      try {
        const searchResumeResp = await searchResumesApi({
          userId: user.userId ,
        })

        setTemplateList(searchResumeResp.userTemplates);
        if (!searchResumeResp) {
          return toast.error("User template loading error ...")
        }
      } catch (error) {
        console.log(error)

        toast.error("User template loading error .. ")

      }
    }
    if (user && user.userId){
      loadUserTemplate().then(r => console.log("loadUserTemplate", r))

    }
  },[user]);


  useEffect(() => {

    if (resumeResult &&  resumeResult.overviewRewriteMessageContent && resumeResult.overviewRewriteMessageContent.overviewRewrite){
      // toast.success(resumeResult.overviewRewriteMessageContent.overviewRewrite);
      console.log(jDInfoExtractMessageContent);
      async function professionalExperienceRewrite(){
        try {
          const apiData = await professionalExperienceRewriteApi(
            {
              userId: user.userId ,
              objectId: resumeObjectId,
              jDInfoExtractMessageContent: jDInfoExtractMessageContent,
              professionalExperiences: professionalExperienceFields,

            }
          );

          // setTemplateList(result.userTemplates);
          setResumeResult((resumeResult) => ({
            ...resumeResult,
            professionalExperienceRewrite: apiData.professionalExperienceMessageContent,
          }));

          if (!apiData) {
            return toast.error("Professional experience rewrite  error ...")
          }
        } catch (error) {
          console.log(error)
          toast.error("Professional experience rewrite error .. ")

        }
      }
      if (user && user.userId && resumeObjectId && professionalExperienceFields && resumeResult && resumeResult.overviewRewriteMessageContent && resumeResult.overviewRewriteMessageContent.overviewRewrite && !resumeResult.professionalExperienceRewrite){
        professionalExperienceRewrite();

      }
    }
  },[resumeResult])


  const [selectedTemplateOption, setSelectedTemplateOption] = useState('');

  const handleSelectTemplateChange = (event) => {
    const selectedTemplateOptionId = event.target.value;
    if (selectedTemplateOptionId === "0"){
      setSelectedTemplateOption("");
      return;
    } else {
      const selectedTemplateOptionData = templateList.filter((item) => item.docID === selectedTemplateOptionId);
      const selectedTemplateData = selectedTemplateOptionData[0].documents[0].postData;
        console.log("selectedTemplateData", selectedTemplateData);
        resumeTemplateNameRef.current.value = selectedTemplateData.resumeTemplateName;
        // futureJobCompanyNameRef.current.value = selectedTemplateData.futureJobCompanyNameRef;
        // futureJobPositionRef.current.value = selectedTemplateData.futureJobPositionRef;
        futureJobImportantHighlightRef.current.value = selectedTemplateData.futureJobImportantHighlightRef;
        jobDescriptionRef.current.value = selectedTemplateData.futureJobDescription;
        overviewRef.current.value = selectedTemplateData.overview;
        qualificationsAndSkillsRef.current.value = selectedTemplateData.qualificationsAndSkills;
        setProfessionalExperienceFields(selectedTemplateData.professionalExperiences);
        setEducationFields(selectedTemplateData.education);
        setSelectedTemplateOption(event.target.value);
    }

  };
  // console.log(templateList)
  // console.log(selectedTemplateOption)
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!user){
      openOverlay();
      return;
    }

    const resumeSubmitOriginalData = {
        futureJobDescription:jobDescriptionRef.current.value,
        futureJobCompanyNameRef:futureJobCompanyNameRef.current.value,
        futureJobPositionRef:futureJobPositionRef.current.value,
        futureJobImportantHighlightRef:futureJobImportantHighlightRef.current.value,
        resumeTemplateName:resumeTemplateNameRef.current.value,
        overview:overviewRef.current.value,
        qualificationsAndSkills:qualificationsAndSkillsRef.current.value,
        professionalExperiences:professionalExperienceFields,
        education:educationFields,

    }

    console.log( "resumeOriginal", resumeSubmitOriginalData);
    try {

      setGenerating(true);
      setResumeResult(null);
      setJDInfoExtractMessageContent(null);

      const resumeRewriteResp = await rewriteMyResumeApi(
        {
          userId: user && user.userId ? user.userId : "0",
          data : resumeSubmitOriginalData,
        }
      );

      if (!resumeRewriteResp) {
        setGenerating(false);
        setResumeResult(null);
        setJDInfoExtractMessageContent(null);

        return toast.error("Error . Please try again later.")
      }

      setResumeResult(resumeRewriteResp);
      setJDInfoExtractMessageContent(resumeRewriteResp.jdInfoExtractMessageContent);
      setResumeObjectId(resumeRewriteResp.lastInsertedId.insertedId)
      setGenerating(false);

    } catch (error) {
      console.log(error)
      setJDInfoExtractMessageContent(null);
      setGenerating(false);
      setResumeResult(null);

      toast.error("Error .. Please try again later.")

    }
  }


  const scrollContainerRef = useRef(null);
  useEffect(() => {
    // Update the scrollRef when the content changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);



  const handleScroll = (event) => {
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth;
    const containerWidth = scrollContainer.clientWidth;

    if (scrollContainer.scrollLeft === 0) {
      scrollContainer.scrollLeft = scrollWidth;
    } else if (scrollContainer.scrollLeft === scrollWidth - containerWidth) {
      scrollContainer.scrollLeft = 0;
    }
  };

  function handleJobExperienceChange(i, event) {
    const values = [...professionalExperienceFields];
    values[i][event.target.name] = event.target.value;
    setProfessionalExperienceFields(values);
  }
  function handleJobExperienceAdd() {
    const values = [...professionalExperienceFields];
    values.push({
      companyName: '',
      professionalExperienceTitle: '',
      ProfessionalExperienceDescription: '',
      jobStartDate: '',
      jobEndDate: '',
      jobLocation: '',
      jobLocationType: '',
      currentlyWorkingHere: false, });
    setProfessionalExperienceFields(values);
  }
  function handleJobExperienceRemove(i) {
    const values = [...professionalExperienceFields];
    if(values.length > 1) {
      values.splice(i, 1);
      setProfessionalExperienceFields(values);
    }
  }

  function handleEducationChange(i, event) {

    const values = [...educationFields];
    values[i][event.target.name] = event.target.value;
    setEducationFields(values);
  }
  function handleEducationAdd() {
    const values = [...educationFields];
    values.push({
      degree: '',
      school: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      activitiesAndSocieties: '',
      description: '', });
    setEducationFields(values);
  }
  function handleEducationRemove(i) {
    const values = [...educationFields];
    if(values.length > 1) {
      values.splice(i, 1);
      setEducationFields(values);
    }
  }

  const handleWordDownload = async (e) => {
    // Read the Word document template
    const response = await fetch(process.env.SITE_URL +'/templates/ResumeTemplate2pages.docx');
    const template = await response.arrayBuffer();

    // Create a new instance of the Docxtemplater library
    const doc = new Docxtemplater();

    // Load the template using PizZip
    const zip = new PizZip(template);
    doc.loadZip(zip);

    // Set the template data
    const data = {
      "firstName": user.firstName,
      "lastName": user.lastName,
      "email": user.email,
      "phoneNo":user.phoneNumber? user.phoneNumber : "123-123-1234",
      "city":user.city? user.city : "My Location",
      "overviewRewriteTitle":resumeResult.overviewRewriteMessageContent.overviewRewriteTitle,
      "overviewRewrite":resumeResult.overviewRewriteMessageContent.overviewRewrite,
      "professionalExperience": resumeResult.professionalExperienceRewrite,
      "education": educationFields,

    };
    doc.setData(data);

    // Render the document
    doc.render();

    // Generate the Word document
    const generatedDoc = doc.getZip().generate({ type: 'blob' });
    // Trigger the file download
    saveAs(generatedDoc, resumeResult.jdInfoExtractMessageContent.jobTitle+"_"+resumeResult.jdInfoExtractMessageContent.companyName+'.docx');
  }
  return (
    <div className="bg-white">

      <div className="pb-10 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center">AI Resume Revolution: Refining and Rewriting your Future</h1>

        </div>


        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">


            <div className="mt-8 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <div>
                <div>
                  <label htmlFor="resumeTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                    Templates
                  </label>
                  <select value={selectedTemplateOption} onChange={handleSelectTemplateChange}>
                    {templateList.length === 0 ? <option value="0">No Templates Found</option> : <option value="0">Select a Template</option>}
                    {templateList.length > 0 && templateList.map((template, index) => {

                      return (
                            <option key={index+"template_sel"} value={template.docID}>{template._id}</option>
                      );
                    })
                    }
                  </select>
                </div>
                <div>
                  <label htmlFor="resumeTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                    Template Name
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="resumeTemplateName"
                        id="resumeTemplateName"
                        ref={resumeTemplateNameRef}
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Ex: Template for Software Engineer	 - 1"
                        aria-describedby="email-description"
                    />
                  </div>
                </div>

              </div>
              <h2 className="sr-only">Details for your resume</h2>
              <div className="grid grid-cols-1  lg:gap-8">
                <div className="">
                  {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                  {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                  <fieldset className="mt-2">


                    <div className="space-y-2 sm:block  w-full h-auto">

                      <div className="mt-2">

                        {/*Future Job Info*/}

                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          My Next Job
                        </label>

                        <legend className="sr-only">My Next Job</legend>
                        <div className="p-2 mb-3 border-b-2 ">
                        <div>
                          <legend className="sr-only">Job description/</legend>
                          <label htmlFor="jobDescirption" className="block text-sm font-medium leading-6 text-gray-900">
                            Job description
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={4}
                                name="jobDescirption"
                                id="jobDescirption"
                                ref={jobDescriptionRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                            />
                          </div>

                          {/*<label htmlFor="futureJobCompanyName" className="block text-sm font-medium leading-6 text-gray-900">*/}
                          {/*  Company Name*/}
                          {/*</label>*/}
                          {/*<div className="mt-2">*/}
                          {/*  <input*/}
                          {/*      type="text"*/}
                          {/*      name="futureJobCompanyName"*/}
                          {/*      id="futureJobCompanyName"*/}
                          {/*      ref={futureJobCompanyNameRef}*/}
                          {/*      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                          {/*      placeholder="EX: Microsoft	"*/}
                          {/*      aria-describedby="email-description"*/}
                          {/*  />*/}
                          {/*</div>*/}
                          {/*<div>*/}
                          {/*  <label htmlFor="futureJobPosition" className="block text-sm font-medium leading-6 text-gray-900">*/}
                          {/*    Position*/}
                          {/*  </label>*/}
                          {/*  <div className="mt-2">*/}
                          {/*    <input*/}
                          {/*        type="text"*/}
                          {/*        name="futureJobPosition"*/}
                          {/*        id="futureJobPosition"*/}
                          {/*        ref={futureJobPositionRef}*/}
                          {/*        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                          {/*        placeholder="Ex: Sr. Business Program Manager	"*/}
                          {/*        aria-describedby="email-description"*/}
                          {/*    />*/}
                          {/*  </div>*/}

                          {/*</div>*/}
                          <label htmlFor="futureJobImportantHighlightRef" className="block text-sm font-medium leading-6 text-gray-900">
                            Important Highlights
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={2}
                                name="futureJobImportantHighlightRef"
                                id="futureJobImportantHighlightRef"
                                ref={futureJobImportantHighlightRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Ex:  Lead a team of 5 PMs to drive the development of the next generation of Microsoft Surface devices.	"
                            />
                          </div>
                        </div>
                        </div>

                        {/*Current Resume*/}
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          My Current Resume
                        </label>
                        <legend className="sr-only">My Current Resume</legend>


                        <div className="p-2 mb-3 border-b-2 ">
                        <div>

                          <label htmlFor="overview" className="block text-sm font-medium leading-6 text-gray-900">
                            Overview
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={4}
                                name="overview"
                                id="overview"
                                ref={overviewRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Multi PMI Certified Agile Hybrid PMO Project Professional with 13+ years of success driving complex projects. A servant leader and change agent that excels at engaging diverse stakeholders, including C-level executives, and delivers exceptional outcomes. Led transformative initiatives at Microsoft, enabling client-facing employees to deliver value-centric solutions. Skilled in cross-functional collaboration with the ability to navigate ambiguity to ensure on-time delivery.  "
                            />
                          </div>

                        </div>

                        <div>
                          <legend className="sr-only">Qualifications and Skills</legend>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Qualifications and Skills
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={4}
                                name="must_have_ingrediants"
                                id="must_have_ingrediants"
                                ref={qualificationsAndSkillsRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Change Management: Driving Changes		 "
                            />
                          </div>

                        </div>

                        <div>
                        <legend className="sr-only">Professional Experience</legend>
                          <h2 className="mt-2 ">
                            Professional Experience
                          </h2>
                        <div className="space-y-2 sm:block  w-full h-auto">

                          <div className="mt-2">

                            <div>
                              {professionalExperienceFields.map((field, idx) => (
                                  <div key={`${field}-${idx}`}>
                                    <div className="mt-2 ">
                                      Job Experience {idx + 1}
                                    </div>
                                    <div className="p-4 border-b-2 border-gray-100 border-solid">
                                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Job Title
                                      </label>
                                      <div className="mt-2">
                                        <input
                                            type="text"
                                            name="professionalExperienceTitle"
                                            id="professionalExperienceTitle"
                                            value={field.professionalExperienceTitle}
                                            onChange={e => handleJobExperienceChange(idx, e)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Sr. Business Program Manager (PMO), Microsoft	"
                                            aria-describedby="email-description"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor="professionalExperienceDescription" className="block text-sm font-medium leading-6 text-gray-900">
                                          Work / Achievement Details
                                        </label>
                                        <div className="mt-2">
                                        <textarea
                                            rows={4}
                                            name="professionalExperienceDescription"
                                            id="professionalExperienceDescription"
                                            value={field.professionalExperienceDescription}
                                            onChange={e => handleJobExperienceChange(idx, e)}
                                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Empowered 10,000+ client-facing employees to deliver user-centric solutions through innovative engagement strategies as leader of Microsoft's Customer Engagement Methodology. "
                                        />
                                        </div>

                                      </div>
                                      <div className=" ">

                                        <div  className="grid grid-cols-6  lg:gap-8">
                                          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                            Start Date
                                          </label>
                                          <input
                                              type="month"
                                              name="jobStartDate"
                                              min="1970-01"
                                              placeholder="Start Date"
                                              value={field.jobStartDate}
                                              onChange={e => handleJobExperienceChange(idx, e)}
                                          />
                                        </div>
                                        <div  className="grid grid-cols-6  lg:gap-8">
                                          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                            End Date
                                          </label>
                                          <input
                                              type="month"
                                              name="jobEndDate"
                                              min="1970-01"
                                              placeholder="End Date"
                                              value={field.jobEndDate}
                                              onChange={e => handleJobExperienceChange(idx, e)}/>
                                        </div>
                                      </div>
                                      {
                                        idx === 0 ? ( <div></div>) : (
                                            <button type="button" onClick={() => handleJobExperienceRemove(idx)}>Remove</button>
                                        )
                                      }
                                    </div>



                                  </div>
                              ))}
                              <button type="button" onClick={() => handleJobExperienceAdd()}>Add More Experience</button>


                            </div>
                            <div>



                            </div>



                          </div>

                        </div>
                        </div>
                        <div>
                          <legend className="sr-only">Education</legend>
                          <h2 className="mt-2 ">
                            Educations
                          </h2>
                          <div className="space-y-2 sm:block  w-full h-auto">
                            {educationFields.map((field, idx) => (
                                <div key={`${field}-${idx}`}>
                                  <div className="mt-2 ">
                                    Education {idx + 1}
                                  </div>
                                  <div className="p-4 border-b-2 border-gray-100 border-solid">
                                  <div>
                                    <label htmlFor="school" className="block text-sm font-medium leading-6 text-gray-900">
                                      School
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name="school"
                                          id="school"
                                          value={field.school}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: University of Texas at Austin"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label htmlFor="degree" className="block text-sm font-medium leading-6 text-gray-900">
                                      Degree
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name="degree"
                                          id="degree"
                                          value={field.degree}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: Bachelor’s"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium leading-6 text-gray-900">
                                      Field Of Study
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name="fieldOfStudy"
                                          id="fieldOfStudy"
                                          value={field.fieldOfStudy}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: Computer Science	"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                    <div className=" ">

                                      <div  className="grid grid-cols-6  lg:gap-8">
                                        <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">
                                          Start Date
                                        </label>
                                        <input
                                            type="month"
                                            name="startDate"
                                            min="1970-01"
                                            placeholder="Start Date"
                                            value={field.startDate}
                                            onChange={e => handleEducationChange(idx, e)}
                                        />
                                      </div>
                                      <div  className="grid grid-cols-6  lg:gap-8">
                                        <label htmlFor="endDate" className="block text-sm font-medium leading-6 text-gray-900">
                                          End Date
                                        </label>
                                        <input
                                            type="month"
                                            name="endDate"
                                            min="1970-01"
                                            placeholder="End Date"
                                            value={field.endDate}
                                            onChange={e => handleEducationChange(idx, e)}/>
                                      </div>
                                    </div>


                                  </div>
                                  {
                                    idx === 0 ? ( <div></div>) : (
                                        <button type="button" onClick={() => handleEducationRemove(idx)}>Remove</button>
                                    )
                                  }
                                  </div>
                                </div>
                            ))}

                            <button type="button" onClick={() => handleEducationAdd()}>Add More Education</button>

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
                Generating Resume...
                </div>) : (
                  <div
                    onClick={handleGenerate}
                    className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >

                    ReWrite My Resume
                    </div>
                )}







            </div>
          </div>
          <div className="mt-10 p-4">
            {/* <h2 className="text-sm font-medium text-gray-900">Recipe</h2> */}

            {!generating && resumeResult && (

                <div

                    className="prose prose-sm mt-4 text-gray-500"

                >
                  <h2 className="mt-3 "> Revised Resume {resumeResult && resumeResult.jdInfoExtractMessageContent && resumeResult.jdInfoExtractMessageContent.jobTitle && " for "+resumeResult.jdInfoExtractMessageContent.jobTitle} {resumeResult && resumeResult.jdInfoExtractMessageContent && resumeResult.jdInfoExtractMessageContent.companyName && " / "+resumeResult.jdInfoExtractMessageContent.companyName}</h2>
                  <div className="flex flex-col">
                    <div>
                      <h2 className="mt-3 p-2">{resumeResult.overviewRewriteMessageContent.overviewRewriteTitle}</h2>
                      <div className="mt-1 p-2">{resumeResult.overviewRewriteMessageContent.overviewRewrite}</div>
                    </div>
                    <div>
                      <ul role="list" className="list-disc list-inside">
                        {resumeResult && resumeResult.professionalExperienceRewrite && resumeResult.professionalExperienceRewrite.map((professionalExperience, i) => {


                          return (
                              // <p key={"tool-" + i}>{tool} </p>
                              <div key={"professionalExperience-" + i} className="indent-8">
                                <div>
                                    <h2 className="mt-3 p-2">{professionalExperience.professionalExperienceTitle} {professionalExperience.companyName}</h2>
                                </div>
                                <div>
                                  {professionalExperience.professionalExperienceDescription ?  professionalExperience.professionalExperienceDescription : ""}
                                  {professionalExperience.ProfessionalExperienceDescription ?  professionalExperience.ProfessionalExperienceDescription : ""}
                                </div>

                              </div>

                          )
                        })}
                      </ul>
                    </div>

                  </div>
                  <div
                      className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                      onClick={handleWordDownload}
                  >
                    Download This Resume in Word Format
                  </div>
                  {/*<div>*/}
                  {/*  Download Resume in PDF Format*/}
                  {/*</div>*/}
                </div>

            )}

          </div>

        </div>
      </div>
    </div>
  )
}
export default V1;
