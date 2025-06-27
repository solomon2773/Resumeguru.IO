import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';


const chatSlice = createSlice({
    name: 'mockInterviewChat',
    initialState: {
        chatId: "",
        sessionId: "",
        chatMessages: [
            // {
            //     id: 1,
            //     message: "Hi! I'm Hannah , a mock interview assistant from ResumeGuru.IO. My goal is to help you practice your interview skills. Let's get started by copy and paste a job description here.",
            //     msg_from: "ResumeGuru.IO",
            //     timeStamp: new Date().toString(),
            //     localTimeString: new Date().toLocaleTimeString(),
            // }

        ],
        currWebSocket: null,
        pendingResponse: false,
        systemReplyMessage:false,
        textToSpeakInProcess: false,
        showMicTooltip:false,
        initialWelcomeAvatarPlayed: false,
        selectedVideoDevice:{},
        selectedAudioDevice:{},
        mockInterviewFromJobSearch: {},
        pronunciationAssessment: {
            pronunciationAssessmentObjectResult: {},
            contentAssessmentResult: {
                vocabularyScore: 1,
                grammarScore: 1,
                topicScore: 1,

            },
            pronunciationAssessmentResult: {
                AccuracyScore: 1,
                FluencyScore: 1,
                CompletenessScore: 1,
                ProsodyScore: 1,
                PronScore: 1,
            },
        },
        lastSttTtsObjectId: "",


    },
    reducers: {
        updateChatId: (state, action) => {
            state.chatId = action.payload;
        },
        clearChatMessages: (state) => {
            state.chatMessages = [];
        },
        addToChatMessage: (state, action) => {
            const { msg, msg_from } = action.payload;
            state.chatMessages.push({
                id: state.chatMessages.length + 1,
                timeStamp: new Date().toString(),
                localTimeString: new Date().toLocaleTimeString(),
                message: msg,
                msg_from: msg_from,
            });
        },
        setCurrWebSocket: (state, action) => {
            state.currWebSocket = action.payload;
        },
        setPendingResponse: (state, action) => {
            state.pendingResponse = action.payload;
        },
        setTextToSpeakInProcess: (state, action) => {
            state.textToSpeakInProcess = action.payload;
        },
        setShowMicTooltip: (state, action) => {
            state.showMicTooltip = action.payload;
        },
        setInitialWelcomeAvatar: (state, action) => {
              state.initialWelcomeAvatarPlayed = action.payload;
        },
        setMockInterviewSelectedVideoDevice: (state, action) => {
            state.selectedVideoDevice = action.payload;
        },
        setMockInterviewSelectedAudioDevice: (state, action) => {
            state.selectedAudioDevice = action.payload;
        },
        setPronunciationAssessment: (state, action) => {
            state.pronunciationAssessment = {
                ...state.pronunciationAssessment,
                ...action.payload
            };
        },
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
        },
        setMockInterviewFromJobSearch: (state, action) => {
            state.mockInterviewFromJobSearch = action.payload;
        },
        setSystemReplyMessage: (state, action) => {
            state.systemReplyMessage = action.payload;
        },
        setLastSttTtsObjectId: (state, action) => {
            state.lastSttTtsObjectId = action.payload;
        }
    },
});

export const {
    clearChatMessages,
    addToChatMessage,
    setCurrWebSocket,
    setPendingResponse,
    setTextToSpeakInProcess,
    setShowMicTooltip,
    setInitialWelcomeAvatar,
    setMockInterviewSelectedVideoDevice,
    setMockInterviewSelectedAudioDevice,
    updateChatId,
    setPronunciationAssessment,
    setSessionId,
    setMockInterviewFromJobSearch,
    setSystemReplyMessage,
    setLastSttTtsObjectId,

} = chatSlice.actions;

export const initChatWebSocket = (userId) => (dispatch, getState) => {
    const chat_id = uuidv4();
    const ws = new WebSocket(process.env.LLM1_BACKEND_WEBSOCKET_URL + chat_id+"/"+userId+"?auth_key="+process.env.LLM1_BACKEND_WEBSOCKET_AUTH_KEY);

    ws.onopen = (event) => {
        if (process.env.DEV){
            console.log("Websocket connected : ", chat_id);
            console.log("Connect to : ", process.env.LLM1_BACKEND_WEBSOCKET_URL);
        }

        dispatch(setCurrWebSocket(ws));
        dispatch(updateChatId(chat_id));
    };

    ws.onmessage = (event) => {
        // console.log(event)
        // message reply from server
        dispatch(addToChatMessage({
            msg: event.data,
            msg_from: "ResumeGuru.IO"
        }));
        setSystemReplyMessage(true);
        dispatch(setPendingResponse(false));
    };
};

export const sendChatMessageAsync = (msg) => (dispatch, getState) => {
    try {
        const { currWebSocket } = getState().chat;
        if (currWebSocket !== null) {
            dispatch(addToChatMessage({
                msg,
                msg_from: "user" }));
            currWebSocket.send(msg);

            dispatch(setPendingResponse(true));
        } else {
            toast.error("Websocket not available");
            // console.log("Websocket not available");
        }


    } catch (err) {
        toast.error("Error sending message");
        if (process.env.DEV){
            console.log(err);
        }

    }
};

export default chatSlice.reducer;
