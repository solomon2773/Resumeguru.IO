import React, { useEffect,  useState, useRef } from 'react'
import { toast } from "react-toastify";
import { mongodbAddNewSkill, mongodbMoveResumeDetailsSkills} from "../../../helpers/mongodb/components/myResume/Edit/skillBlock";
import {addNewResumeDetailsSkills, updateResumeDetailsSkills, moveResumeDetailsSkills} from "../../../store/resumeEditReducer";
import {TextInput, Tooltip, Button, Modal, Label} from "flowbite-react";
import {QuestionMarkCircleIcon} from  "@heroicons/react/24/outline";
import {v4 as uuidv4} from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';


const SkillsBlock = () => {
    const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)

   // const [skillsAnalyzeProcessing, setSkillsAnalyzeProcessing] = useState(false);
    const [openRecommendSkillsModal, setOpenRecommendSkillsModal] = useState(false);
    const newSkill = useRef("");



    const handleSkillsRewriteAction =  (skillName, skillType, skillUUID) => {
        // if (skillsAnalyzeProcessing){
        //     return toast.error("Skills processing is not ready. Please wait a moment. ")
        // }
        let mutableResumeDetails =  _.cloneDeep(resumeDetails);; // shallow clone of resumeDetails


        let targetCategory;
        if (skillType === "existingSkills") {
            targetCategory = "missingSkills"; // Define your logic to determine the target category
        } else if (skillType === "missingSkills") {
            targetCategory = "existingSkills"; // Define your logic to determine the target category
        } else if (skillType === "recommendedSkills") {
            targetCategory = "existingSkills"; // Adjust as needed based on your application logic
        }

        // if (!Array.isArray(resumeDetails.skillsRewrite[skillType])) {
        //     toast("Error moving skill. Please try again.1")
        //     return;
        // } else if (!Array.isArray(resumeDetails.skillsRewrite[targetCategory])) {
        //     toast("Error moving skill. Please try again.2")
        //     return;
        // }

        // Ensure skillsRewrite exists and initialize the skillType and targetCategory if they don't exist
        if (!mutableResumeDetails.skillsRewrite) {
            mutableResumeDetails.skillsRewrite = {};
        }

        if (!Array.isArray(mutableResumeDetails.skillsRewrite[skillType])) {
            mutableResumeDetails.skillsRewrite[skillType] = [];  // Initialize skillType array if it doesn't exist
        }
        if (!Array.isArray(mutableResumeDetails.skillsRewrite[targetCategory])) {
            mutableResumeDetails.skillsRewrite[targetCategory] = [];  // Initialize targetCategory array if it doesn't exist
        }
        if (targetCategory) {
            let fromSkills = [...mutableResumeDetails.skillsRewrite[skillType]];
            let toSkills = [...mutableResumeDetails.skillsRewrite[targetCategory]];
            const skillIndex = fromSkills.findIndex(skill => skill.uuid === skillUUID);

            if (skillIndex !== -1) {
                // Create a new skill object to avoid modifying the existing one
                let skillToMove = {
                    ...fromSkills[skillIndex],
                    name: skillName,
                    skillName: skillName,
                };
                // Remove the original skill from the fromSkills array
                fromSkills.splice(skillIndex, 1);

                if (!Array.isArray(toSkills)) {
                    toSkills = [];
                }
                // Add the new skill object to the target array
                toSkills.push(skillToMove);

                // Dispatch the action with the updated arrays
                dispatch(moveResumeDetailsSkills({
                    skillFromIndex: skillIndex,
                    skillTypeFrom: skillType,
                    skillTypeTo: targetCategory,
                }));
                mongodbMoveResumeDetailsSkills(
                    resumeDetails._id,
                    skillIndex,
                    skillType,
                    targetCategory).then((result) => {

                }).catch((error) => {
                    toast.error("Error moving skill. Please try again.")
                })
            }
        }
        setOpenRecommendSkillsModal(false);

    }



    const addNewSkill = async () => {
        // if (newSkill.current.value !== "") {
        if (newSkill.current && newSkill.current.value && newSkill.current.value.trim() !== "") {
            // if (
            //     resumeDetails &&
            //     resumeDetails.skillsRewrite &&
            //     Array.isArray(resumeDetails.skillsRewrite.existingSkills)
            // ) {
                // Handle case where existingSkills array is empty
                let newId;
                if (resumeDetails && resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && Array.isArray(resumeDetails.skillsRewrite.existingSkills) && resumeDetails.skillsRewrite.existingSkills.length > 0) {
                    const lastSkillId = parseInt(
                        resumeDetails.skillsRewrite.existingSkills[resumeDetails.skillsRewrite.existingSkills.length - 1].id
                    );
                    newId = (lastSkillId + 1).toString();
                } else {
                    // Set a default ID if no skills exist yet (starting ID as "1")
                    newId = "1";
                }
                await dispatch(addNewResumeDetailsSkills({
                    skillType: "existingSkills",
                    newSkill: {
                        id: newId,
                        skillName: newSkill.current.value,
                        uuid: uuidv4(),
                        type: "manualAddition",
                    }
                }))
                await mongodbAddNewSkill(
                    resumeDetails._id,
                    {
                        id: newId,
                        skillName: newSkill.current.value,
                        uuid: uuidv4(),
                        type: "manualAddition",
                    },
                ).then((result) => {

                }).catch((err) => {
                    toast.error("Skills update error 1101...");
                });
                newSkill.current.value = "";
            // } else {
            //         toast.error("Error retrieving skills data. Please check the resume details.");
            //        // console.error("resumeDetails or skillsRewrite is undefined or invalid.");
            //     }
        } else {
            // Notify the user to enter a valid skill
            toast.error("Please enter a valid skill.");
        }
    }




    const [editSkillInput, setEditSkillInput] = useState("");
    const [editSkillDescriptionInput, setEditSkillDescriptionInput] = useState("");
    const [addToSkillBtnSkillType, setAddToSkillBtnSkillType] = useState("");
    const [addToSkillBtnSkillUUID, setAddToSkillBtnSkillUUID] = useState("");
    const handleSkillsRecommendationEditClick = (e) => {
        setOpenRecommendSkillsModal(true)
        // if (skillsAnalyzeProcessing){
        //     return toast.error("Skills processing is not ready. Please wait a moment. ")
        // }

        const skillName = e.target.getAttribute("data-skill-name");
        const skillDescription = e.target.getAttribute("data-skill-description");
        const skillType = e.target.getAttribute("data-skill-type");
        const skillUUID = e.target.getAttribute("data-skill-uuid");

        setEditSkillInput(skillName)
        setEditSkillDescriptionInput(skillDescription)
        setAddToSkillBtnSkillType(skillType)
        setAddToSkillBtnSkillUUID(skillUUID)


    }

    const handleSkillRemoveAction = ( skillType, skillUUID) => {
        // if (skillsAnalyzeProcessing){
        //     return toast.error("Skills processing is not ready. Please wait a moment. ")
        // }
        const fromSkills = [...resumeDetails.skillsRewrite[skillType]]; // Copy the array to avoid direct mutation
        const updatedSkillArray = fromSkills.filter(skill => skill.uuid !== skillUUID); // Filter out the skill by UUID
        dispatch(updateResumeDetailsSkills({
            skillType: skillType,
            updatedSkillArray: updatedSkillArray
        }));

        setOpenRecommendSkillsModal(false);
    }
    return (
        <div className="max-w-7xl px-2 py-2 sm:px-2 lg:px-2 lg:py-2 mx-auto">
              <h2 className="mt-3 mb-3 font-bold text-xl flex">
                     Skills ({resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0 ? resumeDetails.skillsRewrite.existingSkills.length : 0})
                  <Tooltip content="You can add new skill from the input box or by clicking on the recommend skills. " style="light" placement="right" className="flex"><QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer flex"/></Tooltip>
                  <TextInput id="newSkillInput" name="newSkillInput" type="text" ref={newSkill} sizing="sm" className="inline-block w-1/2  m-2" shadow placeholder="Enter new skill here"/>
                  <div className="mb-2 block">
                      <div className="inline-block m-2">
                          <Button color="light" size="xs"  onClick={() => addNewSkill()}>Add New Skill</Button>
                      </div>
                  </div>


              </h2>

            {/*{skillsAnalyzeProcessing && (*/}
            {/*    <div className="text-center align-middle mt-5">*/}

            {/*        <div*/}
            {/*            className="mr-5 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"*/}
            {/*            role="status">*/}
            {/*      <span*/}
            {/*          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"*/}
            {/*      >Analyze Skills...</span*/}
            {/*      >*/}
            {/*        </div>*/}
            {/*        Analyzing Skills ...*/}

            {/*    </div>*/}
            {/*)}*/}


            {resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.existingSkills && resumeDetails.skillsRewrite.existingSkills.length > 0 && resumeDetails.skillsRewrite.existingSkills.map(
                (item, index) => (
                    <div
                        key={"existingSkills-"+index}
                        onClick={() => {handleSkillsRewriteAction(item.skillName, "existingSkills", item.uuid)}}
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
                    (item, index) => (
                        <div key={"missingSkills-"+index} className="group relative bg-red-500 hover:bg-gray-300 text-white px-4 py-2 rounded-full inline-block cursor-pointer overflow-hidden m-2">
                      <span className="text-opacity-100 group-hover:text-gray-600 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                        {item.skillName}
                      </span>
                            <span
                                onClick={(e) => {handleSkillsRecommendationEditClick(e)}}
                                data-skill-name={item.skillName}
                                data-skill-description={item.skillDescription ? item.skillDescription : ""}
                                data-skill-uuid={item.uuid}
                                data-skill-type="missingSkills"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-4xl transition-opacity duration-300 ease-in-out">
                      +
                    </span>
                        </div>
                    )
                )}


                {resumeDetails.skillsRewrite && resumeDetails.skillsRewrite.recommendedSkills && resumeDetails.skillsRewrite.recommendedSkills.length > 0 && resumeDetails.skillsRewrite.recommendedSkills.map(
                    (item, index) => (
                        <div key={"recommendedSkills-"+index} className="group relative bg-orange-500 hover:bg-gray-300 text-white px-4 py-2 rounded-full inline-block cursor-pointer overflow-hidden m-2">
                          <span className="text-opacity-100 group-hover:text-gray-600 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                            {item.skillName}
                          </span>
                            <span
                                onClick={(e) => {handleSkillsRecommendationEditClick(e)}}
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

            <Modal dismissible show={openRecommendSkillsModal} onClose={() => setOpenRecommendSkillsModal(false)}>
                <Modal.Header>Edit Recommend Skills</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">

                        <div className="mb-2 mt-2 block">
                            <Label className="font-bold" htmlFor={"editSkillNameInput"} value="Skill Name :*" />
                        </div>
                        <TextInput id="editSkillNameInput" name="editSkillNameInput"
                                   type="text"
                                   defaultValue={editSkillInput}
                                   onChange={(e) => setEditSkillInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="Enter a skill here"
                                   />
                        <div className="mb-2 mt-2 block">
                            <Label className="font-bold" htmlFor={"editSkillDescriptionInput"} value="Skill Description :(Optional)" />
                        </div>
                        <TextInput id="editSkillDescriptionInput" name="editSkillDescriptionInput"
                                   type="text"
                                   defaultValue={editSkillDescriptionInput}
                                   onChange={(e) => setEditSkillDescriptionInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="Enter a skill description here"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="blue"
                        onClick={(e) => {handleSkillsRewriteAction( editSkillInput,addToSkillBtnSkillType, addToSkillBtnSkillUUID)}}

                    >Add to Skills</Button>
                    <Button color="gray"
                            size="xs"
                            onClick={() => {
                                handleSkillRemoveAction( addToSkillBtnSkillType, addToSkillBtnSkillUUID)
                            }}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default SkillsBlock;
