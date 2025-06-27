import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';



const resumeEditReducer = createSlice({
    name: 'resumeEdit',
    initialState: {
        resumeId: "",
        userId: "",
        resumeEditRightDrawer: false,
        resumeEditRightDrawerTab: "template",
        resumeFontSize: 23,
        resumeFontColor: '262626',
        isResumeLayoutLoading: true,
        resumeDetails:{
            resumeOriginalData: {
                certifications: [],
            },
        },
        resumeTemplateDetails:{},
        skillsHighlight: true,

    },
    reducers: {
        setResumeId: (state, action) => {
            state.resumeId = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setResumeEditRightDrawer: (state, action) => {
            state.resumeEditRightDrawer = action.payload;
        },
        setResumeEditRightDrawerTab: (state, action) => {
            state.resumeEditRightDrawerTab = action.payload;
        },
        setIsResumeLayoutLoading: (state, action) => {
            state.isResumeLayoutLoading = action.payload;
        },
        setResumeFontSize: (state, action) => {
            state.resumeFontSize = action.payload;
        },
        setResumeFontColor: (state, action) => {
            state.resumeFontColor = action.payload;
        },
        setResumeDetails: (state, action) => {
            state.resumeDetails = {
                ...state.resumeDetails,
                ...action.payload
            };
        },
        setResumeTemplateDetails: (state, action) => {
            state.resumeTemplateDetails = {
                ...state.resumeTemplateDetails,
                ...action.payload
            };
        },

        updateResumeDetailsEducation: (state, action) => {
            const { index, data } = action.payload;
            state.resumeDetails.resumeOriginalData.education[index] = {
                ...state.resumeDetails.resumeOriginalData.education[index],
                ...data,
            };
        },
        removeResumeDetailsEducation: (state, action) => {
            const { index } = action.payload;
            if (index >= 0 && index < state.resumeDetails.resumeOriginalData.education.length) {
                state.resumeDetails.resumeOriginalData.education.splice(index, 1);
            }
        },
        addResumeDetailsEducation: (state, action) => {
            if (!state.resumeDetails.resumeOriginalData.education) {
                state.resumeDetails.resumeOriginalData.education = [];
            }
            state.resumeDetails.resumeOriginalData.education.push(action.payload);
        },
        updateResumeDetailsEducationOrder: (state, action) => {
            const { oldIndex, newIndex } = action.payload;
            const education = state.resumeDetails.resumeOriginalData.education;
            if (oldIndex !== newIndex && oldIndex >= 0 && oldIndex < education.length && newIndex >= 0 && newIndex < education.length) {
                const [removed] = education.splice(oldIndex, 1);
                education.splice(newIndex, 0, removed);
            }
        },
        removeResumeDetailsExperience: (state, action) => {
            const { index } = action.payload;
            if (index >= 0 && index < state.resumeDetails.professionalExperienceRewrite.length) {
                state.resumeDetails.professionalExperienceRewrite.splice(index, 1);
            }
        },
        updateResumeDetailsExperience: (state, action) => {
            const { index, data } = action.payload;
            state.resumeDetails.professionalExperienceRewrite[index] = {
                ...state.resumeDetails.professionalExperienceRewrite[index],
                ...data,
            };
        },
        updateResumeDetailsExperienceHistory: (state, action) => {
            const { index, data } = action.payload;
            if (!state.resumeDetails.professionalExperienceRewriteHistory) {
                state.resumeDetails.professionalExperienceRewriteHistory = [];
            }
            if (!state.resumeDetails.professionalExperienceRewriteHistory[index]) {
                state.resumeDetails.professionalExperienceRewriteHistory[index] = [];
            }
            state.resumeDetails.professionalExperienceRewriteHistory[index].push(
                data
            );
        },
        updateResumeDetailsExperienceVersion: (state, action) => {
            const { versionIndex, experienceIndex } = action.payload;
            state.resumeDetails.professionalExperienceRewrite[experienceIndex] = state.resumeDetails.professionalExperienceRewriteHistory[experienceIndex][versionIndex] ;
            state.resumeDetails.professionalExperienceRewrite[experienceIndex] = {
                ...state.resumeDetails.professionalExperienceRewrite[experienceIndex],
                selectedVersion: versionIndex
            }
        },
        updateResumeDetailsExperienceOrder: (state, action) => {
            const {oldIndex, newIndex} = action.payload;
            const professionalExperienceRewrite = state.resumeDetails.professionalExperienceRewrite;
            if (oldIndex !== newIndex && oldIndex >= 0 && oldIndex < professionalExperienceRewrite.length && newIndex >= 0 && newIndex < professionalExperienceRewrite.length) {
                const [removed] = professionalExperienceRewrite.splice(oldIndex, 1);
                professionalExperienceRewrite.splice(newIndex, 0, removed);
            }
        },
        updateResumeDetailsExperienceHistoryOrder: (state, action) => {
            const {oldIndex, newIndex} = action.payload;
            const professionalExperienceRewriteHistory = state.resumeDetails.professionalExperienceRewriteHistory;
            if (oldIndex !== newIndex && oldIndex >= 0 && oldIndex < professionalExperienceRewriteHistory.length && newIndex >= 0 && newIndex < professionalExperienceRewriteHistory.length) {
                const [removed] = professionalExperienceRewriteHistory.splice(oldIndex, 1);
                professionalExperienceRewriteHistory.splice(newIndex, 0, removed);
            }
        },
        rewriteResumeDetailsExperienceBulletPoint: (state, action) => {
            const { experienceIndex, bulletPointIndex, rewriteData } = action.payload;
            state.resumeDetails.professionalExperienceRewrite[experienceIndex].professionalExperienceDescriptionBulletPoints[bulletPointIndex] = rewriteData;
        },
        addNewResumeDetailsExperience: (state, action) => {
            if (!state.resumeDetails.professionalExperienceRewrite) {
                state.resumeDetails.professionalExperienceRewrite = [];
            }
            if (!state.resumeDetails.professionalExperienceRewriteHistory) {
                state.resumeDetails.professionalExperienceRewriteHistory = [];
            }
            state.resumeDetails.professionalExperienceRewrite.push(action.payload);
            state.resumeDetails.professionalExperienceRewriteHistory.push([action.payload]);
        },
        updateResumeDetailsOverview: (state, action) => {
            state.resumeDetails.overviewRewrite = action.payload;

        },
        updateResumeDetailsOverviewHistory: (state, action) => {
            if (!state.resumeDetails.overviewRewriteHistory) {
                state.resumeDetails.overviewRewriteHistory = [];
            }
            state.resumeDetails.overviewRewriteHistory.push(
                {
                    overviewRewrite:action.payload,
                    timestamp: new Date()
                }

            );
        },
        updateResumeDetailsOverviewVersion: (state, action) => {
            state.resumeDetails.overviewRewrite = state.resumeDetails.overviewRewriteHistory[action.payload].overviewRewrite;
            state.resumeDetails.overviewRewrite = {
                ...state.resumeDetails.overviewRewrite,
                selectedVersion: action.payload
            }
        },
        addNewResumeDetailsSkills: (state, action) => {
            const {skillType, newSkill} = action.payload;
            if (!state.resumeDetails.skillsRewrite) {
                state.resumeDetails.skillsRewrite = {};
            }
            if (!state.resumeDetails.skillsRewrite[skillType]) {
                state.resumeDetails.skillsRewrite[skillType] = [];
            }
            state.resumeDetails.skillsRewrite[skillType].push(newSkill);
        },
        updateResumeDetailsSkills: (state, action) => {
            const {skillType, updatedSkillArray} = action.payload;
            state.resumeDetails.skillsRewrite[skillType] = updatedSkillArray;
        },
        updateResumeDetailsSkillsAll: (state, action) => {
               state.resumeDetails.skillsRewrite = action.payload;
        },
        moveResumeDetailsSkills: (state, action) => {
            const {skillFromIndex, skillTypeFrom, skillTypeTo} = action.payload;
            const skill = state.resumeDetails.skillsRewrite[skillTypeFrom][skillFromIndex];
            state.resumeDetails.skillsRewrite[skillTypeFrom].splice(skillFromIndex, 1);
            if (!state.resumeDetails.skillsRewrite) {
                state.resumeDetails.skillsRewrite = {};
            }
            if (!state.resumeDetails.skillsRewrite[skillTypeTo]) {
                state.resumeDetails.skillsRewrite[skillTypeTo] = [];
            }
            state.resumeDetails.skillsRewrite[skillTypeTo].push(skill);
        },
        updateSkillsHighlight: (state, action) => {
            state.skillsHighlight = action.payload;
        },
        addNewCertifications: (state, action) => {
            if (!state.resumeDetails.resumeOriginalData.certifications) {
                state.resumeDetails.resumeOriginalData.certifications = [];
            }
            state.resumeDetails.resumeOriginalData.certifications.push(action.payload);
        },
        removeCertifications: (state, action) => {

            state.resumeDetails.resumeOriginalData.certifications.splice(action.payload, 1);
        },
        updateCertifications: (state, action) => {
            const {index, certificateData} = action.payload;
            state.resumeDetails.resumeOriginalData.certifications[index] = {
                ...state.resumeDetails.resumeOriginalData.certifications[index],
                ...certificateData
            }
        }



    },
});

export const {
    setResumeId,
    setUserId,
    setResumeEditRightDrawer,
    setResumeEditRightDrawerTab,
    setIsResumeLayoutLoading,
    setResumeFontSize,
    setResumeFontColor,
    setResumeDetails,
    setResumeTemplateDetails,
    addResumeDetailsEducation,
    updateResumeDetailsEducation,
    removeResumeDetailsEducation,
    updateResumeDetailsEducationOrder,
    removeResumeDetailsExperience,
    updateResumeDetailsExperience,
    updateResumeDetailsExperienceHistory,
    updateResumeDetailsExperienceVersion,
    rewriteResumeDetailsExperienceBulletPoint,
    updateResumeDetailsOverviewVersion,
    updateResumeDetailsExperienceOrder,
    updateResumeDetailsExperienceHistoryOrder,
    addNewResumeDetailsExperience,
    updateResumeDetailsOverview,
    updateResumeDetailsSkillsAll,
    addNewResumeDetailsSkills,
    updateResumeDetailsOverviewHistory,
    updateResumeDetailsSkills,
    moveResumeDetailsSkills,
    updateSkillsHighlight,
    addNewCertifications,
    removeCertifications,
    updateCertifications

} = resumeEditReducer.actions;


export default resumeEditReducer.reducer;
