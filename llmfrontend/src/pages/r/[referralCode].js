import { setCookie } from "../../utils/cookies";

import { useEffect } from "react";
import { useRouter } from 'next/router';


const referralHome = ({referralCode, userAgent}) => {
    const router = useRouter();

    useEffect(() => {
        setCookie('rl_u_code', referralCode, 30);
        setCookie('rl_u_agent', userAgent, 30);
        router.replace('/login');
    }, []); 

    return null;
    
}

export default referralHome;

export const getServerSideProps = async (context) => {
    const { req, query } = context;
    const referralCodeArray = query.referralCode;
    const userAgent = req.headers['user-agent'];
    const referralCode = Array.isArray(referralCodeArray[0]) ? referralCodeArray[0] : referralCodeArray;

    return {
        props: {
            referralCode: referralCode|| null,
            userAgent: userAgent|| null,
        },
    };
};