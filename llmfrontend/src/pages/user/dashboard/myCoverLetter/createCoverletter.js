import React, {Fragment, useEffect, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {
    mongodbGetCoverLetterDataByUserIdAndDocId,
    mongodbGetCoverLetterListByUserId
} from "../../../../helpers/mongodb/pages/user/coverLetter";
import {toast} from "react-toastify";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import CoverLetter from "../../../../components/aiResume/coverLetter";
import SelectClTemplate from "../../../../components/aiResume/selectClTemplate";
import {useSelector} from "react-redux";


const UserDashboardCreateCoverLetter = () =>{
    const user = useSelector(state => state.user.profile);
    const [coverLetters, setCoverLetters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpenCoverLetter, setIsModalOpenCoverLetter] = useState(false);
    const [coverLetterPopupData, setCoverLetterPopupData] = useState(false);
    const [coverLetterAiGenerated, setCoverLetterAiGenerated] = useState(false);
    const [coverLetterCandidateStrength, setCoverLetterCandidateStrength] = useState(false);
    const [isModalOpenCreateCoverLetter, setIsModalOpenCreateCoverLetter] = useState(false);
    const [clCreatePrgress, setClCreatePrgress] = useState(1);
    const [clTemplateData, setClTemplateData] = useState("");
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
            title="User Dashboard - My Cover Letter - Resume Guru"
            meta_title="User Dashboard - My Cover Letter - Resume Guru"
            meta_desc="User Dashboard - My Cover Letter - Resume Guru"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/"}
        >



                    <div className="relative p-4 w-full max-w-7xl h-full ">

                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            <div className="flex justify-between items-center pb-4  rounded-t border-b dark:border-gray-600">
                                    {clCreatePrgress == 1 ? (
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Create a new cover letter
                                        </h3>
                                    ) :(
                                        clCreatePrgress === 2 && (
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Select Cover Letter Template
                                            </h3>
                                        )
                                    )}
                            </div>

                            {clCreatePrgress == 1 ? (
                                <CoverLetter
                                    setClCreatePrgress={setClCreatePrgress}
                                    setClTemplateData={setClTemplateData}
                                />
                            ) :(
                                clCreatePrgress === 2 && (
                                    <SelectClTemplate
                                        setClCreatePrgress={setClCreatePrgress}
                                        clTemplateData={clTemplateData}
                                    />
                                )
                            )}
                        </div>
                    </div>



        </UserDashboardCommonLayout>
    )
}
export default UserDashboardCreateCoverLetter;
