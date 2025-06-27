import CommonLayout from '../../components/Layout/MainLayout';
import React, {useRef} from "react";

import {useSelector} from "react-redux";


function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(' ')
}


const AiResumeCoverLetter = ()=> {
    const user = useSelector(state => state.user.profile);
    const videoRef = useRef(null);
    const scrollToVideo = () => {
        videoRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <CommonLayout

            parent="home"
            title="AI Cover Letter Tool: Custom & Personal for Jobs"
            meta_title="AI Cover Letter Tool: Custom & Personal for Jobs"
            meta_desc="Create standout cover letters with our AI Generator. Input details, analyze job descriptions, and highlight key skills for employers. "
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/aiResumeCoverLetter"}
            ogImage={process.env.SITE_URL+"/images/pages/ai-cover-letter.png"}

        >
            <div className="bg-white">
                <main>
                    <div className="relative isolate">
                        <svg
                            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
                            aria-hidden="true"
                        >
                            <defs>
                                <pattern
                                    id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                                    width={200}
                                    height={200}
                                    x="50%"
                                    y={-1}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path d="M.5 200V.5H200" fill="none" />
                                </pattern>
                            </defs>
                            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                                <path
                                    d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                                    strokeWidth={0}
                                />
                            </svg>
                            <rect width="100%" height="100%" strokeWidth={0} fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
                        </svg>
                        <div
                            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                            aria-hidden="true"
                        >
                            <div
                                className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                                style={{
                                    clipPath:
                                        'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                                }}
                            />
                        </div>
                        <div className="overflow-hidden">
                            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
                                <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                                    <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                            AI-Powered Cover Letter Generator
                                        </h1>
                                        <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                            Leverage our AI Cover Letter Generator to craft a customized cover letter for your targeted job role. It analyzes the job description to spotlight essential skills, elevating your application's appeal. Just enter your personal information for a cover letter that's both relevant and personalized, designed to leave a strong first impression on employers. Ideal for job seekers determined to stand out.
                                        </p>
                                        <div className="mt-10 flex items-center gap-x-6">
                                            {user && user.userId ? (
                                                <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/myCoverLetter"}>Get started</a>

                                            ):(
                                                <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>
                                            )}

                                            <div  onClick={scrollToVideo} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                                Live demo <span aria-hidden="true">→</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                                        <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                                            <div className="relative">
                                                <img
                                                    src={process.env.SITE_URL+"/images/pages/planning-project.jpg"}
                                                    alt="Planning a project"
                                                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                        </div>
                                        <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                                            <div className="relative">
                                                <img
                                                    src={process.env.SITE_URL+"/images/pages/cheerful-work-colleagues-working.jpg"}
                                                    alt="Working together"
                                                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                            <div className="relative">
                                                <img
                                                    src={process.env.SITE_URL+"/images/pages/analyzing-reports.jpg"}
                                                    alt="Analyzing reports"
                                                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                        </div>
                                        <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                                            <div className="relative">
                                                <img
                                                    src={process.env.SITE_URL+"/images/pages/portrait-of-a-group-of-confident-diverse-businessp.jpg"}
                                                    alt="Confident business people"
                                                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                            <div className="relative">
                                                <img
                                                    src={process.env.SITE_URL+"/images/pages/row-of-young-specialists-with-resume.jpg"}
                                                    alt="Young specialists with resume"
                                                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={videoRef} className="w-full text-center mx-auto">
                        {/* Your video or video placeholder here */}
                        <video
                            width="90%"
                            muted
                            autoPlay
                            loop
                            className="mx-auto rounded-lg shadow-lg"

                        >
                            <source src={process.env.SITE_URL+"/videos/frontpage/coverLetterDemo.mp4"} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </main>
            </div>
        </CommonLayout>
    )
}

export default AiResumeCoverLetter;
// export const getServerSideProps = async (context) => {
//     const { req } = context;
//     const cookies = cookie.parse(req.headers.cookie || '');
//     //const ka_u_token = cookies["ka_u_token"];
//     const ka_u_id = cookies["ka_u_id"];
//     //console.log(ka_u_id)
//     if (ka_u_id) {
//         return {
//             props: {},
//         };
//     } else {
//         return {
//             redirect: {
//                 destination: "/login",
//                 permanent: false,
//             },
//         };
//     }
//
//
//
//
// };
