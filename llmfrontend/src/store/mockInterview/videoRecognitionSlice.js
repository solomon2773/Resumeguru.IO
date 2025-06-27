import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';


const videoRegognitionSlice = createSlice({
    name: 'videoRecognition',
    initialState: {
        displayLandmarks: false,
        recognitionResult: {
            facialCenterFeedback: {},
            facialEyeContactFeedback: {},
            facialSmileFeedback: {},
            facialHeadCenterFeedback: {},
        }

    },
    reducers: {
        setDisplayLandmarks: (state, action) => {
            state.displayLandmarks = action.payload;
        },
        setVideoRecognition: (state, action) => {
            state.recognitionResult = {
                ...state.recognitionResult,
                ...action.payload
            };
        }

    },
});

export const {
    setDisplayLandmarks,
    setVideoRecognition

} = videoRegognitionSlice.actions;



export default videoRegognitionSlice.reducer;
