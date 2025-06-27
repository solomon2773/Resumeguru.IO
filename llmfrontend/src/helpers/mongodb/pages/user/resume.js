import {
    mongodbUpdateRegenerateResumeCoverLetterStreaming,
} from "../api/resume";

import {estimateTokenCount} from "../../../../utils/openAi";


const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/resume', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DB call failed:', error);
      throw error;
    }
};


export async function mongodbRegenerateCoverLetterStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);

    const resumeCoverLetterUpdate = await mongodbUpdateRegenerateResumeCoverLetterStreaming(data,  data.userId);
    //
    //
    return resumeCoverLetterUpdate;

}

export async function mongodbGetResumeListByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getResumeListByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbGetResumeById(objectId) {
    const tResp = await makeDbCall({
        objectId : objectId,
        action: 'getResumeById'
    });
    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbGetResumesVersionByTemplateName(resumeTemplateName) {
    const tResp = await makeDbCall({
        resumeTemplateName : resumeTemplateName,
        action: 'getResumesVersionByTemplateName'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbGetResumeJobDescriptionByUserIdAndDocId(userId,objectId) {
    const tResp = await makeDbCall({
        userId: userId,
        objectId : objectId,
        action: 'getResumeJobDescriptionByUserIdAndDocId'
    });
    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbGetResumeCoverlettersByResumeIDVersion(query) {
    const tResp = await makeDbCall({
        query: query,
        action: 'getResumeCoverlettersByResumeIDVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbGetResumeQandAByResumeIDVersion(query) {
    const tResp = await makeDbCall({
        query: query,
        action: 'getResumeQandAByResumeIDVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbDeleteResume(inputData) {
    const tResp = await makeDbCall({
        inputData: inputData,
        action: 'deleteResume'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}
