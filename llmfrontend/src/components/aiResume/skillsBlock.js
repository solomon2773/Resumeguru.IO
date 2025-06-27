import React, { useEffect,  useState, useRef } from 'react'
import { toast } from "react-toastify";

import {TextInput, Tooltip, Button, Modal, Label} from "flowbite-react";
import {QuestionMarkCircleIcon} from  "@heroicons/react/24/outline";
import {  useSelector } from 'react-redux';
import { Spinner } from "flowbite-react";

const SkillsBlock = ({upsertedId, experienceProcessing, skillProcessing}) => {
    const [openRecommendSkillsModal, setOpenRecommendSkillsModal] = useState(false);
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)



    const handleSkillsClickAction =  () => {
        if (!experienceProcessing && !skillProcessing){
            window.location.href = process.env.SITE_URL+"/user/dashboard/myResume/"+upsertedId
        } else {
            toast.error("Please wait for the processing to complete.")
        }

    }


    return (
        <div className="max-w-7xl px-2 py-2 sm:px-2 lg:px-2 lg:py-2 mx-auto">
              <h2 className="mt-3 mb-3 font-bold text-xl flex">
                     Skills ({resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0 ? resumeDetails.skillsRewrite.existingSkills.length : 0})
                  <Tooltip content="You can add new skills in the edit page. " style="light" placement="right" className="flex"><QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer flex"/></Tooltip>
                  {!experienceProcessing && !skillProcessing ?(
                          <div className="mb-2 block">
                              <div className="inline-block m-2">
                                  <Button color="light" size="xs"  onClick={() => handleSkillsClickAction()}>Add New Skill</Button>
                              </div>
                          </div>


                  ): (
                      <div className="mb-2 block text-center">
                      <Spinner aria-label="Skills Processing" />
                      </div>
                  )}



              </h2>




            {resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0 && resumeDetails.skillsRewrite.existingSkills.map(
                (item, index) => (
                    <div
                        key={"existingSkills-"+index}
                        onClick={() => {handleSkillsClickAction()}}
                        className="group relative bg-blue-500 hover:bg-gray-300 text-white px-4 py-2 rounded-full inline-block cursor-pointer overflow-hidden m-2">
                      <span className="text-opacity-100 group-hover:text-gray-600 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                        {item.skillName}
                      </span>
                        <span
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-4xl transition-opacity duration-300 ease-in-out">
                      -
                    </span>
                    </div>

                )
            )}
            <div className="">
                {( (resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.missingSkills && resumeDetails.skillsRewrite.missingSkills.length > 0) ||
                    (resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.recommendedSkills && resumeDetails.skillsRewrite.recommendedSkills.length > 0)
                ) && (
                    <div>
                        <h3 className="mt-3 mb-3 text-sm flex">Recommend Skills : <Tooltip content="Click on a skill to edit, add to Sills, or remove from recommend skills " style="light" placement="right" className="flex"><QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer flex"/></Tooltip></h3>

                    </div>
                )}
                {resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.missingSkills && resumeDetails.skillsRewrite.missingSkills.length > 0 && resumeDetails.skillsRewrite.missingSkills.map(
                    (item, index) => {
                        if (item.skillName && item.uuid){
                            return(

                                <div key={"missingSkills-"+index} className="group relative bg-red-500 hover:bg-gray-300 text-white px-4 py-2 rounded-full inline-block cursor-pointer overflow-hidden m-2">
                      <span className="text-opacity-100 group-hover:text-gray-600 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                        {item.skillName}
                      </span>
                                    <span
                                        onClick={(e) => {handleSkillsClickAction()}}
                                        data-skill-name={item.skillName}
                                        data-skill-description={item.skillDescription ? item.skillDescription : ""}
                                        data-skill-uuid={item.uuid}
                                        data-skill-type="missingSkills"
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-4xl transition-opacity duration-300 ease-in-out">
                      +
                    </span>
                                </div>
                            )
                        }

                    }
                )}


                {resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.recommendedSkills && resumeDetails.skillsRewrite.recommendedSkills.length > 0 && resumeDetails.skillsRewrite.recommendedSkills.map(
                    (item, index) => (
                        <div key={"recommendedSkills-"+index} className="group relative bg-orange-500 hover:bg-gray-300 text-white px-4 py-2 rounded-full inline-block cursor-pointer overflow-hidden m-2">
                          <span className="text-opacity-100 group-hover:text-gray-600 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                            {item.skillName}
                          </span>
                            <span
                                onClick={(e) => {handleSkillsClickAction()}}
                                data-skill-name={item.skillName}
                                data-skill-description={item.skillDescription ? item.skillDescription : ""}
                                data-skill-uuid={item.uuid}
                                data-skill-type="recommendedSkills"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-4xl transition-opacity duration-300 ease-in-out">
                              +
                            </span>

                        </div>
                    )
                )}
            </div>


        </div>
    )
}
export default SkillsBlock;
