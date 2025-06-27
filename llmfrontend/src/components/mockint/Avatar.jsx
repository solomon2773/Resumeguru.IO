import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { createAvatarSynthesizer, createWebRTCConnection } from "./Utility";
// import { avatarAppConfig } from "./config";
import { useEffect, useRef, useState } from "react";
// import {useAuth} from "../../context/AuthContext";
import {toast} from "react-toastify";
import { Button, Modal } from "flowbite-react";
import {useSelector} from "react-redux";

const Avatar = () => {

    const user = useSelector(state => state.user.profile);
    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);
    const myAvatarVideoEleRef = useRef();
    const myAvatarAudioEleRef = useRef();
    const [mySpeechText, setMySpeechText] = useState("");
    const [loading, setLoading] = useState(false);

    const [iceUrl, setIceUrl] = useState("")
    const [iceUsername, setIceUsername] = useState("")
    const [iceCredential, SetIceCredential] = useState("")

    useEffect(() => {
        async function getRelayToken() {
            setLoading(true);
            if (user && user.userId) {
                fetch(process.env.SITE_URL + '/api/azure/getRelayToken', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.userId ,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Our Ice server Info");
                        console.log(data.iceInfo);
                        const iceDetails = data.iceInfo;

                        setLoading(false);
                        if (data.status){
                            setIceUrl(iceDetails.Urls[0]);
                            setIceUsername(iceDetails.Username);
                            //console.log(data.userUsageResult)
                            SetIceCredential(iceDetails.Password);
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

        if (user && user.userId) {
            getRelayToken();
        }

    },[user]);


    const handleSpeechText = (event) => {
        setMySpeechText(event.target.value);
    }


    const handleOnTrack = (event) => {

        console.log("#### Printing handle onTrack ",event);

        // Update UI elements
        console.log("Printing event.track.kind ",event.track.kind);
        if (event.track.kind === 'video') {
            const mediaPlayer = myAvatarVideoEleRef.current;
            mediaPlayer.id = event.track.kind;
            mediaPlayer.srcObject = event.streams[0];
            mediaPlayer.autoplay = true;
            mediaPlayer.playsInline = true;
            mediaPlayer.addEventListener('play', () => {
            window.requestAnimationFrame(()=>{});
          });
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
          console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")

        }).catch();
    }

    const stopSession = () => {

        try{
          //Stop speaking
          avatarSynthesizer.stopSpeakingAsync().then(() => {
            console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")
            // Close the synthesizer
            avatarSynthesizer.close();
          }).catch();
        }catch(e) {
        }
      }

    const speakSelectedText = () => {

        //Start speaking the text
        const audioPlayer = myAvatarAudioEleRef.current;
        console.log("Audio muted status ",audioPlayer.muted);
        audioPlayer.muted = false;
        avatarSynthesizer.speakTextAsync(mySpeechText).then(
            (result) => {
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Speech and avatar synthesized to video stream.")
                } else {
                    console.log("Unable to speak. Result ID: " + result.resultId)
                    if (result.reason === SpeechSDK.ResultReason.Canceled) {
                        let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result)
                        console.log(cancellationDetails.reason)
                        if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
                            console.log(cancellationDetails.errorDetails)
                        }
                    }
                }
        }).catch((error) => {
            console.log(error)
            avatarSynthesizer.close()
        });
    }

    const startSession = () => {
        console.log("Inside start session");
        let peerConnection = createWebRTCConnection(iceUrl,iceUsername, iceCredential);
        console.log("Peer connection ",peerConnection);
        peerConnection.ontrack = handleOnTrack;
        peerConnection.addTransceiver('video', { direction: 'sendrecv' })
        peerConnection.addTransceiver('audio', { direction: 'sendrecv' })

        let avatarSynthesizer = createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);
        peerConnection.oniceconnectionstatechange = e => {
            console.log("WebRTC status: " + peerConnection.iceConnectionState)

            if (peerConnection.iceConnectionState === 'connected') {
                console.log("Connected to Azure Avatar service");
            }

            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
                console.log("Azure Avatar service Disconnected");
            }
        }

        avatarSynthesizer.startAvatarAsync(peerConnection).then((r) => {
            console.log("[" + (new Date()).toISOString() + "] Avatar started.")

        }).catch(
            (error) => {
                console.log("[" + (new Date()).toISOString() + "] Avatar failed to start. Error: " + error)
            }
        );
    }


    return(

        <div className="max-w-7xl  sm:px-2 lg:px-4 lg:py-4 mx-auto">
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



                    <div className="grid grid-rows-2 grid-flow-col gap-4">

                        <div className="flex flex-col ">
                            <div id="myAvatarVideo" className="myVideoDiv">

                                <video className="myAvatarVideoElement" ref={myAvatarVideoEleRef}>

                                </video>

                                <audio ref={myAvatarAudioEleRef}>

                                </audio>
                            </div>
                                <div className="flex flex-wrap gap-2">
                                <Button outline
                                    onClick={startSession}
                                    gradientDuoTone="purpleToBlue"
                                >
                                    Connect
                                </Button>

                                <Button  outline
                                    onClick={stopSession}
                                    gradientDuoTone="purpleToBlue"
                                >
                                    Disconnect
                                </Button>
                                </div>
                        </div>

                        <div className="flex flex-col ">
                            <textarea
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleSpeechText}
                                rows={4}
                            />
                            <div className="flex flex-wrap gap-2">
                            <Button  outline
                                onClick={speakSelectedText}
                                gradientDuoTone="purpleToBlue"
                            >
                                Speek
                            </Button>

                            <Button  outline
                                onClick={stopSpeaking}
                                gradientDuoTone="purpleToBlue"
                            >
                                Stop
                            </Button>
                            </div>
                        </div>

                    </div>
                )
            }
        </div>

    )
}
export default Avatar;
