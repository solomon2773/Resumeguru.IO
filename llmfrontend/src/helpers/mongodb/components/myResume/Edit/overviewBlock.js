import {estimateTokenCount} from "../../../../../utils/openAi";
import {mongodbUpdateRegenerateResumeOverviewStreaming} from "../../../pages/api/resume";



const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/overviewBlock', {
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


export async function mongodbUpdateResumeOverview(resumeObjectId,  inputData) {
    const tResp = await makeDbCall({
        resumeObjectId: resumeObjectId,
        inputData : inputData,
        action: 'updateResumeOverview'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbRegenerateOverviewStreaming(data) {
    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);

    const resumeOverviewUpdate = await mongodbUpdateRegenerateResumeOverviewStreaming(data,  data.userId);
    //
    //
    return resumeOverviewUpdate;

}


export async function mongodbOverviewSelectedVersion (resumeObjectId,  data) {

    const tResp = await makeDbCall({
        resumeObjectId: resumeObjectId,
        data : data,
        action: 'overviewSelectedVersion'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}
