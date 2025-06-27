import { createSlice } from '@reduxjs/toolkit';


const userReducer = createSlice({
    name: 'userReducer',
    initialState: {
        profile: {},
        buildingSteps: [],
        isBuildingStepsCompleted: false,
        isBuildingStepsChecked: false,
        credits: 0,
        aiParams: {
            aiTemputate: 0.8,
            defaultModel:"gpt-4o-mini",
            currentAiModel:{
                modelVersion: "gpt-4-32k-0613",
                provider: "AzureOpenAI",
            }
        },



    },
    reducers: {
        setUserBasicProfile: (state, action) => {
            state.profile = action.payload;
        },
        updateUserBasicProfile: (state, action) => {
            state.profile.firstName = action.payload.firstName;
            state.profile.lastName = action.payload.lastName;
            state.profile.displayName = action.payload.firstName + " " + action.payload.lastName;
            state.profile.phoneNumber = action.payload.phoneNumber ? action.payload.phoneNumber : '';
            state.profile.city = action.payload.city ? action.payload.city : '';
            state.profile.region = action.payload.city ? action.payload.region : '';
            if (!state.profile.emailHistory) {
                state.profile.emailHistory = [];
            }
            state.profile.emailHistory.push(action.payload.email);
        },

        setInitialBuildingSteps: (state, action) => {
            state.buildingSteps = action.payload;
        },

        updateBuildingSteps: (state, action) => {
            const { id, newStatus } = action.payload;
            const document = state.buildingSteps.find(doc => doc.stepId === id);
            if (document) {
                document.status = newStatus;
            }
        },

        setIsBuildingStepsCompleted: (state, action) => {
            state.isBuildingStepsCompleted = action.payload;
        },

        setIsBuildingStepsChecked: (state, action) => {
            state.isBuildingStepsChecked = action.payload;
        },


    },
});

export const {
    setUserBasicProfile,
    updateUserBasicProfile,
    setInitialBuildingSteps,
    updateBuildingSteps,
    setIsBuildingStepsCompleted,
    setIsBuildingStepsChecked,

} = userReducer.actions;



export default userReducer.reducer;
