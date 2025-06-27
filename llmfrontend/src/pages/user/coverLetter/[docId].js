import React, {useState, useEffect, Fragment} from 'react'
import CommonLayout from "../../../components/Layout/MainLayout";
import { useRouter } from 'next/router';
import {toast} from "react-toastify";
import { saveAs } from 'file-saver';
import {mongodbGetCoverLetterDataByUserIdAndDocId} from "../../../helpers/mongodb/pages/user/coverLetter";
// import {CheckCircleIcon, ChevronDownIcon} from "@heroicons/react/20/solid";
// import {Menu, Transition} from "@headlessui/react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {useSelector} from "react-redux";



const coverLetterDetail = () => {
    const user = useSelector(state => state.user.profile);
    const [coverLetterData, setCoverLetterData] = useState(null);
    const [jobDescriptionResult, setJobDescriptionResult] = useState(null);
    const [coverLetterAiGenerated, setCoverLetterAiGenerated] = useState(null);
    const [coverLetterCandidateStrength, setCoverLetterCandidateStrength] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { docId } = router.query;

    //console.log(coverLetterData)
    useEffect(() => {
        async function getCoverLetterDetail() {
            setLoading(true);
            if (user && user.userId && docId) {
                mongodbGetCoverLetterDataByUserIdAndDocId(user.userId, docId).then(
                    (res) => {
                        if (res) {
                            setCoverLetterData(res);
                            setCoverLetterAiGenerated(res.parsedOutput.coverLetterAiGenerate);
                            setCoverLetterCandidateStrength(res.parsedOutput.coverLetterCandidateStrengthAiGenerate);
                            setLoading(false);
                        }
                    }
                )
            }
        }
        if (user && user.userId && docId) {
            getCoverLetterDetail();
        }

    },[docId]);

    const handleCoverLetterDownload = async (e) => {

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


        //console.log("coverLetterLines", coverLetterLines)
        // Set the template data
        const data = {
            "firstName": coverLetterData.userInfo.firstName,
            "lastName": coverLetterData.userInfo.lastName,
            "email": coverLetterData.userInfo.email,
            "phoneNo":coverLetterData.userInfo.phoneNo,
            "city":coverLetterData.userInfo.city,
            "coverLetterAiGenerate":coverLetterLines,
            "coverLetterCandidateStrengthMessageContent":top4Strengths,

        };
        doc.setData(data);

        // Render the document
        doc.render();

        // Generate the Word document
        const generatedDoc = doc.getZip().generate({ type: 'blob' });
        // Trigger the file download

        saveAs(generatedDoc, "coverLetter_"+user.firstName+user.lastName+"_"+encodeURI(coverLetterData.userContent.companyName.replace(/\s+/g, ''))+".docx");
    }
    //console.log(customerData)
    return (
        <CommonLayout
            parent="user"
            title="User - Cover Letter Detail"
            meta_title={process.env.SEO_DEFAULT_TITLE}
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >

            {loading ?(
                <div className="flex justify-center items-center">
                    {error ? () => toast("Error loading order data") : (
                        <>Loading order data...</>
                    )}

                </div>
            ):(
                <div className="bg-gray-50 dark:bg-slate-900 pt-3 pb-3">
                {/* CoverLetterData */}
                    {coverLetterData && (
                        <div
                            className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
                            <form>
                                <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900">
                                    <div className="pb-10 sm:pb-10">
                                        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                            <h1 className=" p-4 text-center sr-only">AI Generate Cover Letter Detail </h1>


                                        </div>


                                        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:max-w-6xl lg:px-8">
                                            <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-4 pb-2 border-b-2">


                                                <div className="mt-2 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                                                    <div className="col-start-1 col-end-5 mt-2">


                                                        <div className="mt-2">
                                                            <label htmlFor="jdTemplateName" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Company Name
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="jdTemplateName"
                                                                    id="jdTemplateName"
                                                                    readOnly
                                                                    value={coverLetterData.userContent.companyName}
                                                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder="Ex: Template for Software Engineer	 - 1"
                                                                    aria-describedby="email-description"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <h2 className="sr-only">Details for your job description</h2>
                                                    <div className="grid grid-cols-1  lg:gap-8">
                                                        <div className="">
                                                            {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                                                            {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                                                            <fieldset className="mt-2">


                                                                <div className="space-y-2 sm:block  w-full h-auto">

                                                                    <div className="mt-2">

                                                                        {/*Future Job Info*/}
                                                                        <div className=" mb-3 border-b-2 ">
                                                                            <div>
                                                                                <legend className="sr-only">Original Job description</legend>
                                                                                <label htmlFor="jobDescirption" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                    Original Job description
                                                                                </label>
                                                                                <div className="mt-2">
                                                                                    <textarea
                                                                                        rows={3}
                                                                                        name="jobDescirption"
                                                                                        id="jobDescirption"
                                                                                        readOnly
                                                                                        value={coverLetterData.jobDescriptionDetails[0].postBodyJDInfoExtract.futureJobDescription}
                                                                                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                                        placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                                                                                    />
                                                                                </div>



                                                                            </div>
                                                                        </div>


                                                                    </div>

                                                                </div>




                                                            </fieldset>
                                                        </div>
                                                    </div>


                                                </div>



                                                {/*<div className="col-start-1 col-end-5 mt-2">*/}
                                                {/*    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        First name*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="text"*/}
                                                {/*            name="first-name"*/}
                                                {/*            id="first-name"*/}
                                                {/*            placeholder={"First Name"}*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-start-5 col-end-9 mt-2">*/}
                                                {/*    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        Last name*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="text"*/}
                                                {/*            name="last-name"*/}
                                                {/*            id="last-name"*/}
                                                {/*            placeholder={"Last Name"}*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-start-9 col-end-13 mt-2">*/}
                                                {/*    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        Email*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="email"*/}
                                                {/*            name="email"*/}
                                                {/*            id="email"*/}
                                                {/*            placeholder={"abc@def.com"}*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-start-1 col-end-5 mt-2">*/}
                                                {/*    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        Phone No.*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="text"*/}
                                                {/*            name="phone"*/}
                                                {/*            id="phone"*/}
                                                {/*            placeholder="123-456-7890"*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-start-5 col-end-9 mt-2">*/}
                                                {/*    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        City*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="text"*/}
                                                {/*            name="city"*/}
                                                {/*            id="city"*/}
                                                {/*            placeholder="Dallas"*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-start-9 col-end-13 mt-2">*/}
                                                {/*    <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                {/*        State*/}
                                                {/*    </label>*/}
                                                {/*    <div className="mt-2">*/}
                                                {/*        <input*/}
                                                {/*            type="text"*/}
                                                {/*            name="state"*/}
                                                {/*            id="state"*/}
                                                {/*            placeholder="Texas"*/}
                                                {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}





                                            </div>
                                            <div className="col-start-1 col-end-13 mt-2">
                                                {/*<AdvanceFeatureCoverLetter*/}
                                                {/*    onSelectionChange={handleAdvanceFeatureData}*/}
                                                {/*    advanceFeatureInitial={advanceFeatureData}/>*/}
                                            </div>
                                            { jobDescriptionResult && (
                                                <div className="mt-8 p-4 bg-white">
                                                    <div

                                                        className="prose prose-sm mt-4 text-black bg-white"

                                                    >
                                                        <h2 className="mt-3 font-medium"> Job Description Key information for {jobDescriptionResult && jobDescriptionResult.jobTitle && "  "+jobDescriptionResult.jobTitle} {jobDescriptionResult && jobDescriptionResult.companyName && " @ "+jobDescriptionResult.companyName}</h2>
                                                        <div className="flex flex-col">
                                                            <div>
                                                                <h2 className="mt-1 p-2">Job Title : {jobDescriptionResult.jobTitle}</h2>
                                                                <h2 className="mt-1 p-2">Company Name : {jobDescriptionResult.companyName}</h2>
                                                                {jobDescriptionResult.salaryRange && (
                                                                    <h2 className="mt-1 p-2">Salary Range : {jobDescriptionResult.salaryRange}</h2>
                                                                )}
                                                                {jobDescriptionResult.location && (
                                                                    <h2 className="mt-1 p-2">Work Location : {jobDescriptionResult.location}</h2>
                                                                )}

                                                            </div>

                                                            <div>
                                                                <h2 className="mt-1 p-2">Key Responsibilities : </h2>
                                                                <ul role="list" className="list-disc list-inside">
                                                                    {jobDescriptionResult && jobDescriptionResult.keyResponsibilities && jobDescriptionResult.keyResponsibilities.map((keyResponsibility, i) => {
                                                                        return (
                                                                            <div key={"keyResponsibilities-" + i} className="indent-8">
                                                                                <div>
                                                                                    {i+1 + ". "} {keyResponsibility ?  keyResponsibility : ""}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h2 className="mt-1 p-2">Required Skills : </h2>
                                                                <ul role="list" className="list-disc list-inside">
                                                                    {jobDescriptionResult && jobDescriptionResult.requiredSkills && jobDescriptionResult.requiredSkills.map((skill, i) => {
                                                                        return (
                                                                            <div key={"requiredSkills-" + i} className="indent-8">
                                                                                <div>
                                                                                    {i+1 + ". "} {skill ?  skill : ""}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>
                                                            {jobDescriptionResult && jobDescriptionResult.qualifications && jobDescriptionResult.qualifications.length > 0 && (
                                                                <div>
                                                                    <h2 className="mt-1 p-2">Qualifications : </h2>
                                                                    <ul role="list" className="list-disc list-inside">
                                                                        {jobDescriptionResult.qualifications.map((qualification, i) => {
                                                                            return (
                                                                                <div key={"qualifications-" + i} className="indent-8">
                                                                                    <div>
                                                                                        {i+1 + ". "} {qualification ?  qualification : ""}
                                                                                    </div>

                                                                                </div>

                                                                            )
                                                                        })}
                                                                    </ul>
                                                                </div>

                                                            )}
                                                        </div>


                                                    </div>
                                                </div>

                                            )}

                                            {coverLetterAiGenerated && (
                                                <div className="mt-8 p-4 bg-white">
                                                    {coverLetterAiGenerated.split(/\\n|\n/).map((line, index) => (
                                                        <p key={"coverLetterAiGenerate_"+index} className="indent-8 mb-4">{line}</p>
                                                    ))}
                                                    <li className="flex justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                        <div className="flex flex-wrap justify-start ">
                                                            {coverLetterCandidateStrength && coverLetterCandidateStrength.map((candidateStrength,candidateStrengthIndex)=>{
                                                                return(
                                                                    <div key={"coverLetterCandidateStrength_"+candidateStrengthIndex} className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{candidateStrength}</div>
                                                                )
                                                            })}
                                                        </div>
                                                    </li>
                                                </div>
                                            )}


                                                <div className="mt-8 lg:col-span-12">
                                                    <button
                                                        type="button"

                                                        onClick={handleCoverLetterDownload}
                                                        className="group inline-flex items-center cursor-pointer justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                    >
                                                        Download Cover Letter
                                                    </button>

                                                </div>




                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        )}

                {/* End CoverLetterData */}
                </div>
            )}

        </CommonLayout>
    )
}

export default coverLetterDetail;
