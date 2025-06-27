import { Button, Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToChatMessage,
  setPendingResponse,
  setInitialWelcomeAvatar,
  setShowMicTooltip,
  setTextToSpeakInProcess,
  setMockInterviewSelectedAudioDevice,
  setMockInterviewSelectedVideoDevice, sendChatMessageAsync, setSessionId,
} from "../../../store/mockInterview/chatSlice";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Dropdown } from "flowbite-react";
import {v4 as uuidv4} from "uuid";

const MockInterviewInit = ({
                             openMockInterviewModal,
                             setOpenMockInterviewModal,

                           }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState({});
  const [selectedVideoDevice, setSelectedVideoDevice] = useState({});
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [videoPermissionGranted, setVideoPermissionGranted] = useState(false);
  const mockInterviewFromJobSearch = useSelector(state => state.chat.mockInterviewFromJobSearch)


  const getMediaDevices = async () => {
    try {
      // Get the list of audio and video input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((device) => device.kind === 'audioinput');
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');
      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);

      // Set default selection if not selected
      if (audioInputs.length > 0 && !selectedAudioDevice) {
        setSelectedAudioDevice(audioInputs[0]); // default audio selection
      }
      if (videoInputs.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoInputs[0]); // default video selection
      }
    } catch (error) {
      console.error("Error fetching media devices:", error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request both audio and video permissions with selected devices
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDevice.deviceId ? { exact: selectedVideoDevice.deviceId } : undefined },
        // audio: { deviceId: selectedAudioDevice.deviceId ? { exact: selectedAudioDevice.deviceId } : undefined },
      });

      // Set the video stream to the video element
     // if (myVideoRef.current) {
     //   myVideoRef.current.srcObject = stream;
     //    setMediaPermission({ video: true, audio: true });
      //  onStreamReady(stream);
     // }

      setAudioPermissionGranted(true);
      setVideoPermissionGranted(true);

    } catch (err) {
      console.error("Error accessing media devices (Audio/Video):", err);
      toast.error("Error accessing media devices. Please grant both audio and video permissions.");
      // setMediaPermission({ video: false, audio: false });


    }
  };



  useEffect(() => {
    // Fetch initial media devices
    getMediaDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      getMediaDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    // Cleanup event listener when the component unmounts
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [selectedAudioDevice, selectedVideoDevice]);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' }).then((result) => {
      result.onchange = () => {
        if (result.state === 'denied') {
          setSelectedAudioDevice({});
          setAudioPermissionGranted(false);
          // setMediaPermission(prev => ({ ...prev, audio: false }));
          toast.error("Microphone permission denied. Please enable it in your browser settings.");
        }
      };
    });

    navigator.permissions.query({ name: 'camera' }).then((result) => {
      result.onchange = () => {
        if (result.state === 'denied') {
          setSelectedVideoDevice({});
          setVideoPermissionGranted(false);
          // setMediaPermission(prev => ({ ...prev, video: false }));
          toast.error("Camera permission denied. Please enable it in your browser settings.");
        }
      };
    });
  }, []);
  const handleClick = async () => {
    if (!audioPermissionGranted || !videoPermissionGranted) {
      // If either permission is missing, request both
      await requestPermissions();
    }

    if (audioPermissionGranted && videoPermissionGranted) {
      // startSession();

      dispatch(setShowMicTooltip(true));

      if (mockInterviewFromJobSearch && mockInterviewFromJobSearch.jobs && mockInterviewFromJobSearch.jobs[0] && mockInterviewFromJobSearch.jobs[0].id ){

       // const rgJdSelMockInterviewObj = await JSON.parse(rgJdSelMockInterview);
        dispatch(sendChatMessageAsync(mockInterviewFromJobSearch.jobs[0].company+"***"+mockInterviewFromJobSearch.jobs[0].title+"***"+mockInterviewFromJobSearch.jobs[0].description));
        dispatch(setSessionId(uuidv4()));

      } else {
        dispatch(setTextToSpeakInProcess(true));
        dispatch(setInitialWelcomeAvatar(true));
        dispatch(addToChatMessage(
            {
              msg: "Hello! I'm Hannah , a mock interview assistant from ResumeGuru.IO. My goal is to help you practice your interview skills. Let's get started by copy and paste a job description here.",
              msg_from: "ResumeGuru.IO",
            }
        ));
      }

      setOpenMockInterviewModal(false);
      await getAudioSttTtsTimeUsage(user.profile.userId).then((res) => {
        if (res) {
          dispatch(updateSttTTSTime(res));
        }
      });
      await getSttTtsTextUsage(user.profile.userId).then((res) => {
        if (res) {
          dispatch(updateSttTTSTimeText(res));
        }
      });
      await mongodbGetValidSubscriptionPlan(user.profile.userId).then((res) => {
        if (res) {
          dispatch(updateSubscriptionPlan(res));
        }
      });
    } else {

    }
  };

  return (
      <Modal
          show={openMockInterviewModal}
          // size="3xl"
          position="center"
          className="bg-gradient-to-b from-[rgba(3,42,245,0.02)] to-[rgba(30,0,177,0.04)] h-full "
      >
        <Modal.Body
        className={"h-full "}
        >
          <div className="w-full h-full p-4 bg-gradient-to-b from-[rgba(3,42,245,0.02)] to-[rgba(30,0,177,0.04)] rounded-[45px] flex flex-col justify-start items-center gap-9">
            <div className="w-full h-[77px] flex flex-col justify-start items-center">
              <div className="w-full h-[45px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.6)] text-2xl font-[700] leading-[16px] tracking-[0.12px]">Welcome to Mock Interview Setup</div>
              <div className="w-full h-auto text-center text-[rgba(0,0,34,0.60)] text-l font-normal font-[Gotham Pro] leading-[16px] tracking-[0.08px] break-words">Please confirm your preferences</div>
            </div>
            <div className="flex flex-col justify-center items-center gap-9">
              <div className="flex flex-col justify-start items-start gap-1.5">
                <div className="w-full h-[47px] pt-1 pb-1 flex flex-col justify-start items-start gap-3.5">
                    {/* Audio Device Selection */}
                      <Dropdown
                          outline
                          className="font-[Gotham Pro]"
                          gradientDuoTone="purpleToBlue"
                          label={selectedAudioDevice.label ? selectedAudioDevice.label : "Select a Microphone"} size="sm">
                        {audioDevices.map((device) => (
                          <Dropdown.Item
                              onClick={() =>
                          {
                            setSelectedAudioDevice(device);
                            dispatch(setMockInterviewSelectedAudioDevice(device));

                          }}>
                            {device.label || `Microphone ${device.deviceId}`}
                          </Dropdown.Item>
                        ))}

                      </Dropdown>
                      {/*<select*/}
                      {/*    value={selectedAudioDevice}*/}
                      {/*    onChange={(e) => setSelectedAudioDevice(e.target.value)}*/}
                      {/*>*/}
                      {/*  {audioDevices.map((device) => (*/}
                      {/*      <option key={device.deviceId} value={device.deviceId}>*/}
                      {/*        {device.label || `Microphone ${device.deviceId}`}*/}
                      {/*      </option>*/}
                      {/*  ))}*/}
                      {/*</select>*/}

                </div>
              </div>
              <div className="h-[47px] flex flex-col justify-start items-start gap-1.5">
                <div className="w-full h-[47px] pt-1 pb-1 flex flex-col justify-start items-start gap-3.5">
                    {/* Video Device Selection */}
                      <Dropdown
                          outline
                          gradientDuoTone="purpleToBlue"
                          className="font-[Gotham Pro] "
                          label={selectedVideoDevice.label ? selectedVideoDevice.label : "Select Camera"} size="sm">
                        {videoDevices.map((device) => (

                            <Dropdown.Item onClick={() =>
                            {
                              setSelectedVideoDevice(device);
                              dispatch( setMockInterviewSelectedVideoDevice(device))
                            }}>
                              {device.label || `Camera ${device.deviceId}`}</Dropdown.Item>
                        ))}

                      </Dropdown>
                      {/*<select*/}
                      {/*    value={selectedVideoDevice}*/}
                      {/*    onChange={(e) => setSelectedVideoDevice(e.target.value)}*/}
                      {/*>*/}
                      {/*  {videoDevices.map((device) => (*/}
                      {/*      <option key={device.deviceId} value={device.deviceId}>*/}
                      {/*        {device.label || `Camera ${device.deviceId}`}*/}
                      {/*      </option>*/}
                      {/*  ))}*/}
                      {/*</select>*/}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 sm:gap-4">
              <label className="flex items-center cursor-pointer w-full">
    <span className="text-sm sm:text-base text-[rgba(0,0,34,0.60)] font-medium dark:text-gray-300 mr-2 sm:mr-4 leading-tight">
      Allow access to system microphone and camera?
    </span>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    id="allow-media-access-toggle"
                    name="allow-media-access-toggle"
                    checked={audioPermissionGranted && videoPermissionGranted}
                    onChange={async (event) => {
                      if (event.target.checked) {
                        if (selectedAudioDevice.deviceId && selectedVideoDevice.deviceId) {
                          await requestPermissions();
                        } else {
                          event.target.checked = false;
                          toast.error("Please select both audio and video devices");
                        }
                      } else {
                        event.target.checked = false;
                        setAudioPermissionGranted(false);
                        setVideoPermissionGranted(false);
                      }
                    }}
                />
                <div
                    className="relative w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-gradient-to-b peer-checked:from-[rgba(3,42,245,0.6)] peer-checked:to-[rgba(0,150,149,0.8)] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] sm:after:top-[2px] sm:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all dark:border-gray-600"
                ></div>
              </label>
            </div>

            <div>
                  <Button
                          onClick={handleClick}
                          className=" bg-gradient-to-r from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.6)] rounded-[15px] flex justify-center items-center "
                          disabled={!audioPermissionGranted || !videoPermissionGranted}
                  >
                    <span class="text-white text-[20px] font-[700] leading-[48px] font-[Gotham Pro] break-words">
                      Start Interview
                    </span>

                  </Button>
            </div>
           </div>
        </Modal.Body>
      </Modal>
  );
};

export default MockInterviewInit;


