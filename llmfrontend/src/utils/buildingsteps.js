import { mongodbInsertCareerBuildingSteps, mongodbGetUserCareerBuildingSteps, mongodbUpdateUserCareerBuildingSteps } from "../helpers/mongodb/pages/user/careerBuildingSteps";
import { mongodbGetCoverLetterListByUserId } from "../helpers/mongodb/pages/user/coverLetter";
import { mongodbGetLinkedinConnectionMessageListByUserId } from "../helpers/mongodb/pages/user/linkedinMessage";
import { mongodbGetResumeListByUserId } from "../helpers/mongodb/pages/user/resume";
import { mongodbJobsFindUserLikedJobs } from "../helpers/mongodb/pages/jobs/search";
import {

    getAudioSttTtsTimeUsageBuildingSteps
} from "../helpers/mongodb/pages/mockInterview/sttTTSTime";
import careerBuildingSteps from "./staticObjects/dashboard/careerBuildingSteps";
import {setInitialBuildingSteps, setIsBuildingStepsCompleted, setIsBuildingStepsChecked, updateBuildingSteps } from "../store/userReducer";

export const checkUserActivity = async (userId) => {
  try {
    const[coverLetters, linkedInMessages, resumeList, searchList, mockInterviewTime] =
      await Promise.all([
        mongodbGetCoverLetterListByUserId(userId),
        mongodbGetLinkedinConnectionMessageListByUserId(userId),
        mongodbGetResumeListByUserId(userId),
        mongodbJobsFindUserLikedJobs(userId),
          getAudioSttTtsTimeUsageBuildingSteps(userId)
      ]);
    return {coverLetters, linkedInMessages, resumeList, searchList, mockInterviewTime}
  } catch (err) {
    console.log('Error in checking activity list', err);
    return false;
  }
}

export const handleBuildingSteps = async (dispatch, userId) => {

  let isBuildingStepsCompleted = true;
  if (userId) {
    const buildingSteps = await mongodbGetUserCareerBuildingSteps(userId, false, false);
    if (buildingSteps && (buildingSteps).length  > 0) {
      dispatch(setInitialBuildingSteps(buildingSteps));
      const filteredSteps = buildingSteps.filter(doc => doc.status === false);
      if (filteredSteps.length > 0) {
        dispatch(setIsBuildingStepsCompleted(false));
        isBuildingStepsCompleted = false;
      } else {
        dispatch(setIsBuildingStepsCompleted(true));
        isBuildingStepsCompleted = true;
      }

    } else {
      const createdDate = new Date().toISOString();
      const updatedData = careerBuildingSteps.map(item => ({
        stepId: item.stepId,
        label: item.label,
        description: item.description,
        status: false,
        userId: userId,
        createdDate: createdDate
      }));
      const insData = await mongodbInsertCareerBuildingSteps(updatedData);
      dispatch(setInitialBuildingSteps(updatedData));
      dispatch(setIsBuildingStepsCompleted(false));
      isBuildingStepsCompleted = false;
    }

    if (!isBuildingStepsCompleted) {
      checkUserActivity(userId)
        .then(({coverLetters, linkedInMessages, resumeList, searchList, mockInterviewTime}) => {
          isBuildingStepsCompleted = true;
          if (searchList && searchList.length > 0) {
            dispatch(updateBuildingSteps(1, true));
            mongodbUpdateUserCareerBuildingSteps(userId, 1, true)
          } else {
            isBuildingStepsCompleted= false;
          }

          if (resumeList && resumeList.length > 0) {
            dispatch(updateBuildingSteps(2, true));
            mongodbUpdateUserCareerBuildingSteps(userId, 2, true)
          } else {
            isBuildingStepsCompleted= false;
          }

          if (coverLetters && coverLetters.length > 0) {
            dispatch(updateBuildingSteps(3, true));
            mongodbUpdateUserCareerBuildingSteps(userId, 3, true)
          } else {
            isBuildingStepsCompleted= false;
          }

          if (linkedInMessages && linkedInMessages.length > 0) {
            dispatch(updateBuildingSteps(4, true));
            mongodbUpdateUserCareerBuildingSteps(userId, 4, true)
          } else {
            isBuildingStepsCompleted= false;
          }

          if (mockInterviewTime > 0) {
            dispatch(updateBuildingSteps(5, true));
            mongodbUpdateUserCareerBuildingSteps(userId, 5, true)
          } else {
            isBuildingStepsCompleted= false;
          }
          dispatch(setIsBuildingStepsCompleted(isBuildingStepsCompleted));
      })
    }

    dispatch(setIsBuildingStepsChecked(true));
    return isBuildingStepsCompleted;
  }
}
