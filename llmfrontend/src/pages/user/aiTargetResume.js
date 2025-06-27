import CommonLayout from '../../components/Layout/MainLayout';

import {useSelector} from "react-redux";


const AiTargetResume = ()=> {
    const user = useSelector(state => state.user.profile);

    // console.log(resumeProgress)
    // console.log(jobDescription)
    //console.log(resumeDetailData)
    //console.log(advanceFeatureData)

    return (
        <CommonLayout

            parent="home"
            title="AI Resume Tools: Refine & Rewrite for Your Future"
            meta_title={process.env.SEO_DEFAULT_TITLE}
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >
            <div className="bg-white">


                <div className="relative isolate pt-14">
                    {/*<div*/}
                    {/*    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"*/}
                    {/*    aria-hidden="true"*/}
                    {/*>*/}
                    {/*    <div*/}
                    {/*        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"*/}
                    {/*        style={{*/}
                    {/*            clipPath:*/}
                    {/*                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Tailored Resumes, Cover Letters, Interview Prep and more...
                                </h1>
                                <h2 className="mt-6 text-lg leading-8 text-gray-600">
                                    Create a tailored resume reflecting your professional background and specific job requirements, along with personalized cover letters, LinkedIn outreach messages, and detailed interview Q&As. Our comprehensive service ensures every aspect of your job application is optimized for success.
                                </h2>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {user && user.userId ? (
                                        <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/user/dashboard/myResume"}>Get started</a>

                                    ):(
                                        <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>

                                    )}
                                    {/*<a href="#" className="text-sm font-semibold leading-6 text-gray-900">*/}
                                    {/*    Learn more <span aria-hidden="true">→</span>*/}
                                    {/*</a>*/}
                                </div>
                            </div>
                            <div className="mt-16 flow-root sm:mt-24">
                                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img
                                        src={process.env.SITE_URL + '/images/screenshots/ResumeGuruHeader1.jpg'}
                                        width={2432}
                                        height={1442}
                                        alt="Create AI resume screenshot"
                                        className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        {/*<div*/}
                        {/*    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"*/}
                        {/*    style={{*/}
                        {/*        clipPath:*/}
                        {/*            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        </CommonLayout>
    )
}

export default AiTargetResume;
