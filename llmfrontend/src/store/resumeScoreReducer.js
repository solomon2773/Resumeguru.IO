import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';



const resumeScoreReducer = createSlice({
    name: 'resumeScore',
    initialState: {
        popupStatus: false,
        sectionCompletion:{
            personalInfo:{
                firstName: 0,
                lastName: 0,
                email: 0,
                phone: 0,
                location: 0,
            },
            workExperience:0,
            summary:0,
            skills:0,
            totalScore:0,

        },
        contentQuality:{
            overview:{},
            overviewTotalScore:0,
            workExperience: [],
            workExperienceTotalScore: 0,

        },

    },
    reducers: {
        updateSectionCompletion: (state, action) => {
            const personalInfo = action.payload;
            // Check if each field has a value, assign 1 if true, false if no value
            state.sectionCompletion.personalInfo.firstName = personalInfo.personalInfo.firstName ? 20 : 0;
            state.sectionCompletion.personalInfo.lastName = personalInfo.personalInfo.lastName ? 20 : 0;
            state.sectionCompletion.personalInfo.email = personalInfo.personalInfo.email ? 16 : 0;
            state.sectionCompletion.personalInfo.phone = personalInfo.personalInfo.phone ? 8 : 0;
            state.sectionCompletion.personalInfo.location = personalInfo.personalInfo.location ? 2 : 0;
            state.sectionCompletion.skills = personalInfo.skills ? 5 : 0;
            state.sectionCompletion.summary = personalInfo.summary ? 8 : 0;
            state.sectionCompletion.workExperience = personalInfo.workExperience ? 21 : 0;
            state.sectionCompletion.totalScore = state.sectionCompletion.personalInfo.firstName + state.sectionCompletion.personalInfo.lastName + state.sectionCompletion.personalInfo.email + state.sectionCompletion.personalInfo.phone + state.sectionCompletion.personalInfo.location + state.sectionCompletion.skills + state.sectionCompletion.summary + state.sectionCompletion.workExperience;
        },
        updateContentQualityOverview: (state, action) => {
            const Overview = action.payload;
            state.contentQuality.overview = Overview
        },
        updateContentQualityWorkExperience: (state, action) => {
            const {workExperience, workExperienceTotalScore} = action.payload;
            state.contentQuality.workExperience = workExperience;
            state.contentQuality.workExperienceTotalScore = workExperienceTotalScore;
        },
        updateWorkExperienceOrder: (state, action) => {
            const {oldIndex, newIndex} = action.payload;
            const workExperiences = state.contentQuality.workExperience;
            if (oldIndex !== newIndex && oldIndex >= 0 && oldIndex < workExperiences.length && newIndex >= 0 && newIndex < workExperiences.length) {
                const [removed] = workExperiences.splice(oldIndex, 1);
                workExperiences.splice(newIndex, 0, removed);
            }
        },
        addNewWorkExperienceScore: (state, action) => {
            const newWorkExperience = action.payload;
            state.contentQuality.workExperience.push(newWorkExperience);
        }


    },
});

export const {
    updateSectionCompletion,
    updateContentQualityOverview,
    updateContentQualityWorkExperience,
    updateWorkExperienceOrder,
    addNewWorkExperienceScore,

} = resumeScoreReducer.actions;


export default resumeScoreReducer.reducer;
