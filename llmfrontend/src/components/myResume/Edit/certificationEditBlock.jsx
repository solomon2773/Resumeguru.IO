import React, { useEffect,  useState, useRef } from 'react'
import { toast } from "react-toastify";

import {TextInput, Tooltip, Button, Modal, Label, Dropdown, DropdownItem} from "flowbite-react";
import {QuestionMarkCircleIcon} from  "@heroicons/react/24/outline";
import {  useSelector, useDispatch } from 'react-redux';
import { Spinner } from "flowbite-react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {addNewCertifications, removeCertifications, updateCertifications} from "../../../store/resumeEditReducer";
import {mongodbAddNewCertification, mongodbRemoveCertification, mongodbUpdateCertification} from "../../../helpers/mongodb/components/myResume/Edit/certificationBlock";
import {FaBars} from "react-icons/fa";

const CertificationEditBlock = () => {
    const dispatch = useDispatch();
    const [openAddNewCertificationModal, setOpenAddNewCertificationModal] = useState(false);
    const [certificationNameInput, setCertificationNameInput] = useState("");
    const [certificationIssueOrgInput, setCertificationIssueOrgInput] = useState("");
    const [certificationIdInput, setCertificationIdInput] = useState("");
    const [certificationUrlInput, setCertificationUrlInput] = useState("");
    const [certificationIssueDateInput, setCertificationIssueDateInput] = useState("");
    const [certificationExpirationDateInput, setCertificationExpirationDateInput] = useState("");
    const [certificationEditModal, setCertificationEditModal] = useState(false);
    const [certificationEditIndex, setCertificationEditIndex] = useState(null);
    const [certificationNameEditInput, setCertificationNameEditInput] = useState("");
    const [certificationIssueOrgEditInput, setCertificationIssueOrgEditInput] = useState("");
    const [certificationIdEditInput, setCertificationIdEditInput] = useState("");
    const [certificationUrlEditInput, setCertificationUrlEditInput] = useState("");
    const [certificationIssueDateEditInput, setCertificationIssueDateEditInput] = useState("");
    const [certificationExpirationDateEditInput, setCertificationExpirationDateEditInput] = useState("");

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
    const resumeDetails = useSelector(state => state.resumeEdit.resumeDetails.resumeOriginalData)
    const resumeObjectId = useSelector(state => state.resumeEdit.resumeDetails._id)

    const handleAddNewCertificationAction = ()=>{

        if (certificationNameInput === "" || certificationIssueOrgInput === "" ){
            toast.error("Please fill all required fields. Name and Issuing Organization are required.");
            return;
        } else {
            const certificateData = {
                certificationName: certificationNameInput,
                certificationIssueOrg: certificationIssueOrgInput,
                certificationId: certificationIdInput,
                certificationUrl: certificationUrlInput,
                certificationIssueDate: certificationIssueDateInput,
                certificationExpirationDate: certificationExpirationDateInput,
            }
            dispatch(addNewCertifications(certificateData));
            mongodbAddNewCertification({
                resumeObjectId: resumeObjectId,
                certificateData : certificateData
            })
            setCertificationNameInput("");
            setCertificationIssueOrgInput("");
            setCertificationIdInput("");
            setCertificationUrlInput("");
            setCertificationIssueDateInput("");
            setCertificationExpirationDateInput("");
        }
        setOpenAddNewCertificationModal(false);
    }


    const handleEditCertificationAction = ()=>{
        if (certificationNameEditInput === "" || certificationIssueOrgEditInput === "" ){
            toast.error("Please fill all required fields. Name and Issuing Organization are required.");
            return;
        } else {
            const certificateData = {
                certificationName: certificationNameEditInput,
                certificationIssueOrg: certificationIssueOrgEditInput,
                certificationId: certificationIdEditInput,
                certificationUrl: certificationUrlEditInput,
                certificationIssueDate: certificationIssueDateEditInput,
                certificationExpirationDate: certificationExpirationDateEditInput,
            }
            dispatch(updateCertifications(
                {
                    index: certificationEditIndex,
                    certificateData :certificateData
                }
            ));

            mongodbUpdateCertification({
                resumeObjectId: resumeObjectId,
                certificationIndex: certificationEditIndex,
                certificateData :certificateData
            }).then((response) => {

            }).catch((error) => {
               // console.log("Error in updating certification", error);
                toast.error("Error in updating certification");
            });
        }
        setCertificationEditModal(false);
    }

    const removeCertificationAction = (index)=>{
        mongodbRemoveCertification({
            resumeObjectId: resumeObjectId,
            certificationIndex: index,
        }).then((response) => {

        }).catch((error) => {
            // console.log("Error in updating certification", error);
            toast.error("Error in updating certification");
        });
    }
    return (
        <div className="max-w-7xl px-2 py-2 sm:px-2 lg:px-2 lg:py-2 mx-auto">
              <h2 className="text-xl flex">
                  <div className="text-xl font-large leading-6 text-black-900 ">
                      <div className="font-bold">
                     Certifications ({ resumeDetails.certifications  && Array.isArray(resumeDetails.certifications) && resumeDetails.certifications.length > 0 ? resumeDetails.certifications.length : 0})
                      </div>
                  </div>
                          <Tooltip content="You can add new License/Certification here and edit .  " style="light" placement="top" className="flex"><QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer flex"/></Tooltip>

                          <div className="block">
                              <div className="inline-block m-2">
                                  <Button color="light" size="xs"  onClick={() => { setOpenAddNewCertificationModal(true)}}>Add New License/Certification</Button>
                              </div>
                          </div>

              </h2>


            {resumeDetails && resumeDetails.certifications && Array.isArray(resumeDetails.certifications) && resumeDetails.certifications.length > 0 && (

                <div className="">
                    {resumeDetails.certifications.map((certification, certificationIndex) => (
                        <div key={certificationIndex} className="m-1 text-sm leading-2 text-black-900 sm:mt-0 p-2 bg-white rounded shadow relative border border-transparent hover:border-gray-600 hover:bg-gray-50 ">
                            <div className="px-4 py-2 sm:px-6">
                                <span className="flex-grow">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    { certification.certificationUrl ? (
                                        <a href={certification.certificationUrl} target="_blank" className="text-blue-600">
                                            {certification.certificationName}
                                            { certification.certificationIssueDate && " ( "+certification.certificationIssueDate } {certification.certificationExpirationDate && " - " + certification.certificationExpirationDate}
                                            { certification.certificationIssueDate && " )"}
                                        </a>
                                    ) : (
                                        <span>
                                            {certification.certificationName}
                                            { certification.certificationIssueDate && " ( "+certification.certificationIssueDate } {certification.certificationExpirationDate && " - " + certification.certificationExpirationDate}
                                            { certification.certificationIssueDate && " )"}
                                        </span>
                                    ) }

                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                                    {certification.certificationIssueOrg}
                                    {certification.certificationId && " | ID: " + certification.certificationId}

                                </p>
                                </span>
                            </div>
                            <div className="absolute top-2 right-2 cursor-pointer">
                                <Dropdown inline placement="bottom" renderTrigger={() => <span><FaBars/></span>} size="sm">
                                    <DropdownItem onClick={() =>  {
                                        setCertificationEditIndex(certificationIndex);
                                        if (certificationIndex >= 0 && resumeDetails.certifications[certificationIndex]){
                                            setCertificationNameEditInput(resumeDetails.certifications[certificationIndex].certificationName);
                                            setCertificationIssueOrgEditInput(resumeDetails.certifications[certificationIndex].certificationIssueOrg);
                                            setCertificationIdEditInput(resumeDetails.certifications[certificationIndex].certificationId);
                                            setCertificationUrlEditInput(resumeDetails.certifications[certificationIndex].certificationUrl);
                                            setCertificationIssueDateEditInput(resumeDetails.certifications[certificationIndex].certificationIssueDate);
                                            setCertificationExpirationDateEditInput(resumeDetails.certifications[certificationIndex].certificationExpirationDate);
                                            setCertificationEditModal(true);
                                        }



                                    }}>Edit</DropdownItem>
                                    <DropdownItem onClick={() =>  {

                                        dispatch(removeCertifications(certificationIndex));
                                        removeCertificationAction(certificationIndex);
                                    }}>Remove</DropdownItem>
                                </Dropdown>
                            </div>

                        </div>
                    ))}
                </div>
            )}



            <Modal dismissible show={openAddNewCertificationModal} onClose={() => setOpenAddNewCertificationModal(false)}>
                <Modal.Header>Add New License/Certification</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">

                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationNameInput"} value="Name* :" />
                        </div>
                        <TextInput id="certificationNameInput" name="certificationNameInput"
                                   type="text"
                                   defaultValue={certificationNameInput}
                                   onChange={(e) => setCertificationNameInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="PMP, AWS cloud engineer, etc"
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationIssueOrgInput"} value="Issuing Organization* :" />
                        </div>
                        <TextInput id="certificationIssueOrgInput" name="certificationIssueOrgInput"
                                   type="text"
                                   defaultValue={certificationIssueOrgInput}
                                   onChange={(e) => setCertificationIssueOrgInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="Microsoft, Amazon, etc"
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationIdInput"} value="Credential ID :" />
                        </div>
                        <TextInput id="certificationIdInput" name="certificationIdInput"
                                   type="text"
                                   defaultValue={certificationIdInput}
                                   onChange={(e) => setCertificationIdInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder=""
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationUrlInput"} value="Credential URL :" />
                        </div>
                        <TextInput id="certificationUrlInput" name="certificationUrlInput"
                                   type="text"
                                   defaultValue={certificationUrlInput}
                                   onChange={(e) => setCertificationUrlInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder=""
                        />
                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                            <label htmlFor={"certificationIssueDateInput"} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Issue Date :
                            </label>
                            <DatePicker id="certificationIssueDateInput" name="certificationIssueDateInput"
                                        showMonthYearPicker
                                        dateFormat="MMMM-yyyy"
                                        selected={certificationIssueDateInput}
                                        onChange={(date) => {setCertificationIssueDateInput(formatDate(date))}}
                            />
                        </div>
                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                            <label htmlFor={"certificationExpirationDateInput"} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Expiration Date :
                            </label>
                            <DatePicker id="certificationExpirationDateInput" name="certificationExpirationDateInput"
                                        showMonthYearPicker
                                        dateFormat="MMMM-yyyy"
                                        selected={certificationExpirationDateInput}
                                        onChange={(date) => {setCertificationExpirationDateInput(formatDate(date))}}

                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="blue"
                        onClick={(e) => {handleAddNewCertificationAction( )}}

                    >Add</Button>

                </Modal.Footer>
            </Modal>

            <Modal dismissible show={certificationEditModal} onClose={() => setCertificationEditModal(false)}>
                <Modal.Header>Edit License/Certification</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">

                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationNameInput"} value="Name* :" />
                        </div>
                        <TextInput id="certificationNameInput" name="certificationNameInput"
                                   type="text"
                                   defaultValue={certificationNameEditInput}
                                   onChange={(e) => setCertificationNameEditInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="PMP, AWS cloud engineer, etc"
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationIssueOrgInput"} value="Issuing Organization* :" />
                        </div>
                        <TextInput id="certificationIssueOrgInput" name="certificationIssueOrgInput"
                                   type="text"
                                   defaultValue={certificationIssueOrgEditInput}
                                   onChange={(e) => setCertificationIssueOrgEditInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder="Microsoft, Amazon, etc"
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationIdInput"} value="Credential ID :" />
                        </div>
                        <TextInput id="certificationIdInput" name="certificationIdInput"
                                   type="text"
                                   defaultValue={certificationIdEditInput}
                                   onChange={(e) => setCertificationIdEditInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder=""
                        />
                        <div className="mb-1 mt-1 block">
                            <Label className="" htmlFor={"certificationUrlInput"} value="Credential URL :" />
                        </div>
                        <TextInput id="certificationUrlInput" name="certificationUrlInput"
                                   type="text"
                                   defaultValue={certificationUrlEditInput}
                                   onChange={(e) => setCertificationUrlEditInput(e.target.value)}
                                   sizing="sm" className="w-full " shadow placeholder=""
                        />
                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                            <label htmlFor={"certificationIssueDateInput"} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Issue Date :
                            </label>
                            <DatePicker id="certificationIssueDateInput" name="certificationIssueDateInput"
                                        showMonthYearPicker
                                        dateFormat="MMMM-yyyy"
                                        selected={certificationIssueDateEditInput}
                                        onChange={(date) => {setCertificationIssueDateEditInput(formatDate(date))}}
                            />
                        </div>
                        <div  className="grid grid-cols-2  lg:gap-2 pt-2">
                            <label htmlFor={"certificationExpirationDateInput"} className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Expiration Date :
                            </label>
                            <DatePicker id="certificationExpirationDateInput" name="certificationExpirationDateInput"
                                        showMonthYearPicker
                                        dateFormat="MMMM-yyyy"
                                        selected={certificationExpirationDateEditInput}
                                        onChange={(date) => {setCertificationExpirationDateEditInput(formatDate(date))}}

                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="blue"
                        onClick={(e) => {handleEditCertificationAction( )}}

                    >Update</Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default CertificationEditBlock;
