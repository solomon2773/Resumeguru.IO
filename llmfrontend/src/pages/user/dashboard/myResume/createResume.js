import React, {Fragment, useContext, useEffect, useState} from 'react'
import {useAuth} from "../../../../context/AuthContext";
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbGetResumeListByUserId
} from "../../../../helpers/mongodb/pages/user/resume";

import {ArrowLeftIcon, CheckBadgeIcon, UsersIcon} from "@heroicons/react/24/outline";
import JobTemplateBasic from "../../../../components/aiResume/JobTemplateBasic";
import DataImportMethod from "../../../../components/aiResume/dataImportMethod";
import UploadLinkedInResume from "../../../../components/aiResume/uploadLinkedInResume";
import StartFromScratch from "../../../../components/aiResume/startFromScratch";
import AdvanceFeature from "../../../../components/aiResume/advanceFeature";
import ResumeProcessing from "../../../../components/aiResume/resumeProcessing";
import SelectTemplate from "../../../../components/aiResume/selectTemplate";
import createResumeSteps from "../../../../utils/staticObjects/dashboard/createResumeSteps";
import {Pricing_Popup_Box} from "../../../../components/Pricing/Pricing_Popup_Box";
import {useSelector} from "react-redux";


function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(' ')
}


const UserDashboardMyResumeCreateResume = () =>{

    const user = useSelector(state => state.user.profile);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [ resumeProgress, setResumeProgress] = useState(createResumeSteps[0]);//jobTemplateBasic, resumeCreate, resumeProcessing, advanceFeature
    const [ resumeBasicInfo, setResumeBasicInfo] = useState("");
    const [ resumeDetailData, setResumeDetailData] = useState("");
    const [ linkedInUpload, setLinkedInUpload] = useState(false);
    const [ advanceFeatureData, setAdvanceFeature] = useState(false);
    const [ templateData, setTemplateData] = useState("");
    if (process.env.DEV){
        console.log('createResume-resumeProgress : ',resumeProgress)
        console.log('createResume-resumeBasicInfo : ',resumeBasicInfo)
        console.log('createResume-resumeDetailData : ',resumeDetailData)
        console.log('createResume-advanceFeatureData : ',advanceFeatureData)
    }

    const jobDescriptionClick = (newMessage) => {
        setResumeBasicInfo(newMessage);
    }
    const resumeProgressSelect = (newMessage) => {
        setResumeProgress(newMessage);
    }
    const linkedInUploadStatus = (newMessage) => {
        setLinkedInUpload(newMessage);
    }
    const resumeData = (newMessage) => {
        setResumeDetailData(newMessage);
    }
    const advanceFeature = (newMessage) => {
        setAdvanceFeature(newMessage);
    }

    // console.log(resumes)
    useEffect(() => {

        async function getResumeList() {
            setLoading(true);
            if (user && user.userId) {
                mongodbGetResumeListByUserId(user.userId).then((res) => {
                    if (res && res.length > 0) {
                        setResumes(res);
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
            }
        }
        if (user && user.userId) {
            getResumeList();
        }
    },[user]);

    //console.log(resumes);



    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Create New Resume"
            meta_title="User Dashboard - Create New Resume"
            meta_desc="User Dashboard - Create New Resume"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/"}
        >

            <div className="relative p-2 w-full max-w-8xl h-full ">



                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-0">
                    <div className="flex justify-between items-center pb-4  rounded-t border-b dark:border-gray-600">
                        <h3 className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-white">
                            Create a new resume
                        </h3>

                    </div>
                    <nav className=" p-2" aria-label="Breadcrumb">
                        <ol className="mx-auto inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                            {createResumeSteps.length > 0 && createResumeSteps.map((createStep,createStepIndex)=>{
                                return (
                                    <React.Fragment key={"resume_create_steps_"+createStepIndex}>
                                        <li className="inline-flex items-center">
                                            {createStepIndex === 0 ? (
                                                <div
                                                    className={`${resumeProgress.id >= createStepIndex ? "text-blue-600 cursor-pointer" : "text-gray-700"} inline-flex items-center text-sm font-medium  hover:text-blue-600 dark:text-gray-400 dark:hover:text-white`}>
                                                        <svg className="w-3 h-3 me-2.5" aria-hidden="true"
                                                             onClick={() => {
                                                                 if (createStepIndex <= resumeProgress.id){
                                                                     setResumeProgress(createResumeSteps[createStepIndex])
                                                                 }

                                                             }}
                                                             xmlns="http://www.w3.org/2000/svg" fill={"currentColor"}
                                                             viewBox="0 0 20 20">
                                                            <path
                                                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                                        </svg>
                                                </div>
                                            ) : (
                                                < >
                                                    <svg
                                                        onClick={() => {
                                                            if (createStepIndex <= resumeProgress.id){
                                                                setResumeProgress(createResumeSteps[createStepIndex])
                                                            }

                                                        }}
                                                        className={`${resumeProgress.id >= createStepIndex ? "text-blue-600 cursor-pointer" : "text-gray-700"} rtl:rotate-180 w-3 h-3  mx-1`}
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 6 10">
                                                        <path stroke="currentColor" strokeLinecap="round"
                                                              strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                                    </svg>
                                                    <div
                                                        onClick={() => {
                                                            if (createStepIndex <= resumeProgress.id){
                                                                setResumeProgress(createResumeSteps[createStepIndex])
                                                            }

                                                        }}
                                                        className={`${resumeProgress.id >= createStepIndex ? "text-blue-600 cursor-pointer" : "text-gray-700"} hidden md:flex inline-flex items-center text-sm font-medium dark:text-gray-400 dark:hover:text-white`}>
                                                        {createStep.name}
                                                    </div>
                                                </>

                                            )}


                                        </li>
                                    </React.Fragment>
                                );

                            })}


                        </ol>
                    </nav>
                    <div className="">
                        <div className="mx-auto max-w-7xl px-4 sm:px-1 lg:px-4 ">
                            <h1 className="sr-only">AI Resume Revolution: Refining and Rewriting your Future</h1>
                        </div>


                        { resumeProgress.codeName === "resumeBasicInfo" && (
                            <JobTemplateBasic resumeBasicInfo={resumeBasicInfo}  jobDescriptionClick={jobDescriptionClick} resumeProgressSelect={resumeProgressSelect}/>
                        )}

                        { resumeProgress.codeName === "dataImportMethod" && (
                            <DataImportMethod  resumeProgressSelect={resumeProgressSelect} />
                        )}

                        { resumeProgress.codeName === "linkedinUpload" && (
                            <UploadLinkedInResume resumeData={resumeData} resumeProgressSelect={resumeProgressSelect} linkedInUploadStatus={linkedInUploadStatus}/>
                            // <div className="text-center p-4 text-xl-center">Coming soon...</div>
                        )}
                        { resumeProgress.codeName === "resumeDetail" && (
                            <StartFromScratch resumeBasicInfo={resumeBasicInfo} resumeData={resumeData} resumeProgressSelect={resumeProgressSelect} linkedInUploadStatus={linkedInUpload} resumeDetailData={resumeDetailData}/>
                        )}

                        { resumeProgress.codeName === "advanceFeature" && (
                            <AdvanceFeature advanceFeature={advanceFeature} resumeProgressSelect={resumeProgressSelect}/>
                        )}

                        { resumeProgress.codeName === "aiGenerating" && (
                            <ResumeProcessing resumeBasicInfo={resumeBasicInfo} resumeDetailData={resumeDetailData} advanceFeature={advanceFeatureData} resumeProgressSelect={resumeProgressSelect} setTemplateData={setTemplateData}/>
                        )}

                        { resumeProgress.codeName === "selectTemplate" && (
                            <SelectTemplate
                                templateData={templateData}
                                resumeDetailData={resumeDetailData}
                                advanceFeature={advanceFeatureData}
                            />
                        )}



                    </div>

                </div>
            </div>



        </UserDashboardCommonLayout>
    )
}
export default UserDashboardMyResumeCreateResume;
