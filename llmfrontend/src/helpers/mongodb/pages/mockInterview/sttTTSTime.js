const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/mockInterview/sttTTSTime', {
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


export async function mockInterviewSttTtsTimeInsert( data) {
    const tResp = await makeDbCall({
        data : data,
        action: 'mockInterviewSttTtsTimeInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}

export async function sttTimeUpdate(data) {

    const tResp = await makeDbCall({
        data : data,
        action: 'sttTimeUpdate'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}

export async function getAudioSttTtsTimeUsage(userId){
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getAudioSttTtsTimeUsage'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}

export async function getAudioSttTtsTimeUsageBuildingSteps(userId){
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getAudioSttTtsTimeUsageBuildingSteps'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }

}
