
import { estimateTokenCount } from "../../../../utils/openAi";


const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/coverLetter', {
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


export async function mongodbGenerateCoverLetterStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);

   const coverLetterInsert = await mongodbCoverLetterStreamingInsert(data);
    //
    //
    return true;

}

async function mongodbCoverLetterStreamingInsert(inputData) {

    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'coverLetterStreamingInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbGetLast24HoursCoverLetterData(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getLast24HoursCoverLetterData'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbGetCoverLetterListByUserId(userId) {

    const tResp = await makeDbCall({
        userId : userId,
        action: 'getCoverLetterListByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}


export async function mongodbGetCoverLetterDataByUserIdAndDocId(userId, docId) {
    const tResp = await makeDbCall({
        userId : userId,
        docId : docId,
        action: 'getCoverLetterDataByUserIdAndDocId'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        console.log("Are we coming here else ....");
    }
}


export async function mongodbGetCoverLetterByResumeIdVersion(resumeId, version) {

    const tResp = await makeDbCall({
        resumeId : resumeId,
        version : version,
        action: 'getCoverLetterByResumeIdVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}
