
import {estimateTokenCount} from "../../../../utils/openAi";

const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/interviewQuestionToAsk', {
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


export async function mongodbGenerateInterviewQuestionToAskStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.parsedOutput), 1.0);

    const InterviewQuestionsInsert = await mongodbInterviewQuestionsStreamingInsert(data);
    //
    //
    return true;

}

async function mongodbInterviewQuestionsStreamingInsert(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'interviewQuestionsStreamingInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}


export async function mongodbGetInterviewQuestionToAskByResumeIdVersion(userId, resumeId, version) {
    const tResp = await makeDbCall({
        userId : userId,
        resumeId: resumeId,
        version:version,
        action: 'getInterviewQuestionToAskByResumeIdVersion'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}
