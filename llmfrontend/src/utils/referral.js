import {getCookie, removeCookie} from "./cookies";
import {mongodbInsertReferralTrack} from "../helpers/mongodb/pages/user/referralTrack";

export  const  handleReferralLink = async (userId, clientDetails, clientIpAddress) => {

    const rlCookie = await getCookie('rl_u_code');
    if (rlCookie) {
        const userAgent = await getCookie('rl_u_agent');
        if (userAgent){
            const insertResp = await mongodbInsertReferralTrack(rlCookie, userAgent, userId, clientDetails, clientIpAddress);
            await removeCookie('rl_u_code');
            await removeCookie('rl_u_agent');
        }

    }
}
