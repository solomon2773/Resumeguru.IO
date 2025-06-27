import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { createAvatarSynthesizer, createWebRTCConnection } from "./Utility";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {toast} from "react-toastify";
// import { Button, Modal } from "flowbite-react";

import UserQuickCreateContext from "../../context/UserQuickCreateContext";
import {
    setPendingResponse,
    setSessionId,
    setTextToSpeakInProcess,
    setLastSttTtsObjectId,
    updateSttTTSTimeText, updateSubscriptionPlan
} from "../../store/mockInterview/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import {avatarUsageUpdateByChatId} from "../../helpers/mongodb/pages/mockInterview/avatarUsage";
import { v4 as uuidv4 } from 'uuid';
import {getSttTtsTextUsage, mockInterviewSttTtsInsert} from "../../helpers/mongodb/pages/mockInterview/sttTTS";


const Avatar = ({textToSpeek, cotinueAvatar, setcotinueAvatar}) => {

   // console.log(textToSpeek)
    const {  openOverlay } = useContext(UserQuickCreateContext);
    const dispatch = useDispatch();
    const chatId = useSelector((state) => state.chat.chatId);
    const sessionId = useSelector((state) => state.chat.sessionId);
    const user = useSelector((state) => state.user);
    const mockInterviewSelectedAudioDevice = useSelector((state) => state.chat.selectedAudioDevice);
    const mockInterviewSelectedVideoDevice = useSelector((state) => state.chat.selectedVideoDevice);
    const initialWelcomeAvatarPlayed = useSelector((state) => state.chat.initialWelcomeAvatarPlayed);
    const mockInterviewFromJobSearch = useSelector(state => state.chat.mockInterviewFromJobSearch)

    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);
    const myAvatarVideoEleRef = useRef();
    const myAvatarAudioEleRef = useRef();
    const ttsAudioRef = useRef(null);
    const initialWelcomeVideoRef = useRef();
    const [loading, setLoading] = useState(false);
    const [initialWelcome, setInitialWelcome] = useState(true);
    const [initialWelcomeVideoPlayed, setInitialWelcomeVideoPlayed] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [avSpeekText, setAvSpeekText] = useState(false);
    const [iceUrl, setIceUrl] = useState("")
    const [iceUsername, setIceUsername] = useState("")
    const [iceCredential, setIceCredential] = useState("")
    const [isAvatarStarted, setIsAvatarStarted] = useState(false)
    const [openMockInterviewModal, setOpenMockInterviewModal] = useState(false)
    const [showIdleVideo , setShowIdleVideo] = useState(false)
    const [avatarUsage, setAvatarUsage] = useState({})
    useEffect(() => {
            if (mockInterviewFromJobSearch && mockInterviewFromJobSearch.jobs && mockInterviewFromJobSearch.jobs[0] && mockInterviewFromJobSearch.jobs[0].id){
                setFirstTime(false);
                setcotinueAvatar(false);
                setInitialWelcomeVideoPlayed(true);
                setInitialWelcome(false);
                setShowIdleVideo(true);
            }

    }, [mockInterviewFromJobSearch]);
    useEffect(()=>{
        if (avatarUsage.userId && avatarUsage.chatId && avatarUsage.sessionId && avatarUsage.sessionStartTime && avatarUsage.status){
            avatarUsageUpdateByChatId(avatarUsage)
        }


    },[avatarUsage])


    useEffect(() => {
        async function getRelayToken() {
            setLoading(true);
            if (user && user.profile && user.profile.userId) {
                fetch(process.env.SITE_URL + '/api/azure/getRelayToken', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.profile.userId ,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                       // console.log("Our Ice server Info");
                      //  console.log(data.iceInfo);
                        const iceDetails = data.iceInfo;

                        setLoading(false);
                        if (data.status){
                            setIceUrl(iceDetails.Urls[0]);
                            setIceUsername(iceDetails.Username);
                          //  console.log(iceDetails)
                            setIceCredential(iceDetails.Password);
                        } else {
                            toast.error("Get Azure Relay token failed fail in status....");

                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.error('Error:', error);
                        toast.error("Get Azure Relay token failed Fail in catch...");
                    });
            }
        }

        if (user && user.profile && user.profile.userId && process.env.ENABLE_AVATAR_VIDEO) {
            getRelayToken();
        }

    },[user]);

    useEffect(() => {
        if (isAvatarStarted && textToSpeek !== "" && avSpeekText && process.env.ENABLE_AVATAR_VIDEO) {
            speakSelectedTextAvatar(); // Speak the selected text with Avatar
        }
    }, [avSpeekText]);

    useEffect(() => {
        if (textToSpeek !== "" && cotinueAvatar && !firstTime && !process.env.ENABLE_AVATAR_VIDEO) {
            setShowIdleVideo(false);
            speakSelectedTextTTS(); // Speak the selected text without Avatar
        }
    }, [textToSpeek]);


    useEffect(() => {
        if (cotinueAvatar && !firstTime && !isAvatarStarted && process.env.ENABLE_AVATAR_VIDEO) {
            console.log("Starting Avatar")
            startAvatarSession();
        }
    }, [cotinueAvatar]);

    // useEffect(() => {
    //     if (iceUrl !== "" || !process.env.ENABLE_AVATAR_VIDEO) {
    //         if (user.profile && user.profile.userId ) {
    //             setOpenMockInterviewModal(true);
    //         }
    //
    //     }
    // }, [iceUrl, user.profile]);

    useEffect(() => {
        if (ttsAudioRef.current) {
            ttsAudioRef.current.onAudioEnd = () => {
            setShowIdleVideo(true);
          };
        }
      }, [ttsAudioRef.current]);

    const handleOnTrack = (event) => {

        if (process.env.DEV){
            console.log("#### Printing handle onTrack ",event);
            console.log("Printing event.track.kind ",event.track.kind);
        }


        // Update UI elements

        if (event.track.kind === 'video') {

            const mediaPlayer = myAvatarVideoEleRef.current;
            mediaPlayer.id = event.track.kind;
            mediaPlayer.srcObject = event.streams[0];
            mediaPlayer.autoplay = true;
            mediaPlayer.playsInline = true;
            mediaPlayer.addEventListener('play', () => {
            window.requestAnimationFrame(()=>{
                setShowIdleVideo(false);
            });
          });

            // mediaPlayer.addEventListener('timeupdate', () => {
            //     console.log('Current time: ', mediaPlayer.currentTime);
            // });

        } else {
          // Mute the audio player to make sure it can auto play, will unmute it when speaking
          // Refer to https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
          //const mediaPlayer = myAvatarVideoEleRef.current;
          const audioPlayer = myAvatarAudioEleRef.current;
          audioPlayer.srcObject = event.streams[0];
          audioPlayer.autoplay = true;
          audioPlayer.playsInline = true;
          audioPlayer.muted = true;
        }
      };

    const stopSpeaking = () => {
        avatarSynthesizer.stopSpeakingAsync().then(() => {
            if (process.env.DEV) {
                console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")
            }
        }).catch();
    }
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const stopSession = async () => {
        // const waitForDelay = async () => {
        //     await delay(5000); // wait for 5 seconds
        //
        // };
        //
        // await waitForDelay();
        try{
          //Stop speaking
          avatarSynthesizer.stopSpeakingAsync().then(() => {
            setIsAvatarStarted(false);
            setShowIdleVideo(true);
              setAvatarUsage(prevAvatarUsage => {
                  const newAvatarUsage = { ...prevAvatarUsage };

                  // Update the necessary fields
                  newAvatarUsage.sessionEndTime = new Date().toISOString(),
                  newAvatarUsage.sessionDuration = new Date().getTime() - new Date(newAvatarUsage.sessionStartTime).getTime(),
                  newAvatarUsage.status = "Session Ended Successfully";

                  return newAvatarUsage;
              });

              if (process.env.DEV) {
                  console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")
              }
            // Close the synthesizer
            avatarSynthesizer.close();
          }).catch();
        }catch(e) {
        }
      }

    const speakSelectedTextAvatar = () => {
        const textToSpeekStartTimeBuf = new Date().toISOString();
            setAvatarUsage(prevAvatarUsage => {
            const newAvatarUsage = { ...prevAvatarUsage };

            // Update the necessary fields
            newAvatarUsage.textToSpeekStartTime = textToSpeekStartTimeBuf,
                newAvatarUsage.textToSpeek = textToSpeek;

            return newAvatarUsage;
        });

        //Start speaking the text
        dispatch(setTextToSpeakInProcess(true));
        const audioPlayer = myAvatarAudioEleRef.current;
        if (process.env.DEV) {
            console.log("Audio muted status ", audioPlayer.muted);
        }
        audioPlayer.muted = false;
        avatarSynthesizer.speakTextAsync(textToSpeek).then(
            (result) => {
                dispatch(setTextToSpeakInProcess(false));
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {

                    setAvatarUsage(prevAvatarUsage => {
                        const newAvatarUsage = { ...prevAvatarUsage };

                        // Update the necessary fields
                        newAvatarUsage.textToSpeekEndTime= new Date().toISOString(),
                            newAvatarUsage.textToSpeekDuration = new Date().getTime() - new Date(textToSpeekStartTimeBuf).getTime();

                        return newAvatarUsage;
                    });
                    if (firstTime) {
                        setFirstTime(false);
                    }
                    stopSession();
                    setAvSpeekText(false);

                    if (process.env.DEV) {
                        console.log("Speech and avatar synthesized to video stream.")
                    }
                } else {
                    if (process.env.DEV) {
                        console.log("Unable to speak. Result ID: " + result.resultId)
                        console.log("Result reason: " + result.reason)
                    }
                    if (result.reason === SpeechSDK.ResultReason.Canceled) {

                        setAvatarUsage(
                            prevAvatarUsage => {
                                const newAvatarUsage = { ...prevAvatarUsage };

                                // Update the necessary fields
                                newAvatarUsage.textToSpeekEndTime= new Date().toISOString(),
                                    newAvatarUsage.textToSpeekDuration = new Date().getTime() - new Date(textToSpeekStartTimeBuf).getTime(),
                                    newAvatarUsage.status = "Avatar Text to Speech Failed",
                                newAvatarUsage.canceledReason =  result.reason;

                                return newAvatarUsage;
                            }
                        )
                        let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result)
                        if (process.env.DEV) {
                            console.log(cancellationDetails.reason)
                        }
                        if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
                            console.log(cancellationDetails.errorDetails)
                            toast.error("Too many requests made to the service. Please try again after some time.")
                        }
                    }
                }
        }).catch((error) => {
            if (process.env.DEV) {
                console.log(error)
            }
            toast.error("Avatar Text to Speech Failed")
            setAvatarUsage(prevAvatarUsage => {
                const newAvatarUsage = { ...prevAvatarUsage };

                // Update the necessary fields
                newAvatarUsage.textToSpeekEndTime= new Date().toISOString(),
                    newAvatarUsage.textToSpeekDuration = new Date().getTime() - new Date(textToSpeekStartTimeBuf).getTime(),
                    newAvatarUsage.status = "Avatar Text to Speech Failed";

                return newAvatarUsage;
            });
            avatarSynthesizer.close()
        });
    }
    const updateSubscription = async () => {
        await getSttTtsTextUsage(user.profile.userId).then((res) => {
            if (res) {
                dispatch(updateSttTTSTimeText(res));
            }
        });
        // await mongodbGetValidSubscriptionPlan(user.profile.userId).then((res) => {
        //     if (res) {
        //         dispatch(updateSubscriptionPlan(res));
        //     }
        // });
    }
    const speakSelectedTextTTS = () => {

        ttsAudioRef.current = new SpeechSDK.SpeakerAudioDestination();
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.MS_AZURE_SPEECH_SERVICE_KEY, process.env.MS_AZURE_SPEECH_SERVICE_REGION);
        const audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(ttsAudioRef.current);
        //const audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(ttsAudioPlayer);
        // The language of the voice that speaks.

        speechConfig.speechSynthesisVoiceName = process.env.MS_AZURE_SPEECH_SERVICE_VOICE_NAME;

        const ttsSynthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

        ttsSynthesizer.speakTextAsync(
            textToSpeek,
            async (result) => {

                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    if (typeof window !== 'undefined') {
                        const storedValue = localStorage.getItem("rg_jd_sel_mock_interview");
                        if (storedValue) {
                            localStorage.removeItem("rg_jd_sel_mock_interview");
                        }

                    }
                    await mockInterviewSttTtsInsert(
                        {
                            chatId: chatId,
                            sessionId: sessionId,
                            message: textToSpeek,
                            userId: user.profile.userId,
                            type: "tts",
                            ttsResult: result ? result : "",
                        }
                    ).then(async (mockInterviewSttTtsInsertResult) => {
                        const lastSttTtsObjectId = await mockInterviewSttTtsInsertResult.insertedId.toString();
                        dispatch(setLastSttTtsObjectId(lastSttTtsObjectId));
                        updateSubscription();
                    });

                    if (process.env.DEV) {
                        console.log('TTS Synthesis finished.');
                    }
                } else {
                    console.error("Speech synthesis canceled, " + result.errorDetails);
                    setShowIdleVideo(true);
                }

                ttsSynthesizer.close();
            },
            (error) => {
                setShowIdleVideo(true);
                console.error("Error during synthesis: " + error);
            }
        );
    }

    useEffect(()=>{
        const startInitialWelcome = async () =>{
            const initialWelcomeVideoElement = initialWelcomeVideoRef.current;
            dispatch(setSessionId(uuidv4()));
            if (initialWelcomeVideoElement) {
                initialWelcomeVideoElement.play();
                const handleEnded = () => {
                    if (process.env.DEV){
                        console.log('initial welcome video ended')
                    }

                    dispatch(setTextToSpeakInProcess(false));
                    setInitialWelcome(false);
                    setShowIdleVideo(true);
                    if (firstTime) {
                        setFirstTime(false);
                    }
                    setcotinueAvatar(false);
                    // initialWelcomeVideoElement.removeEventListener('ended', handleEnded);
                };
                initialWelcomeVideoElement.addEventListener('ended', handleEnded);
            }
        }
        if (initialWelcomeAvatarPlayed && !initialWelcomeVideoPlayed){
            startInitialWelcome().then(()=>{
                setInitialWelcomeVideoPlayed(true);
            });
        }
    },[initialWelcomeAvatarPlayed])


    const startAvatarSession =  () => {
        setAvatarUsage(prevAvatarUsage => {
            const newAvatarUsage = { ...prevAvatarUsage };

            // Update the necessary fields
            newAvatarUsage.userId= user.profile.userId,
                newAvatarUsage.chatId = chatId,
                newAvatarUsage.sessionId = sessionId,
                newAvatarUsage.sessionStartTime = new Date().toISOString();

            return newAvatarUsage;
        });


        let peerConnection =  createWebRTCConnection(iceUrl,iceUsername, iceCredential);
        //console.log("Peer connection ",peerConnection);
        peerConnection.ontrack =  handleOnTrack;

        peerConnection.addTransceiver('video', { direction: 'sendrecv' })
        peerConnection.addTransceiver('audio', { direction: 'sendrecv' })
        //setLoading(true);
        let avatarSynthesizer =   createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);
        peerConnection.oniceconnectionstatechange = e => {
            if (process.env.DEV) {
                console.log("WebRTC status: " + peerConnection.iceConnectionState)
            }
            if (peerConnection.iceConnectionState === 'connected') {
                if (process.env.DEV) {
                    console.log("Connected to Azure Avatar service");
                }
            }

            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
                if (process.env.DEV) {
                    console.log("Azure Avatar service Disconnected");
                }
            }
        }

        avatarSynthesizer.startAvatarAsync(peerConnection).then((r) => {

            setLoading(false);
            setIsAvatarStarted(true);
            setAvSpeekText(true);
            setcotinueAvatar(false);

            if (process.env.DEV) {
                console.log("[" + (new Date()).toISOString() + "] Avatar started.")
            }

        }).catch(
            (error) => {
                console.log("[" + (new Date()).toISOString() + "] Avatar failed to start. Error: " + error)
            }
        );
    }


    return(

        <div className="sm:w-auto  h-full  flex justify-center items-center bg-white ">

        {
                loading  ? (
                    <div className="flex justify-center items-center">
                        <svg aria-hidden="true"
                            className="w-20 h-20 mx-auto animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                        </svg>
                    </div>

                ) :(
                    <div className="w-full h-full flex justify-center items-center ">
                        <div className="w-full h-full flex justify-center items-center">
                            {initialWelcome ? (
                                <div className="w-full h-full flex justify-center items-center">
                                    <video controls={false} src={process.env.SITE_URL+"/videos/avatar/initialWelcomeV2.mp4"} playsInline ref={initialWelcomeVideoRef} className="object-cover  w-full h-full"></video>
                                </div>
                            ) : (
                                <>
                                    <div  id="localVideo" className={`${showIdleVideo  ? 'block' : 'hidden'} w-full h-full flex justify-center items-center `}>
                                        <video controls={false} src={process.env.SITE_URL+"/videos/avatar/lisa-casual-sitting-idle.mp4"} playsInline autoPlay loop muted className="object-cover  w-full h-full"></video>
                                    </div>
                                    { process.env.ENABLE_AVATAR_VIDEO ? (
                                    <div id="myAvatarVideo" className={`${showIdleVideo  ? 'hidden' : 'block'} w-full h-full flex justify-center items-center`}>
                                        <video  className="object-cover h-full" controls={false} ref={myAvatarVideoEleRef} >
                                        </video>
                                        <audio ref={myAvatarAudioEleRef}>
                                        </audio>
                                    </div>
                                    ) : (
                                        <div className={`${showIdleVideo  ? 'hidden' : 'block'} w-full h-full flex justify-center items-center`}>
                                            <video controls={false} src={process.env.SITE_URL+"/videos/avatar/lisa-casual-sitting-noaudio.mp4"} autoPlay loop muted playsInline className="object-cover  w-full h-full"></video>
                                        </div>
                                    )
                                    }
                                </>
                            )}

                        </div>
                    </div>
                )
            }

        </div>

    )
}
export default Avatar;
