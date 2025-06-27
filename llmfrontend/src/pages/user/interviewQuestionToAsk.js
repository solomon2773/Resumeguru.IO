import CommonLayout from '../../components/Layout/MainLayout';
import { ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/20/solid'

import React, {useContext, useState} from "react";


import {useAuth} from "../../context/AuthContext";
import UserQuickCreateContext from "../../context/UserQuickCreateContext";
import {useSelector} from "react-redux";


const InterviewQuestionToAsk = ()=> {
    const user = useSelector(state => state.user.profile);
    const features = [
        {
            name: 'Job Description Analysis',
            description:
                'Automatically generates interview questions based on key details from the job description, ensuring each question is highly relevant to the role you\'re applying for.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Joboffer.jpg",
            iconAlt: 'Job Description Analysis Icon',
        },
        {
            name: 'Resume-Based Customization',
            description:
                'Tailors questions to reflect your unique experiences, skills, and educational background, helping you draw connections between your qualifications and the job requirements.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Resume.jpg",
            iconAlt: 'Resume-Based Customization Icon',
        },
        {
            name: 'Skill Highlighting',
            description:
                'Designs questions that allow you to subtly highlight your skills and competencies, demonstrating how they align with the company\'s needs.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Skill.jpg",
            iconAlt: 'Skill Highlighting Icon',
        },
        {
            name: 'Educational Insights',
            description:
                'Includes questions that relate to your educational achievements and how they can contribute to your success in the potential role.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Education.jpg",
            iconAlt: 'Educational Insights Icon',
        },
        {
            name: 'Company Culture Probe',
            description:
                'Provides questions specifically crafted to uncover insights into the company’s culture, helping you assess the fit and work environment.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Office.jpg",
            iconAlt: 'Company Culture Probe Icon',
        },
        {
            name: 'Confidence Boosting Preparation',
            description:
                'Prepares you with a robust set of questions that build confidence and show you are a well-prepared and insightful candidate, ready to engage deeply with potential employers.',
            href: '#',
            iconUrl: process.env.SITE_URL+"/images/icons/resumeColorIcons/jpg/Career.jpg",
            iconAlt: 'Confidence Boosting Preparation Icon',
        },
    ]

    return (
        <CommonLayout

            parent="home"
            title="Effective Interview Questions to Ask - Enhance Your Job Interview Strategy"
            meta_title="Effective Interview Questions to Ask - Enhance Your Job Interview Strategy"
            meta_desc="Stand out in your job interviews by asking insightful questions. Our service provides tailored questions that demonstrate your interest and help you gauge company culture and role expectations. Perfect for candidates eager to make a lasting impression."
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/interviewQuestionToAsk"}
            ogImage={process.env.SITE_URL + "/images/pages/interviewQuestionToAskSample-1.jpg"}
        >
            <div className="bg-white mt-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <p className="text-base font-semibold leading-7 text-indigo-600">Interview Question Guide</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Discover Key Interview Questions to Ask Employers
                        </h1>
                        <h2 className="mt-6 text-lg leading-8 text-gray-600">
                            Elevate your interview game with strategically crafted questions that showcase your engagement and help you assess potential employers effectively.


                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        {/*<feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />*/}
                                        <img src={feature.iconUrl}  alt={feature.iconAlt} className="h-10 w-10 flex-none text-indigo-600" ></img>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                        {/*<p className="mt-6">*/}
                                        {/*    <a href={feature.href} className="text-sm font-semibold leading-6 text-indigo-600">*/}
                                        {/*        Learn more <span aria-hidden="true">→</span>*/}
                                        {/*    </a>*/}
                                        {/*</p>*/}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="mt-10 mb-10 flex items-center gap-x-6">
                    {user && user.userId ? (
                        <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/"}>Get started</a>

                    ):(
                        <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>
                    )}


                </div>
                <div className="flex">
                    <img className="mx-auto" alt="Interview Question To Ask During an interview sample" src={process.env.SITE_URL+"/images/pages/interviewQuestionToAskSample-1.jpg"}></img>
                </div>
            </div>
        </CommonLayout>
    )
}

export default InterviewQuestionToAsk;
