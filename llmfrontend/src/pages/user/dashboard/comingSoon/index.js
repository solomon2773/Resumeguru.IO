import React, {Fragment, useEffect, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbGetCoverLetterDataByUserIdAndDocId,
    mongodbGetCoverLetterListByUserId
} from "../../../../helpers/mongodb/pages/user/coverLetter";
import {toast} from "react-toastify";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import CoverLetter from "../../../../components/aiResume/coverLetter";
import {useSelector} from "react-redux";


const UserDashboardMyCoverLetter = () =>{
    const user = useSelector(state => state.user.profile);
    const [coverLetters, setCoverLetters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpenCoverLetter, setIsModalOpenCoverLetter] = useState(false);
    const [coverLetterPopupData, setCoverLetterPopupData] = useState(false);
    const [coverLetterAiGenerated, setCoverLetterAiGenerated] = useState(false);
    const [coverLetterCandidateStrength, setCoverLetterCandidateStrength] = useState(false);
    const [isModalOpenCreateCoverLetter, setIsModalOpenCreateCoverLetter] = useState(false);
    useEffect(() => {

        async function getCoverLetters() {
            setLoading(true);
            if (user && user.userId) {
                mongodbGetCoverLetterListByUserId(user.userId).then((res) => {
                    if (res && res.length > 0) {
                        setCoverLetters(res);
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
            }
        }
        if (user && user.userId) {
            getCoverLetters();
        }
    },[user]);

    //console.log(coverLetters);
    const viewCoverLetter = (event) => {
        setCoverLetterPopupData(false);
        setCoverLetterAiGenerated(false);
        setCoverLetterCandidateStrength(false);
        const _id = event.currentTarget.getAttribute('data-sid');
        if (_id){
            setIsModalOpenCoverLetter(true);
            mongodbGetCoverLetterDataByUserIdAndDocId(user.userId, _id).then((res) => {
                setCoverLetterPopupData(res);
                setCoverLetterAiGenerated(res.parsedOutput.coverLetterAiGenerate);
                setCoverLetterCandidateStrength(res.parsedOutput.coverLetterCandidateStrengthAiGenerate);
                //console.log(res)

            }).catch((err) => {
                console.log(err);
            });
        } else {
            toast.error("Cover letter not found, please contact us.");
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

        saveAs(generatedDoc, "coverLetter_"+encodeURI(coverLetterPopupData.userContent.companyName.replace(/\s+/g, ''))+"_"+encodeURI(coverLetterPopupData.userContent.jobTitle.replace(/\s+/g, ''))+".docx");
        setIsModalOpenCoverLetter(false);
    }

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
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                           Coming Soon
                                        </h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            We are working on this feature, it will be available soon. Please check back later.
                                        </p>
                                    </div>


                                </div>
                                {/* End Header */}


                            </div>
                        </div>
                    </div>
                </div>
                {/* End Card */}
            </div>
            {/* End Table Section */}

            {isModalOpenCoverLetter && (
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
                                Cover Letter
                            </h3>
                            <button
                                type="button"
                                onClick={()=>{setIsModalOpenCoverLetter(!isModalOpenCoverLetter)}}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {coverLetterPopupData ? (
                            <div >
                                <div className="gap-4 m-2 ">
                                    <div>
                                        <label htmlFor="companyName"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                                        <input type="text" name="companyName" id="companyName"
                                               value={coverLetterPopupData.userContent.companyName}
                                               readOnly
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               />
                                    </div>
                                    <div>
                                        <label htmlFor="jobTitle"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
                                        <input type="text" name="jobTitle" id="jobTitle"

                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                               value={coverLetterPopupData.userContent.jobTitle}
                                               readOnly/>
                                    </div>




                                    <div className="sm:col-span-2">
                                        <label htmlFor="coverLetterAiGenerated"
                                               className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Letter Detail : </label>
                                        <div className="mt-2 p-2 bg-gray-50 border border-gray-300 rounded-lg">
                                            {coverLetterAiGenerated.split(/\\n|\n/).map((line, index) => (
                                                <p key={"coverLetterAiGenerate_"+index} className="indent-8 mb-4">{line}</p>
                                            ))}
                                            <li className="flex justify-between py-2 pl-2 pr-2 text-sm leading-6">
                                                <div className="flex flex-wrap justify-start ">
                                                    {coverLetterCandidateStrength && coverLetterCandidateStrength.map((candidateStrength,candidateStrengthIndex)=>{
                                                        return(
                                                            <div key={"coverLetterCandidateStrength_"+candidateStrengthIndex} className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{candidateStrength}</div>
                                                        )
                                                    })}
                                                </div>
                                            </li>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    onClick={() => {
                                        handleCoverLetterDownload()
                                    }}
                                    className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">

                                    Download PDF
                                </button>
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
                                    Create a new cover letter
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
export default UserDashboardMyCoverLetter;
