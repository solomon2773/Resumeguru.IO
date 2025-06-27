import React, { useEffect,  useState, } from 'react'

import {PaperClipIcon} from "@heroicons/react/20/solid";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { Button } from "flowbite-react";


const OriginalResumeBlock = ({resumeData, userData, setTemplateData, setResumeTemplateSelectProgress}) => {

    //console.log(resumeData)

    const handleSelectTemplate = async (e) => {
        // Read the Word document template
        e.preventDefault();

        const data = {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email,
            "phoneNo":userData.phoneNumber? userData.phoneNumber : "xxx-xxx-xxxx",
            "city":userData.city? userData.city : "My Location",
            "jobTitle":resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.jobTitle ? resumeData.resumeBasicInfo.jobTitle.replace(/[^a-zA-Z]+/g, '') : "jobTitle",
            "overviewRewriteTitle":resumeData.overviewRewrite.overviewRewriteTitle,
            "overviewRewrite":resumeData.overviewRewrite.overviewRewrite,
            "professionalExperience": resumeData.professionalExperienceRewrite,
            "education": resumeData.resumeOriginalData.education,
            "certifications": resumeData.certifications ? resumeData.certifications : false,
            "languages": resumeData.languages,
            };
        setTemplateData(data);
        setResumeTemplateSelectProgress(2);
    }

    const handleWordDownloadOriginal = async (e) => {
        // Read the Word document template


        const  response = await fetch(process.env.SITE_URL +'/templates/ResumeTemplate2pagesV1.docx');

        const template = await response.arrayBuffer();

        // Create a new instance of the Docxtemplater library
        const doc = new Docxtemplater();

        // Load the template using PizZip
        const zip = new PizZip(template);
        doc.loadZip(zip);

        // Set the template data
        const data = {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email,
            "phoneNo":userData.phoneNumber? userData.phoneNumber : "xxx-xxx-xxxx",
            "city":userData.city? userData.city : "My Location",
            "overviewRewrite":resumeData.resumeOriginalData.overview,
            "professionalExperience": resumeData.resumeOriginalData.professionalExperiences,
            "education": resumeData.resumeOriginalData.education,
            "qualificationsAndSkills": resumeData.resumeOriginalData.qualificationsAndSkills,

        };
        doc.setData(data);

        // Render the document
        doc.render();

        // Generate the Word document
        const generatedDoc = doc.getZip().generate({ type: 'blob' });
        let companyName = "companyName"
        let jobTitle = "jobTitle"
        if(resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.aiTargetResume){
            companyName = resumeData.postBodyJDInfoExtract && resumeData.postBodyJDInfoExtract.companyName ? resumeData.postBodyJDInfoExtract.companyName.replace(/[^a-zA-Z]+/g, '') : "companyName";
            jobTitle = resumeData.postBodyJDInfoExtract && resumeData.postBodyJDInfoExtract.jobTitle ? resumeData.postBodyJDInfoExtract.jobTitle.replace(/[^a-zA-Z]+/g, '') : "jobTitle";
        }   else {
            companyName = resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.companyName ? resumeData.resumeBasicInfo.companyName.replace(/[^a-zA-Z]+/g, '') : "companyName";
            jobTitle = resumeData.resumeBasicInfo && resumeData.resumeBasicInfo.jobTitle ? resumeData.resumeBasicInfo.jobTitle.replace(/[^a-zA-Z]+/g, '') : "jobTitle";
        }
        // Trigger the file download
        saveAs(generatedDoc, "ResumeGuruIO_"+companyName+'_'+jobTitle+'.docx');
    }

    return (
        <div className="pt-4 sm:pt-2 ">
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900 sr-only">Original Resume</h3>
                {/*<p className="mt-1 max-w-2xl text-sm leading-6 ">This is the original resume. </p>*/}
            </div>
            <div className=" border-t border-gray-100">

                {/*<div className="md:grid md:grid-cols-4 md:gap-4 border-b border-gray-900/10 pb-3 ">*/}
                {/*    <div className=" md:mb-0 md:col-span-3 ">*/}
                {/*        <div className="px-4 sm:px-0">*/}

                {/*    </div>*/}
                {/*    </div>*/}
                {/*    <div className="ml-auto mr-auto md:col-span-1 flex items-center justify-center m-2" >*/}
                {/*    <div className="ml-auto mr-0" >*/}

                {/*        <Button outline*/}
                {/*                onClick={handleSelectTemplate}*/}
                {/*                gradientDuoTone="purpleToBlue">*/}
                {/*            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />*/}
                {/*            Select Download Template*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div>
                    <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0 bg-white">

                        <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <div className="flex flex-row items-end  pt-5 px-[1.4cm]">
                                <div className="grow">
                                    <h1 className="font-bold text-center text-[1.65em] leading-inherit text-[#2E3D50] font-serif">
                                        {userData.firstName} {userData.lastName}
                                    </h1>
                                    <div className="flex flex-row flex-wrap gap-1 items-center pt-[2px] justify-center text-[#2E3D50] font-light text-[0.75em]">
                                        <div className="flex flex-row gap-1 items-center mr-1">
                                            <div className="after:content-[,]">
                                                {userData.city ? userData.city : "My Location"}
                                            </div>
                                        </div>
                                        <span className="flex flex-row gap-1 items-center mr-1">
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M20.016 8.016V6L12 11.016 3.984 6v2.016L12 12.985zm0-4.032q.797 0 1.383.609t.586 1.406v12q0 .797-.586 1.406t-1.383.609H3.985q-.797 0-1.383-.609t-.586-1.406v-12q0-.797.586-1.406t1.383-.609z"></path></svg>
                                              <div>{userData.email}</div>
                                            </span>
                                                                            <span className="flex flex-row gap-1 items-center mr-1">
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M19.5 0h-15A1.5 1.5 0 0 0 3 1.5v21A1.5 1.5 0 0 0 4.5 24h15a1.5 1.5 0 0 0 1.5-1.5v-21A1.5 1.5 0 0 0 19.5 0M18 18H6V3h12z"></path></svg>
                                              <div>{userData.phoneNumber ? userData.phoneNumber : "123-123-1234"}</div>
                                            </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-100">
                                <div className="divide-y divide-gray-100">

                                    {/*Overview*/}
                                    <div className="px-4 py-2 sm:px-0 m-2">
                                        <div className="text-xl font-large leading-6 text-black-900 ">
                                            <div className="font-bold">
                                                Overview
                                            </div>
                                        </div>

                                        <div className="m-2 flex text-sm leading-2 text-black-900 sm:mt-0 p-2">
                                                      <span className="flex-grow">
                                                          {/*<div className="font-bold mt-2 mb-2 text-sm">{resumeData.overviewRewrite.overviewRewriteTitle}</div>*/}
                                                          <div className="mt-2 mb-2 p-2 text-sm">{resumeData.resumeOriginalData.overview}</div>
                                                      </span>
                                        </div>
                                    </div>
                                    {/*Skills*/}

                                    {resumeData.resumeOriginalData.skills && (
                                        <div className="px-4 py-2 sm:px-0 m-2">
                                            <div className="text-xl font-large leading-6 text-black-900 ">
                                                <div className="font-bold">
                                                    Skills
                                                </div>
                                            </div>
                                            <div className="m-2 flex text-sm leading-2 text-black-900 sm:mt-0 p-2">
                                                        <span className="flex-grow">
                                                            {resumeData.resumeOriginalData.skills}
                                                        </span>

                                            </div>
                                        </div>
                                    )}



                                    {/*Qualifications / Certifications*/}
                                    {resumeData.resumeOriginalData.certifications && (
                                        <div className="px-4 py-2 sm:px-0 m-2">
                                            <div className="text-xl font-large leading-6 text-black-900 ">
                                                <div className="font-bold">
                                                    Qualifications / Certifications
                                                </div>
                                            </div>
                                            <div className="m-2 flex text-sm leading-2 text-black-900 sm:mt-0 p-2">
                                                      <span className="flex-grow">
                                                          {resumeData.resumeOriginalData.certifications}
                                                      </span>
                                                {/*<span className="ml-4 flex-shrink-0">*/}
                                                {/*    <button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">*/}
                                                {/*      Update*/}
                                                {/*    </button>*/}
                                                {/*</span>*/}
                                            </div>
                                        </div>
                                    )}

                                    {/*professionalExperiences*/}
                                    <div className="px-4 py-2 sm:px-0 m-2">
                                        <div className="text-xl font-large leading-6 text-black-900 "><div className="font-bold">Professional Experiences</div></div>
                                        <div className="m-2  text-sm leading-2 text-black-900 sm:mt-0 p-2">
                                            {resumeData.resumeOriginalData && resumeData.resumeOriginalData.professionalExperiences && resumeData.resumeOriginalData.professionalExperiences.map((professionalExperience, professionalExperienceIndex) => (
                                                <React.Fragment key={"professionalExperience_ai_"+professionalExperienceIndex} >
                                                    <div className="text-sm font-medium leading-6 text-gray-900">

                                                        {/*<div className=" flex-shrink-0  ">*/}
                                                        {/*    <button type="button" className="m-2 rounded-md bg-white font-medium p-1 text-indigo-600 hover:text-indigo-500">*/}
                                                        {/*        Regenerate*/}
                                                        {/*    </button>*/}
                                                        {/*    <button type="button" className="m-2 rounded-md bg-white font-medium p-1 text-indigo-600 hover:text-indigo-500">*/}
                                                        {/*        Edit*/}
                                                        {/*    </button>*/}
                                                        {/*</div>*/}




                                                    </div>
                                                    <div className="mt-2  text-sm leading-6 text-black-900  sm:mt-0">
                                                                <span className="font-bold">
                                                                {professionalExperience.professionalExperienceTitle} {professionalExperience.companyName}  ( {professionalExperience.jobStartDate} {professionalExperience.jobEndDate ? " - "+professionalExperience.jobEndDate : ' - Present'})
                                                                </span>


                                                    </div>
                                                    <div key={"professionalExperienceRewrite_dd_"+professionalExperienceIndex} className="mt-1 text-sm leading-6 text-black-900  sm:mt-0">


                                                            <div className="ps-5 mt-2 space-y-1 p-2 ">
                                                                {professionalExperience.professionalExperienceDescription}
                                                            </div>

                                                    </div>


                                                </React.Fragment>
                                            )) }
                                        </div>



                                    </div>

                                    {/*educations*/}
                                    <div className="px-4 py-2 sm:px-0 m-2">
                                        <div className="text-xl font-large leading-6 text-black-900 ">
                                            <div className="font-bold">
                                                Education
                                            </div>
                                        </div>

                                        <div className="m-2  text-sm leading-2 text-black-900 sm:mt-0 p-2">
                                            {resumeData.resumeOriginalData && resumeData.resumeOriginalData.education && resumeData.resumeOriginalData.education.map((education, educationIndex) => (

                                                <div key={"educationAI_dt_"+educationIndex} className="mt-1 p-2 text-sm leading-6 text-gray-700  sm:mt-0">
                                                            <span className="flex-grow">
                                                            {education.degree} in {education.fieldOfStudy} ( {education.startDate} {education.endDate ? " - "+education.endDate : ' - Present'})
                                                                <br/>
                                                                {education.school}
                                                            </span>
                                                    {/*                    <span className="ml-4 flex-shrink-0">*/}
                                                    {/*<button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">*/}
                                                    {/*  Update*/}
                                                    {/*</button>*/}
                                                    {/*</span>*/}

                                                </div>
                                            )) }

                                        </div>



                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default OriginalResumeBlock;
