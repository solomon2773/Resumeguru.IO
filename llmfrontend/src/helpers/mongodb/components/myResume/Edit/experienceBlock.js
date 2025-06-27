import {estimateTokenCount} from "../../../../../utils/openAi";


const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/experienceBlock', {
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



export async function mongodbRemoveResumeExperience( resumeId, experienceIndex) {
    const tResp = await makeDbCall({
        resumeId : resumeId,
        experienceIndex: experienceIndex,
        action: 'removeResumeExperience'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateExperienceRewrite(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'updateExperienceRewrite'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbUpdateResumeExperienceOrder (resumeId, oldIndex, newIndex) {

    const tResp = await makeDbCall({
        resumeId : resumeId,
        oldIndex: oldIndex,
        newIndex: newIndex,
        action: 'updateResumeExperienceOrder'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbAddNewExperienceRewrite(resumeObjectId, inputData) {
    const tResp = await makeDbCall({
        resumeObjectId : resumeObjectId,
        inputData: inputData,
        action: 'addNewExperienceRewrite'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateExperienceVersion(resumeObjectId, experienceIndex, versionIndex) {
    const tResp = await makeDbCall({
        resumeObjectId : resumeObjectId,
        experienceIndex: experienceIndex,
        action: 'updateExperienceVersion'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbRegenerateExperienceBulletPointStreamingCredtInsert(data) {
    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);



}

export async function mongodbRegenerateExperienceParagraphStreamingCredtInsert(data) {
    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);

    const creditUsageInsert = await mongodbUserCreditUsageInsert({
        userId: data.userId,
        resumeObjectId: data.resumeObjectId,
        credit: completionTokens,
        tokenUsage:{
            promptTokens:promptTokens,
            completionTokens:completionTokens,
            totalTokens:promptTokens+ completionTokens,
        },
        modelVersion : data.modelVersion ? data.modelVersion : null,
        provider: data.provider ? data.provider : null,
        apiCallPostData: {
            streamInputData: data.userContent,
            chatPrompt: data.chatPrompt,
            modelParams: data.modelParams ? data.modelParams : null,
        },
        apiCallResult: data.parsedOutput,
        creditUsageType: "rewriteExperienceParagraph",
        detailName: "Generate Experience Paragraph Streaming Call",
        detailText: "Generate Experience Paragraph Streaming Call - Edit Experience",
    });
}
