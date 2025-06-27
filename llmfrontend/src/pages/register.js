import React, {useEffect, useRef, useState} from 'react';
import CommonLayout from "../components/Layout/MainLayout";
import {setCookie, removeCookie, getCookie} from "../utils/cookies";
import {useAuth} from "../context/AuthContext";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import { executeRecaptcha } from '../utils/recaptcha';
import {
    useClientDetails
} from "../hooks/referrallink/useClientDetails";
import {
    mongodbInsertReferralTrack
} from "../helpers/mongodb/pages/user/referralTrack";
import { Button } from "flowbite-react";
import {handleUserRegistration} from "../utils/google/gtm/tracking";
import {handleBuildingSteps} from "../utils/buildingsteps";
import {useDispatch, useSelector} from "react-redux";



const Register= () => {
    const router = useRouter()
    const { emailPasswordSignUp, } = useAuth();
    const user = useSelector(state => state.user.profile);
    const email = useRef("");
    const password = useRef("");
    const passwordReEnter = useRef("");
    const  firstName = useRef("");
    const  lastName = useRef("");
    const [regStart, setRegStart] = useState(false);
    const [clientIpAddress, clientDetails] = useClientDetails();
    const dispatch = useDispatch();

    useEffect(()=>{
        async function handelLoginUser(){
            const buildingStepsStatus = await handleBuildingSteps(dispatch, user.userId);

            if (buildingStepsStatus) {
                window.location.replace(process.env.SITE_URL+"/user/dashboard/");
            } else {
                window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
            }
        }
        if (user && user.userId){
            handelLoginUser();
        }
    },[user])

    const  handleReferralLink = async (userId) => {
        const rlCookie = await getCookie('rl_u_code');
        if (rlCookie) {
            const userAgent = await getCookie('rl_u_agent');
            const insertResp = await mongodbInsertReferralTrack(rlCookie, userAgent, userId, clientDetails, clientIpAddress);
            await removeCookie('rl_u_code');
            await removeCookie('rl_u_agent');
        }
    }

    const emailPasswordRegBtn = async ()=>{
        setRegStart(true);
        const emailCurrentValue = email.current.value;
        const firstNameCurrentValue = firstName.current.value;
        const lastNameCurrentValue = lastName.current.value;
        const passwordCurrentValue = password.current.value;
        const passwordCurrentValueReEnter = passwordReEnter.current.value;
        if (firstNameCurrentValue === ""){
            setRegStart(false);
            toast.error("First Name is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        if (lastNameCurrentValue === ""){
            setRegStart(false);
            toast.error("Last Name is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        if (emailCurrentValue === ""){
            setRegStart(false);
            toast.error("Email is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        // if (emailCurrentValue !== "" ){
        //
        //     try {
        //         const response = await fetch('/api/user/emailValidation', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
        //             },
        //             body: JSON.stringify({
        //                 email: emailCurrentValue,
        //                 source: "new_user_registration"
        //             }),
        //         });
        //         const json = await response.json();
        //         if (json.success === false) {
        //             setRegStart(false);
        //             toast.error("Email is invalid! ", {
        //                 position: toast.POSITION.TOP_RIGHT
        //             });
        //             return;
        //         }
        //     } catch (error) {
        //         setRegStart(false);
        //         toast.error("Email is invalid! ", {
        //             position: toast.POSITION.TOP_RIGHT
        //         });
        //         return;
        //     }
        //
        //
        // }

        if (passwordCurrentValue === ""){
            setRegStart(false);
            toast.error("Password is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        if (passwordCurrentValueReEnter === ""){
            setRegStart(false);
            toast.error("Re-Enter Password is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }





        if (passwordCurrentValue === passwordCurrentValueReEnter){
            const token = await executeRecaptcha("new_user_registration");

            if (!token) {
                alert('Failed to execute reCAPTCHA. Please try again.');
                return;
            }
            const googleRecaptchaVerify = await fetch(
                process.env.SITE_URL + `/api/google/recaptcha`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        token: token,
                    })
                }
            )
            const jsonGoogleRecaptchaVerify = await googleRecaptchaVerify.json();
            if (jsonGoogleRecaptchaVerify.success) {

                await emailPasswordSignUp(emailCurrentValue,passwordCurrentValue, firstNameCurrentValue, lastNameCurrentValue).then(async (result)=>{
                    handleUserRegistration({
                        userId: result,
                        registrationFrom: "Manual Email signup page",
                    });

                    if (result){
                        handleReferralLink(result.userId);
                        const buildingStepsStatus = await handleBuildingSteps(dispatch, result);
                        // console.log(result)
                        // window.gtag('set', 'user_id', result);
                        // window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
                        if (buildingStepsStatus) {
                            window.location.replace(process.env.SITE_URL+"/user/dashboard/");
                        } else {
                            window.location.replace(process.env.SITE_URL+"/user/dashboard/welcome");
                        }
                    } else {
                        toast.error("New User Registration Error! ", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        // window.location.reload();
                    }

                }).catch((error)=>{
                   // console.log(error)
                    setRegStart(false);
                    toast.error("New User Registration Error! Page will be reloaded."+error,  {
                        position: toast.POSITION.TOP_RIGHT
                    });
                     window.location.reload();
                })
            } else {
                setRegStart(false);
                toast.error("reCAPTCHA verification failed! ", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }

        } else {
            setRegStart(false);
            toast.error("Password does not match! ", {
                position: toast.POSITION.TOP_RIGHT
            });
        }


    }

    return (
        <CommonLayout parent="home"
                      title="ResumeGuru - User Registration"
                      meta_title={process.env.SEO_DEFAULT_TITLE}
                      meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
                      meta_keywords={process.env.SEO_DEFAULT_KEYWORDS}
        >


            <section className="jumbotron breadcumb no-bg"
                     style={{backgroundImage: `url(${"./img/background/subheader.jpg"})`}}
            >
                <div className="mainbreadcumb">
                    <div className="container ml-auto mr-auto">
                        <div className="row">
                            <div className="col-md-12 text-center ">
                                <h1 className="text-3xl font-bold">New User Register</h1>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section >
                <div className="flex min-h-full flex-col justify-center py-6 sm:px-6 lg:px-8">

                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h3 className="justify-center text-center">Don&quot;t have an account? Register now.</h3>
                        <h3 className="justify-center text-center">Setup your account at ResumeGuru.IO.</h3>

                        <div className="spacer-10"></div>
                        {regStart ? (

                            <div className="center">
                            <div className="spinner-border text-primary">
                            </div>Processing...

                            </div>
                        ) : (

                            <div className="flex min-h-full flex-col justify-center py-3 sm:px-6 lg:px-8">

                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                            <label
                                                htmlFor="firstName"
                                                className="block text-sm font-medium leading-6 text-gray-900 p-2"
                                            >First Name:</label>
                                            <input type="text" ref={firstName} name="firstName" id="firstName"
                                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                    </div>
                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                            <label
                                                htmlFor="lastName"
                                                className="block text-sm font-medium leading-6 text-gray-900 p-2"

                                            >Last Name:</label>
                                            <input
                                                type="text" ref={lastName} name="lastName" id="lastName"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                    </div>

                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium leading-6 text-gray-900 p-2">Email Address:</label>
                                            <div className="mt-2">
                                            <input type="text" ref={email}
                                                   name="email"
                                                   id="email"
                                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="field-set">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium leading-6 text-gray-900 p-2"
                                            >Password:</label>
                                            <input type="password" ref={password} name="password" id="password"
                                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="field-set">
                                            <label
                                                htmlFor="re-password"
                                                className="block text-sm font-medium leading-6 text-gray-900 p-2"
                                            >Re-enter Password:</label>
                                            <input type="password" ref={passwordReEnter} name="re-password" id="re-password"
                                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>


                                    <div className=" mt-3 justify-center">
                                        <Button onClick={emailPasswordRegBtn}
                                                id="emailPasswordRegBtn"
                                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                color="blue"
                                        >
                                           Register Now
                                        </Button>

                                        <div className="clearfix"></div>
                                    </div>

                                <p className="text-gray-400 text-sm text-center mt-3">
                                    By continuing, you agree to ResumeGuru.io&#39;s <a href={process.env.SITE_URL+"/termsofservice"}>Terms of Service</a>. Read our <a href={process.env.SITE_URL+"/privacy"}>Privacy Policy</a>.

                                </p>

                                </div>
                        )}


                    </div>

                </div>
            </section>

        </CommonLayout>
    )


};
export default Register;
