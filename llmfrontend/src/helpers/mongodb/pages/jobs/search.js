const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/apis/search', {
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

export async function mongodbJobsSearchResultInsert(data) {
    const tResp = await makeDbCall({
        data : data,
        action: 'jobsSearchResultInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbJobsSearchLastResultFind() {
    const tResp = await makeDbCall({
        action: 'jobsSearchLastResultFind'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbJobsFindUserLikedJobs(userId) {
    const tResp = await makeDbCall({
        userId: userId,
        action: 'jobsFindUserLikedJobs'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbJobsUpdateLikedJob(uuid, userId) {
    const tResp = await makeDbCall({
        userId: userId,
        uuid: uuid,
        action: 'jobsUpdateLikedJob'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbJobsRemoveLikedJob(uuid, userId) {
    const tResp = await makeDbCall({
        userId: userId,
        uuid: uuid,
        action: 'jobsRemoveLikedJob'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbJobFindFromUUID(uuid) {
    const tResp = await makeDbCall({
        uuid: uuid,
        action: 'jobFindFromUUID'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}
