import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import {Button, Datepicker, Dropdown, Label, Modal, Textarea, TextInput, Spinner} from "flowbite-react";

import { useDispatch, useSelector } from 'react-redux';
import EducationBlock from "./educationBlock";
import ExperienceBlock from "./experienceBlock";
import OverviewBlock from "./overviewBlock";
import SkillsBlock from "./skillsBlock";
import {
    setResumeEditRightDrawer,
    setResumeEditRightDrawerTab,
    setResumeTemplateDetails,
    updateSkillsHighlight
} from "../../../store/resumeEditReducer";
import CertificationEditBlock from "./certificationEditBlock";

const EditResumeBlock = () => {
   const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)
    const user = useSelector(state => state.user)
    const skillsHighlight = useSelector(state => state.resumeEdit.skillsHighlight)
    const resumeScore = useSelector(state => state.resumeScore)

    const { updateMergeUserData } = useAuth()


    const [profileEditModal, setProfileEditModal] = useState(false)
    const [profileEditProcessing, setProfileEditProcessing] = useState(false)

    // console.log(resumeDetails)
    const profileEditHandler = async () => {
        try {
            setProfileEditProcessing(true)
            const updatedProfile = {
                firstName: document.getElementById("profileFirstName").value,
                lastName: document.getElementById("profileLastName").value,
                email: document.getElementById("profileEmail").value,
                phoneNumber: document.getElementById("profilePhoneNo").value,
                city: document.getElementById("profileLocationCity").value,
                region : document.getElementById("profileRegion").value,

            }
           // console.log(updatedProfile)
            if (updatedProfile.firstName === "" || updatedProfile.lastName === "" || updatedProfile.email === "" || updatedProfile.phoneNumber === "" || updatedProfile.city === "" ) {
                setProfileEditProcessing(false)
                toast.error("Please fill all required fields")
                return
            }

            // await dispatch(updateUserBasicProfile(updatedProfile))
            // await mongodbUpdateBasicUserProfile(user.profile.userId, updatedProfile)
            updateMergeUserData(user.profile.userId,
                {
                    firstName:updatedProfile.firstName,
                    lastName:updatedProfile.lastName,
                    phoneNumber:updatedProfile.phoneNumber ? updatedProfile.phoneNumber : '',
                    city:updatedProfile.city ? updatedProfile.city : '',
                    email:updatedProfile.email,
                    region:updatedProfile.region ? updatedProfile.region : '',
                }).then((result) => {
                //    console.log(result)
                //reloadRealmUser().then(() => {
                setProfileEditProcessing(false)
                setProfileEditModal(false)
                toast.success('Profile updated successfully');
                // })

            })

        } catch (e) {
           // console.log(e)
            setProfileEditProcessing(false)
            toast.error("Error updating profile")
        }
    }


    const [totalResumeScore, setTotalResumeScore] = useState(0)
    const [scoreColor, setScoreColor] = useState("failure")

    useEffect(() => {

        setTotalResumeScore(((Number(resumeScore.sectionCompletion.totalScore) + Number(resumeScore.contentQuality.workExperienceTotalScore)) / 2).toFixed(2))
        if (Number(totalResumeScore) < 50) {
            setScoreColor("failure")
        } else if (Number(totalResumeScore) < 70) {
            setScoreColor("pink")
        } else if (Number(totalResumeScore) < 85) {
            setScoreColor("purple")
        } else {
            setScoreColor("success")
        }


    },[resumeScore, resumeDetails, totalResumeScore])

    const checkScoreBth = () => {
        const data = {
            "firstName": user.profile.firstName ? user.profile.firstName : "Resume",
            "lastName": user.profile.lastName ? user.profile.lastName : "Guru",
            "email": user.profile.email ? user.profile.email : "info@resumeguru.io",
            "phoneNo":user.profile.phoneNumber? user.profile.phoneNumber : "800-800-8000",
            "city":user.profile.city? user.profile.city : "Dallas, Tx",
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
        dispatch(setResumeEditRightDrawerTab("score"));
    }

    return (

    <div>
        <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-5 sm:mt-0 bg-white">



            <div className="divide-y divide-gray-100 rounded-md ">

                <div className="flex">
                    {totalResumeScore > 0 && (
                        <div className="left-0">
                            <label className="inline-flex items-center cursor-pointer m-2">
                                <Button gradientMonochrome={scoreColor} size="sm" onClick={checkScoreBth}>ResumeScore : {totalResumeScore}</Button>
                            </label>
                        </div>
                    )}

                    <div className="right-0">
                        {resumeDetails && resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0 && (
                            <label className="inline-flex items-center cursor-pointer m-2">
                                <input type="checkbox" value="" className="sr-only peer" checked={skillsHighlight}
                                       onClick={ ()=>{
                                           // setSkillsHighlight(!skillsHighlight);
                                           dispatch(updateSkillsHighlight(!skillsHighlight));
                                       }}
                                       onChange={()=>{
                                           dispatch(updateSkillsHighlight(!skillsHighlight));
                                       }}

                                />
                                <div
                                    className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Highlight Skills</span>
                            </label>
                        )}
                    </div>



                </div>

                <div className="flex flex-row items-end  pt-2 px-[1.4cm]">

                    <div className="grow cursor-pointer"
                    onClick={()=>{setProfileEditModal(true);}}>
                        <h1 className="font-bold text-center text-[1.65em] leading-inherit text-[#2E3D50] font-serif">
                            {user.profile && user.profile.firstName ? user.profile.firstName : ""} {user.profile && user.profile.lastName ? user.profile.lastName : ""}
                        </h1>
                        <div className="flex flex-row flex-wrap gap-1 items-center pt-[2px] justify-center text-[#2E3D50] font-light text-[0.75em]">
                            {user.profile && user.profile.city && (
                            <div className="flex flex-row gap-1 items-center mr-1">
                                <div className="after:content-[,]">
                                    {user.profile.city } {user.profile.region ? ", " + user.profile.region : ""}
                                </div>
                            </div>
                            )}
                            {user.profile && user.profile.emailHistory && user.profile.emailHistory.length > 0 ? (
                                <span className="flex flex-row gap-1 items-center mr-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M20.016 8.016V6L12 11.016 3.984 6v2.016L12 12.985zm0-4.032q.797 0 1.383.609t.586 1.406v12q0 .797-.586 1.406t-1.383.609H3.985q-.797 0-1.383-.609t-.586-1.406v-12q0-.797.586-1.406t1.383-.609z"></path></svg>
                                                  <div>{user.profile.emailHistory[user.profile.emailHistory.length - 1] }</div>
                            </span>
                            ) : (
                                <span className="flex flex-row gap-1 items-center mr-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M20.016 8.016V6L12 11.016 3.984 6v2.016L12 12.985zm0-4.032q.797 0 1.383.609t.586 1.406v12q0 .797-.586 1.406t-1.383.609H3.985q-.797 0-1.383-.609t-.586-1.406v-12q0-.797.586-1.406t1.383-.609z"></path></svg>
                                                  <div>{user.profile.email }</div>
                            </span>
                            )}
                            {user.profile && user.profile.phoneNumber && (
                            <span className="flex flex-row gap-1 items-center mr-1">
                                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[0.9em] h-[0.9em] fill-[#2E3D50]"><path d="M19.5 0h-15A1.5 1.5 0 0 0 3 1.5v21A1.5 1.5 0 0 0 4.5 24h15a1.5 1.5 0 0 0 1.5-1.5v-21A1.5 1.5 0 0 0 19.5 0M18 18H6V3h12z"></path></svg>
                                                   <div>{user.profile.phoneNumber}</div>
                            </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100">
                    <div className="divide-y divide-gray-100">

                        {/*Overview*/}
                        <OverviewBlock />

                        {/*Skills*/}
                        <SkillsBlock />

                        {/*Qualifications / Certifications*/}
                        <CertificationEditBlock />


                        {/*professionalExperiences*/}
                        <ExperienceBlock />

                        {/*educations*/}
                        <EducationBlock />

                    </div>
                </div>

            </div>
        </div>


        <Modal show={profileEditModal} onClose={() => setProfileEditModal(false)}
        >
            <Modal.Header>Profile detail update</Modal.Header>
            <Modal.Body>
                <div>
                    <div className="mb-2 mt-2 block">
                        <Label htmlFor="profileFirstName" value="First Name *" />
                    </div>
                    <TextInput
                        id="profileFirstName"
                        name="profileFirstName"
                        defaultValue={user.profile && user.profile.firstName ? user.profile.firstName : ""}
                        required/>
                    <div className="mb-2 mt-2 block">
                        <Label htmlFor="profileLastName" value="Last Name *" />
                    </div>
                    <TextInput
                        id="profileLastName"
                        name="profileLastName"
                        defaultValue={user.profile && user.profile.lastName ? user.profile.lastName : ""}
                        required/>
                    <div className="mb-2 mt-2 block">
                        <Label htmlFor="profileEmail" value="E-mail *" />
                    </div>
                    <TextInput
                        id="profileEmail"
                        name="profileEmail"
                        defaultValue={user.profile && user.profile.emailHistory && user.profile.emailHistory.length > 0  ? user.profile.emailHistory[user.profile.emailHistory.length - 1] : (user.profile.email ? user.profile.email : "abc@resumeguru.io")}
                        required/>
                    <div className="mb-2 mt-2 block">
                        <Label htmlFor="profilePhoneNo" value="Phone Number *" />
                    </div>
                    <TextInput
                        id="profilePhoneNo"
                        name="profilePhoneNo"
                        defaultValue={user.profile && user.profile.phoneNumber ? user.profile.phoneNumber : ""}
                        />
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <div className="mb-2 mt-2 block">
                                <Label htmlFor="profileLocationCity" value="City *" />
                            </div>
                            <TextInput
                                id="profileLocationCity"
                                name="profileLocationCity"
                                defaultValue={user.profile && user.profile.city ? user.profile.city : ""}
                            />
                        </div>
                        <div className="w-1/2">
                            <div className="mb-2 mt-2 block">
                                <Label htmlFor="profileRegion" value="State/Province" />
                            </div>
                            <TextInput
                                id="profileRegion"
                                name="profileRegion"
                                defaultValue={user.profile && user.profile.region ? user.profile.region : ""}
                            />
                        </div>
                    </div>

                    <div className="mb-2 mt-2 block">
                        <Label  value="* Required fields" />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue"
                        onClick={() => profileEditHandler()}
                        isProcessing={profileEditProcessing}

                >Update</Button>
                {!profileEditProcessing && (
                    <Button color="gray" onClick={() => setProfileEditModal(false)}>
                        Close
                    </Button>
                )}

            </Modal.Footer>
        </Modal>



    </div>
  )
}
export default EditResumeBlock;
