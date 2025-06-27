const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/referralLink', {
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


export async function mongodbInsertReferralCode(referralCode, userId) {
    const tResp = await makeDbCall({
        referralCode : referralCode,
        userId: userId,
        action: 'insertReferralCode'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbGetUserReferralCodes(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getUserReferralCodes'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbCheckUniqueReferralCode(referralCode) {
    const tResp = await makeDbCall({
        referralCode : referralCode,
        action: 'checkUniqueReferralCode'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbGetReferralByCode (referralCode) {
    const tResp = await makeDbCall({
        referralCode : referralCode,
        action: 'getReferralByCode'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbDeleteReferralCode(referralId) {
    const tResp = await makeDbCall({
        referralId : referralId,
        action: 'deleteReferralCode'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export function uniqueReferralCode () {
    let result = '';
    let length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

