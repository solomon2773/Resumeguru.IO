import {
    mongodbGetReferralByCode
} from "./referralLink";


const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/general/referralTrack', {
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

export async function mongodbInsertReferralTrack(referralCode, userAgent, userId, clientDetails, clientIp) {
    if (referralCode) {
        const referralLink = await mongodbGetReferralByCode(referralCode);
        if (referralLink) {
            const referralTrackData = await mongodbInsertReferralTrackData({
                userId: userId,
                userAgent: userAgent,
                referralCode: referralCode,
                referralLinkObj: referralLink._id,
                country: clientDetails.country,
                countryCode: clientDetails.countryCode,
                city: clientDetails.city,
                region: clientDetails.region,
                clientIp: clientIp,
                createdAt: new Date(),
            });

            if (referralTrackData) {
                const refereeCreditDetails = 'Referral Bonus => Referral Code:' +  referralCode ;
                // Insert a new document if it does not exist
                // console.log("Track credit details", referralCreditDetails);
                const refereeNewRecord = {
                    userId: referralLink.userId,
                    credit: 5000,
                    detailName: 'Referral Bonus',
                    detailText: refereeCreditDetails,
                    referralType:'referee',
                    referredFrom: userId,
                    creditUsageType: 'ReferralBonus',
                    createdAt: new Date(),
                };

                await mongodbInsertRefereeCreditData(refereeNewRecord);
                /////
                const referrerCreditDetails = 'Referral Bonus => Referral Code:' +  referralCode ;
                // Insert a new document if it does not exist
                // console.log("Track credit details", referralCreditDetails);
                const refererNewRecord = {
                    userId: userId,
                    credit: 3000,
                    detailName: 'Referral Bonus',
                    detailText: referrerCreditDetails,
                    referralType:'referrer',
                    referredTo: referralLink.userId,
                    creditUsageType: 'ReferralBonus',
                    createdAt: new Date(),
                };

                await mongodbInsertRefereeCreditData(refererNewRecord);
            }
            return referralTrackData;
        } else {
            return false;
        }
    }

}


export async function mongodbInsertReferralTrackData(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'insertReferralTrackData'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbInsertRefereeCreditData(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'insertRefereeCreditData'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

