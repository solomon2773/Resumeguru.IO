const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/mockInterview/sttTTSApi', {
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

export async function mockInterviewSttTtsInsert( data) {
    const tResp = await makeDbCall({
        data : data,
        action: 'mockInterviewSttTtsInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}

export async function getSttTtsTextUsage(userId){
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getSttTtsTextUsage'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}

export async function getUserInterviewSessions(userId){
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getUserInterviewSessions'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}

export async function getInterviewSessionConversations(userId, sessionId){
    const tResp = await makeDbCall({
        userId : userId,
        sessionId: sessionId,
        action: 'getInterviewSessionConversations'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}

export async function mongodbUpdateSessionName(userId, sessionId, sessionNameInput) {
    const tResp = await makeDbCall({
        userId : userId,
        sessionId: sessionId,
        sessionNameInput: sessionNameInput,
        action: 'updateSessionName'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}

export async function mongodbUpdateRecommendedAnswerToSttTts(inputData){
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'updateRecommendedAnswerToSttTts'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}
