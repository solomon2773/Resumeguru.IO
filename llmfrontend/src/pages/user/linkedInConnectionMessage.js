import CommonLayout from '../../components/Layout/MainLayout';

import {
    CheckBadgeIcon,

    UsersIcon,
} from '@heroicons/react/24/outline'
import React, {useContext, useState} from "react";
// import {toast} from "react-toastify";

import {useSelector} from "react-redux";


const LinkedinConnectionMessage = ()=> {
    const user = useSelector(state => state.user.profile);
    // console.log(resumeProgress)
    // console.log(jobDescription)
    //console.log(resumeDetailData)
    //console.log(advanceFeatureData)

    return (
        <CommonLayout

            parent="home"
            title="Connect with Top Recruiters on LinkedIn"
            meta_title="Connect with Top Recruiters on LinkedIn"
            meta_desc="Create compelling and personalized LinkedIn connection messages with our tool. Stand out and effectively expand your professional network by sending messages that resonate with potential contacts and foster meaningful connections. Perfect for professionals aiming to grow their network strategically."
            meta_keywords={"LinkedIn Connection Message, LinkedIn Connection Request, LinkedIn Connection Message Generator, LinkedIn Connection Message Examples, LinkedIn Connection Message Template"}
            ogImage={process.env.SITE_URL+"/images/pages/linkedin_and_interview_questions.jpg"}
            ogUrl={process.env.SITE_URL+"/user/linkedInConnectionMessage"}
            ogType={"website"}
        >
            <div className="bg-white">


                <div className="overflow-hidden bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
                            <div className="lg:pr-4 lg:pt-4">
                                <div className="lg:max-w-lg">
                                    <p className="text-base font-semibold leading-7 text-indigo-600">A better to connect</p>
                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Craft Engaging Connection Messages</h1>
                                    <h2 className="mt-6 text-lg leading-8 text-gray-600">
                                        Enhance your LinkedIn strategy with our specialized connection message tool. Tailored specifically for engaging recruiters, it personalizes your approach, optimizes sending times, and tracks engagement to improve your chances of making meaningful professional connections. Perfect for job seekers looking to expand their network effectively.
                                    </h2>
                                    <div className="mt-8">
                                        <div className="mt-10 mb-10 flex items-center gap-x-6">
                                            {user && user.userId ? (
                                                <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/linkedInMessage"}>Get started</a>

                                            ):(
                                                <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>
                                            )}


                                        </div>
                                    </div>
                                    <figure className="mt-16 border-l border-gray-200 pl-8 text-gray-600">
                                        <blockquote className="text-base leading-7">
                                            <p>
                                                “The LinkedIn Connection Message Tool was a game-changer for my job search. It helped me craft personalized messages that resonated with recruiters, significantly boosting my network. I quickly landed several interviews and built valuable relationships. Highly recommended for anyone looking to enhance their LinkedIn strategy!”
                                            </p>
                                        </blockquote>
                                        <figcaption className="mt-6 flex gap-x-4 text-sm leading-6">

                                            <div>
                                                <span className="font-semibold text-gray-900">Maria Thomas</span> – Marketing Manager
                                            </div>
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                            <img
                                src={process.env.SITE_URL+"/images/pages/linkedin_and_interview_questions.jpg"}
                                alt="Linked and Interview Questions sample"
                                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:ml-0"
                                width={2432}
                                height={1442}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    )
}

export default LinkedinConnectionMessage;
