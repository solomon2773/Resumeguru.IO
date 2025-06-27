
import CommonLayout from '../../components/Layout/MainLayout';
import React, {useRef} from "react";
import {useSelector} from "react-redux";


const AiResumeJDExtractor = ()=> {
    const user = useSelector(state => state.user.profile);
    const videoRef = useRef(null);
    const scrollToVideo = () => {
        videoRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <CommonLayout

            parent="home"
            ogImage={process.env.SITE_URL + "/images/screenshots/jobExtractorSample.jpg"}
            ogUrl={process.env.SITE_URL + "/user/aiJdExtractor"}
            ogType={"website"}
            title="JD Extraction | helps you to understand a job post faster."
            meta_title={ "JD Extraction | helps you to understand a job post faster."}
            meta_desc="Streamline your job hunt. Copy job descriptions, save for later, and extract key details like company, title, and skills—ideal for quick application prep."
        >
            <div className="wraper">
                <div className="relative isolate overflow-hidden bg-white">
                    <svg
                        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
                                width={200}
                                height={200}
                                x="50%"
                                y={-1}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M.5 200V.5H200" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth={0} fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
                    </svg>
                    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                            {/*<img*/}
                            {/*    className="h-11"*/}
                            {/*    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"*/}
                            {/*    alt="Your Company"*/}
                            {/*/>*/}
              {/*              <div className="mt-24 sm:mt-32 lg:mt-16">*/}
              {/*                  <a href="#" className="inline-flex space-x-6">*/}
              {/*<span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">*/}
              {/*  What's new*/}
              {/*</span>*/}
              {/*                      <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">*/}
              {/*  <span>Just shipped v1.0</span>*/}
              {/*  <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />*/}
              {/*</span>*/}
              {/*                  </a>*/}
              {/*              </div>*/}
                            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Effortless Job Application Prep: Extract Key Details Instantly
                            </h1>
                            <h2 className="mt-6 text-lg leading-8 text-gray-600">
                                Just copy and paste a job description from any online listing and assign it a template name for future reference. Our tool will automatically extract essential details such as the company name, job title, responsibilities, necessary skills, qualifications, and more, streamlining your job application process.
                            </h2>
                            <div className="mt-10 flex items-center gap-x-6">
                                {user && user.userId ? (
                                    <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/jdExtractor"}>Get started</a>

                                ):(
                                    <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>

                                )}
                                <div onClick={scrollToVideo} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                    Learn more <span aria-hidden="true">→</span>
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img
                                        src={process.env.SITE_URL + "/images/screenshots/jobExtractorSample.jpg"}
                                        alt="Job Description Extractor"
                                        width={1656}
                                        height={533}
                                        className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                    />
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
                        <source src={process.env.SITE_URL+"/videos/frontpage/jdExtractorExample.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </CommonLayout>
    )
}

export default AiResumeJDExtractor;
// export const getStaticProps = async (context) => {
//
// }
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
