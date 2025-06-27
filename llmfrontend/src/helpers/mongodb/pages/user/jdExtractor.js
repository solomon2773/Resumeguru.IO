const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/jdExtractor', {
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

export async function mongodbGetJdExtractorDataByUserIdAndDocId(userId, docId) {
    const tResp = await makeDbCall({
        userId : userId,
        docId: docId,
        action: 'getJdExtractorDataByUserIdAndDocId'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}
export async function mongodbGetJdExtractorListByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getJdExtractorListByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }

}
