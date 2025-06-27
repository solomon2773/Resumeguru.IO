import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';



const coverLetterReducer = createSlice({
    name: 'coverLetterEdit',
    initialState: {
        ClId: "",
        userId: "",
        isClLayoutLoading: true,
        clFontSize: 23,
        clFontColor: '262626',
        clData:{},
        clDetails:{},
    },
    reducers: {
        setClId: (state, action) => {
            state.ClId = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setIsClLayoutLoading: (state, action) => {
            state.isClLayoutLoading = action.payload;
        },
        setClFontSize: (state, action) => {
            state.clFontSize = action.payload;
        },
        setClFontColor: (state, action) => {
            state.clFontColor = action.payload;
        },
        setClData: (state, action) => {
            state.clData = action.payload;
        },
        setClDetails: (state, action) => {
            state.clDetails = action.payload;
        },

    },
});

export const {
    setClId,
    setUserId,
    setResumeEditRightDrawer,
    setIsClLayoutLoading,
    setClFontSize,
    setClFontColor,
    setClData,
    setClDetails,
} = coverLetterReducer.actions;


export default coverLetterReducer.reducer;
