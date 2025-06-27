import React, {Fragment, useEffect, useState} from 'react'
import {useAuth} from "../../../../context/AuthContext";
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbGetLinkedinConnectionMessageListByUserId,

} from "../../../../helpers/mongodb/pages/user/linkedinMessage";
import {toast} from "react-toastify";
import LinkedinMessageBlock from "../../../../components/dashboard/linkedinConnectionMessage/messageBlock";
import {Modal} from "flowbite-react";

import {useSelector} from "react-redux";


const UserDashboardLinkedinMessage = () =>{
    const { } = useAuth()
    const user = useSelector(state => state.user.profile);
    const [linkedinConnectionMessages, setLinkedinConnectionMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpenLinkedinMessage, setIsModalOpenLinkedinMessage] = useState(false);
    const [linkedinConnectionMessagePopupData, setLinkedinConnectionMessagePopupData] = useState({});
    const [resumeObjectId, setResumeObjectId] = useState(false);
    const [resumeVersion, setResumeVersion] = useState(false);
    const [isModalOpenCreateLinkedinMessage, setIsModalOpenCreateLinkedinMessage] = useState(false);



    useEffect(() => {

        async function getLinkedinConnectionMessages() {
            setLoading(true);
            if (user && user.userId) {
                mongodbGetLinkedinConnectionMessageListByUserId(user.userId).then((res) => {
                    if (res && res.length > 0) {
                        setLinkedinConnectionMessages(res);
                    }
                    setLoading(false);
                }).catch((err) => {
                   // console.log(err);
                    setLoading(false);
                });
            }
        }
        if (user && user.userId) {

            getLinkedinConnectionMessages();
        }
    },[user]);

    //console.log(LinkedinMessage);
    const viewLinkedInConnectionMessage = (event) => {
        setLinkedinConnectionMessagePopupData(false);

        const resumeObjectId = event.currentTarget.getAttribute('data-resume-id');
        const resumeVersion = event.currentTarget.getAttribute('data-resume-version');
        const jobTitle = event.currentTarget.getAttribute('data-job-title');
        const jobCompany = event.currentTarget.getAttribute('data-company-name');
        setResumeObjectId(resumeObjectId);
        setResumeVersion(resumeVersion);
        setIsModalOpenLinkedinMessage(true);
        if (resumeObjectId && resumeVersion) {

                setLinkedinConnectionMessagePopupData({
                    jobTitle: jobTitle,
                    companyName: jobCompany,
                });

        } else {

            toast.error("Linkedin connection message not found, please contact us.");
            return;
        }

    }



    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - My LinkedIn Connection Message - Resume Guru"
            meta_title="User Dashboard - My LinkedIn Connection Message - Resume Guru"
            meta_desc="User Dashboard - My LinkedIn Connection Message - Resume Guru"
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
                                            onClick={() => {
                                                // All features are now free
                                                setIsModalOpenCreateLinkedinMessage(true)
                                            }}
                                            className="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">
                                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                            Create Message On-demand
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            LinkedIn Connection Message List
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            A personalized LinkedIn connection message, tailored to the recipient and their professional interests, significantly enhances your chances of building a meaningful network. By demonstrating that you understand their career or industry and highlighting commonalities, you're more likely to engage in valuable conversations and foster professional relationships.
                                            <br></br>
                                            Here you can find all of your LinkedIn Connection Message for each job description or manually created. The best way to help you to connect to a recruiter or hiring manager.
                                            <br></br>
                                            On-demand LinkedIn Connection Message is a feature that allows you to create a personalized LinkedIn connection message for a specific job description or company. You can use this feature to create a message that is tailored to the recipient's professional interests and highlights commonalities between you and the recipient. This feature can help you to engage in valuable conversations and foster professional relationships.
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
                                                  Messages
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
                                                  Last Message
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
                                    {linkedinConnectionMessages.length > 0 ? linkedinConnectionMessages.map((message, messageIndex) => (
                                        <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                        key={"LinkedinMessageIndex_"+messageIndex}>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewLinkedInConnectionMessage} data-resume-id={message.resumeObjectId} data-resume-version={message.resumeVersion} data-company-name={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName} data-job-title={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="font-mono text-sm text-blue-600 dark:text-blue-500">{message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewLinkedInConnectionMessage} data-resume-id={message.resumeObjectId} data-resume-version={message.resumeVersion} data-company-name={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName} data-job-title={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewLinkedInConnectionMessage} data-resume-id={message.resumeObjectId} data-resume-version={message.resumeVersion} data-company-name={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName} data-job-title={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">

                                                   {message.messageCount ? message.messageCount : 0} Msgs
                                                  </span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={viewLinkedInConnectionMessage} data-resume-id={message.resumeObjectId} data-resume-version={message.resumeVersion} data-company-name={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName} data-job-title={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}>
                                                <span className="block px-6 py-2">
                                                  <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">

                                                    v{message.resumeVersion ? message.resumeVersion : 0}
                                                  </span>
                                                </span>
                                                </button>
                                            </td>

                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal">
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{convertToLocalTime(message.createdAt)}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                    onClick={viewLinkedInConnectionMessage} data-resume-id={message.resumeObjectId} data-resume-version={message.resumeVersion} data-company-name={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.companyName ? message.userContent.jobInformation.companyName : message.userContent.companyName} data-job-title={message.userContent && message.userContent.jobInformation && message.userContent.jobInformation.jobTitle ? message.userContent.jobInformation.jobTitle : message.userContent.jobTitle}>
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
                                            <td colSpan="5" className="text-center py-4 text-sm font-medium text-gray-600 dark:text-gray-400 p-5">
                                                We haven't crafted any LinkedIn connection messages yet. Our personalized message generator draws from your resume and the specific professionals or roles you're targeting to create tailored outreach for you. To begin, you can start from here or <a href={process.env.SITE_URL+"/user/dashboard/myResume/"} className="text-blue-600"> start from creating your resume.</a> This enables us to generate LinkedIn connection messages that are customized for you, ensuring you make the best impression in your networking efforts.

                                            </td>
                                        </tr>
                                        )}

                                    </tbody>
                                </table>
                                {/* End Table */}

                                {/* Footer */}
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{linkedinConnectionMessages.length}</span> results
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

            {isModalOpenLinkedinMessage && (
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
                                LinkedIn Connection Message
                            </h3>
                            <button
                                type="button"
                                onClick={()=>{setIsModalOpenCreateLinkedinMessage(!isModalOpenLinkedinMessage)}}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {linkedinConnectionMessagePopupData ? (
                            <div >
                                <div className="gap-4 m-2 ">
                                    <div>
                                        <label htmlFor="companyName"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                                        <input type="text" name="companyName" id="companyName"
                                               value={linkedinConnectionMessagePopupData.companyName}
                                               readOnly
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               />
                                    </div>
                                    <div>
                                        <label htmlFor="jobTitle"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
                                        <input type="text" name="jobTitle" id="jobTitle"

                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               value={linkedinConnectionMessagePopupData.jobTitle}
                                               readOnly/>
                                    </div>




                                    <div className="sm:col-span-2">

                                       <LinkedinMessageBlock resumeObjectId={resumeObjectId} resumeVersion={resumeVersion} />
                                    </div>
                                </div>

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

            {isModalOpenCreateLinkedinMessage && (
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
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Create a new linkedin connection message
                                </h2>
                                <button
                                    type="button"
                                    onClick={()=>{setIsModalOpenCreateLinkedinMessage(!isModalOpenCreateLinkedinMessage)}}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                          <LinkedinMessageBlock dataInputType={"standAlone"}/>

                        </div>
                    </div>


                </div>
            )}

        </UserDashboardCommonLayout>
    )
}
export default UserDashboardLinkedinMessage;
