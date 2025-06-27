import React, {   useState } from 'react'
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaGripVertical, FaBars, FaRegQuestionCircle} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Dropdown, DropdownItem } from 'flowbite-react';
import {TextInput, Tooltip, Button, Modal, Label, Spinner, Textarea} from "flowbite-react";
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import {updateResumeDetailsEducation, removeResumeDetailsEducation, addResumeDetailsEducation, updateResumeDetailsEducationOrder} from "../../../store/resumeEditReducer";
import {
    mongodbUpdateResumeEducation,
    mongodbRemoveResumeEducation,
    mongodbAddNewResumeEducation,
    mongodbUpdateResumeEducationOrder
} from "../../../helpers/mongodb/components/myResume/Edit/educationBlock";

const EducationBlock = () => {
    const parseDate = async (dateString) => {
        if (!dateString) return null;
        const [year, month] = dateString.split('-');
        return new Date(year, month - 1); // Month is 0-indexed in JS Date
    };
    const formatDate =  (date) => {
        if (date && date.getMonth() && date.getFullYear()){
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            //   const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            const year = date.getFullYear();
            return `${year}-${month}`; //`${month}-${day}-${year}`;
        } else {
            return "";
        }

    };
    const dispatch = useDispatch();
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails)
    const [educationEditRemoveModal, setEducationEditRemoveModal] = useState(false);
    const [educationEditModal, setEducationEditModal] = useState(false);
    const [educationEditIndex, setEducationEditIndex] = useState(0);
    const [educationEditDetails, setEducationEditDetails] = useState({});
    const [educationEditEndDate, setEducationEditEndDate] = useState(null);
    const [updateEducationProcessing , setUpdateEducationProcessing] = useState(false);
    const [educationRemoveProcessing , setEducationRemoveProcessing] = useState(false);
    const [educationAddNewModal, setEducationAddNewModal] = useState(false);
    const [addNewEducationProcessing , setAddNewEducationProcessing] = useState(false);
    const [educationAddNewEndDate , setEducationAddNewEndDate] = useState(null);


    const removeEducationHandler = async (index)=> {
        setEducationRemoveProcessing(true);
        dispatch(removeResumeDetailsEducation({index: index}))
        await mongodbRemoveResumeEducation(resumeDetails._id, index).then((response) => {
            setEducationEditRemoveModal(false);
            setEducationRemoveProcessing(false);
        }).catch((error) => {
            console.log(error)
            setEducationRemoveProcessing(false);
            toast.error("Error removing education")
        })



    }
    const addNewEducationHandler = async () => {
        setAddNewEducationProcessing(true);
        const newEducation = {
            school: document.getElementById("educationEdit_shcool_new").value,
            fieldOfStudy:  document.getElementById("educationEdit_fieldOfStudy_new").value,
            degree : document.getElementById("educationEdit_degree_new").value,
            endDate : document.getElementById("educationEdit_endDate_new").value,
            grade : document.getElementById("educationEdit_grade_new").value,
            additionalInfo : document.getElementById("educationEdit_additionalInfo_new").value,
            uuid: uuidv4()
        }
        dispatch(addResumeDetailsEducation(newEducation));
        await mongodbAddNewResumeEducation(resumeDetails._id, newEducation).then((response) => {
            setAddNewEducationProcessing(false);
            setEducationAddNewModal(false);

        }).catch((error) => {
            console.log(error)
            setAddNewEducationProcessing(false);
            setEducationAddNewModal(false);
            toast.error("Error adding new education")
        })


    }
    const updateEducationHandler = async () => {


        const educationEditData = {
            schoolName : document.getElementById("educationEdit_shcool_"+educationEditIndex).value,
            fieldOfStudy : document.getElementById("educationEdit_fieldOfStudy_"+educationEditIndex).value,
            degree : document.getElementById("educationEdit_degree_"+educationEditIndex).value,
            endDate : document.getElementById("educationEdit_endDate_"+educationEditIndex).value,
            grade : document.getElementById("educationEdit_grade_"+educationEditIndex).value,
            additionalInfo : document.getElementById("educationEdit_additionalInfo_"+educationEditIndex).value,
        }
        // console.log(educationEditData)
        setUpdateEducationProcessing(true);
        dispatch(updateResumeDetailsEducation({
            index: educationEditIndex,
            data: {
                school: educationEditData.schoolName,
                degree: educationEditData.degree,
                fieldOfStudy: educationEditData.fieldOfStudy,
                endDate: educationEditData.endDate,
                grade: educationEditData.grade,
                additionalInfo: educationEditData.additionalInfo
            }
        }))


        await mongodbUpdateResumeEducation(

             resumeDetails._id,
             educationEditIndex,
             {
                school: educationEditData.schoolName,
                degree: educationEditData.degree,
                fieldOfStudy: educationEditData.fieldOfStudy,
                endDate: educationEditData.endDate,
                grade: educationEditData.grade,
                additionalInfo: educationEditData.additionalInfo
            },


        )
            .then((result) => {


            }).catch((error) => {
                console.log(error)
                setUpdateEducationProcessing(false);
                setEducationEditModal(false);
                toast.error("Update education error ...")
            })
        setUpdateEducationProcessing(false);
        setEducationEditModal(false);

    }

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        dispatch(updateResumeDetailsEducationOrder({oldIndex: source.index, newIndex: destination.index})) ;
        mongodbUpdateResumeEducationOrder(resumeDetails._id, source.index, destination.index).then((response) => {
           console.log(response)
        }).catch((error) => {
            console.log(error)

        })
    };
    return(

        <div>
            <div className="px-4 py-2 sm:px-0 m-2">
                <div className="text-xl font-large leading-6 text-black-900 ">
                    <div className="font-bold">
                        Education
                    </div>
                </div>
                <div className="mb-2 block">
                    <div className="inline-block m-2">
                        <Button color="light" size="xs"  onClick={() => setEducationAddNewModal(true)}>Add New Education</Button>
                    </div>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="educationHistoryDragDropContext">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {resumeDetails && resumeDetails.resumeOriginalData && resumeDetails.resumeOriginalData.education && resumeDetails.resumeOriginalData.education.map((education, educationIndex) => (
                                    <Draggable key={educationIndex} draggableId={educationIndex.toString()} index={educationIndex}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="m-1 text-sm leading-2 text-black-900 sm:mt-0 p-2 bg-white rounded shadow relative border border-transparent hover:border-gray-600 hover:bg-gray-50 cursor-grabbing"
                                            >
                                                {education &&(
                                                    <>
                                                        <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                                            <FaGripVertical />
                                                        </div>
                                                        <div
                                                            key={`educationAI_dt_${educationIndex}`}
                                                            className=" p-2 text-sm leading-6 text-gray-700 sm:mt-0 "
                                                        >
                                                    <span className="flex-grow">
                                                {education.school ? `${education.school}, ` : ''}
                                                        <br />
                                                        {education.degree ? `${education.degree}, ` : ''}{education.fieldOfStudy}
                                                        <br />
                                                        {education.grade && `Grade: ${education.grade}, `}{education.endDate && `Graduation: ${education.endDate}`}
                                                        <br />
                                                        {education.additionalInfo ? `${education.additionalInfo}` : ''}
                                                    </span>
                                                        </div>
                                                        <div className="absolute top-2 right-2 cursor-pointer">
                                                            <Dropdown inline placement="bottom" renderTrigger={() => <span><FaBars/></span>} size="sm">
                                                                <DropdownItem onClick={() =>  {
                                                                    setEducationEditModal(true);
                                                                    setEducationEditIndex(educationIndex);
                                                                    setEducationEditDetails(education);
                                                                }}>Edit</DropdownItem>
                                                                <DropdownItem onClick={() =>  {
                                                                    setEducationEditIndex(educationIndex);
                                                                    setEducationEditRemoveModal(true);
                                                                }}>Remove</DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </>

                                                )}


                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>

            <Modal show={educationEditRemoveModal} onClose={() => setEducationEditRemoveModal(false)}
            >
                <Modal.Header>Remove Education</Modal.Header>
                <Modal.Body>
                    <div>

                        <div>
                            Are you sure you want to remove this education from your resume?
                        </div>



                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="red"
                            onClick={() => removeEducationHandler(educationEditIndex)}
                            isProcessing={educationRemoveProcessing}

                    >Remove</Button>
                    {!educationRemoveProcessing && (
                        <Button color="gray" onClick={() => setEducationEditRemoveModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
            <Modal show={educationEditModal} onClose={() => setEducationEditModal(false)}
            >
                <Modal.Header>Edit Education</Modal.Header>
                <Modal.Body>
                    <div>

                        {
                            educationEditDetails ? (
                                <div className="">
                                    <div className="mb-2 mt-2 block ">
                                        <Label className="font-bold" htmlFor={"educationEdit_shcool_"+educationEditIndex} value="School Name" />
                                    </div>
                                    <TextInput id={"educationEdit_shcool_"+educationEditIndex}
                                               name={"educationEdit_school_"+educationEditIndex}
                                               defaultValue={educationEditDetails.school}
                                               required/>
                                    <div className="mb-2 mt-2 block ">
                                        <Label className="font-bold" htmlFor={"educationEdit_fieldOfStudy_"+educationEditIndex} value="Field of Study" />
                                    </div>
                                    <TextInput id={"educationEdit_fieldOfStudy_"+educationEditIndex}
                                               name={"educationEdit_fieldOfStudy_"+educationEditIndex}
                                               defaultValue={educationEditDetails.fieldOfStudy}
                                               required/>
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_degree_"+educationEditIndex} value="Degree" />
                                    </div>
                                    <TextInput id={"educationEdit_degree_"+educationEditIndex}
                                               name={"educationEdit_degree_"+educationEditIndex}
                                               defaultValue={educationEditDetails.degree}
                                               required/>
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_endDate_"+educationEditIndex} value="Graduation Date" />
                                    </div>
                                    <DatePicker
                                        id={"educationEdit_endDate_"+educationEditIndex}
                                        name={"educationEdit_endDate_"+educationEditIndex}
                                        showMonthYearPicker
                                        selected={educationEditEndDate}
                                        className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                                        dateFormat="yyyy-MMMM"
                                        onChange={(date) => {setEducationEditEndDate(formatDate(date))}}
                                    />
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_grade_"+educationEditIndex} value="Grade" />
                                    </div>
                                    <TextInput id={"educationEdit_grade_"+educationEditIndex}
                                               name={"educationEdit_grade_"+educationEditIndex}
                                               defaultValue={educationEditDetails.grade ? educationEditDetails.grade : ""}
                                               />
                                    <div className="mb-2 mt-2 block flex">
                                        <Label className="font-bold " htmlFor={"educationEdit_additionalInfo_"+educationEditIndex} value="Additional Information" />

                                        <Tooltip content="Something else you want to mention about this eduction record? (i.e: the classes you took? projects you are proud of.) " style="light" placement="right" >
                                            <div className="p-1 center"><FaRegQuestionCircle className=" h-3 w-3 cursor-pointer flex"/></div>
                                        </Tooltip>
                                    </div>
                                    <Textarea id={"educationEdit_additionalInfo_"+educationEditIndex}
                                              name={"educationEdit_additionalInfo_"+educationEditIndex}
                                              placeholder="Something else you want to mention about this eduction record? (i.e: the classes you took? projects you are proud of.) "
                                              rows={4}
                                              defaultValue={educationEditDetails.additionalInfo ? educationEditDetails.additionalInfo : ""}
                                    />

                                </div>
                            ):(
                                <div className="text-center">
                                    <Spinner aria-label="Loading education error"  size="lg"/>
                                </div>
                            )
                        }




                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue"
                            onClick={() => updateEducationHandler()}
                            isProcessing={updateEducationProcessing}

                    >Update</Button>
                    {!updateEducationProcessing && (
                        <Button color="gray" onClick={() => setEducationEditModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
            <Modal show={educationAddNewModal} onClose={() => setEducationAddNewModal(false)}
            >
                <Modal.Header>Add New Education</Modal.Header>
                <Modal.Body>
                    <div>

                                <div className="">
                                    <div className="mb-2 mt-2 block ">
                                        <Label className="font-bold" htmlFor={"educationEdit_shcool_new"} value="School Name" />
                                    </div>
                                    <TextInput id={"educationEdit_shcool_new"}
                                               name={"educationEdit_school_new"}
                                               required/>
                                    <div className="mb-2 mt-2 block ">
                                        <Label className="font-bold" htmlFor={"educationEdit_fieldOfStudy_new"} value="Field of Study" />
                                    </div>
                                    <TextInput id={"educationEdit_fieldOfStudy_new"}
                                               name={"educationEdit_fieldOfStudy_new"}
                                               required/>
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_degree_new"} value="Degree" />
                                    </div>
                                    <TextInput id={"educationEdit_degree_new"}
                                               name={"educationEdit_degree_new"}
                                               required/>
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_endDate_new"} value="Graduation Date" />
                                    </div>
                                    <DatePicker
                                        id={"educationEdit_endDate_new"}
                                        name={"educationEdit_endDate_new"}
                                        showMonthYearPicker
                                        selected={educationAddNewEndDate}
                                        className="cursor-pointer text-center p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                                        dateFormat="yyyy-MMMM"
                                        onChange={(date) => {setEducationAddNewEndDate(formatDate(date))}}
                                    />
                                    <div className="mb-2 mt-2 block">
                                        <Label className="font-bold" htmlFor={"educationEdit_grade_new"} value="Grade" />
                                    </div>
                                    <TextInput id={"educationEdit_grade_new"}
                                               name={"educationEdit_grade_new"}
                                               defaultValue={educationEditDetails.grade ? educationEditDetails.grade : ""}
                                    />
                                    <div className="mb-2 mt-2 block flex">
                                        <Label className="font-bold " htmlFor={"educationEdit_additionalInfo_new"} value="Additional Information" />

                                        <Tooltip content="Something else you want to mention about this eduction record? (i.e: the classes you took? projects you are proud of.) " style="light" placement="right" >
                                            <div className="p-1 center"><FaRegQuestionCircle className=" h-3 w-3 cursor-pointer flex"/></div>
                                        </Tooltip>
                                    </div>
                                    <Textarea id={"educationEdit_additionalInfo_new"}
                                              name={"educationEdit_additionalInfo_new"}
                                              placeholder="Something else you want to mention about this eduction record? (i.e: the classes you took? projects you are proud of.) "
                                              rows={4}
                                    />

                                </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue"
                            onClick={() => addNewEducationHandler()}
                            isProcessing={addNewEducationProcessing}

                    >Update</Button>
                    {!addNewEducationProcessing && (
                        <Button color="gray" onClick={() => setEducationAddNewModal(false)}>
                            Close
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default EducationBlock;
