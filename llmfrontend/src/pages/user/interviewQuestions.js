import CommonLayout from '../../components/Layout/MainLayout';
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import React, {useContext, useState} from "react";
// import {toast} from "react-toastify";

import {useSelector} from "react-redux";


const InterviewQuestions = ()=> {
    const user = useSelector(state => state.user.profile);
    const features = [
        {
            name: 'Tailored STAR Responses',
            description:
                'Create compelling answers using the STAR (Situation, Task, Action, Result) method, specifically customized to reflect your personal experiences and the job you\'re targeting. This approach helps you articulate clear, structured stories that demonstrate your skills and achievements.',
            icon: CloudArrowUpIcon,
        },
        {
            name: 'Role-Specific Preparation',
            description: 'Get detailed answers that are tailored to the specific questions you\'re likely to face for the particular role and industry you are applying for. This feature ensures your responses are directly relevant and showcase your suitability for the position.',
            icon: LockClosedIcon,
        },
        {
            name: 'Enhanced Interview Readiness',
            description: 'Boost your interview readiness with practice questions and model answers that prepare you to respond confidently and effectively under pressure, ensuring you leave a strong impression during your actual interview.',
            icon: ServerIcon,
        },
        {
            name: 'Industry-Specific Technical Questions',
            description: 'Generate industry-specific technical questions, such as coding challenges for software engineers complete with sample code answers. This feature allows candidates to demonstrate their technical expertise and problem-solving skills relevant to their field.',
            icon: ServerIcon,
        },
    ]

    return (
        <CommonLayout

            parent="home"
            title="Ace Your Interview: Custom Q&A Prep"
            meta_title="Ace Your Interview: Custom Q&A Prep"
            meta_desc="Step into your next interview with confidence. Our Interview Question and Answer service prepares you with customized, role-specific answers, including technical questions for various industries. Utilize our STAR method guidance to articulate your experiences compellingly and demonstrate your professional expertise effectively."
            meta_keywords="Interview Questions, Interview Answers, STAR Method, Technical Questions, Role-Specific Preparation, Interview Readiness, Industry-Specific Questions"
            ogImage={process.env.SITE_URL+"/images/pages/InterviewQuestion.jpg"}
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/interviewQuestions"}

        >
            <div className="overflow-hidden bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        <div className="lg:ml-auto lg:pl-4 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base font-semibold leading-7 text-indigo-600">Interview Prep Mastery</h2>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ace Your Interview: Custom Q&A Prep</h1>
                                <h2 className="mt-6 text-lg leading-8 text-gray-600">
                                    Step into your next interview with confidence. Our Interview Question and Answer service prepares you with customized, role-specific answers, including technical questions for various industries. Utilize our STAR method guidance to articulate your experiences compellingly and demonstrate your professional expertise effectively.
                                </h2>
                                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                                    {features.map((feature) => (
                                        <div key={feature.name} className="relative pl-9">
                                            <dt className="inline font-semibold text-gray-900">
                                                <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                                {feature.name}
                                            </dt>{' '}
                                            <dd className="inline">{feature.description}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                            <div className="mt-10 mb-10 flex items-center gap-x-6">
                                {user && user.userId ? (
                                    <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/interviewQuestion"}>Get started</a>

                                ):(
                                    <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>
                                )}


                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:order-first">
                            <img
                                src={process.env.SITE_URL + '/images/pages/InterviewQuestion.jpg'}
                                alt="Interview Questions and Answers"
                                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[50rem]"
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

export default InterviewQuestions;
