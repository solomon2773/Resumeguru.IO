
const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/certificationBlock', {
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

export async function mongodbAddNewCertification( inputData) {

    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'addNewCertification'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbRemoveCertification( inputData) {

    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'removeCertification'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateCertification(inputData) {

    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'updateCertification'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateCertificationOrder (resumeId, oldIndex, newIndex) {

    const tResp = await makeDbCall({
        resumeId : resumeId,
        oldIndex: oldIndex,
        newIndex: newIndex,
        action: 'updateCertificationOrder'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

