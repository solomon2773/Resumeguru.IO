import React, { useState, useEffect, useRef } from 'react'
import {toast} from "react-toastify";
import { Button, Modal, TextInput, Label, Textarea, Checkbox } from "flowbite-react";
import {mongodbAddNewFeedback} from "../../helpers/mongodb/components/feedback";
import { executeRecaptcha } from '../../utils/recaptcha';
import {useSelector} from "react-redux";
const FeedbackPopupModal = () => {

    const user = useSelector(state => state.user.profile);
    const [openModal, setOpenModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const feedbackRef = useRef(null);
    const feedbackSubmit = async () => {
        if (feedbackRef.current.value === ""){
            toast.error("Please enter your feedback");
            return;
        }
        const token = await executeRecaptcha("feedbackSubmit");

        if (!token) {
            alert('Failed to execute reCAPTCHA. Please try again.');
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);
        try{


            const googleRecaptchaVerify = await fetch(
                process.env.SITE_URL + `/api/google/recaptcha`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        token: token,
                    })
                }
            )
            const jsonGoogleRecaptchaVerify = await googleRecaptchaVerify.json();
            if (jsonGoogleRecaptchaVerify.success){
                const feedback = {
                    feedback: feedbackRef.current.value,
                    googleRecaptchaVerify: jsonGoogleRecaptchaVerify,
                    userId : user && user._id ? user._id : "anonymous",
                    user: user && user.email ? user.email : "anonymous",
                    createdAt: new Date()

                }
                mongodbAddNewFeedback(feedback).then((res) => {
                    toast.success("Thank you for your feedback. ")
                    setOpenModal(false);
                    setIsProcessing(false);
                });
            } else {
                toast.error("Error submitting feedback. Please try again.")
                setIsProcessing(false);
            }

        } catch (e) {
            //console.error(e);
            setIsProcessing(false);
            toast.error("Error submitting feedback. Please try again.")

        }


    }

  return (
     <>
         <Button outline gradientDuoTone="purpleToBlue" size="xs" className="mr-auto ml-0 round-full" onClick={() => setOpenModal(true) }>Feedback</Button>
         <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={feedbackRef}>
             <Modal.Header />
             <Modal.Body>
                 <div className="space-y-2">
                     <h3 className="text-xl font-medium text-gray-900 dark:text-white">Your feedback is valuable to us, let us know about any issue, question, or recommended.</h3>

                     <div>
                         <div className="mb-2 block">
                             <Label htmlFor="feedback" value="Your Feedback : " />
                         </div>
                         <Textarea id="feedback"
                                   name="feedback"
                                      placeholder="Your feedback here..."
                                   ref={feedbackRef}
                                   type="feedback" required />
                     </div>

                     <div className="w-full">
                         <Button
                             outline gradientDuoTone="purpleToBlue"
                             rows={8}
                             isProcessing={isProcessing}
                             onClick={() => feedbackSubmit()}

                         >Submit</Button>
                     </div>

                 </div>
             </Modal.Body>
         </Modal>
     </>
  )
}
export default FeedbackPopupModal;
