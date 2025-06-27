const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/educationBlock', {
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

export async function mongodbUpdateResumeEducation( resumeId, educationIndex, educationData) {

    const tResp = await makeDbCall({
        resumeId : resumeId,
        educationIndex: educationIndex,
        educationData: educationData,
        action: 'updateResumeEducation'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function  mongodbRemoveResumeEducation( resumeId, educationIndex) {
    const tResp = await makeDbCall({
        resumeId : resumeId,
        educationIndex: educationIndex,
        action: 'removeResumeEducation'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbAddNewResumeEducation( resumeId, educationData) {
    const tResp = await makeDbCall({
        resumeId : resumeId,
        educationData: educationData,
        action: 'addNewResumeEducation'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResumeEducationOrder( resumeId, oldIndex, newIndex) {
    const tResp = await makeDbCall({
        resumeId : resumeId,
        oldIndex: oldIndex,
        newIndex: newIndex,
        action: 'updateResumeEducationOrder'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}
