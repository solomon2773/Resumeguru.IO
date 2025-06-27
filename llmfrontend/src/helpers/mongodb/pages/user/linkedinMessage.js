
import {estimateTokenCount} from "../../../../utils/openAi";

const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/linkedinMessage', {
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

export async function mongodbRegenerateConnectionMessageStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.parsedOutput), 1.0);

    const resumeConnectionMessageUpdate = await mongodbInsertLinkedinConnectionMessageStreaming(data,  data.userId);
    //
    //
    return resumeConnectionMessageUpdate;

}

async function mongodbInsertLinkedinConnectionMessageStreaming(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'insertLinkedinConnectionMessageStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateLinkedinConnectionMessageStreaming(inputData,   userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateLinkedinConnectionMessageStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}


export async function mongodbGetLinkedinConnectionMessageByResumeIdVersion(resumeId, version) {
    const tResp = await makeDbCall({
        resumeId : resumeId,
        version: version,
        action: 'getLinkedinConnectionMessageByResumeIdVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}


export async function mongodbGetLinkedinConnectionMessageListByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getLinkedinConnectionMessageListByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}


export async function mongodbGetLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion(userId, resumeObjectId, resumeVersion) {
    const tResp = await makeDbCall({
        userId : userId,
        resumeObjectId: resumeObjectId,
        resumeVersion: resumeVersion,
        action: 'getLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}
