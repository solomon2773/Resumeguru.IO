import { Button, Modal} from "flowbite-react";
import React, { useState } from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";

import {
    mongodbDeleteReferralCode
} from "../../../../../helpers/mongodb/pages/user/referralLink";

const DeleteLinkModal = ({openDeleteLinkModal, setDeleteLinkModal, referralCode, rcObjectId, getUserReferralCode}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const deleteReferralCode = () => {
        setIsProcessing(true);
        mongodbDeleteReferralCode(rcObjectId)
            .then((response) => {
                setIsProcessing(false);
                setDeleteLinkModal(false);
                getUserReferralCode();
            })
    }

    return (
        <Modal show={openDeleteLinkModal} size="3xl"  onClose={() => setDeleteLinkModal(false)}>
        <Modal.Header>Delete Referral Code</Modal.Header>
        <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this Referral Code `{referralCode}`?
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="failure" isProcessing={isProcessing} onClick={deleteReferralCode}>
                {"Yes"}
                </Button>
                <Button color="gray" onClick={() => setDeleteLinkModal(false)}>
                cancel
                </Button>
            </div>
        </div>
        </Modal.Body>

        </Modal>
  )
}

export default DeleteLinkModal;
