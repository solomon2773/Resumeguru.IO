import { Button, Modal, TextInput, Label, Textarea} from "flowbite-react";
import React, { useState, useEffect, useRef } from 'react'
import {toast} from "react-toastify";

const ShareLinkModal = ({openShreLinkModal, setOpenShreLinkModal, referralLink}) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = () => {

    if (nameRef.current.value === ""){
      toast.error("Please enter Full Name");
      return;
    }

    if (emailRef.current.value === ""){
      toast.error("Please enter Email");
      return;
    }
    setIsProcessing(true);
    const submitData = {
      fullName: nameRef.current.value,
      refLink: referralLink,
    }

    sendReferralLinkEmail(submitData);
    setIsProcessing(false);
    setOpenShreLinkModal(false);
  }

  async function sendReferralLinkEmail(submitData) {
    const emailData = {
        to: emailRef.current.value,
        from: 'info@resumeguru.io',
        submitData,
    };

    await fetch('/api/mail/referralLinkMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify(emailData),
    }).then((res) => {
        if (res.status === 200) {
            toast.success('Email Sent Successfully');
        } else {
            toast.error('Failed to send email');
        }
    });

  }

  return (
    <Modal show={openShreLinkModal} size="3xl"  onClose={() => setOpenShreLinkModal(false)}>
    <Modal.Header>Share Referral Link</Modal.Header>
    <Modal.Body>
      <div className="space-y-2">
        <div>
            <div className="mb-2 block">
                <a herf="# "> Referral Link:  {referralLink}</a>
            </div>
        </div>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="feedback" value="Full Name : " />
            </div>
            <TextInput id="fullname"
                      name="fullname"
                        placeholder="Name.."
                      ref={nameRef}
                      type="text" required />
        </div>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="feedback" value="Email : " />
            </div>
            <TextInput id="email"
                      name="email"
                        placeholder="email@example.com"
                      ref={emailRef}
                      type="email" required />
        </div>

        <div className="w-full">
            <Button
                outline gradientDuoTone="purpleToBlue"
                rows={8}
                isProcessing={isProcessing}
                onClick={() => handleSubmit()}

            >Send</Button>
        </div>

    </div>
    </Modal.Body>

  </Modal>
  )
}

export default ShareLinkModal;
