import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useRef, useEffect, useContext} from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import {
    initChatWebSocket,
    sendChatMessageAsync,
    setOpenPricingModal,
    setSystemReplyMessage,
    setLastSttTtsObjectId
} from '../../../store/mockInterview/chatSlice';
import {Button, Label, Modal, Textarea} from "flowbite-react";
import UserLoginBlock from "../../User/UserLoginBlock";
import Avatar from "../../mockinterviewAvatar/Avatar";
import UserAudio from "../../mockinterviewAvatar/userAudio";
import UserQuickCreateContext from "../../../context/UserQuickCreateContext";
import ScoreElement from "../elements/scoreElement";
import MessageElement from "../elements/messageElement";
import {mockInterviewMessageInsert} from "../../../helpers/mongodb/pages/mockInterview/mockInterview";
import Link from "next/link";

import RecognitionBlock from "../AiRecognition/RecognitionBlock";
import MockInterviewInit from "../../mockinterviewAvatar/modals/mockInterviewInit";
import RecommendReplyBadge  from "../recommendReplyBadge";
import RecommendAnswer  from "../blocks/RecommendAnswer";
import {ChatPromptTemplate} from "langchain/prompts";
import {
    recommendAnswerPrompt
} from "../../../helpers/langChain/prompts/mockInterview/recommendAnswer";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {toast} from "react-toastify";
import {recommendAnswerModel} from "../../../helpers/langChain/functions/mockInterview/recommendAnswer";

import { mongodbUpdateRecommendedAnswerToSttTts } from "../../../helpers/mongodb/pages/mockInterview/sttTTS";


// import {toast} from "react-toastify";

const MockInterviewAutoGenViewTwo = () => {
    const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);

    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.chatMessages);
    const pendingResponse = useSelector((state) => state.chat.pendingResponse);
    const textToSpeakInProcess = useSelector((state) => state.chat.textToSpeakInProcess);
    const chatId = useSelector((state) => state.chat.chatId);
    const sessionId = useSelector((state) => state.chat.sessionId);
    const pronunciationAssessment = useSelector((state) => state.chat.pronunciationAssessment);
    const pronunciationAssessmentObjectResult = useSelector((state) => state.chat.pronunciationAssessmentObjectResult);
    const subscription = useSelector((state) => state.chat.interviewSubscription);
    const videoRecognitionResult = useSelector((state) => state.videoRecognition.recognitionResult);
    const systemReplyMessage = useSelector((state) => state.chat.systemReplyMessage);
    const user  = useSelector((state) => state.user.profile);
    const mockInterviewFromJobSearch = useSelector((state) => state.chat.mockInterviewFromJobSearch);
    const lastSttTtsObjectId = useSelector((state) => state.chat.lastSttTtsObjectId);
    // console.log(user)
    const [messageTextInput, setMessageTextInput] = useState('');
    const [textToSpeek, setTextToSpeek] = useState('Welcome to ResumeGuru');
    const [userReply, setUserReply] = useState('');
    const [cotinueAvatar, setcotinueAvatar] = useState(false);
    const [showMyVideo, setShowMyVideo] = useState(false);
    const myVideoRef = useRef(null);
  //  const videoRefExtra = useRef(null);
    const [openMockInterviewModal, setOpenMockInterviewModal] = useState(true)

    // const avatarRef = useRef(null);
    const [mediaPermission, setMediaPermission] = useState({ video: false, audio: false });
    const [scoreExpended, setScoreExpended] = useState(false);
    const messageEndRef = useRef(null);
    const openPricingModal  = useSelector((state) => state.chat.openPricingModal);

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

    useEffect (()=>{

            setShowMyVideo(mediaPermission.video);

    },[mediaPermission])

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



    const [contentScore , setContentScore] = useState(1);
    useEffect(() =>{
        if (pronunciationAssessment.contentAssessmentResult.vocabularyScore && pronunciationAssessment.contentAssessmentResult.grammarScore && pronunciationAssessment.contentAssessmentResult.topicScore){
            setContentScore((pronunciationAssessment.contentAssessmentResult.vocabularyScore + pronunciationAssessment.contentAssessmentResult.grammarScore + pronunciationAssessment.contentAssessmentResult.topicScore) / 3);
        }
    },[pronunciationAssessment.contentAssessmentResult.vocabularyScore,pronunciationAssessment.contentAssessmentResult.grammarScore, pronunciationAssessment.contentAssessmentResult.topicScore])

    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth > 1024) {
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
    // const handleStreamReady = (stream) => {
    //
    //     if (videoRefExtra.current) {
    //         videoRefExtra.current.srcObject = stream;
    //     }
    //
    // };
    const getRecognitionBarColor = (score, side) => {
        if (side === 'left') {
            score = -Math.abs(score); // Ensure the score is treated as negative for left side
        }
        if (score >= -30 && score <= 30) {
            return 'green'; // Green for -20 to +20
        } else if ((score >= -80 && score < -31) || (score > 30 && score <= 80)) {
            return 'yellow'; // Orange for -60 to -21 or +21 to +60
        } else {
            return 'red'; // Red for the rest
        }
    };

    const [aiTemputate, setAiTemputate] = useState(0.8);
    const [recommendedAnswer , setRecommendedAnswer] = useState("");
    const [pronunciationDetails, setPronunciationDetails] = useState(false);
    const [contentDetails, setContentDetails] = useState(false);

    useEffect(() =>{
        async function recommendAnswerStreaming(){
            const startTime = Date.now();

            try{

                const modelParams = {
                    temperature: aiTemputate,
                    // top_p: 1.0,
                    // frequency_penalty: 0.1,
                    // presence_penalty: 0.0,
                    user: user.userId,
                    stream: true,
                    modelName: 'gpt-4o-mini',
                    //openAIApiKey: process.env.OPENAI_API_KEY,
                    azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
                };

                let chatPrompt;
                chatPrompt = new ChatPromptTemplate(recommendAnswerPrompt);

                const streamInputData = {
                    "jobDescription":mockInterviewFromJobSearch ? mockInterviewFromJobSearch : "",
                    "groupChatReplyQuestion":messages[messages.length - 1].message,
                };


                const modelOpenAI = new ChatOpenAI(modelParams).bind(recommendAnswerModel);
                const chat = chatPrompt
                    .pipe(modelOpenAI)
                    .pipe(new JsonOutputFunctionsParser());

                const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
                let recommendedAnswerBuf = "";
                for await (const chunk of stream) {
                    recommendedAnswerBuf = chunk.recommendAnswer.replace(/<|>/g, "");
                    setRecommendedAnswer(
                      chunk.recommendAnswer.replace(/<|>/g, "")
                    );
                }
                const endTime = Date.now();
                const fetchTime = endTime - startTime;
                ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
                await mongodbUpdateRecommendedAnswerToSttTts({
                    objectId: lastSttTtsObjectId,
                    recommendedAnswer: recommendedAnswerBuf,
                    recommendedAnswerProcessingTime: fetchTime,

                }).then((result)=>{
                    // dispatch(setLastSttTtsObjectId(""));
                });
            } catch (e) {
                dispatch(setSystemReplyMessage(false));
                console.log(e)
                return toast.error("Recommend Answer Streaming Error", e.message ? e.message : "Error ")

            }


        }

        if ( messages.length > 0 && messages[messages.length - 1].msg_from === "ResumeGuru.IO" && lastSttTtsObjectId){

            recommendAnswerStreaming().then((result)=> {
                dispatch(setSystemReplyMessage(false));
            }).catch((e)=>{
                dispatch(setSystemReplyMessage(false));
                console.log("recommendAnswerStreamingError", e);
            })
        }
    },[systemReplyMessage, messages, lastSttTtsObjectId])
    return (
        <div id="main-content" className="relative w-full max-w-screen-2xl mx-auto h-screen overflow-y-auto bg-gray-200 dark:bg-gray-900">

            <h1 className="sr-only"> ResumeGuru.IO Generate AI powered virtual mock interview</h1>
            <div className="h-screen flex flex-col px-1 md:px-4 pt-2 pb-2 2xl:px-0 h-1/2 md:h-full">
                {/* Top small info div */}
                <div className=" flex justify-center items-start border-r-2 border-gray-200 min-h-12"  >
                    {/*{user && user.userId && (*/}
                    {/*<div className="absolute left-2 top-2">*/}
                    {/*    <Button color="failure" size="sm" pill>*/}
                    {/*    <Link*/}
                    {/*        href={process.env.SITE_URL+"/user/dashboard/mockInterview"}*/}
                    {/*    >*/}
                    {/*        <span className="">End Session</span>*/}

                    {/*    </Link>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                    {/*    )}*/}
                    <div>
                        <a href={process.env.SITE_URL} className="text-white text-2xl font-bold">
                            <img src={process.env.SITE_URL + "/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"} alt="ResumeGuru.IO Logo" className="w-24 h-12" />
                        </a>
                    </div>

                    {user && user.userId ? (
                        // <div className="absolute right-2 top-2">
                        //     <Button color="blue" size="sm" pill>
                        //     <Link
                        //         href={process.env.SITE_URL+"/user/dashboard"}
                        //     >
                        //         <span className="">Dashboard</span>
                        //
                        //     </Link>
                        //     </Button>
                        // </div>
                        <div className="absolute right-2 top-2">
                            <Button  gradientDuoTone="pinkToOrange" size="sm" pill>
                                <Link
                                    href={process.env.SITE_URL+"/user/dashboard/mockInterview/"+sessionId}
                                >
                                    <span className="">End Session</span>

                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="absolute right-0 m-2">

                            <Button className=""
                                    color={"blue"}
                                    size="xs"
                                    onClick={()=>{
                                openOverlay();
                            }}>Login</Button>

                        </div>
                    )}
                </div>
                {/* Chat area */}
                <div className="h-screen flex flex-col  lg:grid lg:grid-rows-layout lg:gap-4 lg:grid-cols-3" style={{height:"96%"}}>
                    <div className="flex flex-col  lg:h-full md:h-1/3 sm:h-1/3 overflow-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className={showMyVideo ? "flex-grow h-full flex  justify-center items-center" : "flex-grow h-full flex justify-center items-center"}>
                            <Avatar
                                textToSpeek={textToSpeek}
                                cotinueAvatar={cotinueAvatar}
                                setcotinueAvatar={setcotinueAvatar}

                            />
                            {/*<div id="myVideoDiv1" className={showMyVideo ? 'flex justify-center h-auto w-full items-center text-white bg-gray-300 block lg:hidden ' : 'hidden'} >*/}
                            {/*    /!*<video*!/*/}
                            {/*    /!*    ref={videoRefExtra}*!/*/}
                            {/*    /!*    autoPlay*!/*/}
                            {/*    /!*    playsInline*!/*/}
                            {/*    /!*    className="h-56 w-full"*!/*/}
                            {/*    /!*></video>*!/*/}

                            {/*</div>*/}
                        </div>


                        <div className={showMyVideo ? "flex-grow h-full w-full justify-center items-center border-t-2 border-gray-200 sm:flex md:flex flex-col" : "hidden"}>
                            <div className="mb-2 block">
                                <Label  value={user && user.firstName+" "+user.lastName} />
                            </div>
                            <div id="myVideoDiv" className={showMyVideo ? 'flex justify-center items-center text-white block' : 'hidden'}>
                                {/*<video*/}
                                {/*    ref={myVideoRef}*/}
                                {/*    autoPlay*/}
                                {/*    playsInline*/}
                                {/*    className="h-56 w-full "*/}
                                {/*></video>*/}

                                <RecognitionBlock  />

                            </div>

                        </div>
                        <RecommendAnswer />
                    </div>
                    <div className="flex lg:p-2 sm:p-0 flex-col lg:h-full sm:h-auto overflow-auto bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                        <div className={"flex-grow h-full flex  justify-center items-center" }>

                            <div className="overflow-auto w-full h-full">

                                <div className="">
                                    <div className="flex items-center justify-between p-2">
                                        <ScoreElement
                                            topicName={"Pronunciation"}
                                            topicScore={pronunciationAssessment.pronunciationAssessmentResult.PronScore}
                                            topicToolTipContent="Overall score indicating the pronunciation quality of the given speech. This is aggregated from AccuracyScore, FluencyScore, CompletenessScore (if applicable), ProsodyScore (if applicable) with weight."
                                        />
                                        {pronunciationDetails ? (
                                            <ChevronDoubleDownIcon className="h-4 w-4 ml-2 cursor-pointer"
                                            onClick={
                                                () => {
                                                    setPronunciationDetails(false);
                                                    setScoreExpended(false);
                                                }
                                            }
                                            />
                                        ) : (
                                            <ChevronDoubleRightIcon className="h-4 w-4 ml-2 cursor-pointer"
                                            onClick={
                                                () => {
                                                    setPronunciationDetails(true);
                                                    setScoreExpended(true);
                                                }
                                            }/>
                                        )}
                                    </div>
                                    {pronunciationDetails && scoreExpended && (
                                        <div className="w-full text-black align-text-bottom bg-gray-50 pt-1 pb-1 pl-4 pr-4">
                                            {/* Detailed Scores */}
                                            <ScoreElement
                                                topicName={"Accuracy score"}
                                                topicScore={pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore}
                                                topicToolTipContent="Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Syllable, word, and full text accuracy scores are aggregated from the phoneme-level accuracy score, and refined with assessment objectives."
                                            />

                                            <ScoreElement
                                                topicName={"Fluency score"}
                                                topicScore={pronunciationAssessment.pronunciationAssessmentResult.FluencyScore}
                                                topicToolTipContent="Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words."
                                            />

                                            <ScoreElement
                                                topicName={"Completeness score"}
                                                topicScore={pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore}
                                                topicToolTipContent="Completeness of the speech, calculated by the ratio of pronounced words to the input reference text."
                                            />

                                            <ScoreElement
                                                topicName={"Prosody score"}
                                                topicScore={pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore}
                                                topicToolTipContent="Prosody of the given speech. Prosody indicates how natural the given speech is, including stress, intonation, speaking speed, and rhythm."
                                            />
                                            {/* Detailed Scores ends here */}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between p-2">
                                        <ScoreElement
                                            topicName={"Content"}
                                            topicScore={contentScore}
                                            topicToolTipContent="This score provides an aggregated assessment of the content of the speech and includes vocabulary score, grammar score, and topic score."
                                        />
                                        {contentDetails ? (
                                            <ChevronDoubleDownIcon className="h-4 w-4 ml-2 cursor-pointer"
                                                           onClick={
                                                               () => {
                                                                   setContentDetails(false);
                                                                   setScoreExpended(false);
                                                               }
                                                           }
                                            />
                                        ) : (
                                            <ChevronDoubleRightIcon className="h-4 w-4 ml-2 cursor-pointer"
                                                            onClick={
                                                                () => {
                                                                    setContentDetails(true);
                                                                    setScoreExpended(true);
                                                                }
                                                            }/>
                                        )}
                                    </div>
                                    {contentDetails && scoreExpended && (
                                        <div className="w-full text-black align-text-bottom bg-gray-50 pt-1 pb-1 pl-4 pr-4">
                                            {/* Detailed Scores */}
                                            <ScoreElement
                                                topicName={"Vocabulary score"}
                                                topicScore={pronunciationAssessment.contentAssessmentResult.vocabularyScore}
                                                topicToolTipContent="Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea."
                                            />
                                            <ScoreElement
                                                topicName={"Grammar score"}
                                                topicScore={pronunciationAssessment.contentAssessmentResult.grammarScore}
                                                topicToolTipContent="Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical."
                                            />
                                            <ScoreElement
                                                topicName={"Topic score"}
                                                topicScore={pronunciationAssessment.contentAssessmentResult.topicScore}
                                                topicToolTipContent="Level of understanding and engagement with the topic, which provides insights into the speaker’s ability to express their thoughts and ideas effectively and the ability to engage with the topic."
                                            />
                                            {/* Detailed Scores ends here */}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col w-full h-3/4 bottom-0 p-1 bg-white border-t border-gray-300 items-center justify-center">
                                    <div className="w-full  block p-2  ">
                                        <Label value="Recommended Answer : " />
                                    </div>
                                    <div className="relative flex-grow flex items-start w-full py-2 bg-white ">
                                        <Textarea
                                            value={recommendedAnswer}
                                            style={{ height: '100%' }}
                                            // rows={contentDetails && pronunciationDetails && scoreExpended ? 5 : 14}
                                            readOnly
                                            placeholder="Recommended answer will be displayed here."
                                            className="w-full h-full py-2 pl-4 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>


                            </div>

                        </div>
                        <div className={"flex-grow h-full w-full justify-center items-center border-t-2 border-gray-200 sm:flex md:flex flex-col" }>
                            <div className="flex-grow h-1/2 w-full flex justify-start items-center">
                                <RecommendReplyBadge />
                            </div>
                            <div className="flex-grow h-1/2 w-full flex justify-end items-center">
                                    <UserAudio
                                        setUserReply={setUserReply}
                                        sendMessage={sendAudioMessage}

                                    />
                            </div>
                        </div>
                    </div>

                    <div className="relative flex flex-col h-auto flex-grow overflow-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex-grow overflow-auto p-2 h-auto">
                            <MessageElement
                                messages={messages}
                                chatId={chatId}
                            />
                            <div ref={messageEndRef} />

                        </div>
                    </div>
                </div>
            </div>
            <UserLoginBlock />

            <MockInterviewInit
                openMockInterviewModal={openMockInterviewModal}
                setOpenMockInterviewModal={setOpenMockInterviewModal}
                setMediaPermission={setMediaPermission}

            />
        </div>
    );
};

export default MockInterviewAutoGenViewTwo;

