import {useAuth} from "../../context/AuthContext";
import React,{useRef, useState, useContext, Fragment} from "react";
import {  toast } from 'react-toastify';
import { useRouter } from 'next/router'
import Link from 'next/link';
import {useDispatch} from "react-redux";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import {handleReferralLink} from "../../utils/referral";
import {handleBuildingSteps} from "../../utils/buildingsteps";
import {
    useClientDetails
} from "../../hooks/referrallink/useClientDetails";

const UserLoginBlock = ()=> {
    const dispatch = useDispatch();
    const [clientIpAddress, clientDetails] = useClientDetails();
    const { isOverlayOpen, closeOverlay } = useContext(UserQuickCreateContext);
    // console.log(isOverlayOpen)
    // if (!isOverlayOpen) return null;
    const router = useRouter()
    const {login, loginWithGoogle, loginWithMicrosoft, loginWithGithub, loginWithLinkedIn, loginWithYahoo} = useAuth();
    const email = useRef("");
    const password = useRef("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [emailLoginFormOpen, setEmailLoginFormOpen] = useState(false);
    // const rememberMe = useRef("");

    const signupId = "New User Bonus";
    const signupCredit = 8000;
    const emailPasswordLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        const emailCurrentValue = email.current.value;
        const passwordCurrentValue = password.current.value;

        login(emailCurrentValue,passwordCurrentValue).then( async(result)=>{


            if (result){
                // console.log(result)
                window.gtag('set', 'user_id', result);
                window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                setLoggingIn(false);
                toast.error("Login Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }

        }).catch((error)=>{
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            setLoggingIn(false);
            toast.error("Login Error!! "+error.error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    const googleLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        loginWithGoogle(signupId,signupCredit).then(async (result)=>{

            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                closeOverlay();
                setLoggingIn(false);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                setLoggingIn(false);
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                toast.error("Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            setLoggingIn(false);
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const microsoftLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        loginWithMicrosoft(signupId,signupCredit).then(async (result)=>{

            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                closeOverlay();
                setLoggingIn(false);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                setLoggingIn(false);
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                toast.error("Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            setLoggingIn(false);
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const yahooLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        loginWithYahoo(signupId,signupCredit).then(async (result)=>{

            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                closeOverlay();
                setLoggingIn(false);
                const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                if (buildingStepsStatus) {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                } else {
                    window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                }
            } else {
                setLoggingIn(false);
                window.gtag('set', 'user_id', "0");
                window.gtag('event', 'logout', { method: 'custom' });
                toast.error("Error! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch((error)=>{
            setLoggingIn(false);
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const githubLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        loginWithGithub(signupId,signupCredit).then(async(result)=>{

           // console.log(result)
            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                closeOverlay();
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
            setLoggingIn(false);
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    const linkedInLoginBtn = (e)=>{
        e.preventDefault();
        setLoggingIn(true);
        loginWithLinkedIn().then(async(result)=>{

            if (result){
                await handleReferralLink(result, clientDetails, clientIpAddress);
                closeOverlay();
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
            setLoggingIn(false);
            window.gtag('set', 'user_id', "0");
            window.gtag('event', 'logout', { method: 'custom' });
            toast.error("Login Error! "+error, {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    return (
        <>
            <Transition.Root show={isOverlayOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeOverlay}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">

                                    {loggingIn ? (
                                        <div className="flex min-h-full flex-col justify-center  ">
                                            <div className="sm:mx-auto sm:w-full sm:max-w-md mx-auto text-center">
                                                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">Logging in...</h2>
                                                <span className="sr-only">Waiting for login...</span>
                                                <div className=" block mt-10 animate-spin center inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">

                                                </div>

                                            </div>
                                        </div>
                                    ) :(
                                        <>
                                            <div className="flex min-h-full flex-col justify-center  ">
                                                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">Start to use the power of AI for the next job application.</h2>
                                                </div>

                                                <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
                                                    <div className="bg-white py-2 px-2 shadow ">

                                                        <div className="mt-4 ">
                                                            {/*<div>*/}
                                                            {/*    <a*/}
                                                            {/*        href="#"*/}
                                                            {/*        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"*/}
                                                            {/*    >*/}
                                                            {/*        <span className="sr-only">Sign in with Facebook</span>*/}
                                                            {/*        <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">*/}
                                                            {/*            <path*/}
                                                            {/*                fillRule="evenodd"*/}
                                                            {/*                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"*/}
                                                            {/*                clipRule="evenodd"*/}
                                                            {/*            />*/}
                                                            {/*        </svg>*/}
                                                            {/*    </a>*/}
                                                            {/*</div>*/}


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

                                                                    <div className="inline-table"> <div className="table-cell align-middle">Continue with Google</div></div>

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
                                                                    <div className="inline-table"> <div className="table-cell align-middle">Continue with GitHub</div></div>
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
                                                                    <div className="inline-table"> <div className="table-cell align-middle">Continue with Microsoft</div></div>
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
                                                                    <div className="inline-table"> <div className="table-cell align-middle">Continue with Yahoo</div></div>
                                                                </div>
                                                            </div>
                                                            {/*<div>*/}
                                                            {/*    <div*/}
                                                            {/*        onClick={linkedInLoginBtn}*/}
                                                            {/*        className="cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"*/}
                                                            {/*    >*/}
                                                            {/*        <span className="sr-only">Sign in with LinkedIn</span>*/}
                                                            {/*        <div className="table-cell pr-2">*/}
                                                            {/*            <svg className="h-10 w-10" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">*/}
                                                            {/*                <path d="M20.447 20.452H16.819V14.765C16.819 13.403 16.792 11.735 14.971 11.735C13.125 11.735 12.87 13.164 12.87 14.661V20.452H9.243V9.147H12.7V10.693H12.746C13.234 9.819 14.317 8.908 15.847 8.908C19.279 8.908 20.447 10.913 20.447 14.116V20.452zM5.337 7.433C4.194 7.433 3.27 6.509 3.27 5.367C3.27 4.225 4.194 3.301 5.337 3.301C6.479 3.301 7.403 4.225 7.403 5.367C7.403 6.509 6.479 7.433 5.337 7.433zM7.119 20.452H3.555V9.147H7.119V20.452zM22.225 0H1.771C0.792 0 0 0.773 0 1.728V22.271C0 23.227 0.792 24 1.771 24H22.225C23.205 24 24 23.227 24 22.271V1.728C24 0.773 23.205 0 22.225 0z" fill="#0077B5"/>*/}
                                                            {/*            </svg>*/}

                                                            {/*        </div>*/}
                                                            {/*        <div className="inline-table"> <div className="table-cell align-middle">Continue with LinkedIn</div></div>*/}
                                                            {/*    </div>*/}
                                                            {/*</div>*/}

                                                            {/*<div>*/}
                                                            {/*    <div*/}
                                                            {/*        onClick={twitterLoginBtn}*/}
                                                            {/*        className="cursor-pointer inline-flex w-full mt-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"*/}
                                                            {/*    >*/}
                                                            {/*        <span className="sr-only">Sign in with Twitter</span>*/}
                                                            {/*        <div className="table-cell pr-2">*/}
                                                            {/*        <svg className="h-10 w-10" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">*/}
                                                            {/*            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />*/}
                                                            {/*        </svg>*/}
                                                            {/*        </div>*/}
                                                            {/*        <div className="table-cell"> Continue with Twitter</div>*/}
                                                            {/*    </div>*/}
                                                            {/*</div>*/}


                                                        </div>
                                                        <div className="mt-6">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 flex items-center">
                                                                    <div className="w-full border-t border-gray-300" />
                                                                </div>
                                                                <div className="relative flex justify-center text-sm">
                                                                    <Link
                                                                        onClick={()=>{closeOverlay();}}
                                                                        href="/login"
                                                                        className="cursor-pointer bg-white px-2 ">Or continue with email</Link>
                                                                </div>
                                                            </div>
                                                            {/*{emailLoginFormOpen && (*/}

                                                            {/*    <form className="space-y-6" action="#" method="POST">*/}
                                                            {/*        <div>*/}
                                                            {/*            <label htmlFor="email" className="block text-sm font-medium text-gray-700">*/}
                                                            {/*                Email address*/}
                                                            {/*            </label>*/}
                                                            {/*            <div className="mt-1">*/}
                                                            {/*                <input*/}
                                                            {/*                    id="email"*/}
                                                            {/*                    name="email"*/}
                                                            {/*                    type="email"*/}
                                                            {/*                    autoComplete="email"*/}
                                                            {/*                    ref={email}*/}
                                                            {/*                    required*/}
                                                            {/*                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"*/}
                                                            {/*                />*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}

                                                            {/*        <div>*/}
                                                            {/*            <label htmlFor="password" className="block text-sm font-medium text-gray-700">*/}
                                                            {/*                Password*/}
                                                            {/*            </label>*/}
                                                            {/*            <div className="mt-1">*/}
                                                            {/*                <input*/}
                                                            {/*                    id="password"*/}
                                                            {/*                    name="password"*/}
                                                            {/*                    type="password"*/}
                                                            {/*                    ref={password}*/}
                                                            {/*                    autoComplete="current-password"*/}
                                                            {/*                    required*/}
                                                            {/*                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"*/}
                                                            {/*                />*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}

                                                            {/*        <div className="flex items-center justify-between">*/}


                                                            {/*            <div className="text-sm">*/}
                                                            {/*                <Link href={process.env.SITE_URL+"/forget-password"} className="font-medium text-indigo-600 hover:text-indigo-500">*/}
                                                            {/*                    Forgot your password?*/}
                                                            {/*                </Link>*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}

                                                            {/*        <div>*/}
                                                            {/*            <button*/}
                                                            {/*                type="submit"*/}
                                                            {/*                onClick={emailPasswordLoginBtn}*/}
                                                            {/*                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                                            {/*            >*/}
                                                            {/*                Sign in*/}
                                                            {/*            </button>*/}
                                                            {/*        </div>*/}
                                                            {/*    </form>*/}
                                                            {/*)}*/}


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm text-center">
                                                By continuing, you agree to ResumeGuru.io&#39;s <a href={process.env.SITE_URL+"/termsofservice"}>Terms of Service</a>. Read our <a href={process.env.SITE_URL+"/privacy"}>Privacy Policy</a>.

                                            </p>
                                            {/*<div className="mt-5 sm:mt-6">*/}
                                            {/*    <button*/}
                                            {/*        type="button"*/}
                                            {/*        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"*/}
                                            {/*        onClick={closeOverlay}*/}
                                            {/*    >*/}
                                            {/*        Go back to dashboard*/}
                                            {/*    </button>*/}
                                            {/*</div>*/}
                                        </>
                                    )}

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>

                </Dialog>
            </Transition.Root>



        </>






    )
}
export default UserLoginBlock;
