import React, { useEffect, useRef, useState } from "react";
import {
    FaceLandmarker,
    HandLandmarker,
    PoseLandmarker,
    FilesetResolver,
    ImageSegmenter,
} from "@mediapipe/tasks-vision";
import {uploadFilePrivate} from "../../../helpers/s3/s3client";
import {useSelector} from "react-redux";
import {mongodbMockInterviewChunkInsert} from "../../../helpers/mongodb/components/mockInterview/AiRecognition/recognitionBlock";
import {setVideoRecognition, setDisplayLandmarks} from "../../../store/mockInterview/videoRecognitionSlice";
import {useDispatch} from "react-redux";
import {Badge, Progress} from "flowbite-react";
import {toast} from "react-toastify";
// import dynamic from 'next/dynamic';



const RecognitionBlock = () => {
// Function to check if WebGL is available (which indicates GPU support)
    const isWebGLAvailable = () => {
        try {
            const canvas = document.createElement("canvas");
            return !!(
                window.WebGLRenderingContext &&
                (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
            );
        } catch (e) {
            console.log("Error checking for WebGL support:", e);
            return false;
        }
    };
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.profile)
    const sessionId = useSelector((state) => state.chat.sessionId);
    const selectedAudioDevice = useSelector((state) => state.chat.selectedAudioDevice);
    const selectedVideoDevice = useSelector((state) => state.chat.selectedVideoDevice);
    const displayLandmarks = useSelector((state) => state.videoRecognition.displayLandmarks);

    // const StatsMonitor = dynamic(() => import('../../StatsMonitor'), { ssr: false });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const videoWidth = 320;
    const videoHeight = 240;
    const [faceLandmarker, setFaceLandmarker] = useState(null);
    const [handLandmarker, setHandLandmarker] = useState(null);
    const [poseLandmarker, setPoseLandmarker] = useState(null);
    const [imageSegmenter, setImageSegmenter] = useState(null);
    const [displaySegmentation, setDisplaySegmentation] = useState(false);

    const [ctx, setCtx] = useState(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [facialCenterFeedback, setFacialCenterFeedback] = useState({
        centerScore:0,
        centered: false,
        description:"",
       });
    const [facialEyeContactFeedback, setFacialEyeContactFeedback] = useState({
        eyeContactScore: 0,
        eyeContact: false,
        description: ""
    });
    const [facialSmileFeedback, setFacialSmileFeedback] = useState({
        smileScore: 0,
        smiling: false,
        description: ""
    });
    const [facialHeadCenterFeedback, setFacialHeadCenterFeedback] = useState({
        distanceScore: 0,
        tooFarTooClose: false,
        description: ""
    });


    // useEffect(()=>{
    //
    //     dispatch(setVideoRecognition({
    //         facialCenterFeedback: facialCenterFeedback,
    //         facialEyeContactFeedback: facialEyeContactFeedback,
    //         facialSmileFeedback: facialSmileFeedback,
    //         facialHeadCenterFeedback: facialHeadCenterFeedback
    //     }))
    //
    // },[facialCenterFeedback, facialEyeContactFeedback, facialSmileFeedback, facialHeadCenterFeedback])
    // console.log(facialCenterFeedback)
    const [initializeFaceLandmarkerModel, setInitializeFaceLandmarkerModel] = useState(false);
    // Step 1: Initialize FaceLandmarker, HandLandmarker, and PoseLandmarker with GPU or CPU delegate based on availability
    useEffect(() => {
        const initializeFaceLandmarker = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const delegate = isWebGLAvailable() ? "GPU" : "CPU"; // Check GPU availability

               //console.log(`Using delegate: ${delegate}`); // Log which delegate is being used

                const faceLandmarkerInstance = await FaceLandmarker.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                            delegate, // Set delegate based on GPU availability
                        },
                        outputFaceBlendshapes: true,
                        runningMode: "VIDEO",
                        numFaces: 1,

                    }
                );
                // const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                //     baseOptions: {
                //         modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                //         delegate
                //     },
                //     runningMode: "VIDEO",
                //     numHands: 2
                // });
                // const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                //     baseOptions: {
                //         modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                //         delegate
                //     },
                //     runningMode: "VIDEO",
                //     numPoses: 2
                // });
                // const imageSegmenterInstance = await ImageSegmenter.createFromOptions(
                //     vision,
                //     {
                //         baseOptions: {
                //             modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
                //             delegate,
                //         },
                //         runningMode: "VIDEO",
                //         outputCategoryMask: true,
                //         outputConfidenceMasks: false
                //     }
                // );
                setFaceLandmarker(faceLandmarkerInstance);
                // setHandLandmarker(handLandmarker);
                // setPoseLandmarker(poseLandmarker);
                // setImageSegmenter(imageSegmenterInstance);
                setInitializeFaceLandmarkerModel(true);

                if (canvasRef.current) {
                    const context = canvasRef.current.getContext("2d");
                    setCtx(context);
                }
            } catch (error) {
                console.error("Error initializing FaceLandmarker:", error);
            }
        };
        if (!initializeFaceLandmarkerModel){
            initializeFaceLandmarker();
        }

    }, [initializeFaceLandmarkerModel]);


    // Step 2: Start Webcam and Detection
    useEffect(() => {
        if (faceLandmarker && !webcamRunning ) { //if (faceLandmarker && handLandmarker && poseLandmarker && !webcamRunning ) {
            const startWebcam = async () => {
                try {
                    // const stream = await navigator.mediaDevices.getUserMedia({
                    //     video: { width: 320, height: 240 },
                    //     audio: true
                    // });
                    // videoRef.current.srcObject = stream;
                    // To Do, audio streaming recording..
                    let recordingStream;
                    if (selectedAudioDevice.deviceId){
                        recordingStream = await navigator.mediaDevices.getUserMedia({
                            video: {
                                width: 320, height: 240,
                                deviceId: { exact: selectedVideoDevice.deviceId } },
                            // audio: {
                            //     deviceId: { exact: selectedAudioDevice.deviceId }  // Use the selected audio input device
                            // }
                        });
                    } else {
                        recordingStream = await navigator.mediaDevices.getUserMedia({
                            width: 320, height: 240,
                            deviceId: { exact: selectedVideoDevice.deviceId } ,
                        });
                    }


                    // Clone the video track to create a separate stream for processing
                    const videoTrack = recordingStream.getVideoTracks()[0];
                    const processingStream = new MediaStream([videoTrack]); // Create a stream with only the video track

                    // Set the video element to play the processing stream (video only)
                    videoRef.current.srcObject = processingStream;
                    // Wait for video to load dimensions
                    videoRef.current.onloadeddata = () => {
                        videoRef.current.play();
                        setWebcamRunning(true);
                       // startRecording(recordingStream);

                    };

                } catch (err) {
                    console.error("Error accessing webcam:", err);
                }
            };
           if (!webcamRunning && selectedAudioDevice.deviceId && selectedVideoDevice.deviceId) {
                startWebcam();
           }
        }
    }, [faceLandmarker, handLandmarker, poseLandmarker, selectedVideoDevice, selectedAudioDevice, webcamRunning]);


    // Step 3: Real-time face detection
    useEffect(() => {
        const detectFaces = async () => {


            if (faceLandmarker && ctx && webcamRunning) { //if (faceLandmarker && handLandmarker && poseLandmarker && ctx && webcamRunning) {
                const desiredFPS = 3; // Set your desired frames per second (e.g., 10 FPS)
                const interval = 1000 / desiredFPS;

                let lastDetectionTime = performance.now();
                const detect = async () => {
                    if (!videoRef.current) return;
                    const currentTime = performance.now();
                    if (currentTime - lastDetectionTime < interval) {
                        // Skip this frame if not enough time has passed
                        requestAnimationFrame(detect);
                        return;
                    }

                    lastDetectionTime = currentTime;
                    // Ensure video and canvas dimensions match
                    // const videoWidth = videoRef.current.videoWidth;
                    // const videoHeight = videoRef.current.videoHeight;

                    const faceResults = await faceLandmarker.detectForVideo(
                        videoRef.current,
                        performance.now()
                    );

                    // const handLandmarkerResults = await handLandmarker.detectForVideo(
                    //     videoRef.current,
                    //     performance.now()
                    // );
                    // const poseLandmarkerResults = await poseLandmarker.detectForVideo(
                    //     videoRef.current,
                    //     performance.now()
                    // );
                    // const segmentationResults = await imageSegmenter.segmentForVideo(
                    //     videoRef.current,
                    //     performance.now()
                    // );
                    canvasRef.current.width = videoWidth;
                    canvasRef.current.height = videoHeight;
                    // Clear canvas
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    // console.log(faceResults.faceBlendshapes[0].categories)
                    // {index: 23, score: 0.000017384780221618712, categoryName: 'jawForward', displayName: ''}
                    // console.log(handLandmarkerResults)
                    // console.log(poseLandmarkerResults)
                    if (faceResults.faceLandmarks  ) {
                        // console.log(faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0 && faceResults.faceLandmarks[0])
                        // const drawingUtils = new DrawingUtils(ctx);
                        faceResults.faceLandmarks.forEach(async (landmarks) => {
                           await analyzeFace(landmarks, videoRef.current.videoWidth, videoRef.current.videoHeight);
                            if (displayLandmarks) {
                                landmarks.forEach(({x, y}) => {
                                    ctx.beginPath();
                                    ctx.arc(
                                        x * canvasRef.current.width,
                                        y * canvasRef.current.height,
                                        2,
                                        0,
                                        Math.PI * 2
                                    );

                                    ctx.fillStyle = "#FFFFFF";
                                    ctx.fill();
                                });
                            }

                        });
                    }

                    // if (handLandmarkerResults.landmarks  ) {
                    //
                    //     handLandmarkerResults.landmarks.forEach(handLandmarks => {
                    //         if (displayLandmarks) {
                    //             handLandmarks.forEach(({x, y}) => {
                    //                 ctx.beginPath();
                    //                 ctx.arc(
                    //                     x * canvasRef.current.width,
                    //                     y * canvasRef.current.height,
                    //                     2,
                    //                     0,
                    //                     Math.PI * 2
                    //                 );
                    //                 ctx.fillStyle = "#FF0000";
                    //                 ctx.fill();
                    //             });
                    //         }
                    //     });
                    // }
                    // if (poseLandmarkerResults.landmarks  ) {
                    //     poseLandmarkerResults.landmarks.forEach(poseLandmarks => {
                    //         if (displayLandmarks) {
                    //             poseLandmarks.forEach(({x, y}) => {
                    //                 ctx.beginPath();
                    //                 ctx.arc(
                    //                     x * canvasRef.current.width,
                    //                     y * canvasRef.current.height,
                    //                     2,
                    //                     0,
                    //                     Math.PI * 2
                    //                 );
                    //                 ctx.fillStyle = "#00FF00";
                    //                 ctx.fill();
                    //             });
                    //         }
                    //
                    //     });
                    // }

                    // Process segmentation results
                    // if (segmentationResults.categoryMask && displaySegmentation) {
                    //     try {
                    //         const maskWidth = segmentationResults.categoryMask.width;
                    //         const maskHeight = segmentationResults.categoryMask.height;
                    //         const maskData = segmentationResults.categoryMask.getAsUint8Array();
                    //
                    //         // Create a temporary canvas for the blurred background
                    //         const tempCanvas = document.createElement("canvas");
                    //         const tempCtx = tempCanvas.getContext("2d");
                    //
                    //         // Set dimensions for the temporary canvas
                    //         tempCanvas.width = canvasRef.current.width;
                    //         tempCanvas.height = canvasRef.current.height;
                    //
                    //         // Draw the original video frame on the temp canvas
                    //         tempCtx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
                    //
                    //         // Apply blur filter to the temp canvas
                    //         tempCtx.filter = "blur(3px)";
                    //         tempCtx.drawImage(tempCanvas, 0, 0);
                    //
                    //         // Extract the blurred background as ImageData
                    //         const blurredBackground = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                    //
                    //         // Create a new ImageData object for the final output
                    //         const finalImageData = ctx.createImageData(maskWidth, maskHeight);
                    //
                    //         // Process the mask to make the foreground transparent
                    //         for (let i = 0; i < maskData.length; i++) {
                    //             const isForeground = maskData[i] > 0; // Foreground if category value > 0
                    //             const offset = i * 4;
                    //
                    //             if (isForeground) {
                    //                 // Use the blurred background for the background
                    //                 finalImageData.data[offset] = blurredBackground.data[offset];
                    //                 finalImageData.data[offset + 1] = blurredBackground.data[offset + 1];
                    //                 finalImageData.data[offset + 2] = blurredBackground.data[offset + 2];
                    //                 finalImageData.data[offset + 3] = 255; // Fully opaque
                    //
                    //             } else {
                    //                 // Make the foreground transparent
                    //                 finalImageData.data[offset] = 0;
                    //                 finalImageData.data[offset + 1] = 0;
                    //                 finalImageData.data[offset + 2] = 0;
                    //                 finalImageData.data[offset + 3] = 0; // Fully transparent
                    //
                    //             }
                    //         }
                    //
                    //         // Draw the final ImageData on the main canvas
                    //         ctx.putImageData(finalImageData, 0, 0);
                    //     } catch (error) {
                    //         console.error("Failed to process and draw transparent foreground:", error);
                    //     }
                    // }
                    requestAnimationFrame(detect);
                };
                detect();
            }
        };
        detectFaces();
    }, [faceLandmarker, handLandmarker, poseLandmarker, ctx, webcamRunning]);

    const [recording, setRecording] = useState(false);
    const videoChunksBufferRef = useRef([]); // Buffer to store video chunks
    const bufferSizeRef = useRef(0); // Tracks the total size of the buffer
    const isUploadingRef = useRef(false); // To avoid multiple uploads at once
    const CHUNK_SIZE = 5 * 1024 * 1024; // 2MB in bytes

    const startRecording = (stream) => {
        try {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    videoChunksBufferRef.current.push(event.data);
                    bufferSizeRef.current += event.data.size;

                    // When buffer reaches 5MB, trigger upload
                    if (bufferSizeRef.current >= CHUNK_SIZE && !isUploadingRef.current) {
                        uploadChunk();
                    }
                }
            };

            mediaRecorder.start(1500); // Start recording in 1-second intervals
            setRecording(true);

        } catch (error) {
            console.error("Error starting the recording:", error);
        }
    };

    const stopRecording = () => {
        videoRef.current.stop();
        setRecording(false);

        // Upload any remaining chunks in the buffer
        if (bufferSizeRef.current > 0) {
            uploadChunk();
        }
    };
    const uploadChunk = async () => {
        // Lock the uploading state to avoid multiple uploads
        isUploadingRef.current = true;

        // Concatenate all chunks in the buffer into a single Blob
        const blob = new Blob(videoChunksBufferRef.current, { type: 'video/webm' });
        const fileName = `mockInterview-${Date.now()}.webm`;

        // Create FormData and append the video blob
        // const formData = new FormData();
        // formData.append('videoStream', blob);
        // formData.append('fileName', fileName);

        // Clear the buffer and reset the buffer size while uploading
        videoChunksBufferRef.current = [];
        bufferSizeRef.current = 0;

        uploadFilePrivate('mockInterviewVideo',{
            data: blob,
            userId: user.userId,
            type: 'video/webm; codecs=vp8,opus',
            size: blob.size,
            name: fileName,

        }).then((result)=>{
            // console.log(result)
            if (result.$metadata.httpStatusCode === 200){
                //console.log('Chunk uploaded successfully:', result);
                // TO DO: Add the uploaded chunk to the list of uploaded chunks in the database
                // path : mockInterviewVideo/{userId}/{fileName}
                mongodbMockInterviewChunkInsert(
                    {
                        userId: user.userId,
                        type: 'video/webm; codecs=vp8,opus',
                        size: blob.size,
                        name: fileName,
                        path: `mockInterviewVideo/${user.userId}/${fileName}`,
                        sessionId

                    }
                )

            }
            // Clear the buffer and allow further uploads
            videoChunksBufferRef.current = [];
            bufferSizeRef.current = 0;
            isUploadingRef.current = false;
        })

    };

    // Function to analyze facial attributes
    const analyzeFace = (faceLandmarks, videoWidth, videoHeight) => {
        if (!faceLandmarks || faceLandmarks.length === 0) return;

        const noseTip = faceLandmarks[1];  // Typically the tip of the nose is index 1
        const leftEye = faceLandmarks[33]; // Typical left eye landmark
        const rightEye = faceLandmarks[263]; // Typical right eye landmark
        const leftMouth = faceLandmarks[61]; // Left corner of the mouth
        const rightMouth = faceLandmarks[291]; // Right corner of the mouth

        let feedback = {
            distanceScore: 0,
            centerScore: 0,
            smileScore: 0,
            eyeContactScore: 0
        };

        // 1. Detect if the person is too close or too far from the camera (distance score)
        const eyeDistance = Math.abs(leftEye.x - rightEye.x) * videoWidth;

        // console.log(eyeDistance)
        // Define the ideal range for eye distance
        const idealMinDistance = videoWidth * 0.15; // Ideal minimum eye distance (for "too far")
        const idealMaxDistance = videoWidth * 0.19;  // Ideal maximum eye distance (for "too close")
        const idealRange = idealMaxDistance - idealMinDistance;

        if (eyeDistance < idealMinDistance) {
            // Too far from the camera
            feedback.distanceScore = -100.0 * (1 - (eyeDistance / idealMinDistance)); // Scale to -100
            setFacialHeadCenterFeedback({
                distanceScore: feedback.distanceScore,
                tooFarTooClose: true,
                description: "Too Far!",
            });
        } else if (eyeDistance > idealMaxDistance) {
            // Too close to the camera
            feedback.distanceScore = 100.0 * ((eyeDistance - idealMaxDistance) / idealMaxDistance); // Scale to +100
            setFacialHeadCenterFeedback({
                distanceScore: feedback.distanceScore,
                tooFarTooClose: true,
                description: "Too Close!",
            });
        } else {
            // Within the ideal range
            feedback.distanceScore = 0;
            setFacialHeadCenterFeedback({
                distanceScore: 0,
                tooFarTooClose: false,
                description: "Perfect!",
            });
        }

        // 2. Check if the face is centered (center score)
        const faceCenterX = (leftEye.x + rightEye.x) / 2 * videoWidth;
        const frameCenterX = videoWidth / 2;
        const centerDifference = faceCenterX - frameCenterX;

        const maxCenterDeviation = videoWidth * 0.1; // Maximum acceptable deviation from the center
        feedback.centerScore = (centerDifference / maxCenterDeviation) * 100.0; // Scale to -100 to +100

        if (feedback.centerScore > 100.0) feedback.centerScore = 100.0; // Cap score at +100
        if (feedback.centerScore < -100.0) feedback.centerScore = -100.0; // Cap score at -100

        if (Math.abs(centerDifference) > maxCenterDeviation) {
            setFacialCenterFeedback({
                centerScore: feedback.centerScore,
                centered: false,
                description: "Please center your face in the frame.",
            });
        } else {
            setFacialCenterFeedback({
                centerScore: feedback.centerScore,
                centered: true,
                description: "Your face is centered in the frame.",
            });
        }

        // 3. Smile detection (smile score)
        const mouthWidth = Math.abs(rightMouth.x - leftMouth.x) * videoWidth;

        // Maximum smile width is 20% of video width (custom threshold)
        const maxSmileWidth = videoWidth * 0.15;
        const normalizedSmile = Math.min(mouthWidth / maxSmileWidth, 1); // Normalize between 0 and 1
        feedback.smileScore = normalizedSmile * 5.0; // Scale to 0 - 5.0 range

        if (feedback.smileScore > 0) {
            setFacialSmileFeedback({
                smileScore: feedback.smileScore,
                smiling: true,
                description: `Great! You are smiling with a score of ${feedback.smileScore.toFixed(2)}.`,
            });
        } else {
            setFacialSmileFeedback({
                smileScore: feedback.smileScore,
                smiling: false,
                description: "Try smiling for a friendlier appearance.",
            });
        }

        // 4. Eye contact detection (eye contact score)
        const eyeCenterX = (leftEye.x + rightEye.x) / 2 * videoWidth;
        const eyeCenterY = (leftEye.y + rightEye.y) / 2 * videoHeight;

        const horizontalDiff = Math.abs(eyeCenterX - frameCenterX);
        const verticalDiff = Math.abs(eyeCenterY - videoHeight * 0.5);

        // Calculate horizontal and vertical deviations
        const maxHorizontalDiff = videoWidth * 0.05;
        const maxVerticalDiff = videoHeight * 0.1;

        // Normalize the deviations and scale to 0 - 5.0 range
        const normalizedEyeContactX = Math.max(1 - (horizontalDiff / maxHorizontalDiff), 0);
        const normalizedEyeContactY = Math.max(1 - (verticalDiff / maxVerticalDiff), 0);

        // Overall eye contact score is the average of both horizontal and vertical
        feedback.eyeContactScore = ((normalizedEyeContactX + normalizedEyeContactY) / 2) * 5.0;

        if (feedback.eyeContactScore > 0) {
            setFacialEyeContactFeedback({
                eyeContactScore: feedback.eyeContactScore,
                eyeContact: true,
                description: `Good eye contact! Your score is ${feedback.eyeContactScore.toFixed(2)}.`,
            });
        } else {
            setFacialEyeContactFeedback({
                eyeContactScore: feedback.eyeContactScore,
                eyeContact: false,
                description: "Try maintaining better eye contact with the camera.",
            });
        }

        // Return detailed feedback and scores
        return feedback;
    };



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



    return (
        <div className="w-full h-full p-1 bg-[rgba(3,42,245,0.11)] border-2 border-[rgba(3,42,245,0.6)] rounded-[30px] flex flex-col justify-start items-center"  >
            <div
                className="w-full flex justify-center items-center"

            >
                {/*    /!* User Name Badge *!/*/}
                <div className="m-2 p-1 bg-gradient-to-b from-[rgba(0,150,149,0.3)] to-[rgba(3,42,245,0.3)] rounded-[10px] flex justify-center items-center gap-2">
                    <div className="text-center text-white text-xs font-bold ">
                        {user && user.firstName && user.lastName && (user.firstName+" "+user.lastName)}
                    </div>
                </div>

                {/*    /!* Indicators Section *!/*/}

                <div className="w-full flex flex-row justify-between items-center p-4 gap-4">

                    {/* Left Progress Bar (0 to 100) */}
                    <div className="w-1/3  justify-center items-center">
                        <div className="px-1 py-1 rounded-md flex justify-center items-center">
                            {facialCenterFeedback.centerScore < 50 ? (
                                <div className="text-center text-[12px] font-[400] leading-4 tracking-[0.06em] bg-gradient-to-r from-[rgba(0,150,149,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                    Perfect!
                                </div>


                            ):(
                            <div className="text-center text-[12px] font-[400] leading-4 tracking-[0.06em] bg-gradient-to-r from-[rgba(199,78,91,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                Too Left!
                            </div>
                            )}

                        </div>
                        <div className="w-full h-auto rounded-md overflow-hidden ">

                            <Progress
                                progress={Math.max(0, Math.min(100, facialCenterFeedback.centerScore))} // Transform 0 to 100 range
                                size="sm"
                                color={getRecognitionBarColor(facialCenterFeedback.centerScore, 'right')}
                                style={{ direction: 'rtl' }} // Right-to-left direction
                            />
                        </div>

                    </div>
                    <div className="w-1/3 flex justify-center items-center">

                        {facialHeadCenterFeedback.tooFarTooClose ? (
                            <>
                                {facialHeadCenterFeedback.description === "Too Close!" ? (
                                    <div className="text-center text-sm sm:text-xl font-[400]  tracking-[0.06em] bg-gradient-to-r from-[rgba(217,153,34,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                        Too Close!
                                    </div>
                                ):(
                                    <div className="text-center text-sm sm:text-xl font-[400]  tracking-[0.06em] bg-gradient-to-r from-[rgba(199,78,91,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                        Too Far!
                                    </div>
                                )}
                            </>

                        ):(
                            <div className="text-center text-sm sm:text-xl font-[400]  tracking-[0.06em] bg-gradient-to-r from-[rgba(0,150,149,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                Perfect!
                            </div>


                        )}

                    </div>
                    {/* Right Progress Bar (-100 to 0) */}
                    <div className="w-1/3  justify-center items-center">
                        <div className="px-1 py-1 rounded-md flex justify-center items-center">
                            {facialCenterFeedback.centerScore > -50 ? (
                                <div className="text-center text-[12px] font-[400] leading-4 tracking-[0.06em] bg-gradient-to-r from-[rgba(0,150,149,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                    Perfect!
                                </div>

                            ):(
                                <div className="text-center text-[12px] font-[400] leading-4 tracking-[0.06em] bg-gradient-to-r from-[rgba(199,78,91,1)] to-[rgba(3,42,245,0.6)] bg-clip-text text-transparent">
                                    Too Right!
                                </div>
                            )}


                        </div>
                        <div className="w-full h-auto rounded-md overflow-hidden ">
                            <Progress
                                progress={Math.max(0, Math.min(100, -facialCenterFeedback.centerScore))} // Transform -100 to 0 to 0-100 scale
                                size="sm"
                                color={getRecognitionBarColor(facialCenterFeedback.centerScore, 'left')}
                                style={{ direction: 'ltr' }} // Left-to-right direction
                            />
                        </div>

                    </div>


                </div>
            </div>

            {/* User Video Section */}
            <div className="w-full h-full p-2 flex flex-col justify-start items-start gap-2 relative">
                {/*{initializeFaceLandmarkerModel ? (*/}
                {/*    <>*/}
                        <div className="w-full h-full relative">
                            {/*<video*/}
                            {/*    ref={videoRef}*/}

                            {/*    style={{*/}
                            {/*        display: "block",*/}
                            {/*        margin: "auto",*/}
                            {/*        position: "absolute", // Ensures centering works with inset-0*/}
                            {/*        top: 0,*/}
                            {/*        left: 0,*/}
                            {/*        right: 0,*/}
                            {/*        bottom: 0,*/}
                            {/*    }}*/}

                            {/*    width="320"*/}
                            {/*    height="240"*/}
                            {/*    className="absolute top-0 left-0 transform scale-x-[-1]"*/}
                            {/*/>*/}
                            {/*<canvas*/}
                            {/*    ref={canvasRef}*/}
                            {/*    width="320"*/}
                            {/*    height="240"*/}
                            {/*    className="absolute top-0 left-0 bg-transparent transform scale-x-[-1]"*/}
                            {/*    style={{*/}
                            {/*        display: "block" ,*/}
                            {/*        zIndex: 9,*/}
                            {/*        margin: "auto",*/}
                            {/*        position: "absolute", // Ensures centering works with inset-0*/}
                            {/*        top: 0,*/}
                            {/*        left: 0,*/}
                            {/*        right: 0,*/}
                            {/*        bottom: 0,*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <video
                                ref={videoRef}
                                className="absolute w-full h-full top-0 left-0 transform scale-x-[-1] object-cover z-5"
                                style={{ display: "block", margin: "auto" }}
                                autoPlay
                                muted
                                playsInline
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute w-full h-full top-0 left-0 bg-transparent transform scale-x-[-1] z-10"
                                style={{ display: "block", margin: "auto" }}
                            />
                        </div>
                    {/*</>*/}
                {/*// ) : (*/}
                {/*//     <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-500 rounded-[30px]">*/}
                {/*//         <span>No Video Available</span>*/}
                {/*//     </div>*/}
                {/*// )}*/}
            </div>

            {/*admin tool section*/}
            {user && user.role === 'admin' && (
                <div className="p-1">
                    {/*<StatsMonitor />*/}
                    <label className="inline-flex items-center cursor-pointer">
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-3">Display recognition result?</span>
                        <input type="checkbox" className="sr-only peer"
                               id="allow-recognition-access-toggle"
                               name="allow-recognition-access-toggle"
                               checked={displayLandmarks }
                               onChange={async (event) => {
                                   if (event.target.checked) {
                                       dispatch(setDisplayLandmarks(true));


                                   } else {
                                       dispatch(setDisplayLandmarks(false));

                                   }
                                   setFaceLandmarker(null);
                                   // setHandLandmarker(null);
                                   // setPoseLandmarker(null);
                                   setInitializeFaceLandmarkerModel(false);
                               }}
                        />
                        <div
                            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            )}








        </div>
    );
};

export default RecognitionBlock;

