import React, {Fragment, useEffect, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbGetInterviewQuestionListByUserId,

} from "../../../../helpers/mongodb/pages/user/interviewQuestions";
import {toast} from "react-toastify";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import CoverLetter from "../../../../components/aiResume/coverLetter";
import InterviewQuestionBlock from "../../../../components/dashboard/interviewQuestion/interviewQuestionBlock";
import {useSelector} from "react-redux";

const UserDashboardInterviewQuestion = () =>{
    const user = useSelector(state => state.user.profile);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resumeObjectId, setResumeObjectId] = useState(false);
    const [resumeVersion, setResumeVersion] = useState(false);
    const [isModalOpenInterviewQuestion, setIsModalOpenInterviewQuestion] = useState(false);
    const [interviewQuestionPopupData, setInterviewQuestionPopupData] = useState(false);
    const [coverLetterAiGenerated, setCoverLetterAiGenerated] = useState(false);
    const [coverLetterCandidateStrength, setCoverLetterCandidateStrength] = useState(false);
    const [isModalOpenCreateCoverLetter, setIsModalOpenCreateCoverLetter] = useState(false);
    useEffect(() => {

        async function getIngerviewQuestions() {
            setLoading(true);
            if (user && user.userId) {
                mongodbGetInterviewQuestionListByUserId(user.userId).then((res) => {
                    if (res && res.length > 0) {
                        setInterviewQuestions(res);
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
            }
        }
        if (user && user.userId) {
            getIngerviewQuestions();
        }
    },[user]);

    const viewInterviewQuestion = (event) => {
        setInterviewQuestionPopupData(false);

        const _id = event.currentTarget.getAttribute('data-doc-id');
        const resumeObjectId = event.currentTarget.getAttribute('data-resume-id');
        const resumeVersion = event.currentTarget.getAttribute('data-resume-version');
        const jobTitle = event.currentTarget.getAttribute('data-job-title');
        const jobCompany = event.currentTarget.getAttribute('data-company-name');

        setResumeObjectId(resumeObjectId);
        setResumeVersion(resumeVersion);
        setIsModalOpenInterviewQuestion(true);
        if (_id && resumeObjectId && resumeVersion){

            setInterviewQuestionPopupData({
                jobTitle: jobTitle,
                companyName: jobCompany,
            });
        } else {

            toast.error("Interview question detail not found, please contact us.");
            return;
        }

    }

    const handleCoverLetterDownload = async () => {

        // Read the Word document template
        const response = await fetch(process.env.SITE_URL +'/templates/coverletter_template1.docx');
        const template = await response.arrayBuffer();

        // Create a new instance of the Docxtemplater library
        const doc = new Docxtemplater();

        // Load the template using PizZip
        const zip = new PizZip(template);
        doc.loadZip(zip);
        const coverLetterLines = coverLetterAiGenerated.replace(/Dear Hiring Manager,[\n\n|\n\s]*/g, "").replace(/\\n|\n\n|\n/g, "\n").split(/\\n|\n\n|\n/).map((line, index) => {
            return {  line };
        });
        const top4Strengths = coverLetterCandidateStrength.slice(0, 4).map((strength, index) => {
            return {  strength };
        });


        //console.log(user)
        // Set the template data
        const data = {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
            "city":user.city ? user.city : "My Location",
            "coverLetterAiGenerate":coverLetterLines,
            "coverLetterCandidateStrengthMessageContent":top4Strengths,

        };
        doc.setData(data);

        // Render the document
        doc.render();

        // Generate the Word document
        const generatedDoc = doc.getZip().generate({ type: 'blob' });
        // Trigger the file download

        saveAs(generatedDoc, "coverLetter_"+encodeURI(interviewQuestionPopupData.userContent.companyName.replace(/\s+/g, ''))+"_"+encodeURI(interviewQuestionPopupData.userContent.jobTitle.replace(/\s+/g, ''))+".docx");
        setIsModalOpenInterviewQuestion(false);
    }

    return (
        <UserDashboardCommonLayout
            parent="home"
            title="Interview Question - Resume Guru"
            meta_title="Interview Question - Resume Guru"
            meta_desc="AI help you to simulate possible questions related to your resume and the job description. All questions will be answered using STAR method."
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/"}
        >
            {/* Table Section */}
            <div className="max-w-full py-2 sm:px-2 lg:px-4 lg:py-4 mx-auto">
                {/* Card */}
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                                {/* Header */}

                                <div className="px-6 py-4">
                                    <div className="inline-flex gap-x-2">
                                        {/*<a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">*/}
                                        {/*    View all*/}
                                        {/*</a>*/}

                                        <div
                                            onClick={() => {setIsModalOpenCreateCoverLetter(true)}}
                                            className="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">
                                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                            Create Interview Question
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            Interview Questions List
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Here you can find all of your interview questions.
                                        </p>
                                    </div>

                                </div>
                                {/* End Header */}

                                {/* Accordion */}
                                {/*              <div className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-slate-900 dark:border-gray-700">*/}
                                {/*                  <button type="button" className="hs-collapse-toggle py-4 px-6 w-full flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" id="hs-basic-collapse" data-hs-collapse="#hs-as-table-collapse">*/}
                                {/*                      <svg className="hs-collapse-open:rotate-90 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>*/}
                                {/*                      Insights*/}
                                {/*                  </button>*/}
                                {/*                  <div id="hs-as-table-collapse" className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-collapse">*/}
                                {/*                      <div className="pb-4 px-6">*/}
                                {/*                          <div className="flex items-center space-x-2">*/}
                                {/*<span className="h-5 w-5 flex justify-center items-center rounded-full bg-blue-600 text-white dark:bg-blue-500">*/}
                                {/*  <svg className="flex-shrink-0 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>*/}
                                {/*</span>*/}
                                {/*                              <span className="text-sm text-gray-800 dark:text-gray-400">*/}
                                {/*  There are no insights for this period.*/}
                                {/*</span>*/}
                                {/*                          </div>*/}
                                {/*                      </div>*/}
                                {/*                  </div>*/}
                                {/*              </div>*/}
                                {/* End Accordion */}

                                {/* Table */}
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                  Company Name
                                                </span>
                                                <div className="hs-tooltip">
                                                    <div className="hs-tooltip-toggle">
                                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                                                        <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700" role="tooltip">
                          Company Name related popup
                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                      Job Title
                    </span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                              Questions
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                              Version
                                            </span>
                                            </div>
                                        </th>



                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                      Last Updated
                    </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-end"></th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading && (
                                        <tr>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center" colSpan={6}>
                                                <div className=" block mt-10 animate-spin center inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>


                                    )}
                                    {interviewQuestions.length > 0 ? interviewQuestions.map((interviewQuestion, coverLetterIndex) => (
                                        <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                        key={"coverLetterIndex_"+coverLetterIndex}>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                        onClick={viewInterviewQuestion} data-doc-id={interviewQuestion._id } data-resume-id={interviewQuestion.resumeObjectId} data-resume-version={interviewQuestion.resumeVersion}
                                                        data-company-name={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}
                                                        data-job-title={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}
                                                >
                                                <span className="block px-6 py-2">
                                                  <span className="font-mono text-sm text-blue-600 dark:text-blue-500">{interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                        onClick={viewInterviewQuestion} data-doc-id={interviewQuestion._id } data-resume-id={interviewQuestion.resumeObjectId} data-resume-version={interviewQuestion.resumeVersion}
                                                        data-company-name={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}
                                                        data-job-title={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}
                                                >
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewInterviewQuestion} data-doc-id={interviewQuestion._id } data-resume-id={interviewQuestion.resumeObjectId} data-resume-version={interviewQuestion.resumeVersion}
                                                        data-company-name={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}
                                                        data-job-title={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                                    <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                    </svg>
                                                   {interviewQuestion.questionCount ? interviewQuestion.questionCount * 5  : 0}
                                                  </span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewInterviewQuestion} data-doc-id={interviewQuestion._id } data-resume-id={interviewQuestion.resumeObjectId} data-resume-version={interviewQuestion.resumeVersion}
                                                        data-company-name={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}
                                                        data-job-title={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                                    <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                    </svg>
                                                    V {interviewQuestion.resumeVersion ? interviewQuestion.resumeVersion : 0}
                                                  </span>
                                                </span>
                                                </button>
                                            </td>

                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal">
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{convertToLocalTime(interviewQuestion.createdAt)}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                    onClick={viewInterviewQuestion} data-doc-id={interviewQuestion._id } data-resume-id={interviewQuestion.resumeObjectId} data-resume-version={interviewQuestion.resumeVersion}
                                                    data-company-name={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.companyName ? interviewQuestion.userContent.jobInformation.companyName : interviewQuestion.userContent.companyName}
                                                    data-job-title={interviewQuestion.userContent && interviewQuestion.userContent.jobInformation && interviewQuestion.userContent.jobInformation.jobTitle ? interviewQuestion.userContent.jobInformation.jobTitle : interviewQuestion.userContent.jobTitle}
                                                >
                                                <span className="px-6 py-1.5">
                                                  <span className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                    <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                      <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z"/>
                                                      <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
                                                    </svg>
                                                    View
                                                  </span>
                                                </span>
                                                </button>
                                            </td>
                                        </tr>

                                    )) :(
                                        <tr>
                                            {!loading && (
                                                <td colSpan="5" className="text-center py-4 text-sm font-medium text-gray-600 dark:text-gray-400 p-5">
                                                    We couldn't find any interview questions yet. Our interview question generator uses details from your resume and the specific job you're targeting to tailor questions for you. To get started, <a href={process.env.SITE_URL+"/user/dashboard/myResume/"} className="text-blue-600">please create or upload your resume first.</a> This way, we can provide you with personalized interview questions that best prepare you for your job search.


                                                </td>
                                            )}

                                        </tr>
                                        )}

                                    </tbody>
                                </table>
                                {/* End Table */}

                                {/* Footer */}
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{interviewQuestions.length}</span> results
                                        </p>
                                    </div>

                                    {/*<div>*/}
                                    {/*    <div className="inline-flex gap-x-2">*/}
                                    {/*        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">*/}
                                    {/*            <svg className="w-3 h-3" width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*                <path d="M10.506 1.64001L4.85953 7.28646C4.66427 7.48172 4.66427 7.79831 4.85953 7.99357L10.506 13.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>*/}
                                    {/*            </svg>*/}
                                    {/*            Prev*/}
                                    {/*        </button>*/}

                                    {/*        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">*/}
                                    {/*            Next*/}
                                    {/*            <svg className="w-3 h-3" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*                <path d="M4.50598 2L10.1524 7.64645C10.3477 7.84171 10.3477 8.15829 10.1524 8.35355L4.50598 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>*/}
                                    {/*            </svg>*/}
                                    {/*        </button>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                                {/* End Footer */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Card */}
            </div>
            {/* End Table Section */}

            {isModalOpenInterviewQuestion && (
            <div
                id="defaultModal"
                tabIndex="-1"
                aria-hidden="true"
                className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full flex">
                <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity"></div> {/* Overlay with semi-transparent background */}

                <div className="relative p-4 w-full max-w-7xl h-full ">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">

                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Interview Question
                            </h3>
                            <button
                                type="button"
                                onClick={()=>{setIsModalOpenInterviewQuestion(!isModalOpenInterviewQuestion)}}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {interviewQuestionPopupData ? (
                            <div >
                                <div className="gap-4 m-2 ">
                                    <div>
                                        <label htmlFor="companyName"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                                        <input type="text" name="companyName" id="companyName"
                                               value={interviewQuestionPopupData.companyName}
                                               readOnly
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               />
                                    </div>
                                    <div>
                                        <label htmlFor="jobTitle"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
                                        <input type="text" name="jobTitle" id="jobTitle"

                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               value={interviewQuestionPopupData.jobTitle}
                                               readOnly/>
                                    </div>


                                    <InterviewQuestionBlock resumeObjectId={resumeObjectId} resumeVersion={resumeVersion}/>

                                    {/*<div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full">*/}


                                    {/*    {interviewQuestionPopupData && interviewQuestionPopupData.length > 0 && interviewQuestionPopupData.map((questionSet, index) => (*/}
                                    {/*        // Rendering each line as a separate paragraph*/}

                                    {/*        <p key={"interviewQuestionsToAskAiGenerate_v2_"+index} className=" mb-4">*/}
                                    {/*            /!*{Object.values(question).map((value, valueIndex) => (*!/*/}

                                    {/*            /!*    <div key={valueIndex}>*!/*/}
                                    {/*            /!*        <>{index+1}. </>*!/*/}
                                    {/*            /!*        <>{value}</>*!/*/}

                                    {/*            /!*    </div>*!/*/}

                                    {/*            /!*))}*!/*/}
                                    {/*            {questionSet && questionSet.parsedOutput.length > 0 && questionSet.parsedOutput.map((question, questionIndex)=>(*/}
                                    {/*                <>*/}
                                    {/*                    <div >*/}
                                    {/*                        <>{(index*5)+questionIndex+1}. </>*/}
                                    {/*                        <>{question.question}</>*/}

                                    {/*                    </div>*/}
                                    {/*                    <div>*/}
                                    {/*                        {question.uuid &&  (*/}

                                    {/*                            <>*/}
                                    {/*                                {question.answers && question.answers.length > 0 ? (*/}
                                    {/*                                    <button*/}
                                    {/*                                        id={'suggest_answer_btn_v2_'+question.uuid}*/}
                                    {/*                                        // onClick={generateInterviewQuestionAnswerStreaming}*/}
                                    {/*                                        data-question-uuid={question.uuid}*/}
                                    {/*                                        data-question={question.question}*/}
                                    {/*                                        data-question-block={index}*/}
                                    {/*                                        className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"*/}
                                    {/*                                    >*/}
                                    {/*                                        <>ReGenerate Suggest Answer</>*/}

                                    {/*                                    </button>*/}
                                    {/*                                ) :(*/}
                                    {/*                                    <button*/}
                                    {/*                                        id={'suggest_answer_btn_v2_'+question.uuid}*/}
                                    {/*                                        // onClick={generateInterviewQuestionAnswerStreaming}*/}
                                    {/*                                        data-question-uuid={question.uuid}*/}
                                    {/*                                        data-question={question.question}*/}
                                    {/*                                        data-question-block={index}*/}
                                    {/*                                        className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"*/}
                                    {/*                                    >*/}
                                    {/*                                        <>Generate Suggest Answer</>*/}

                                    {/*                                    </button>*/}
                                    {/*                                )}*/}


                                    {/*                                <div*/}
                                    {/*                                    id={'suggest_answer_process_v2_'+question.uuid}*/}
                                    {/*                                    style={{display: 'none'}}*/}
                                    {/*                                    className="text-center align-middle mt-5 ">*/}
                                    {/*                                    <div*/}
                                    {/*                                        className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"*/}
                                    {/*                                        role="status">*/}
                                    {/*                                      <span*/}
                                    {/*                                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"*/}
                                    {/*                                      >generating a recommended answer...</span>*/}
                                    {/*                                    </div>*/}
                                    {/*                                    generating a recommended answer...*/}
                                    {/*                                </div>*/}
                                    {/*                            </>*/}

                                    {/*                        )}*/}
                                    {/*                        /!*<div className=""> {!interviewQuestionAnswerGenerate && question.answers && question.answers.length > 0 && (*!/*/}
                                    {/*                        /!*    <div className="p-3">*!/*/}
                                    {/*                        /!*        Answer version : {question.answers.length}*!/*/}
                                    {/*                        /!*    </div>*!/*/}
                                    {/*                        /!*)}</div>*!/*/}
                                    {/*                        <div className="p-3">*/}

                                    {/*                            {question.answers && question.answers[question.answers.length - 1] && question.answers[question.answers.length - 1].answer.map((answer, answerIndex) => (*/}

                                    {/*                                <React.Fragment key={answerIndex}>*/}

                                    {/*                                    {answer.situation && (*/}
                                    {/*                                        <div className="pb-1">*/}
                                    {/*                                            <strong>Situation</strong>  : {answer.situation}*/}
                                    {/*                                        </div>*/}
                                    {/*                                    )}*/}
                                    {/*                                    {answer.task && (*/}
                                    {/*                                        <div className="pb-1">*/}
                                    {/*                                            <strong>Task</strong> : {answer.task}*/}
                                    {/*                                        </div>*/}
                                    {/*                                    )}*/}
                                    {/*                                    {answer.action && (*/}
                                    {/*                                        <div className="pb-1">*/}
                                    {/*                                            <strong>Action</strong> : {answer.action}*/}
                                    {/*                                        </div>*/}
                                    {/*                                    )}*/}
                                    {/*                                    {answer.result && (*/}
                                    {/*                                        <div className="pb-1">*/}
                                    {/*                                            <strong>Result</strong> : {answer.result}*/}
                                    {/*                                        </div>*/}
                                    {/*                                    )}*/}

                                    {/*                                </React.Fragment>*/}
                                    {/*                            ))}*/}

                                    {/*                        </div>*/}
                                    {/*                    </div>*/}
                                    {/*                </>*/}
                                    {/*            ))}*/}


                                    {/*        </p>*/}
                                    {/*    ))}*/}


                                    {/*</div>*/}
                                </div>
                                {/*<button*/}
                                {/*    type="submit"*/}
                                {/*    onClick={() => {*/}
                                {/*        handleCoverLetterDownload()*/}
                                {/*    }}*/}
                                {/*    className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">*/}

                                {/*    Download Interview Question*/}
                                {/*</button>*/}
                            </div>
                        ):(
                            <div className="text-center">
                                <div role="status">

                                    <svg aria-hidden="true"
                                         className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg> Loading...
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>


            </div>
            )}

            {isModalOpenCreateCoverLetter && (
                <div
                    id="defaultModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full flex">
                    <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity"

                    ></div> {/* Overlay with semi-transparent background */}

                    <div className="relative p-4 w-full max-w-7xl h-full ">

                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            <div className="flex justify-between items-center pb-4  rounded-t border-b dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Create a new interview question
                                </h3>
                                <button
                                    type="button"
                                    onClick={()=>{setIsModalOpenCreateCoverLetter(!isModalOpenCreateCoverLetter)}}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                          <CoverLetter />

                        </div>
                    </div>


                </div>
            )}

        </UserDashboardCommonLayout>
    )
}
export default UserDashboardInterviewQuestion;
