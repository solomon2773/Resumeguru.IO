const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/mockInterview/mockInterview', {
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

export async function mockInterviewMessageInsert( data) {
    const tResp = await makeDbCall({
        data : data,
        action: 'mockInterviewMessageInsert'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return [];
    }
}

