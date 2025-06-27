import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {
    initChatWebSocket,
    sendChatMessageAsync,
    setOpenPricingModal,

} from '../../../store/mockInterview/chatSlice';
import {Button, Label, Modal, Textarea} from "flowbite-react";
import UserLoginBlock from "../../User/UserLoginBlock";
import Avatar from "../../mockinterviewAvatar/Avatar";
import UserAudio2 from "../../mockinterviewAvatar/userAudio2";
import UserQuickCreateContext from "../../../context/UserQuickCreateContext";
import MessageElement from "../elements/messageElement";
import {mockInterviewMessageInsert} from "../../../helpers/mongodb/pages/mockInterview/mockInterview";
import Link from "next/link";
import RecognitionBlock from "../AiRecognition/RecognitionBlock";
import MockInterviewInit from "../../mockinterviewAvatar/modals/mockInterviewInit";
import RecommendReplyBadge  from "../recommendReplyBadge";
import RecommendAnswer  from "../blocks/RecommendAnswer";
import MockInterviewPageScoreDetailV1 from "../blocks/MockInterviewPageScoreDetailV1";



// import {toast} from "react-toastify";

const MockInterviewAutoGenV3 = () => {
    const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);

    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.chatMessages);
    const pendingResponse = useSelector((state) => state.chat.pendingResponse);
    const chatId = useSelector((state) => state.chat.chatId);
    const sessionId = useSelector((state) => state.chat.sessionId);
    const pronunciationAssessment = useSelector((state) => state.chat.pronunciationAssessment);
    const pronunciationAssessmentObjectResult = useSelector((state) => state.chat.pronunciationAssessmentObjectResult);
    const user  = useSelector((state) => state.user.profile);
    const [messageTextInput, setMessageTextInput] = useState('');
    const [textToSpeek, setTextToSpeek] = useState('Welcome to ResumeGuru');
    const [userReply, setUserReply] = useState('');
    const [cotinueAvatar, setcotinueAvatar] = useState(false);
    const [openMockInterviewModal, setOpenMockInterviewModal] = useState(true)

    // const avatarRef = useRef(null);

    const [smallScreenSize, setSmallScreenSize] = useState(false);
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (user && user.userId){

            dispatch(initChatWebSocket(user.userId));
        }
    }, [dispatch, user]);

    useEffect (()=>{
        if (!user && !user.user){
            openOverlay();

        } else {
            closeOverlay();
        }
    },[user])


    useEffect (()=>{
        if (messages.length > 0 && messages[messages.length - 1].msg_from === "ResumeGuru.IO"){
            setTextToSpeek(messages[messages.length - 1].message);
            setcotinueAvatar(true);
        }
        if (messages.length > 0 && chatId !== "" ){
            // console.log(messages);
            mockInterviewMessageInsert(
                {
                    chatId: chatId,
                    sessionId: sessionId,
                    message: messages[messages.length - 1],
                    userId: user.userId,
                    pronunciationAssessment: messages[messages.length - 1].msg_from === "ResumeGuru.IO" ? "" : pronunciationAssessment,
                    pronunciationAssessmentObjectResult:messages[messages.length - 1].msg_from === "ResumeGuru.IO" ? "" : pronunciationAssessmentObjectResult
                }
            );
        }

    },[messages])



    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {

        if (!user){
            openOverlay();
            return;
        }
        if (pendingResponse){
            return;
        }

        if (messageTextInput.trim()) {
            dispatch(sendChatMessageAsync(messageTextInput));
            setMessageTextInput('');

        }
    };
    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };
    const sendAudioMessage = async () => {
        if (!user){
            openOverlay();
            return;
        }
        if (pendingResponse){
            return;
        }

        if (userReply.trim()) {
            dispatch(sendChatMessageAsync(userReply));
            setUserReply('');
        }
    };



    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth > 1024) {
                setSmallScreenSize(false);
            } else {
                setSmallScreenSize(true);
            }
        };

        // Check screen size on initial load
        checkScreenSize();

        // Add event listener to check screen size on resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);






    return (
        <div id="main-content" className="">

            <h1 className="sr-only"> ResumeGuru.IO Generate AI powered virtual mock interview</h1>

            <div className="w-full h-full h-screen p-4 bg-white flex flex-col lg:flex-row gap-4">

                {/* Left Column */}
                <div className="flex flex-col w-full gap-4 items-center flex-grow lg:w-1/4 lg:h-full">
                    <div className="p-4 w-5/6 h-auto bg-[rgba(3,42,245,0.11)] rounded-xl flex flex-col gap-4 items-center">
                        <Avatar
                            className="w-full h-auto rounded-xl"
                            textToSpeek={textToSpeek}
                            cotinueAvatar={cotinueAvatar}
                            setcotinueAvatar={setcotinueAvatar}

                        />
                    </div>


                    <MockInterviewPageScoreDetailV1 />

                </div>
                {/* Center Column */}
                <div className="flex flex-col w-full  justify-start items-start gap-3 h-full sm:h-auto">
                    {/* Outer Container with Gradient Border */}
                    <RecognitionBlock  />

                    {/* Message Section */}
                    <MessageElement
                        messages={messages}
                        chatId={chatId}
                    />

                    {/* Reply Section */}
                    <UserAudio2
                        setUserReply={setUserReply}
                        sendMessage={sendAudioMessage}

                    />

                </div>
                {/* Right Column */}
                <div className="flex flex-col w-full lg:w-1/2 justify-start items-end gap-1">
                    {/* End Session Button */}
                    <div
                        className="cursor-pointer w-[100px] sm:w-[150px] h-auto p-1 sm:p-2 bg-gradient-to-r from-[rgba(0,150,149,0.65)] to-[rgba(3,42,245,0.49)] rounded-[6px] sm:rounded-[8px] flex justify-center items-center hover:from-[rgba(0,150,149,0.85)] hover:to-[rgba(3,42,245,0.69)]"
                    >
                        <div
                            className="w-full h-full text-center text-white text-sm sm:text-xl font-bold"
                            onClick={() => {
                                window.location.href =
                                    process.env.SITE_URL + "/user/dashboard/mockInterview/" + sessionId;
                            }}
                        >
                            End Session
                        </div>
                    </div>



                    {/* Content Section */}
                    <div className="w-full h-[666px] hidden sm:flex flex-col justify-start items-start gap-5">

                        {/* Recommended Answer Section */}
                        <RecommendAnswer />
                        {/* Quick Reply Prompts */}
                        <RecommendReplyBadge />

                    </div>
                </div>

            </div>
            <UserLoginBlock />
            <MockInterviewInit
                openMockInterviewModal={openMockInterviewModal}
                setOpenMockInterviewModal={setOpenMockInterviewModal}

            />
        </div>
    );
};

export default MockInterviewAutoGenV3;

