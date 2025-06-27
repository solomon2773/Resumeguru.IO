import React, {useState, useEffect} from 'react';
import {Badge, Label} from "flowbite-react";
import {sendChatMessageAsync, setOpenPricingModal} from "../../store/mockInterview/chatSlice";
import {useDispatch, useSelector} from "react-redux";


const RecommendReplyBadge = () => {
    const dispatch = useDispatch();

    const recommendReply = [
        {
            id: 1,
            title: "Where should I start?",
            color: "info",

        },
        {
            id: 2,
            title: "I don't know how to answer, please guide me?",
            color: "info",
        },
        {
            id: 3,
            title: "I dont understand the question, can you explain it?",
            color: "info",
        },
        {
            id: 4,
            title: "Next question please",
            color: "info",
        },
        {
            id: 5,
            title: "I am not sure about the answer, can you help me?",
            color: "info",
        },
        {
            id: 6,
            title: "More Job Options.",
            color: "info",
        },
        {
            id: 7,
            title: "Yes",
            color: "info",
        },
        {
            id: 8,
            title: "No",
            color: "info",
        }
        ]
    const user  = useSelector((state) => state.user.profile);
    const subscription = useSelector((state) => state.chat.interviewSubscription);
    const pendingResponse = useSelector((state) => state.chat.pendingResponse);


    const sendMessage = async (messageTextInput) => {

        if (!user){
            dispatch(setOpenPricingModal(false));
            return;
        }
        if (pendingResponse){
            return;
        }
        // if ((subscription.subscription.interviewMaxTime - subscription.timeSpendText <= 0) || subscription.subscription === 0){
        //     // toast.error("You have reached your maximum time for this month. Please upgrade your subscription to continue.");
        //     dispatch(setOpenPricingModal(true));
        //     return;
        // }

        if (messageTextInput.trim()) {
            dispatch(sendChatMessageAsync(messageTextInput));

        }
    };
    return (
        <div className="w-full flex-column  h-auto" >
            {/* Quick Reply Prompts Header */}
            <div className="block w-full p-2 bg-gradient-to-r from-[rgba(0,150,149,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent text-xl font-bold ">
                Quick Reply Prompts
            </div>

            {/* Quick Reply Options */}
            <div className="flex flex-wrap gap-2">
                {recommendReply && recommendReply.map((item, index) => (
                    <div key={"quick_reply_prompt_div_" + index} className="p-2 bg-[rgba(3,42,245,0.11)] rounded-[15px] flex justify-center items-center">
                        <div className="text-[rgba(3,42,245,0.80)] text-xs font-normal leading-4 cursor-pointer"
                             onClick={() => {
                                 sendMessage(item.title);
                             }}
                        >
                             {item.title}
                        </div>
                    </div>

                ))}
            </div>



        </div>
    );
}
export default RecommendReplyBadge;
