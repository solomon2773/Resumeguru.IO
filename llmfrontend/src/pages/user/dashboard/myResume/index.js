import React, {Fragment, useContext, useEffect, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbGetResumeListByUserId
} from "../../../../helpers/mongodb/pages/user/resume";
import {useSelector} from "react-redux";


const UserDashboardMyResume = () =>{
    const user = useSelector(state => state.user.profile);

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);


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


    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Resume Guru"
            meta_title="User Dashboard - Resume Guru"
            meta_desc="User Dashboard - Resume Guru"
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

                                        <a href={process.env.SITE_URL+"/user/dashboard/myResume/createResume/"}>
                                            <div
                                                className="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">
                                                <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                                Create New Resume
                                            </div>
                                        </a>

                                    </div>
                                </div>
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            My Resume List
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Here you can find all of your resume.
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
                                              Template Name
                                            </span>
                                                <div className="hs-tooltip">
                                                    <div className="hs-tooltip-toggle">
                                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                                                        <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700" role="tooltip">
                                                          Template Name related popup
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                  Company Name
                                                </span>

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
                                              Version Number
                                            </span>
                                            </div>
                                        </th>



                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                  Last Version Created
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
                                    {resumes.length > 0 && resumes.map((resume, resumeIndex) => (
                                        <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                        key={"resumeIndex_"+resumeIndex}  onClick={()=>{
                                            window.location.href=process.env.SITE_URL+"/user/dashboard/myResume/"+resume.resumes[0]._id.toString();
                                        }} data-sid={resume._id}
                                        >
                                            <td className="h-px w-px whitespace-nowrap"
                                            >
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                        onClick={()=>{
                                                            window.location.href=process.env.SITE_URL+"/user/dashboard/myResume/"+resume.resumes[0]._id.toString();
                                                        }} data-sid={resume._id}
                                                >
                                                <span className="block px-6 py-2">
                                                  <span className="font-mono text-sm text-blue-600 dark:text-blue-500">{resume._id && resume._id}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                        onClick={()=>{
                                                            window.location.href=process.env.SITE_URL+"/user/dashboard/myResume/"+resume.resumes[0]._id.toString();
                                                        }} data-sid={resume._id}
                                                >
                                                <span className="block px-6 py-2">
                                                     {resume.resumes && resume.resumes[0].resumeBasicInfo && resume.resumes[0].resumeBasicInfo.aiTargetResume ? (
                                                         <span className="font-mono text-sm text-blue-600 dark:text-blue-500">

                                                             <div className="text-sm leading-6 ">  {resume.resumes && resume.resumes[0] && resume.resumes[0].companyName ? resume.resumes[0].companyName : "N/A"}</div>
                                                         </span>
                                                     ):(
                                                         <span className="font-mono text-sm text-blue-600 dark:text-blue-500">

                                                             <div className="text-sm leading-6 ">{resume.resumes && resume.resumes[0].resumeBasicInfo && resume.resumes[0].resumeBasicInfo.companyName ? resume.resumes[0].resumeBasicInfo.companyName : "N/A"}</div>

                                                         </span>
                                                     )}

                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal">
                                                <span className="block px-6 py-2">
                                                    {resume.resumes && resume.resumes[0].resumeBasicInfo && resume.resumes[0].resumeBasicInfo.aiTargetResume ? (
                                                        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">

                                                             <div className="text-sm leading-6 ">  {resume.resumes && resume.resumes[0] && resume.resumes[0].jobTitle ? resume.resumes[0].jobTitle : "N/A"}</div>
                                                         </span>
                                                    ):(
                                                        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">

                                                             <div className="text-sm leading-6 ">{resume.resumes && resume.resumes[0].resumeBasicInfo ? resume.resumes[0].resumeBasicInfo.jobTitle : resume.resumes[0].jobTitle}</div>

                                                         </span>
                                                    )}

                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal" onClick={()=>{
                                                    window.location.href=process.env.SITE_URL+"/user/dashboard/myResume/"+resume.resumes[0]._id.toString();
                                                }} data-sid={resume._id}>
                                                <span className="block px-6 py-2">
                                                  <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                                    {/*<svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">*/}
                                                    {/*  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>*/}
                                                    {/*</svg>*/}
                                                     V.{resume.resumes && resume.resumes[0].version}
                                                  </span>
                                                </span>
                                                </button>
                                            </td>

                                            <td className="h-px w-px whitespace-nowrap">
                                                <button type="button" className="block" data-hs-overlay="#hs-ai-invoice-modal">
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{resume.resumes && resume.resumes.length > 0 && convertToLocalTime(resume.resumes[0].lastUpdate)}</span>
                                                </span>
                                                </button>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    className="block" data-hs-overlay="#hs-ai-invoice-modal"
                                                    onClick={()=>{
                                                        window.location.href=process.env.SITE_URL+"/user/dashboard/myResume/"+resume.resumes[0]._id.toString();
                                                    }} data-sid={resume._id}>
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

                                    ))}

                                    </tbody>
                                </table>
                                {/* End Table */}

                                {/* Footer */}
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{resumes.length}</span> results
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



        </UserDashboardCommonLayout>
    )
}
export default UserDashboardMyResume;
