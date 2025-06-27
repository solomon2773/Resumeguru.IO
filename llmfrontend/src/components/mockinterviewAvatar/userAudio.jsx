import React, { useState, useEffect, useRef } from 'react';
import { Button, Textarea } from "flowbite-react";
import Tooltip from "../Tooltip";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { MicrophoneIcon , } from "@heroicons/react/24/solid";
import {useDispatch, useSelector} from "react-redux";
import {
    PronunciationAssessmentConfig,
    PronunciationAssessmentGradingSystem, PronunciationAssessmentGranularity, PropertyId, SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
import {
    setPronunciationAssessment,
    setShowMicTooltip, setLastSttTtsObjectId
} from "../../store/mockInterview/chatSlice";
import {
    mockInterviewSttTtsTimeInsert,
    sttTimeUpdate
} from "../../helpers/mongodb/pages/mockInterview/sttTTSTime";
import { mockInterviewSttTtsInsert } from "../../helpers/mongodb/pages/mockInterview/sttTTS";


const UserAudio = ({setUserReply, sendMessage}) => {

    const [isListening, setIsListening] = useState(false);
    const [sttTimeId, setSttTimeId] = useState(null);
    const [sttStartTime, setSttStartTime] = useState(0);
    const [sttEndTime, setSttEndTime] = useState(0);
    const [sessionIdBuffer, setSessionIdBuffer] = useState("");

    const defaultReportState = {
        sttResult: {},
        message:[],
        msgResult:[],
        isCompleted: false
    }
    const [reportRecordObject, setReportRecordObject] = useState(defaultReportState);
    const [myReplyTranscript, setMyReplyTranscript] = useState("");
    const speechConfig = useRef(null);
    const audioConfig = useRef(null);
    const recognizer = useRef(null);
    const chatId = useSelector((state) => state.chat.chatId);
    const sessionId = useSelector((state) => state.chat.sessionId);
    const user = useSelector((state) => state.user.profile);
    const selectedAudioDevice = useSelector((state) => state.chat.selectedAudioDevice);
    const pendingResponse = useSelector((state) => state.chat.pendingResponse);
    const messages = useSelector((state) => state.chat.chatMessages);

    const dispatch = useDispatch();
    const textToSpeakInProcess = useSelector((state) => state.chat.textToSpeakInProcess);
    const showMicTooltip = useSelector((state) => state.chat.showMicTooltip);
    const myTranscriptRef = useRef("");
    const [recognizingTranscript, setRecognizingTranscript] = useState("");



    const [previousTranscriptFromAgent, setPreviousTranscriptFromAgent] = useState("");
    useEffect(() => {

        if (messages.length > 0 && messages[messages.length - 1].msg_from === "ResumeGuru.IO"){
            setPreviousTranscriptFromAgent(messages[messages.length - 1].message);
        }
    },[messages])
    useEffect(() => {
        if (reportRecordObject.isCompleted) {
            mockInterviewSttInsertUserFeedback(
                {
                    chatId: chatId,
                    sessionId: sessionId,
                    message: reportRecordObject.message,
                    msgResult: reportRecordObject.msgResult,
                    userId: user.userId,
                    type: "stt",
                    ttsResult:null,
                    pronunciationAssessmentObjectResult: reportRecordObject.sttResult,
                }
            );

            setReportRecordObject(defaultReportState)
        }

    }, [reportRecordObject.isCompleted]);

    const processRecognizedTranscriptCount = useRef(0);

    const setupRecognizer = () => {
        // Speech SDK configuration
        speechConfig.current = sdk.SpeechConfig.fromSubscription(
            process.env.MS_AZURE_SPEECH_SERVICE_KEY,
            process.env.MS_AZURE_SPEECH_SERVICE_REGION
        );
        speechConfig.current.speechRecognitionLanguage = "en-US";

        // Audio configuration
        audioConfig.current = sdk.AudioConfig.fromMicrophoneInput(selectedAudioDevice.deviceId);

        // Recognizer setup
        recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);
        const pronunciationAssessmentConfig = new PronunciationAssessmentConfig(
            '',
            PronunciationAssessmentGradingSystem.HundredMark,
            PronunciationAssessmentGranularity.Phoneme,
            false
        );
        pronunciationAssessmentConfig.enableProsodyAssessment = true;
        pronunciationAssessmentConfig.enableContentAssessmentWithTopic(previousTranscriptFromAgent ? previousTranscriptFromAgent : "mock interview"); //updated to previous question.
        pronunciationAssessmentConfig.applyTo(recognizer.current);

        // Event handlers
        recognizer.current.recognizing = (s, e) => handleRecognizingTranscript(e);
        recognizer.current.recognized = (s, e) => handleRecognizedTranscript(e);
    };
    const handleRecognizedTranscript = async (event) => {
        const result = event.result;
        if (process.env.DEV) {
            console.log('Recognized result:', result);
        }
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {

            myTranscriptRef.current = myTranscriptRef.current + result.text;
            setMyReplyTranscript(myTranscriptRef.current);
            setUserReply(myTranscriptRef.current);
            const pronunciationAssessmentObjectResult = sdk.PronunciationAssessmentResult.fromResult(result);
            const pronunciationAssessmentResultJson = result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult);


            if (process.env.DEV){
                console.log(previousTranscriptFromAgent)
                console.log('Transcript: -->', myTranscriptRef.current);
                console.log(pronunciationAssessmentResultJson)
                console.log(pronunciationAssessmentObjectResult)
                console.log(pronunciationAssessmentObjectResult.contentAssessmentResult)
                console.log(pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment)
                console.log(
                    `\n grammarScore: ${pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.GrammarScore},` +
                    `\n topicScore : ${pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.TopicScore},` +
                    `\n vocabularyScore: ${pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.VocabularyScore},` +
                    `\n Accuracy score: ${pronunciationAssessmentObjectResult.accuracyScore},` +
                    `\n pronunciation score: ${pronunciationAssessmentObjectResult.pronunciationScore},` +
                    `\n completeness score : ${pronunciationAssessmentObjectResult.completenessScore},` +
                    `\n fluency score: ${pronunciationAssessmentObjectResult.fluencyScore},` +
                    `\n prosody score: ${pronunciationAssessmentObjectResult.prosodyScore}`
                );
            }
            if (pronunciationAssessmentObjectResult && pronunciationAssessmentObjectResult.accuracyScore && pronunciationAssessmentObjectResult.fluencyScore && pronunciationAssessmentObjectResult.prosodyScore && pronunciationAssessmentObjectResult.completenessScore && pronunciationAssessmentObjectResult.pronunciationScore   ){
                setReportRecordObject((prev) => ({
                    ...prev,
                    sttResult: {
                        ...prev.sttResult,
                        pronunciationAssessmentObjectResult: Array.isArray(prev.sttResult.pronunciationAssessmentObjectResult)
                            ? [...prev.sttResult.pronunciationAssessmentObjectResult, pronunciationAssessmentObjectResult]
                            : [pronunciationAssessmentObjectResult] // Initializes it as an array if not already
                    }
                }));
                dispatch(setPronunciationAssessment(
                    {
                        pronunciationAssessmentObjectResult : pronunciationAssessmentObjectResult ? pronunciationAssessmentObjectResult : "",
                        pronunciationAssessmentResult: {
                            AccuracyScore: pronunciationAssessmentObjectResult.accuracyScore ? Number(pronunciationAssessmentObjectResult.accuracyScore.toFixed(1)) : 1,
                            FluencyScore: pronunciationAssessmentObjectResult.fluencyScore ? Number(pronunciationAssessmentObjectResult.fluencyScore.toFixed(1)) : 1,
                            ProsodyScore: pronunciationAssessmentObjectResult.prosodyScore ? Number(pronunciationAssessmentObjectResult.prosodyScore.toFixed(1)) : 1,
                            CompletenessScore: pronunciationAssessmentObjectResult.completenessScore ? Number(pronunciationAssessmentObjectResult.completenessScore.toFixed(1)) : 1,
                            PronScore: pronunciationAssessmentObjectResult.pronunciationScore ? Number(pronunciationAssessmentObjectResult.pronunciationScore.toFixed(1)) : 1,

                        }}
                ))
            }
            if (pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment){

                setReportRecordObject((prev) => ({
                    ...prev,
                    sttResult: {
                        ...prev.sttResult,
                        contentAssessmentResult: Array.isArray(prev.sttResult.contentAssessmentResult)
                            ? [...prev.sttResult.contentAssessmentResult, pronunciationAssessmentObjectResult.contentAssessmentResult]
                            : [pronunciationAssessmentObjectResult.contentAssessmentResult] // Ensures it starts as an array if not already
                    },
                    // isCompleted: true
                }));
                dispatch(setPronunciationAssessment(
                    {
                        contentAssessmentResult: {
                            vocabularyScore: pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.VocabularyScore ? Number(pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.VocabularyScore.toFixed(1))  : 1,
                            grammarScore: pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.GrammarScore ? Number(pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.GrammarScore.toFixed(1))  : 1,
                            topicScore: pronunciationAssessmentObjectResult.contentAssessmentResult && pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.TopicScore ? Number(pronunciationAssessmentObjectResult.contentAssessmentResult.privPronJson.ContentAssessment.TopicScore.toFixed(1))  : 1,
                        },
                    }

                ))
            }
            if (result.text !== "" && result.text !== "."){
                setReportRecordObject((prev) => ({
                    ...prev,
                    message: Array.isArray(prev.message) ? [...prev.message, result.text] : [result.text], // Ensures `message` is an array
                    msgResult: Array.isArray(prev.message) ? [...prev.msgResult, result] : [result] // Ensures `msgResult` is an array

                }));

                // mockInterviewSttTtsInsert(
                //     {
                //         chatId: chatId,
                //         sessionId: sessionId,
                //         message: result.text,
                //         msgResult: result,
                //         userId: user.userId,
                //         type: "stt",
                //         pronunciationAssessmentObjectResult: pronunciationAssessmentObjectResult ? pronunciationAssessmentObjectResult : "",
                //     }
                //
                // );
            }
            processRecognizedTranscriptCount.current = processRecognizedTranscriptCount.current + 1;
            setUserReply(myTranscriptRef.current);
        }
    };

    const handleRecognizingTranscript = async (event) =>{
        const result = event.result;
        if (process.env.DEV){
            console.log('Recognizing result:', result);
        }
        if (result.reason === sdk.ResultReason.RecognizingSpeech) {
            const transcript =  result.text;
            if (process.env.DEV){
                console.log('Transcript: -->', transcript);
            }
            // Call a function to process the transcript as needed
            setRecognizingTranscript(transcript);

        }
    }
    const mockInterviewSttTtsInsertTime = async () => {
        if (user && user.userId && chatId && sessionId ){
            const ttsTimeInsertId = await mockInterviewSttTtsTimeInsert(
                {
                    userId: user.userId,
                    chatId: chatId,
                    sessionId: sessionId,
                    type: "stt",
                    timeUtilised: 0
                }
            );
            setSessionIdBuffer(sessionId);
            if (process.env.DEV){
                console.log('InsertedId STT =>', ttsTimeInsertId.insertedId);
            }

            setSttTimeId(ttsTimeInsertId.insertedId);
        }

    }

    const mockInterviewSttInsertUserFeedback = async (data) => {
        if (user && user.userId && chatId && sessionId ){
            const ttsTimeInsertId = await mockInterviewSttTtsInsert(data);
            setSessionIdBuffer(sessionId);
            if (process.env.DEV){
                console.log('InsertedId STT =>', ttsTimeInsertId.insertedId);
            }
            dispatch(setLastSttTtsObjectId(ttsTimeInsertId.insertedId));
            setSttTimeId(ttsTimeInsertId.insertedId);
        }

    }

    const StartSpeechToTextFromMic = async () => {
        if (!sttTimeId) {
            await mockInterviewSttTtsInsertTime();
        }
        if (!recognizer.current) setupRecognizer();

        if (messages.length > 0 && messages[messages.length - 1].msg_from === "ResumeGuru.IO"){
            setPreviousTranscriptFromAgent(messages[messages.length - 1].message);
        }
        recognizer.current.startContinuousRecognitionAsync(() => {
            setIsListening(true);
            setSttStartTime(Date.now());
            if (process.env.DEV){
                console.log('Speech recognition started.');
            }
        });
        // recognizer.current.startContinuousRecognitionAsync(() => {
        //     setSttStartTime(Date.now());
        //     if (process.env.DEV){
        //         console.log('Speech recognition started.');
        //     }
        //     setIsListening(true);
        // });
    }

    useEffect(() => {
        const updateTimeConsumed = () =>{
            const totaltimeTaken = (sttEndTime - sttStartTime)/1000;
            if (process.env.DEV){
                console.log('Start STT time =>', sttStartTime);
                console.log('End STT time =>', sttStartTime);
                console.log('Total STT time =>', totaltimeTaken);
                console.log('STT insertedId =>', sttTimeId);
            }

            if (sttTimeId && totaltimeTaken > 0 && sessionIdBuffer === sessionId) {
                sttTimeUpdate(
                    {
                        insertedId: sttTimeId,
                        timeUtilised: totaltimeTaken
                    }
                );
                setSttStartTime(0);
                setSttEndTime(0);
            } else {

                mockInterviewSttTtsInsertTime();
            }
        }

        if (typeof sttEndTime === 'number' && sttEndTime > 0 && typeof setSttStartTime === 'number' && setSttStartTime > 0) {
            updateTimeConsumed();
        }

    }, [sttEndTime]);

    const resumeListening = () => {
        if (!isListening) {
            setIsListening(true);
            recognizer.current.startContinuousRecognitionAsync(() => {
                if (process.env.DEV){
                    console.log('Resumed listening...');
                }
            });
        }
    };


    const stopListening = () => {
        if (!recognizer.current) {
            console.error('Recognizer is null or undefined.');
            return;
        }
        recognizer.current.stopContinuousRecognitionAsync(() => {
            setSttEndTime(Date.now());
            setIsListening(false);
            if (process.env.DEV){
                console.log('Speech recognition stopped.');
            }
        });
    };




    const handleReplyMessageChange = (newText) => {
        myTranscriptRef.current = newText;
        setMyReplyTranscript(newText);
        setUserReply(newText);
    };


    const handleSendMessage = async () =>{
        setReportRecordObject((prev) => ({
            ...prev,

            isCompleted: true
        }));
      stopListening();
        myTranscriptRef.current = '';
        setMyReplyTranscript('');
        setUserReply('');
        sendMessage();

    }
    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {

            event.preventDefault();
            setReportRecordObject((prev) => ({
                ...prev,

                isCompleted: true
            }));
            stopListening();
            myTranscriptRef.current = '';
            setMyReplyTranscript('');
            setUserReply('');
            sendMessage();
        }
    };

    return (
        <div className=" mx-auto w-full">

                    {/*<div className="flex flex-row overflow-x-auto items-center rounded-xl bg-white w-full  ">*/}
                    {/*    {textToSpeakInProcess ? (*/}
                    {/*        <div className="flex items-center text-center w-full md:w-1/2 absolute bottom-0 right-0 p-1 bg-white border-t border-gray-300">*/}
                    {/*            <Spinner aria-label="Avatar speak in progress" size="xl" />*/}
                    {/*        </div>*/}
                    {/*    ) :(*/}
                            <div className="flex items-center w-full  bottom-0  p-1 bg-white border-t border-gray-300 ">

                                <div className="relative flex items-center w-full  py-2 bg-white  ">
                                    <Textarea

                                        value={myReplyTranscript}
                                        onClick={()=>{
                                            dispatch(setShowMicTooltip(false));
                                        }}
                                        rows={6}
                                        onKeyDown={(e)=>{handleKeyDownEnter(e)}}
                                        onChange={(e)=>{handleReplyMessageChange(e.target.value)}}
                                        placeholder="Your reply message..."
                                        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>
                            </div>
            <div className="flex flex-wrap w-full">

                <div className="flex w-1/3 mx-auto m-2">
                <Button
                    className="w-full"
                    gradientDuoTone="cyanToBlue"
                    isProcessing={pendingResponse || textToSpeakInProcess}
                    onClick={()=>{
                        if (!pendingResponse && !textToSpeakInProcess){
                            if (isListening){
                                stopListening();
                            } else {
                                StartSpeechToTextFromMic();
                                dispatch(setShowMicTooltip(false));
                            }
                        }

                    }}
                >
                                    {
                                        isListening ? (
                                            <div className="blink flex">
                                                <MicrophoneIcon className="h-6 w-6 text-white flash"                 />
                                                <span >Listening</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Tooltip
                                                    message="Click here to speak"
                                                    showTooltip={showMicTooltip}
                                                >
                                                    <div className=" flex ">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="h-6 w-6 cursor-pointer"
                                                             viewBox="0 0 24 24"

                                                        ><path fill="currentColor" d="M19 11c0 1.19-.34 2.3-.9 3.28l-1.23-1.23c.27-.62.43-1.31.43-2.05zm-4 .16L9 5.18V5a3 3 0 0 1 3-3a3 3 0 0 1 3 3zM4.27 3L21 19.73L19.73 21l-4.19-4.19c-.77.46-1.63.77-2.54.91V21h-2v-3.28c-3.28-.49-6-3.31-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1c.81 0 1.6-.19 2.31-.52l-1.66-1.66L12 14a3 3 0 0 1-3-3v-.72L3 4.27z"/></svg>

                                                    </div>
                                                </Tooltip>
                                            </>
                                        )
                                    }
                                </Button>
                </div>
                <div className="flex w-1/3 mx-auto m-2">
                <Button
                    className="w-full"
                    isProcessing={pendingResponse || textToSpeakInProcess}
                    gradientDuoTone="purpleToBlue"
                    onClick={()=>{
                        if (!pendingResponse && !textToSpeakInProcess){
                            handleSendMessage()
                        }}}

                >
                                        <span className="ml-2">

                                            <svg
                                                className="w-5 h-5 transform rotate-45 -mt-px"
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
                    <span >Send</span>

                </Button>
                </div>
            </div>
                        {/*)}*/}


                    {/*</div>*/}


        </div>
    );
  }
  export default UserAudio;
