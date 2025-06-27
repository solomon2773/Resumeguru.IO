import React, {useContext, useEffect, useRef, useState} from 'react'
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import { Modal, Spinner } from "flowbite-react";
// import {convertTimestampToLocalTimeWithoutSpace, parseLinkedinExperienceDateRange} from "../../utils/timeConvert";
//Certifications
import CertificationBlock from "./certificationBlock";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import createResumeSteps from "../../utils/staticObjects/dashboard/createResumeSteps";
import {Combobox} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import { getResumeTemplateListByUserId, getResumeTemplateByUserIdandDocID} from "../../helpers/mongodb/pages/api/resume";
import {useSelector} from "react-redux";



const StartFromScratch = ({resumeBasicInfo, resumeData, resumeProgressSelect, linkedInUploadStatus, resumeDetailData}) => {

  //   console.log(resumeDetailData)
  // console.log(linkedInUploadStatus)
    // console.log(resumeProgressSelect)
  // const router = useRouter()
  const { } = useAuth()
  const user = useSelector(state => state.user.profile);
  const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)




  const [generating, setGenerating] = useState(false);
  //const [ resumeObjectId, setResumeObjectId] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //console.log("resumeObjectId", resumeObjectId);

  // const jobDescriptionRef = useRef("");
  const overviewRef = useRef("");
  const skillsRef = useRef("");
  // const qualificationsAndCertificationsRef = useRef("");
  // const futureJobCompanyNameRef = useRef("");
  // const futureJobPositionRef = useRef("");
  // const futureJobImportantHighlightRef = useRef("");
  const resumeTemplateNameRef = useRef("");

  const [professionalExperienceFields, setProfessionalExperienceFields] = useState([{
    companyName: '',
    professionalExperienceTitle: '',
    professionalExperienceDescription: '',
    jobStartDate: '',
    jobEndDate: '',
    jobLocation: '',
    jobLocationType: '',
    currentlyWorkingHere: false,

}]);
  const [validationExperienceErrors, setValidationExperienceErrors] = useState(
      professionalExperienceFields.map(() => ({
        companyName: false,
        professionalExperienceTitle: false,
        professionalExperienceDescription: false,
      }))
  );

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

    const jpgResumeExtractor = async (resumePDFImages) => {
      setOpenModal(true);
        const responseJpgResumeExtract = await fetch(process.env.SITE_URL + '/api/pdfResumeUpload/jpgResumeExtract', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.userId,
            resumePDFImages : resumePDFImages,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
          }
        });
        const resultJpgResumeExtract = await responseJpgResumeExtract.json();
        if (resultJpgResumeExtract.status){
          return resultJpgResumeExtract.response;
        } else {
          // console.log(resultJpgResumeExtract)
          setOpenModal(false);
            toast.error("Error in extracting resume data.. ")
          return false
        }

    }
    if (resumeDetailData && resumeDetailData.resumeTemplateName && linkedInUploadStatus){
      //console.log("resumeDetailData", resumeDetailData)
     // console.log("linkedInUploadStatus", linkedInUploadStatus)
      resumeTemplateNameRef.current.value = resumeDetailData.resumeTemplateName ? resumeDetailData.resumeTemplateName : "";
      overviewRef.current.value = resumeDetailData.overview ? resumeDetailData.overview : "";
      skillsRef.current.value = resumeDetailData.skills ? resumeDetailData.skills : "";
      // certificationsRef.current.value = resumeDetailData.certifications ? resumeDetailData.certifications : "";
      setProfessionalExperienceFields(resumeDetailData.professionalExperiences ? resumeDetailData.professionalExperiences : []);
      setEducationFields(resumeDetailData.education ? resumeDetailData.education : []);
    } else if (resumeDetailData && resumeDetailData.resumeJPGImages && resumeDetailData.resumeJPGImages.length > 0 && linkedInUploadStatus){
      jpgResumeExtractor(resumeDetailData.resumeJPGImages).then(async (r) => {
        //console.log("jpgResumeExtractor", r)

        if (r){
          // resumeTemplateNameRef.current.value = r.resumeTemplateName ? r.resumeTemplateName : "";
          overviewRef.current.value = r.overview ? r.overview : "";
          skillsRef.current.value = r.skills ? r.skills : "";
          // certificationsRef.current.value = r.certifications ? r.certifications : "";
          await setProfessionalExperienceFields(r.professionalExperiences ? r.professionalExperiences : []);
          await setEducationFields(r.education ? r.education : []);
          setOpenModal(false);
        }
      });
    }


  },[resumeDetailData, linkedInUploadStatus])

  const [loadingSavedTemplate, setLoadingSavedTemplate] = useState(false);
  useEffect(()=>{

    async function loadUserTemplate(){
      try {
        const userTemplates = await getResumeTemplateListByUserId( user.userId);
        setTemplateList(userTemplates);

      } catch (error) {
        setLoadingSavedTemplate(false);
        //console.log(error)
        toast.error("User resume template list loading error .. ")
      }
    }
    if (user && user.userId){
      setLoadingSavedTemplate(true);
      loadUserTemplate().then((r) => {
        setLoadingSavedTemplate(false);
        // console.log("loadUserTemplate", r)
      })

    }
  },[user]);





 // const [selectedTemplateOption, setSelectedTemplateOption] = useState('');

  const handleSelectTemplateChange = async (event) => {

    const selectedTemplateOptionId = event.docID;
    // console.log(selectedTemplateOptionId)
    if (selectedTemplateOptionId === "0"){
    //  setSelectedTemplateOption("");
      return;
    } else {
      const selectedTemplateOptionData = await getResumeTemplateByUserIdandDocID(user.userId, selectedTemplateOptionId);
        resumeTemplateNameRef.current.value = selectedTemplateOptionData[0].resumeOriginalData.resumeTemplateName;
        overviewRef.current.value = selectedTemplateOptionData[0].resumeOriginalData.overview;
        skillsRef.current.value = selectedTemplateOptionData[0].resumeOriginalData.skills ? selectedTemplateOptionData[0].resumeOriginalData.skills : ""  ;
        // certificationsRef.current.value = selectedTemplateOptionData[0].resumeOriginalData.certifications ? selectedTemplateOptionData[0].resumeOriginalData.certifications : "";
        setProfessionalExperienceFields(selectedTemplateOptionData[0].resumeOriginalData.professionalExperiences);
        setEducationFields(selectedTemplateOptionData[0].resumeOriginalData.education);
    }

  };
  // console.log(templateList)


  function handleJobExperienceChange(i, event) {
    const nameBuff = event.target.name;
    const values = [...professionalExperienceFields];
    values[i][nameBuff.replace(i,"")] = event.target.value;
    setProfessionalExperienceFields(values);
  }

  function handleJobExperienceAdd() {
    const values = [...professionalExperienceFields];
    values.push({
      companyName: '',
      professionalExperienceTitle: '',
      professionalExperienceDescription: '',
      jobStartDate: '',
      jobEndDate: '',
      jobLocation: '',
      jobLocationType: '',
      currentlyWorkingHere: false, });
    setProfessionalExperienceFields(values);
    setValidationExperienceErrors([...validationExperienceErrors, {
      companyName: false,
      professionalExperienceTitle: false,
      professionalExperienceDescription: false,
    }]);
  }
  function handleJobExperienceRemove(i) {
    const values = [...professionalExperienceFields];
    if(values.length > 1) {
      values.splice(i, 1);
      setProfessionalExperienceFields(values);
    }
  }

  function handleEducationChange(i, event) {
    const nameBuff = event.target.name;
    const values = [...educationFields];
    values[i][nameBuff.replace(i,"")] = event.target.value;
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


  const [queryFieldSaveResumeTemplate, setQueryFieldSaveResumeTemplate] = useState('')
  const [selectedSaveResumeTemplate, setSelectedSaveResumeTemplate] = useState({    docID: "0",    _id: 'Please select a saved resume template',  })
  const savedResumeTemplates = templateList;
  const filteredResumeTemplates =
      queryFieldSaveResumeTemplate === ''
          ? savedResumeTemplates
          : savedResumeTemplates.filter((field) => {
            return field.docID.toLowerCase().includes(queryFieldSaveResumeTemplate.toLowerCase())
          })
 // console.log(selectedSaveResumeTemplate)


  const [validationCheckCss, setValidationCheckCss] = useState({
    resumeTemplateName: false,
    overviewSummary: false,
  });
  const handleNextToAdvenceFeature = async (e) => {
    e.preventDefault();

   // console.log(resumeBasicInfo)
    if (!user){
      openOverlay();
      return;
    }

    setValidationCheckCss({
      resumeTemplateName: resumeTemplateNameRef.current.value === '' ,
      overviewSummary: overviewRef.current.value === '' ,

    })

    if (resumeBasicInfo.aiTargetResume){

    } else {

    }

    const professionalExperienceFieldsNewValidationErrors = professionalExperienceFields.map(field => ({
      companyName: !field.companyName,
      professionalExperienceTitle: !field.professionalExperienceTitle,
      professionalExperienceDescription: !field.professionalExperienceDescription,
    }));
    const professionalExperienceFieldsErrors = professionalExperienceFieldsNewValidationErrors.some(error => error.companyName || error.professionalExperienceTitle || error.professionalExperienceDescription);
    setValidationExperienceErrors(professionalExperienceFieldsNewValidationErrors);

    if (professionalExperienceFieldsErrors || resumeTemplateNameRef.current.value === '' || overviewRef.current.value === ''){
      toast.error("Please fill out all required fields in the professional experience section.");
        return false;
    }




    const resumeSubmitOriginalData = {

      resumeTemplateName:resumeTemplateNameRef.current.value,
      overview:overviewRef.current.value,
      skills:skillsRef.current && skillsRef.current.value ? skillsRef.current.value : "",
      certifications: resumeDetails.resumeOriginalData && resumeDetails.resumeOriginalData.certifications ? resumeDetails.resumeOriginalData.certifications : [],
      professionalExperiences:professionalExperienceFields,
      education:educationFields,
      Involvement:"",
      languages:"",
      publications:"",
      references:"",
      honorsAndAwards:"",

    }
    // console.log(resumeSubmitOriginalData)
    resumeData(resumeSubmitOriginalData);
    setGenerating(true);
    setJDInfoExtractMessageContent(null);
    setGenerating(false);
    resumeProgressSelect(createResumeSteps[4]);

  }



  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">

        <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 pt-4 pb-4">

          <div className="pb-10 sm:pb-10">
        {/*<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">*/}
        {/*  <h1 className="text-center">AI Resume Revolution: Refining and Rewriting the Future</h1>*/}

        {/*</div>*/}


        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">


            <div className="mt-8 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <div>
                {/*Saved Resume Templates section start*/}
                {loadingSavedTemplate && (
                    <div>Loading saved resume template...</div>
                )}
                {filteredResumeTemplates && filteredResumeTemplates.length > 0 && (
                    <div className="mt-2">
                      <Combobox as="div" value={selectedSaveResumeTemplate} onChange={(e)=>{
                        setSelectedSaveResumeTemplate(e);
                        handleSelectTemplateChange(e);
                      }}>

                        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Saved Resume Templates</Combobox.Label>
                        <div className="relative mt-2">
                          <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md focus:outline-none">

                            <Combobox.Input
                                id="workFieldInput"
                                readOnly
                                className={` cursor-default w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                onChange={(event) => {
                                  setQueryFieldSaveResumeTemplate(event.target.value);
                                }}
                                displayValue={(field) => field?._id}
                            />
                          </Combobox.Button>
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </Combobox.Button>
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredResumeTemplates.map((template) => (
                                    <Combobox.Option
                                        key={template.docID}
                                        value={template}
                                        className={({ active }) =>
                                            classNames(
                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                            )
                                        }
                                    >
                                      {({ active, selected }) => (
                                          <>
                                            <span className={classNames('block truncate', selected && 'font-semibold')}>{template._id}</span>

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

                        </div>
                      </Combobox>
                    </div>
                )}

                {/*Saved Resume Templates section end*/}
                <div className="mt-2">
                  <label htmlFor="resumeTemplateName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Resume Template Name *
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="resumeTemplateName"
                        id="resumeTemplateName"
                        ref={resumeTemplateNameRef}
                        className={`${validationCheckCss.resumeTemplateName ? 'border-red-500 border-1' : 'border-0'} p-2 block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        placeholder="Ex: Template for Software Engineer	 - 1"
                        aria-describedby="email-description"
                    />
                  </div>
                </div>

              </div>
              <h2 className="sr-only">Details of your resume</h2>
              <div className="grid grid-cols-1  lg:gap-8">
                <div className="">
                  {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                  {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                  <fieldset className="mt-2">

                    <legend className="sr-only">Details for your resume</legend>
                    <div className="sm:block  w-full h-auto">

                      <div className="">



                        <div className=" ">
                        <div>

                          <label htmlFor="overview" className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Overview/Summary *
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={4}
                                name="overview"
                                id="overview"
                                ref={overviewRef}
                                className={`${validationCheckCss.overviewSummary ? 'border-red-500 border-1' : 'border-0'} p-2 block w-full rounded-md py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                placeholder="Multi PMI Certified Agile Hybrid PMO Project Professional with 13+ years of success driving complex projects. A servant leader and change agent that excels at engaging diverse stakeholders, including C-level executives, and delivers exceptional outcomes. Led transformative initiatives at Microsoft, enabling client-facing employees to deliver value-centric solutions. Skilled in cross-functional collaboration with the ability to navigate ambiguity to ensure on-time delivery.  "
                            />
                          </div>

                        </div>

                        <div>
                          <legend className="sr-only">Skills </legend>
                          <label htmlFor="email" className="block mt-2 mb-2 text-lg font-large text-gray-900 dark:text-white">
                            Skills
                          </label>
                          <div className="mt-2">
                            <textarea
                                rows={4}
                                name="must_have_ingrediants"
                                id="must_have_ingrediants"
                                ref={skillsRef}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Change Management: Driving Changes		 "
                            />
                          </div>

                        </div>
                          <CertificationBlock addNewEnable={true}/>


                        <div>
                        <legend className="sr-only ">Professional Experience / Job History / Projects</legend>
                          <h2 className="mt-2 text-lg font-large">
                            Professional Experience / Job History / Projects
                          </h2>
                        <div className=" sm:block  w-full h-auto">

                          <div className="mt-2">

                            <div>
                              {professionalExperienceFields.map((field, idx) => (
                                  <div key={`${field}-${idx}`}>
                                    <div className="mt-2 ">
                                      Job / Project Experience {idx + 1}
                                    </div>
                                    <div className="p-4 border-2 border-gray-200 border-solid">
                                      <label htmlFor={"companyName"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Company / Project Name *
                                      </label>
                                      <div className="mt-2">
                                        <input
                                            type="text"
                                            name={"companyName" + idx}
                                            id={"companyName" + idx}
                                            value={field.companyName}
                                            onChange={e => handleJobExperienceChange(idx, e)}
                                            className={` ${validationExperienceErrors[idx] && validationExperienceErrors[idx].companyName ? 'border-red-500 border-1' : 'border-0'} block w-full rounded-md py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                            placeholder=" Microsoft	"
                                            aria-describedby="email-description"
                                        />
                                      </div>
                                      <label htmlFor={"professionalExperienceTitle"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Job Title / Project Role Name *
                                      </label>
                                      <div className="mt-2">
                                        <input
                                            type="text"
                                            name={"professionalExperienceTitle"+idx}
                                            id={"professionalExperienceTitle"+idx}
                                            value={field.professionalExperienceTitle}
                                            onChange={e => handleJobExperienceChange(idx, e)}
                                            className={`${validationExperienceErrors[idx] && validationExperienceErrors[idx].professionalExperienceTitle ? 'border-red-500 border-1' : 'border-0'} block w-full rounded-md py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                            placeholder="Sr. Business Program Manager (PMO), Microsoft	"
                                            aria-describedby="email-description"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor={"professionalExperienceDescription"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                          Work / Achievement / Project Details *
                                        </label>
                                        <div className="mt-2">
                                        <textarea
                                            rows={4}
                                            name="professionalExperienceDescription"
                                            id={"professionalExperienceDescription"+idx}
                                            value={field.professionalExperienceDescription}
                                            onChange={e => handleJobExperienceChange(idx, e)}
                                            className={`${validationExperienceErrors[idx] && validationExperienceErrors[idx].professionalExperienceDescription ? 'border-red-500 border-1' : 'border-0'} p-2 block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                            placeholder="Empowered 10,000+ client-facing employees to deliver user-centric solutions through innovative engagement strategies as leader of Microsoft's Customer Engagement Methodology. "
                                        />
                                        </div>

                                      </div>
                                      <div className=" ">

                                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                                          <label htmlFor={"jobStartDate"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Start Date
                                          </label>
                                          <input
                                              type="month"
                                              name={"jobStartDate"+idx}
                                              id={"jobStartDate" + idx}
                                              min="1970-01"
                                              className="w-40"
                                              placeholder="Start Date"
                                              value={field.jobStartDate}
                                              onChange={e => handleJobExperienceChange(idx, e)}
                                          />
                                        </div>
                                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                                          <label htmlFor={"jobEndDate" + idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            End Date
                                          </label>
                                          <input
                                              type="month"
                                              name={"jobEndDate"+idx}
                                                id={"jobEndDate" + idx}
                                              className="w-40"
                                              min="1960-01"
                                              placeholder="End Date"
                                              value={field.jobEndDate}
                                              onChange={e => handleJobExperienceChange(idx, e)}/>
                                        </div>
                                      </div>
                                      {
                                        idx === 0 ? ( <div></div>) : (
                                            <button type="button"
                                                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                    onClick={() => handleJobExperienceRemove(idx)}>Remove Experience {(idx + 1)}</button>
                                        )
                                      }
                                    </div>



                                  </div>
                              ))}
                              <button type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                      onClick={() => handleJobExperienceAdd()}>Add More Experience</button>


                            </div>
                            <div>



                            </div>



                          </div>

                        </div>
                        </div>
                        <div>
                          <legend className="sr-only">Education : </legend>
                          <h2 className="mt-2 ">
                            Educations
                          </h2>
                          <div className="space-y-2 sm:block  w-full h-auto">
                            {educationFields.map((field, idx) => (
                                <div key={`${field}-${idx}`}>
                                  <div className="mt-2 ">
                                    Education {idx + 1}
                                  </div>
                                  <div className="p-4 border-2 border-gray-200 border-solid">
                                  <div>
                                    <label htmlFor={"school"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      School
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name={"school"+idx}
                                          id={"school"+idx}
                                          value={field.school ? field.school : ''}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: University of Texas at Austin"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label htmlFor={"degree"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Degree
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name={"degree"+idx}
                                          id={"degree"+idx}
                                          value={field.degree ? field.degree : ''}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: Bachelor’s"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label htmlFor={"fieldOfStudy"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Field Of Study
                                    </label>
                                    <div className="mt-2">
                                      <input
                                          type="text"
                                          name={"fieldOfStudy"+idx}
                                          id={"fieldOfStudy"+idx}
                                          value={field.fieldOfStudy ? field.fieldOfStudy : ''}
                                          onChange={e => handleEducationChange(idx, e)}
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                          placeholder="Ex: Computer Science	"
                                          aria-describedby="email-description"
                                      />
                                    </div>
                                    <div className=" ">

                                      <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                                        <label htmlFor={"startDate"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                          Start Date
                                        </label>
                                        <input
                                            type="month"
                                            name={"startDate"+idx}
                                            className="w-40"
                                            min="1970-01"
                                            placeholder="Start Date"
                                            value={field.startDate ? field.startDate : ''}
                                            onChange={e => handleEducationChange(idx, e)}
                                        />
                                      </div>
                                      <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                                        <label htmlFor={"endDate"+idx} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                          End Date
                                        </label>
                                        <input
                                            type="month"
                                            name={"endDate"+idx}
                                            className="w-40"
                                            min="1970-01"
                                            placeholder="End Date"
                                            value={field.endDate ? field.endDate : ''}
                                            onChange={e => handleEducationChange(idx, e)}/>
                                      </div>
                                    </div>


                                  </div>
                                  {
                                    idx === 0 ? ( <div></div>) : (
                                        <button type="button"
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={() => handleEducationRemove(idx)}>Remove Education {(idx + 1)}</button>
                                    )
                                  }
                                  </div>
                                </div>
                            ))}

                            <button type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={() => handleEducationAdd()}>Add More Education</button>

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
                    onClick={handleNextToAdvenceFeature}
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
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Please wait while the data extraction process is underway. This may take up to 3 minutes. Kindly do not close this window or refresh the page during this time. Thank you for your patience.
              </h3>
              <div className="text-center">
                <Spinner size="xl" aria-label="Processing resume data extracting" />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
  )
}
export default StartFromScratch;
