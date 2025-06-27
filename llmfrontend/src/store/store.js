import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './mockInterview/chatSlice';
import resumeEditReducer from './resumeEditReducer';
import coverLetterReducer from './coverLetterReducer';
import userReducer  from "./userReducer";
import resumeScoreReducer from "./resumeScoreReducer";
import videoRecognitionSlice from "./mockInterview/videoRecognitionSlice";

const store = configureStore({
    reducer: {
        chat: chatReducer,
        resumeEdit: resumeEditReducer,
        user: userReducer,
        coverLetterEdit:coverLetterReducer,
        resumeScore:resumeScoreReducer,
        videoRecognition:videoRecognitionSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production', // Disable DevTools in production

});

export default store;

