import {useAuth} from "../context/AuthContext";
import CommonLayout2 from "../components/Layout/MainLayout2";
import React, {useEffect, useRef, useState} from "react";
import {  toast } from 'react-toastify';
import { useRouter } from 'next/router'
import Link from 'next/link';
import {handleReferralLink} from "../utils/referral";
import { handleBuildingSteps } from "../utils/buildingsteps";
import {useDispatch} from "react-redux";
import {
    useClientDetails
} from "../hooks/referrallink/useClientDetails";
import {getCookie} from "../utils/cookies";
import {handleUserRegistration} from "../utils/google/gtm/tracking";

export default function MarketingHomeSignUp() {
    const dispatch = useDispatch();
    const router = useRouter()
    const {login, loginWithGoogle, loginWithGithub, loginWithLinkedIn, loginWithYahoo, loginWithMicrosoft} = useAuth();
    const email = useRef("");
    const password = useRef("");
    const [logingIn, setLoggedIn] = useState(false);
    const [emailLogin, setEmailLogin] = useState(false);
    const [clientIpAddress, clientDetails] = useClientDetails();
    const [signupId, setSignupId] = useState("NewUser - Signup Page");

    useEffect(()=>{

            getCookie("startCode").then((result)=>{

                if (result ){
                    setSignupId(result);
                }
            }) ;

    },[])



    const signupCredit = 8000;

    const emailPasswordLoginBtn = (e)=>{
        e.preventDefault();
        setLoggedIn(true);
        const emailCurrentValue = email.current.value;
        const passwordCurrentValue = password.current.value;

        login(emailCurrentValue,passwordCurrentValue).then(async(result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "Email - "+signupId
            });

            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                // console.log(result)
                window.gtag('set', 'user_id', result);
                window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggedIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }

        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggedIn(false);
            toast.error("Login Error!! "+error.error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    const googleLoginBtn = (e)=>{
        e.preventDefault();
        setLoggedIn(true);
        loginWithGoogle(signupId,signupCredit).then(async(result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "Google - "+signupId
            });
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggedIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggedIn(false);
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const githubLoginBtn = (e)=>{
        e.preventDefault();

        loginWithGithub(signupId,signupCredit).then(async (result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "Github - "+signupId
            });
            // console.log(result)
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const microsoftLoginBtn = (e)=>{
        e.preventDefault();
        setLoggedIn(true);

        loginWithMicrosoft(signupId,signupCredit).then(async (result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "Microsoft - "+signupId
            });
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggedIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggedIn(false);
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const yahooLoginBtn = (e)=>{
        e.preventDefault();
        setLoggedIn(true);

        loginWithYahoo(signupId,signupCredit).then(async (result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "Yahoo - "+signupId
            });
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggedIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggedIn(false);
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const linkedInLoginBtn = (e)=>{
        e.preventDefault();
        setLoggedIn(true);
        loginWithLinkedIn().then(async (result)=>{
            handleUserRegistration({
                userId: result,
                registrationFrom: "LinkedIn - "+signupId
            });
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggedIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{

            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggedIn(false);
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    return (



        <CommonLayout2
            parent="home"
            title="Resume Guru - New User Sign Up"
            meta_title="Resume Guru - New User Sign Up"
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >
            <div className="mx-auto mt-2 max-w-7xl justify-center ">

                    <a href={process.env.SITE_URL}>
                        <img
                            className="block w-auto h-10 m-3"
                            src={process.env.SITE_URL+"/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
                            alt="ResumeGuru.IO Logo"
                        />
                    </a>



            </div>


            {/*<Pricing_V2 />*/}
            {logingIn ? (

                    <div className="flex items-center justify-center h-screen" style={{     height: "200px !important",
                        fontSize: "2em"}}>
                        <svg aria-hidden="true" role="status" className="inline w-10 h-10 mr-5 text-white animate-spin"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"/>
                        </svg>
                        Loading...
                    </div>


                ) :(
                <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">

                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Start to use the power of AI for the next interview and job application.</h1>

                    </div>

                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">


                            <div className="mt-6  gap-3">


                                <div>
                                    <div
                                        onClick={googleLoginBtn}
                                        className=" cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Google</span>

                                        <div className="table-cell pr-2">
                                            <svg className="h-10 w-10" aria-hidden="true" fill="currentColor" viewBox="0 0 48 48">
                                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                            </svg>
                                        </div>

                                        <div className="table-cell"> Continue with Google</div>

                                    </div>
                                </div>
                                <div>
                                    <div
                                        onClick={githubLoginBtn}
                                        className="cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with GitHub</span>
                                        <div className="table-cell pr-2">
                                            <svg className="h-10 w-10" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="table-cell"> Continue with GitHub</div>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        onClick={microsoftLoginBtn}
                                        className="cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Microsoft</span>
                                        <div className="table-cell pr-2">
                                            <svg className="h-10 w-10" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                                <path fill="#F25022" d="M2 2H11.5V11.5H2z"/>
                                                <path fill="#7FBA00" d="M12.5 2H22V11.5H12.5z"/>
                                                <path fill="#00A4EF" d="M2 12.5H11.5V22H2z"/>
                                                <path fill="#FFB900" d="M12.5 12.5H22V22H12.5z"/>
                                            </svg>
                                        </div>
                                        <div className="table-cell"> Continue with Microsoft</div>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        onClick={yahooLoginBtn}
                                        className="cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Sign in with Yahoo</span>
                                        <div className="table-cell pr-2">
                                            <img
                                                className="h-auto w-14"
                                                aria-hidden="true"
                                                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Yahoo%21_%282019%29.svg"
                                            />


                                        </div>
                                        <div className="table-cell"> Continue with Yahoo</div>
                                    </div>
                                </div>
                                {/*<div>*/}
                                {/*    <div*/}
                                {/*        onClick={linkedInLoginBtn}*/}
                                {/*        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 cursor-pointer"*/}
                                {/*    >*/}
                                {/*        <span className="sr-only">Sign in with LinkedIn</span>*/}
                                {/*        <img src="images/signin_with_linkedin-buttons/Retina/Sign-In-Large---Default.png"></img>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div>*/}
                                {/*    <a*/}
                                {/*        href="#"*/}
                                {/*        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"*/}
                                {/*    >*/}
                                {/*        <span className="sr-only">Sign in with GitHub</span>*/}
                                {/*        <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">*/}
                                {/*            <path*/}
                                {/*                fillRule="evenodd"*/}
                                {/*                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"*/}
                                {/*                clipRule="evenodd"*/}
                                {/*            />*/}
                                {/*        </svg>*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </div>
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500 cursor-pointer"
                                        onClick={()=>{
                                            setEmailLogin(!emailLogin)
                                        }}>Or continue with email</span>
                                    </div>
                                </div>
                                {emailLogin && (
                                    <form className="space-y-6" action="#" method="POST">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email address
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    ref={email}
                                                    required
                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    ref={password}
                                                    autoComplete="current-password"
                                                    required
                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/*<div className="flex items-center">*/}
                                            {/*    <input*/}
                                            {/*        id="remember-me"*/}
                                            {/*        name="remember-me"*/}
                                            {/*        type="checkbox"*/}
                                            {/*        ref={rememberMe}*/}
                                            {/*        onChange={(e)=>{!rememberMe.current}}*/}
                                            {/*        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"*/}
                                            {/*    />*/}
                                            {/*    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900" >*/}
                                            {/*        Remember me*/}
                                            {/*    </label>*/}
                                            {/*</div>*/}

                                            <div className="text-sm">
                                                <Link href={process.env.SITE_URL+"/forget-password"} className="font-medium text-indigo-600 hover:text-indigo-500">
                                                    Forgot your password?
                                                </Link>


                                            </div>
                                            <div className="text-sm">
                                                <Link href={process.env.SITE_URL+"/register"} className="font-medium text-indigo-600 hover:text-indigo-500">
                                                    create a new account
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                onClick={emailPasswordLoginBtn}
                                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Sign in
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <p className="text-gray-400 text-sm text-center mt-3">
                                    By continuing, you agree to ResumeGuru.io&#39;s <a href={process.env.SITE_URL+"/termsofservice"}>Terms of Service</a>. Read our <a href={process.env.SITE_URL+"/privacy"}>Privacy Policy</a>.

                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            )}


        </CommonLayout2>

    )
}
