const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/careerBuildingSteps', {
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

export async function mongodbInsertCareerBuildingSteps(buildingSteps) {

    const tResp = await makeDbCall({
        buildingSteps : buildingSteps,
        action: 'insertCareerBuildingSteps'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}

export async function mongodbGetUserCareerBuildingSteps(userId, statuFilter = false, status) {
    const tResp = await makeDbCall({
        userId : userId,
        statuFilter: statuFilter,
        status: status,
        action: 'getUserCareerBuildingSteps'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
    
}



export async function mongodbUpdateUserCareerBuildingSteps(userId, stepId, status) {

    const tResp = await makeDbCall({
        userId : userId,
        stepId: stepId,
        status: status,
        action: 'updateUserCareerBuildingSteps'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}
