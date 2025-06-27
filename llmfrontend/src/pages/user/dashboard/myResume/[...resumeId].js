import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import cookie from 'cookie';
import {
    PaperClipIcon,
    UserIcon,
    RocketLaunchIcon,
    ChevronDoubleDownIcon,
    ChevronDoubleRightIcon
} from '@heroicons/react/20/solid'
import { useState } from "react";
import React, {useEffect} from "react";
import {
    mongodbGetResumeById,
    mongodbDeleteResume,
    mongodbGetResumesVersionByTemplateName,
    mongodbGetResumeCoverlettersByResumeIDVersion,
    mongodbGetResumeQandAByResumeIDVersion
} from "../../../../helpers/mongodb/pages/user/resume";

import {
    mongodbGetInterviewQuestionByResumeIdVersion
} from "../../../../helpers/mongodb/pages/user/interviewQuestions";

import LinkedinMessageBlock from "../../../../components/dashboard/linkedinConnectionMessage/messageBlock";
import InterviewQuestionBlock from "../../../../components/dashboard/interviewQuestion/interviewQuestionBlock";
import QuestionToAskBlock from "../../../../components/dashboard/questionToAsk/quesitonToAskBlock";
import OriginalResumeBlock from "../../../../components/myResume/original/resumeBlock";
import { Button, Dropdown, Modal } from "flowbite-react";
import EditResumeBlock from "../../../../components/myResume/Edit/editResumeBlock";
import SelectClTemplate from "../../../../components/myResume/Edit/selectClTemplate";
import EditCoverLetterBlock from "../../../../components/myResume/Edit/editCoverLetterBlock";
import SelectTemplate from "../../../../components/myResume/Edit/selectTemplate";
import { ChatBubbleLeftEllipsisIcon, EnvelopeIcon, LinkIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import {
    mongodbGetCoverLetterByResumeIdVersion
} from "../../../../helpers/mongodb/pages/user/coverLetter";
import RightDrawer from "../../../../components/myResume/Edit/rightDrawer";
import { useDispatch, useSelector } from 'react-redux';
import {
    setResumeDetails,
    setResumeEditRightDrawer,
    setResumeEditRightDrawerTab,
    setResumeTemplateDetails
} from "../../../../store/resumeEditReducer";
import {updateSectionCompletion, updateContentQualityOverview, updateContentQualityWorkExperience} from "../../../../store/resumeScoreReducer";
import {analyzeText} from "../../../../utils/nlp/textAnalyzer";

function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(' ')
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Define common stopwords that you want to filter out
const stopwords = [
    'the', 'and', 'or', 'a', 'is', 'of', 'in', 'to', 'for', 'on', 'with', 'as', 'by', 'at', 'from', 'an', 'this', 'that', 'it', 'be'
];

const ResumeEdit = ({resumeFound, resume, resumes, coverLetters, interviewQuestions,  error})=> {
    const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)
    const [resumeData, setResumeData] = useState(resume);
    const [resumeTemplateSelectProgress, setResumeTemplateSelectProgress] = useState(1);
    const [clTemplateSelectProgress, setClTemplateSelectProgress] = useState(1);
    const [ templateData, setTemplateData] = useState("");
    const [clTemplateData, setClTemplateData] = useState("");
    const [coverLetterData, setCoverLetterData] = useState(coverLetters)
    const [interviewQuestionData, setInterviewQuestionData] = useState(interviewQuestions)
    const [userInfo, setUserInfo] = useState({});
    // const router = useRouter()
    const user = useSelector(state => state.user.profile);
    //console.log(resumeData)
    //console.log(user)

    const resumeEditRightDrawer = useSelector(state => state.resumeEdit.resumeEditRightDrawer)

    const tabs = [

        { name: 'Original Resume', icon: UserIcon,  },
        { name: 'AI Optimized Resume',  icon: RocketLaunchIcon,  },
        { name: 'Cover Letter', icon: EnvelopeIcon },
        { name: 'Connection Message', icon: LinkIcon },
        { name: 'Interview Questions', icon: ChatBubbleLeftEllipsisIcon },
        { name: 'Questions to Ask', icon: MagnifyingGlassPlusIcon },

    ]
    const [activeTab, setActiveTab] = useState(tabs[1].name)



    const tabSelectHandler = (event) => {
        event.preventDefault()
        setResumeTemplateSelectProgress(1);
        setClTemplateSelectProgress(1);
        setActiveTab(event.target.getAttribute("data-name"))
    }

    useEffect(() => {
        if (resumeEditRightDrawer) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
        return () => {
          document.body.style.overflow = '';
        };
      }, [resumeEditRightDrawer]);

    useEffect (()=>{
        if (user && user.email){
            setUserInfo({
                "firstName": user.firstName ? user.firstName : "firstName",
                "lastName": user.lastName ? user.lastName : "firstName",
                "email": user.email ? user.email : "email",
                "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
                "city":user.city ? user.city : "City",
                "state":user.region ? user.region : "Texas",

            });
        }

    }, [user])
    const resumeMainVersionChangeHandler = async ( resumeId,version ) => {

        mongodbGetResumeById(resumeId).then((findeResumeById)=>{
            setResumeData(JSON.parse(JSON.stringify(findeResumeById)));
        });
        mongodbGetCoverLetterByResumeIdVersion(resumeId, version).then((coverLetter)=>{
            setCoverLetterData(coverLetter)
        })
        mongodbGetInterviewQuestionByResumeIdVersion(resumeId, version).then((interviewQuestions)=>{
            setInterviewQuestionData(interviewQuestions)
        })

    };

    /* Basic Score Calculation*/
    useEffect(()=>{
        dispatch(setResumeDetails(resumeData));
        // resume score check
        if (resumeData && resumeData.scores){
            dispatch(updateSectionCompletion(resumeData.scores));
        } else {
            if (user && user.email) {
                dispatch(updateSectionCompletion({
                    personalInfo: {
                        firstName: user && user.firstName ? 20 : 0,
                        lastName: user && user.lastName ? 20 : 0,
                        email: user && user.email ? 16 : 0,
                        phone: user && user.phoneNumber ? 8 : 0,
                        location: user && user.city ? 2 : 0,
                    },
                    workExperience: resumeData.professionalExperienceRewrite && resumeData.professionalExperienceRewrite.length > 0 ? 21 : 0,
                    summary: resumeData.overviewRewrite && resumeData.overviewRewrite.overviewRewrite ? 8 : 0,
                    skills: resumeData.skillsRewrite && resumeData.skillsRewrite.existingSkills ? 5 : 0,

                }));


            }
        }
    },[resumeData,user])
    /* Content Score Calculation*/
    const [analysisResult, setAnalysisResult] = useState(null);
    useEffect(()=>{
        if (analysisResult === null && resumeDetails && resumeDetails.professionalExperienceRewrite && resumeDetails.professionalExperienceRewrite.length > 0) {
            if ( !resumeDetails.professionalExperienceRewrite) {
                return;
            }
            // Create a copy of the analysis results array
            const newExperienceAnalysisResult = [];
            let contentScoreTotal = 0;

            if (resumeDetails.advancedPromptFeature && resumeDetails.advancedPromptFeature.workExperienceParagraphLayout === "bullet"){

                // Loop over professional experience entries
                resumeDetails.professionalExperienceRewrite.map((experience, experienceIndex) => {
                    // Initialize an array for each experience in newExperienceAnalysisResult
                    newExperienceAnalysisResult[experienceIndex] = [];
                    newExperienceAnalysisResult[experienceIndex] = {
                        results: [],
                        score: 0
                    };
                    // Loop over the bullet points for each experience
                    experience.professionalExperienceDescriptionBulletPoints.map((bulletPoint, bulletPointIndex) => {
                        const inputText = bulletPoint; // The text to analyze
                        const result = analyzeText(inputText); // Analyze the text
                        // Push the result for this bullet point into the corresponding experience index
                        newExperienceAnalysisResult[experienceIndex].results.push(result);
                        if (newExperienceAnalysisResult[experienceIndex].results.length === (bulletPointIndex+1)){
                            const experienceTotalScoreBuffer = newExperienceAnalysisResult[experienceIndex].results.reduce((acc, result) => acc + result.score, 0);
                            newExperienceAnalysisResult[experienceIndex].score = (experienceTotalScoreBuffer/ newExperienceAnalysisResult[experienceIndex].results.length).toFixed(2);

                        } else {
                            newExperienceAnalysisResult[experienceIndex].score += result.score;
                        }

                        // contentScoreTotal += result.score;
                    });
                    contentScoreTotal +=  Number(newExperienceAnalysisResult[experienceIndex].score) ;

                });
                // newExperienceAnalysisResult.totalScore = contentScoreTotal;
                // Set the final analysis result once all processing is done
                setAnalysisResult(newExperienceAnalysisResult);
                dispatch(updateContentQualityWorkExperience({
                    workExperience:newExperienceAnalysisResult,
                    workExperienceTotalScore:contentScoreTotal > 0 ? (contentScoreTotal / newExperienceAnalysisResult.length ).toFixed(2) : 0,
                }));
            } else {
                // Loop over professional experience entries
                resumeDetails.professionalExperienceRewrite.map((experience, experienceIndex) => {
                    newExperienceAnalysisResult[experienceIndex] = {
                        results: [],
                        score: 0
                    };
                    const inputText = experience.professionalExperienceDescription; // The text to analyze
                    const result = analyzeText(inputText); // Analyze the text
                    // Push the result for this experience into the corresponding index
                    newExperienceAnalysisResult[experienceIndex].results.push(result);
                    if (newExperienceAnalysisResult[experienceIndex].results.length === (experienceIndex+1)){
                        const experienceTotalScoreBuffer = newExperienceAnalysisResult[experienceIndex].results.reduce((acc, result) => acc + result.score, 0);
                        newExperienceAnalysisResult[experienceIndex].score = (experienceTotalScoreBuffer/ newExperienceAnalysisResult[experienceIndex].results.length).toFixed(2);
                    } else {
                        newExperienceAnalysisResult[experienceIndex].score += result.score;
                    }
                    contentScoreTotal +=  Number(newExperienceAnalysisResult[experienceIndex].score) ;

                });
                // newExperienceAnalysisResult.totalScore = contentScoreTotal;
                // Set the final analysis result once all processing is done
                setAnalysisResult(newExperienceAnalysisResult);
                dispatch(updateContentQualityWorkExperience({
                    workExperience:newExperienceAnalysisResult,
                    workExperienceTotalScore:contentScoreTotal > 0 ? (contentScoreTotal / newExperienceAnalysisResult.length ).toFixed(2) : 0,
                }));
            }



        }

    },[resumeDetails,analysisResult])

    const handleSelectTemplate = async (e) => {
        // Read the Word document template
        e.preventDefault();

        const data = {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phoneNo":user.phoneNumber? user.phoneNumber : "xxx-xxx-xxxx",
            "city":user.city? user.city : "My Location",
            "jobTitle":resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.jobTitle ? resumeDetails.resumeBasicInfo.jobTitle.replace(/[^a-zA-Z]+/g, '') : "jobTitle",
            "overviewRewriteTitle":resumeDetails.overviewRewrite.overviewRewriteTitle,
            "overviewRewrite":resumeDetails.overviewRewrite.overviewRewrite,
            "professionalExperience": resumeDetails.professionalExperienceRewrite,
            "education": resumeDetails.resumeOriginalData.education,
            "certifications": resumeDetails.certifications ? resumeDetails.certifications : false,
            "languages": resumeDetails.languages,
            "skills": resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills ? resumeDetails.skillsRewrite.existingSkills.map(skill => ({ skillName: skill.skillName })) :   "",
            "skillsExist":!!(resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0),
            "certificationsExist":!!(resumeDetails.certifications),
        };

        dispatch(setResumeTemplateDetails(data));
        dispatch(setResumeEditRightDrawer(true));
        dispatch(setResumeEditRightDrawerTab("template"));

      //  setResumeTemplateSelectProgress(2);
    }

    const handleBack = async (e) => {
        e.preventDefault();
        setResumeTemplateSelectProgress(1);
    }

    const [deleteResumeModal, setDeleteResumeModal] = useState(false);
    const [deleteResumeProcessing, setDeleteResumeProcessing] = useState(false);
    const deleteResumeHandler = async (_id) => {
        setDeleteResumeProcessing(true);
        mongodbDeleteResume({
            userId: user.userId,
            resumeObjectId: _id})
            .then((response) => {
              //  console.log("deleteResumeHandler response", response)
                window.location.href = process.env.SITE_URL+"/user/dashboard/myResume";
            //    setDeleteResumeProcessing(false);
        })

    }

    const [jobDescriptionDetailBlock, setJobDescriptionDetailBlock] = useState(false);
    const jobDescriptionDetailBlockClick = ()=>{
        setJobDescriptionDetailBlock(!jobDescriptionDetailBlock)
    }
    // Function to find key matching skills
    const getKeyMatchingSkills = (text1, text2) => {
        const words1 = text1.toLowerCase().split(/\W+/).filter(word => !stopwords.includes(word) && word.length > 1);
        const words2 = text2.toLowerCase().split(/\W+/).filter(word => !stopwords.includes(word) && word.length > 1);
        return [...new Set(words1.filter(word => words2.includes(word)))];

    };


    // Function to highlight matching key skills in a paragraph
    const highlightText = (paragraph, matchingSkills) => {
        let highlightedParagraph = paragraph;

        // Create a copy of matchingSkills and sort it by length in descending order
        const sortedSkills = [...matchingSkills].sort((a, b) => b.length - a.length);

        // Iterate over the matching skills and replace occurrences with highlighted version
        sortedSkills.forEach(skill => {
            const skillRegex = new RegExp(`(${skill})`, 'gi'); // Create a case-insensitive regex for each skill
            highlightedParagraph = highlightedParagraph.replace(skillRegex, `<span style="background-color: yellow; font-weight: bold;">$1</span>`);
        });

        return <span dangerouslySetInnerHTML={{ __html: highlightedParagraph }} />;
    };






    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Resume AI Tool"
            meta_title="User Dashboard - Resume AI Tool"
            meta_desc="User Dashboard - Resume AI Tool"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/myResume"}
        >

            <div className="wraper mx-auto w-full  sm:px-2 lg:px-4  py-2" style={{"backgroundColor": "rgba(25, 4, 69, 0.02)"}}>                <div>
                    <div>
                        {resumes && resumes.length > 0 && (
                            <div className="m-1">
                                <div className="flex items-center  ">
                                    <Dropdown
                                        label={ resumeDetails && resumeDetails.version ? "Version : " + resumeDetails.version : "Version : 0"}
                                        dismissOnClick={true}
                                        id="resumeVersion"
                                        name="resumeVersion"
                                        size="xs"
                                        className="bg-green-50"
                                        style={{ borderRadius: '9999px',borderColor: '#047857', borderWidth:"1px", color:'#047857', backgroundColor:'#ECFDF5',  fontWeight:"500", padding:"0px"}}
                                    >
                                        {resumes.map((resumeVersion, resumeVersionIndex) => (
                                            <Dropdown.Item
                                                key={"version-"+resumeVersion._id}
                                                value={resumeVersion._id}
                                                data-version={resumeVersion.version}
                                                className=" items-center  bg-green-50 px-6 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 "
                                                onClick={(e) => {
                                                    resumeMainVersionChangeHandler(resumeVersion._id, resumeVersion.version).then((response) => {

                                                    });

                                                }}
                                            > Version : {resumeVersion.version}</Dropdown.Item>

                                        ))}
                                    </Dropdown>
                                </div>
                            </div>
                        )}
                    </div>
                    <blockquote
                        id="target_resume_blockquote"
                        className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                        <div className="flex items-center justify-between font-bold">Target Job Information : </div>
                        <div className="text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">
                            {resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.aiTargetResume ? (
                                <>
                                    <p className="text-sm leading-6 "> Company Name : {resumeDetails.postBodyJDInfoExtract && resumeDetails.postBodyJDInfoExtract.companyName ? resumeDetails.postBodyJDInfoExtract.companyName : "N/A"}</p>
                                    <p className="text-sm leading-6 "> Job Title : {resumeDetails.postBodyJDInfoExtract && resumeDetails.postBodyJDInfoExtract.jobTitle ? resumeDetails.postBodyJDInfoExtract.jobTitle : "N/A"}</p>
                                </>
                            ):(
                                <>
                                    <p className="text-sm leading-6 "> Company Name : {resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.companyName ? resumeDetails.resumeBasicInfo.companyName : "N/A"}</p>
                                    <p className="text-sm leading-6 "> Job Title : {resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.jobTitle ? resumeDetails.resumeBasicInfo.jobTitle : "N/A"}</p>

                                </>
                            )}
                            {/**Job Description details**/}
                            <div className="flex items-center cursor-pointer" onClick={jobDescriptionDetailBlockClick}>
                                {jobDescriptionDetailBlock ? (
                                    <ChevronDoubleDownIcon className="h-5 w-5 text-blue-700 cursor-pointer"/>
                                ) : (
                                    <ChevronDoubleRightIcon className="h-5 w-5 text-blue-700 cursor-pointer"/>
                                )}
                                <label htmlFor="coverLetterOption" className="cursor-pointer inline text-l font-medium leading-6 text-blue-700">
                                    Details
                                </label>
                            </div>
                            {jobDescriptionDetailBlock && (
                                <div>
                                    {resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.futureJobDescription && (
                                        <p className="text-sm leading-6 "> Job Desctiption : <textarea className="w-full" defaultValue={resumeDetails.resumeBasicInfo.futureJobDescription }></textarea></p>

                                    )}


                                    {resumeDetails.postBodyJDInfoExtract && resumeDetails.postBodyJDInfoExtract.keyResponsibilities && resumeDetails.postBodyJDInfoExtract.keyResponsibilities.length > 0 && (
                                        <p className="text-sm leading-6 "> Key Responsibility : <div className="w-full" >
                                            {resumeDetails.postBodyJDInfoExtract.keyResponsibilities.map((keyResponsibility, i) => {
                                                return (
                                                    <div key={"keyResponsibilities-" + i} className="indent-8">
                                                        <div>
                                                            {i+1 + ". "} {keyResponsibility ?  keyResponsibility : ""}
                                                        </div>

                                                    </div>

                                                )
                                            })}
                                        </div>
                                        </p>
                                    )}
                                    {resumeDetails.postBodyJDInfoExtract && resumeDetails.postBodyJDInfoExtract.keyResponsibilities && resumeDetails.postBodyJDInfoExtract.requiredSkills.length > 0 && (
                                        <p className="text-sm leading-6 "> Required Skills :
                                            <div className="w-full " >
                                                {resumeDetails.postBodyJDInfoExtract.requiredSkills.map((keyResponsibility, i) => {
                                                    return (
                                                        <div key={"keyResponsibilities-" + i} className="inline-block ">

                                                            {(i > 0 && i < resumeDetails.postBodyJDInfoExtract.requiredSkills.length - 1)&& ", "}{keyResponsibility ?  keyResponsibility : ""}


                                                        </div>

                                                    )
                                                })}
                                            </div>
                                        </p>
                                    )}


                                </div>
                            )}

                        </div>
                    </blockquote>
                {/*<div className="paragraph">*/}
                {/*    {resumeDetails && resumeDetails.resumeBasicInfo && resumeDetails.resumeBasicInfo.futureJobDescription && highlightText(resumeDetails.professionalExperienceRewrite[0].professionalExperienceDescription, resumeDetails.postBodyJDInfoExtract.requiredSkills)}*/}
                {/*</div>*/}

                {/*Tabs*/}
                    <div>
                        {/*Mobile Tab*/}
                        <div className="block sm:hidden">
                            <label htmlFor="tabs" className="sr-only">
                                Function Tab
                            </label>
                            <select
                                id="tabs"
                                name="tabs"
                                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                defaultValue={tabs[0].name}
                                onChange={tabSelectHandler}
                            >
                                {tabs.map((tab) => (
                                    <option

                                        key={"mobile"+tab.name}
                                        value={tab.name}
                                    >{tab.name}</option>
                                ))}
                            </select>
                        </div>
                        {/*Desktop Tab*/}
                        <div className=" hidden sm:block">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {tabs.map((tab,tabIndex) => (
                                        <React.Fragment key={"resume_tab_"+tabIndex}>
                                            <div
                                                key={"desktop"+tab.name}

                                                className={classNames(
                                                    activeTab === tab.name
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer',
                                                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium cursor-pointer'
                                                )}
                                                aria-current={activeTab === tab.name ? 'page' : undefined}

                                            >
                                                <tab.icon
                                                    className={classNames(
                                                        activeTab === tab.name ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                                                        '-ml-0.5 mr-2 h-5 w-5'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <span data-name={tab.name}
                                                      onClick={tabSelectHandler}
                                                >{tab.name}</span>
                                            </div>
                                        </React.Fragment>

                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>


                </div>

                { activeTab === tabs[0].name && user && resumeFound && resumeDetails && (

                    <div className="pt-4 sm:pt-2 ">

                        <div className="md:grid md:grid-cols-4 md:gap-4 border-b border-gray-900/10 pb-3 ">
                            <div className=" md:mb-0 md:col-span-3 " >
                                {/*<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />*/}
                                <div className="px-4 sm:px-0">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Original Resume</h3>
                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">This is the original resume.</p>
                                </div>
                            </div>
                            {/*<div className="ml-auto mr-auto md:col-span-1 flex items-center justify-center m-2" >*/}
                            {/*    <RightDrawer*/}
                            {/*        templateData={templateData}*/}
                            {/*        resumeData={resumeData}*/}
                            {/*    />*/}
                            {/*    <div className="ml-auto mr-0" >*/}
                            {/*        <Button outline*/}
                            {/*                onClick={handleSelectTemplate}*/}
                            {/*                gradientDuoTone="purpleToBlue">*/}
                            {/*            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />*/}
                            {/*            Select Download Template*/}
                            {/*        </Button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>


                        <div>
                            <OriginalResumeBlock
                                resumeData={resumeData}
                                userData={user}
                                setTemplateData={setTemplateData}
                                setResumeTemplateSelectProgress={setResumeTemplateSelectProgress}
                            />

                        </div>


                    </div>

                )}




                {/* new AI generated resume*/}
                { activeTab === tabs[1].name && user && resumeFound && resumeData && (
                    <div className="pt-4 sm:pt-2 ">

                        <div className="md:grid md:grid-cols-4 md:gap-4 border-b border-gray-900/10 pb-3 ">
                            <div className=" md:mb-0 md:col-span-3 " >
                                {/*<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />*/}
                                <div className="px-4 sm:px-0">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">AI {resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.aiTargetResume ? "Target" : "Optimized"} Resume</h3>
                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">This is a rewritten {resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.aiTargetResume ? "target" : "optimized"} resume for your specific job opening. You can create new content by clicking the "Regenerate" button, or you can modify existing data by hovering over the section you want to edit and clicking on it. </p>
                                </div>
                            </div>
                            <div className="ml-auto mr-auto md:col-span-1 flex items-center justify-center m-2" >
                                <RightDrawer

                                />
                                <div className="ml-auto mr-0" >
                                            <Button outline
                                                    onClick={handleSelectTemplate}
                                                    gradientDuoTone="purpleToBlue">
                                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                Download Resume
                                            </Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <EditResumeBlock   />

                        </div>


                    </div>
                )}

                {/*Cover Letter*/}
                { activeTab === tabs[2].name && user && resumeFound && resumeData && (

                    clTemplateSelectProgress === 1 ? (
                        <EditCoverLetterBlock
                            coverLetters={coverLetters}
                            coverLetterData={coverLetterData}
                            setCoverLetterData={setCoverLetterData}
                            resumeData={resumeData}
                            userInfo={userInfo}
                            setClTemplateData={setClTemplateData}
                            setClTemplateSelectProgress={setClTemplateSelectProgress}
                        />
                        ) : (
                            clTemplateSelectProgress === 2 && (
                                <SelectClTemplate
                                    clTemplateData={clTemplateData}
                                    setClTemplateSelectProgress={setClTemplateSelectProgress}

                                />
                            )
                        )
                )}

                {/*Connection Message*/}
                { activeTab === tabs[3].name && user && resumeFound && resumeData && (
                    <div className="px-4 py-2 ">
                        <LinkedinMessageBlock resumeObjectId={resumeData._id} resumeVersion={resumeData.version} dataInputType={"aiResume"}/>
                    </div>
                )}


                {/*AI Possible Interview questions */}
                { activeTab === tabs[4].name && user && resumeFound && resumeData && (
                    <div className="px-4 py-2 ">
                    <InterviewQuestionBlock resumeObjectId={resumeData._id} resumeVersion={resumeData.version}/>
                    </div>
                )}

                {/*AI Interview questions to ask*/}
                { activeTab === tabs[5].name && user && resumeFound && resumeData && (
                    <div className="px-4 py-2 ">
                    <QuestionToAskBlock resumeObjectId={resumeData._id} resumeVersion={resumeData.version}/>
                    </div>
                )}

                {resumeTemplateSelectProgress === 1 && activeTab === tabs[1].name && (
                    <div className="m-6">
                        <Button color="failure"
                                size="sm"
                                onClick={() => {setDeleteResumeModal(true)}}

                        >Delete </Button>

                    </div>
                )}


            </div>
            <Modal
                show={deleteResumeModal}
                onClose={() => setDeleteResumeModal(false)}
            >
                <Modal.Header>Delete Resume</Modal.Header>
                <Modal.Body>
                   <div>
                       <p>Resume template name : <strong>{resumeData.resumeTemplateName}</strong></p>
                          <p>Are you sure you want to delete this resume? The current version will be deleted.</p>
                   </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                            size="sm"
                            color="gray"
                            onClick={() => deleteResumeHandler(resumeData._id)}
                            className="mr-2"
                            isProcessing={deleteResumeProcessing}

                    >Delete This Resume</Button>
                    {!deleteResumeProcessing && (
                        <Button color="blue" onClick={() => setDeleteResumeModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>

        </UserDashboardCommonLayout>
    )
}

export default ResumeEdit;
export const getServerSideProps = async (context) => {
    if (process.env.DEV){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }


    const { req } = context;
    const cookies = cookie.parse(req.headers.cookie || '');
    const resumeId = context.query.resumeId;

    const ka_u_id = cookies["ka_u_id"];
    //console.log(ka_u_id)
    //console.log(resumeId)
    if (ka_u_id && resumeId) {
        // Perform a user-specific operation...

        // Check if idString is a string
        if (typeof resumeId[0] !== "string") {
            return {
                props: {
                    error: "The provided id is not a string.",
                    resumeFound: false,
                },
            };
        }

        // Validate ObjectId string
        if (!(/^[a-f\d]{24}$/i).test(resumeId[0])) {
            return {
                props: {
                    error: "The provided string is not a valid ObjectId.",
                    resumeFound: false,
                },
            };
        }
        if (!resumeId[0] || (resumeId[0].length !== 24 && resumeId[0].length !== 12) || !(/^[a-fA-F0-9]{24}$/).test(resumeId[0])) {
            return {
                props: {
                    error: "Invalid ObjectId string format.",
                    resumeFound: false,
                },
            };
        }

        const resume = await mongodbGetResumeById(resumeId[0]).then((result) => {
            return result;
        });

        if (resume){
           // console.log(resume.resumeTemplateName)
             const resumes = await mongodbGetResumesVersionByTemplateName(resume.resumeTemplateName).then((result) => {
                // console.log(result)
                return result;
            })


            const coverLetters = await mongodbGetResumeCoverlettersByResumeIDVersion(
                    {
                        resumeObjectId:resumeId[0],
                        resumeVersion:resume.version,
                    }).then((result) => {
                return result;
            })

            const interviewQuestions = await mongodbGetResumeQandAByResumeIDVersion(
                {
                    resumeObjectId:resumeId[0],
                    resumeVersion:resume.version,
                }).then((result) => {
                return result;
            })


            return {
                props: {
                    resumes: resumes ? JSON.parse(JSON.stringify(resumes)) : null,
                    resume: JSON.parse(JSON.stringify(resume)) ,
                    coverLetters: coverLetters ? JSON.parse(JSON.stringify(coverLetters)) : null,
                    interviewQuestions: interviewQuestions ? JSON.parse(JSON.stringify(interviewQuestions)) : null,
                    // linkedinConnectionMessages: serializedLinkedinConnectionMessagesData,
                    resumeFound: true,
                },
            };
        } else {
            return {
                props: {
                    error: "Resume not found.",
                    resumeFound: false,
                },
            };
        }

    } else {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }




};
