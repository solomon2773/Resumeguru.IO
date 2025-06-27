import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useRef, useEffect, useContext} from 'react';
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
    initChatWebSocket,
    sendChatMessageAsync, setPronunciationAssessment,
} from '../../../store/mockInterview/chatSlice';
import { Button, Tooltip } from "flowbite-react";
import UserLoginBlock from "../../User/UserLoginBlock";
import Avatar from "../../mockinterviewAvatar/Avatar";
import UserAudio from "../../mockinterviewAvatar/userAudio";
import UserQuickCreateContext from "../../../context/UserQuickCreateContext";
import { Progress } from "flowbite-react";
// import {toast} from "react-toastify";
import Link from "next/link";
import {mockInterviewMessageInsert} from "../../../helpers/mongodb/pages/mockInterview/mockInterview";
import { QuestionMarkCircleIcon} from "@heroicons/react/24/outline";

const MockInterviewAutoGen = () => {
    const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.profile);

    const messages = useSelector((state) => state.chat.chatMessages);
    const pendingResponse = useSelector((state) => state.chat.pendingResponse);
    const chatId = useSelector((state) => state.chat.chatId);
    const sessionId = useSelector((state) => state.chat.sessionId);
    const pronunciationAssessment = useSelector((state) => state.chat.pronunciationAssessment);
    const pronunciationAssessmentObjectResult = useSelector((state) => state.chat.pronunciationAssessmentObjectResult);
    //console.log(messages)
    const [messageTextInput, setMessageTextInput] = useState('');
    const [textToSpeek, setTextToSpeek] = useState('Welcome to ResumeGuru');
    const [userReply, setUserReply] = useState('');
    const [cotinueAvatar, setcotinueAvatar] = useState(false);
    const [isAudioDisabled, setIsAudioDisabled] = useState(false);
    const [showMyVideo, setShowMyVideo] = useState(false);
    const myVideoRef = useRef(null);
    const videoRefExtra = useRef(null);

    // const avatarRef = useRef(null);
    const [mediaPermission, setMediaPermission] = useState({ video: false, audio: false });
    const [scoreExpended, setScoreExpended] = useState(false);
    const messageEndRef = useRef(null);

    const user = {
        name: userProfile && userProfile.firstName ? userProfile.firstName + " " + userProfile.lastName : 'Resume Guru User',
        email: userProfile && userProfile.email ? userProfile.email : "",
        imageUrl:
            userProfile && userProfile.profileImage && userProfile.profileImage.bucket ? process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + userProfile.profileImage.bucket+"/"+userProfile.profileImage.key : "/images/author-placeholder.jpg",
        imageAlt: userProfile && userProfile.firstName && userProfile.lastName ?  userProfile.firstName+" "+userProfile.lastName+" thumbnails" : "",
    }
    useEffect(() => {
        if (userProfile && userProfile.userId){
            dispatch(initChatWebSocket(userProfile.userId));
        }

     //   dispatch(initChatWebSocket());


    }, [dispatch, userProfile]);

    useEffect (()=>{
        if (!userProfile){
            openOverlay();

        } else {
            closeOverlay();
        }
    },[userProfile])


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
                    userId: userProfile.userId,
                    pronunciationAssessment: messages[messages.length - 1].msg_from === "ResumeGuru.IO" ? "" : pronunciationAssessment,
                    pronunciationAssessmentObjectResult:messages[messages.length - 1].msg_from === "ResumeGuru.IO" ? "" : pronunciationAssessmentObjectResult
                }

            );
        }

    },[messages])

    useEffect (()=>{
        if (mediaPermission.video){
            setShowMyVideo(true);
        }
    },[mediaPermission])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {

        if (!userProfile){
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
        if (!userProfile){
            openOverlay();
            return;
        }
        setIsAudioDisabled(true);
        if (pendingResponse){
            return;
        }
        if (userReply.trim()) {
            dispatch(sendChatMessageAsync(userReply));
            setUserReply('');
            setIsAudioDisabled(false);
        }
    };

    const progressBarColor = (score) => {
        if (score >= 80){
            return "lime";
        } else if (score >= 60){
            return "yellow";
        } else {
            return "red";
        }
    }

    const [contentScore , setContentScore] = useState(1);
    useEffect(() =>{
        if (pronunciationAssessment.contentAssessmentResult.vocabularyScore && pronunciationAssessment.contentAssessmentResult.grammarScore && pronunciationAssessment.contentAssessmentResult.topicScore){
            setContentScore((pronunciationAssessment.contentAssessmentResult.vocabularyScore + pronunciationAssessment.contentAssessmentResult.grammarScore + pronunciationAssessment.contentAssessmentResult.topicScore) / 3);
        }
    },[pronunciationAssessment.contentAssessmentResult.vocabularyScore,pronunciationAssessment.contentAssessmentResult.grammarScore, pronunciationAssessment.contentAssessmentResult.topicScore])
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth > 768) {
                setScoreExpended(true);
            } else {
                setScoreExpended(false);
            }
        };

        // Check screen size on initial load
        checkScreenSize();

        // Add event listener to check screen size on resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    const handleStreamReady = (stream) => {

        if (videoRefExtra.current) {
            videoRefExtra.current.srcObject = stream;
        }

    };
    return (
        <div className="flex flex-wrap h-screen md:w-screen">
            {userProfile && userProfile.userId && (
                <div className="absolute right-2 top-2">
                    <Link
                        href={process.env.SITE_URL+"/user/dashboard"}
                        className="  group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                    >
                        <span className="">Dashboard</span>

                    </Link>
                </div>

            )}
            <h1 className="sr-only"> ResumeGuru.IO Generate AI powered virtual mock interview</h1>
            <div className="w-full flex-grow-0 h-1/2 md:w-1/2 md:h-full flex flex-col bg-white ">
                {/* Top small info div */}
                <div className="flex-grow-0 h-12 flex justify-center items-startv border-r-2 border-gray-200 ">
                    <a href={process.env.SITE_URL} className="text-white text-2xl font-bold">
                        <img src={process.env.SITE_URL + "/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"} alt="ResumeGuru.IO Logo" className="w-24 h-12" />
                    </a>
                </div>
                {/* Middle video div */}
                <div className="flex-grow flex justify-center items-center">
                    <Avatar
                        textToSpeek={textToSpeek}
                        cotinueAvatar={cotinueAvatar}
                        setcotinueAvatar={setcotinueAvatar}
                        myVideoRef={myVideoRef}
                        onStreamReady={handleStreamReady}
                        setMediaPermission={setMediaPermission}
                    />
                    <div id="myVideoDiv1" className={showMyVideo ? 'flex justify-center w-1/2 items-center text-white p-4 bg-gray-300 block sm:hidden' : 'hidden'} >
                        <video
                            ref={videoRefExtra}
                            autoPlay
                            playsInline
                            className="h-56 w-full"
                        ></video>
                    </div>
                </div>

                {/* Bottom small info div */}
                <div className="w-full  flex-grow-0 justify-center items-end border-r-2 border-gray-200">
                    <div className="p-2 bg-gray-200">
                        <div className="w-full flex justify-center items-end bg-gray-50 ">
                            <div className="table-cell p-2 w-full">
                                <div className="items-center justify-between text-xs">
                                    <div className="text-base text-xs bold flex">Pronunciation {pronunciationAssessment.pronunciationAssessmentResult.PronScore || 0} / 100
                                        <Tooltip
                                            content="Overall score indicating the pronunciation quality of the given speech. This is aggregated from AccuracyScore, FluencyScore, CompletenessScore (if applicable), ProsodyScore (if applicable) with weight."
                                            animation="duration-1000"
                                            className=" max-w-2xl bg-white text-black"
                                            style="light"
                                        >
                                            <QuestionMarkCircleIcon className=" h-4 w-4 text-gray-500 inline-block ml-1"  />
                                        </Tooltip>
                                    </div>
                                    <Progress progress={pronunciationAssessment.pronunciationAssessmentResult.PronScore || 1} color={progressBarColor(pronunciationAssessment.pronunciationAssessmentResult.PronScore || 1)} />
                                </div>
                            </div>
                            <div className="table-cell p-2 w-full">
                                <div className="items-center justify-between text-xs">
                                    <div className="text-base text-xs flex">Content {contentScore || 1} / 100
                                        <Tooltip
                                            content="This score provides an aggregated assessment of the content of the speech and includes vocabulary score, grammar score, and topic score."
                                            animation="duration-1000"
                                            className=" max-w-2xl bg-white text-black"
                                            style="light"
                                        >
                                            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                        </Tooltip>
                                    </div>
                                    <Progress progress={contentScore || 1} color={progressBarColor(contentScore || 1)} />
                                </div>
                            </div>
                        </div>
                        {scoreExpended && (
                            <div className="w-full text-black align-text-bottom bg-gray-50">
                                <div className="flex flex-col items-center">
                                    <div className="table items-center w-full">
                                        <div className="table-cell p-2">
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Accuracy score {pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore || 0} / 100
                                                    <Tooltip
                                                        content="Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Syllable, word, and full text accuracy scores are aggregated from the phoneme-level accuracy score, and refined with assessment objectives."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip>
                                                </div>
                                                <Progress progress={pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore || 1} color={progressBarColor(pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore || 1)} />
                                            </div>
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Fluency score {pronunciationAssessment.pronunciationAssessmentResult.FluencyScore || 0} / 100
                                                    <Tooltip
                                                        content="Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip></div>
                                                <Progress progress={pronunciationAssessment.pronunciationAssessmentResult.FluencyScore || 1} color={progressBarColor(pronunciationAssessment.pronunciationAssessmentResult.FluencyScore || 1)} />
                                            </div>
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Completeness score {pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore || 0} / 100
                                                    <Tooltip
                                                        content="Completeness of the speech, calculated by the ratio of pronounced words to the input reference text."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip></div>
                                                <Progress progress={pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore || 1} color={progressBarColor(pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore || 1)} />
                                            </div>
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Prosody score {pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore || 0} / 100
                                                    <Tooltip
                                                        content="Prosody of the given speech. Prosody indicates how natural the given speech is, including stress, intonation, speaking speed, and rhythm."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip>
                                                </div>
                                                <Progress progress={pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore || 1} color={progressBarColor(pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore || 1)} />
                                            </div>
                                        </div>
                                        <div className="table-cell p-2">
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Vocabulary score {pronunciationAssessment.contentAssessmentResult.vocabularyScore.toFixed(2) || 0} / 100
                                                    <Tooltip
                                                        content="Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip>
                                                </div>
                                                <Progress progress={pronunciationAssessment.contentAssessmentResult.vocabularyScore || 1} color={progressBarColor(pronunciationAssessment.contentAssessmentResult.vocabularyScore || 1)} />
                                            </div>
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Grammar score {pronunciationAssessment.contentAssessmentResult.grammarScore.toFixed(2) || 0} / 100
                                                    <Tooltip
                                                        content="Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip>
                                                </div>
                                                <Progress progress={pronunciationAssessment.contentAssessmentResult.grammarScore || 1} color={progressBarColor(pronunciationAssessment.contentAssessmentResult.grammarScore || 1)} />
                                            </div>
                                            <div className="items-center justify-between text-xs">
                                                <div className="text-base text-xs flex">Topic score {pronunciationAssessment.contentAssessmentResult.topicScore.toFixed(2) || 0} / 100
                                                    <Tooltip
                                                        content="Level of understanding and engagement with the topic, which provides insights into the speaker’s ability to express their thoughts and ideas effectively and the ability to engage with the topic."
                                                        animation="duration-1000"
                                                        className=" max-w-2xl bg-white text-black"
                                                        style="light"
                                                    >
                                                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                                                    </Tooltip>
                                                </div>
                                                <Progress progress={pronunciationAssessment.contentAssessmentResult.topicScore || 1} color={progressBarColor(pronunciationAssessment.contentAssessmentResult.topicScore || 1)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) }
                    </div>


                </div>
            </div>


            <div className="flex flex-col flex-grow h-1/2 md:w-1/2 md:h-full">
                <div id="myVideoDiv" className={showMyVideo ? 'flex justify-center  items-center text-white p-4 bg-gray-300 hidden sm:block' : 'hidden'} >
                    <video
                        ref={myVideoRef}
                        autoPlay
                        playsInline
                        className="h-56 w-full"
                    ></video>
                </div>
                <div className="flex-grow overflow-auto p-2 h-auto">

                   <div className="flex-grow overflow-auto ">
                                {messages.map( (msg, msgIndex) =>{

                                    if (msg.msg_from === "user") {
                                        return (
                                            <div key={chatId + "_"+msg.id} className="col-start-1 col-end-13 p-1 rounded-lg">
                                                <div className="flex flex-row items-center border-gray-200 bg-gray-150 bg-opacity-50 p-1 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                                    {userProfile && userProfile.firstName ? (
                                                        <img
                                                            className="h-8 w-8 rounded-full"
                                                            src={user.imageUrl}

                                                            alt={userProfile.firstName ? userProfile.firstName : "" + " " + userProfile.lastName ? userProfile.lastName : ""} />
                                                    ) : (
                                                        <UserCircleIcon
                                                            className="h-8 w-8 rounded-full text-gray-500"

                                                        />
                                                    )}
                                                    <div
                                                        className="flex flex-col w-full  ">
                                                        {/*<div className="flex items-center space-x-2 rtl:space-x-reverse">*/}
                                                        {/*<span*/}
                                                        {/*    className="text-sm font-semibold text-gray-900 dark:text-white">{userProfile.firstName ? userProfile.firstName : ""}</span>*/}
                                                        {/*    /!*<span*!/*/}
                                                        {/*    /!*    className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(msg.timeStamp).toLocaleTimeString()}</span>*!/*/}
                                                        {/*</div>*/}
                                                        <div className="text-sm font-normal p-2 text-gray-900 dark:text-white bg-gray-200 rounded-xl" dangerouslySetInnerHTML={{ __html: msg.message }} />

                                                        {/*<span*/}
                                                        {/*    className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>*/}
                                                    </div>


                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={chatId + "_"+msg.id} className="col-start-1 col-end-13 p-2 rounded-lg p-1">
                                                <div className="flex items-center flex-row rtl:space-x-reverse">

                                                    <div className="flex items-start bg-gray-100 bg-opacity-50 p-1 border-gray-200 rounded-e-xl rounded-es-xl dark:bg-gray-700">


                                                        <div
                                                            className="flex flex-col w-full   ">
                                                            {/*<div*/}
                                                            {/*    className="flex items-center space-x-2 rtl:space-x-reverse">*/}
                                                            {/*    <span*/}
                                                            {/*        className="text-sm font-semibold text-gray-900 dark:text-white">ResumeGuru.IO</span>*/}

                                                            {/*</div>*/}
                                                            <div className="text-sm font-normal p-2 text-gray-900 dark:text-white bg-gray-200 rounded-xl" dangerouslySetInnerHTML={{ __html: msg.message }} />

                                                            {/*<span*/}
                                                            {/*    className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>*/}
                                                        </div>
                                                        <img className="w-8 h-8 rounded-full"
                                                             src={process.env.SITE_URL+"/images/logos/rg/icons/ResumeGuru_Icon_ResumeGuru_Icon-04.svg"}
                                                             alt="ResumeGuru.IO Icon"/>

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                    <div ref={messageEndRef} />


                    {
                        !mediaPermission.audio ? (
                            <div className="flex items-center w-full md:w-1/2 fixed bottom-0 right-0 p-1 bg-white border-t border-gray-300 ">
                                <div className="items-center h-12 w-full">
                                <div className="relative flex items-center w-full  py-2 bg-white  ">
                                    <input
                                        type="text"
                                        value={messageTextInput}
                                        onKeyDown={handleKeyDownEnter}
                                        onChange={(e) => setMessageTextInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        isProcessing={pendingResponse}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded p-0 focus:outline-none focus:ring-2 focus:ring-blue-500"

                                        onClick={()=>{sendMessage()}}

                                    >
                                <span className="ml-2">
                                            <svg
                                                className="w-4 h-4 transform rotate-45 -mt-px"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                ></path>
                                            </svg>
                                        </span>
                                    </Button>
                                </div>

                            </div>
                            </div>
                        ) : (
                            <div className="  items-center h-12 w-full ">
                                <UserAudio
                                    setUserReply={setUserReply}
                                    sendMessage={sendAudioMessage}
                                    pendingResponse={pendingResponse}
                                    isAudioDisabled={isAudioDisabled}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            <UserLoginBlock />

        </div>

    );
};

export default MockInterviewAutoGen;

