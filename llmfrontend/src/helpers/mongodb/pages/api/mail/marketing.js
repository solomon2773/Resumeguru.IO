const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/apis/marketing', {
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

export async function mongodbGetUserProfileIncomplete(updateData) {
    const tResp = await makeDbCall({
        updateData : updateData,
        action: 'getUserProfileIncomplete'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbGetUserByTemplateId(templateId) {
    const tResp = await makeDbCall({
        templateId : templateId,
        action: 'getUserByTemplateId'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbGetJobSearchUser(templateId) {
    const tResp = await makeDbCall({
        templateId : templateId,
        action: 'getJobSearchUser'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbMarketingEmailSent(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'marketingEmailSent'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}


export async function mongodbGetNonUserEmails(templateId) {
    try {
        const params = {
            templateId : templateId,
            action: 'getNonUserEmails'
        };

        const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/apis/getNonUserEmails', {
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

        if (data.success) {
            return data.result;
        } else {
            return false;
        }
    } catch (error) {
        console.error('DB call failed:', error);
        throw error;
    }
}

