const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/context/authContext', {
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

export async function mongoDBinsertOneUserStatus(inputData) {

    const tResp = await makeDbCall({
        data : inputData,
        action: 'insertOneUserStatus'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return null;
    }
}

export async function mongoDBFindExistingUserByFirebaseId(inputData) {
    const tResp = await makeDbCall({
        data : inputData,
        action: 'findExistingUserByFirebaseId'
    });

    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return null;
    }
}
export async function mongoDBFindExistingUserByUserId(inputData) {
    const tResp = await makeDbCall({
        data : inputData,
        action: 'findExistingUserByUserId'
    });

    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return null;
    }
}
export async function mongoDBAddNewUser(inputData) {
    const tResp = await makeDbCall({
        data : inputData,
        action: 'addNewUser'
    });

    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return null;
    }
}


export async function mongoDBFindUserAndUpdateByUserId(inputData) {
    const tResp = await makeDbCall({
        data : inputData,
        action: 'findUserAndUpdateByUserId'
    });

    if (tResp.success && tResp.result) {
        return tResp.result;
    } else {
        return null;
    }
}
