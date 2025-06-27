import CommonLayout from '../../components/Layout/MainLayout';
import { CloudArrowUpIcon, BoltIcon, SparklesIcon, UserIcon, ClockIcon, DocumentTextIcon, SpeakerWaveIcon, AcademicCapIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useRef, useState} from "react";
import {Faqs_v1} from "../../components/Faqs/Faqs_v1";
import {mockInterviewFrontEndFAQs} from "../../utils/staticObjects/sections/faqs/mockInterview";
import {useSelector} from "react-redux";


const InterviewQuestions = ()=> {
    const user = useSelector(state => state.user.profile);
    const features = [

        {
            name: 'Personalized Interview Questions',
            description: 'Hannah generates relevant technical and behavioral questions tailored to your job description and personal input, ensuring you practice with the most pertinent questions.',
            icon: UserIcon,
        },
        {
            name: 'Real-Time Feedback',
            description: 'Receive immediate feedback on your answers. Hannah analyzes your responses for content quality and pronunciation, providing scores to help you understand areas for improvement.',
            icon: ClockIcon,
        },
        {
            name: 'Content Analysis',
            description: 'Hannah evaluates the substance of your answers, checking for completeness, relevance, and clarity, and offers suggestions for enhancing your responses.',
            icon: DocumentTextIcon,
        },
        {
            name: 'Pronunciation Scoring',
            description: 'Improve your verbal communication skills with real-time pronunciation scoring. Hannah highlights areas where you can refine your speech for better clarity and professionalism.',
            icon: SpeakerWaveIcon,
        },
        {
            name: 'Tailored STAR Responses',
            description:
                'Create compelling answers using the STAR (Situation, Task, Action, Result) method, specifically customized to reflect your personal experiences and the job you\'re targeting. This approach helps you articulate clear, structured stories that demonstrate your skills and achievements.',
            icon: SparklesIcon,
        },
        {
            name: 'Skill Evaluation',
            description:
                'Test your technical abilities with coding challenges and problem-solving questions. Hannah assesses your solutions and provides detailed feedback to help you sharpen your skills.',
            icon: BoltIcon,
        },
        {
            name: 'Behavioral Analysis',
            description:
                'Enhance your soft skills by practicing responses to behavioral questions. Hannah evaluates key indicators such as teamwork, leadership, and communication skills, providing actionable insights for improvement.',
            icon: AcademicCapIcon,
        },
    ]
    const videoRef = useRef(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    useEffect(() => {

        const handleCanPlay = () => {
           // setVideoPlaying(true);
          //  videoRef.current.play();

        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('canplay', handleCanPlay);
        }

        // Cleanup the event listener on component unmount
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, []);
    const playVideo = () => {
        const video = document.querySelector('video');
        if (videoPlaying) {
            video.pause();
            setVideoPlaying(false);
            return;
        } else {
            setVideoPlaying(true);
            video.play().then(r => {
                console.log(r);
            }).catch(e => {
                console.log(e);
            });
        }

    };

    const handleVideoEnd = () => {
        setVideoPlaying(false);
    };

    return (
        <CommonLayout

            parent="home"
            title="AI Mock Interviews - Real-Time Feedback & Skill Evaluation"
            meta_title="AI Mock Interviews - Real-Time Feedback & Skill Evaluation"
            meta_desc="Enhance your interview skills with AI agent Hannah. Get personalized questions, real-time feedback, and pronunciation scoring to prepare for your next job interview."
            meta_keywords="AI mock interview, Interview Agent, Interview Questions, Interview Answers, STAR Method, Technical Questions, Role-Specific Preparation, Interview Readiness, Industry-Specific Questions"
            ogImage={process.env.SITE_URL+"/images/pages/InterviewQuestion.jpg"}
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/interviewQuestions"}

        >
            <div className="overflow-hidden bg-white py-10 lg:py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-2 gap-y-2 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        <div className="lg:ml-auto lg:pl-4 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base font-semibold leading-7 text-indigo-600">AI Mock Interviews</h2>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Real-Time Feedback & Skill Evaluation</h1>
                                <h2 className="mt-6 text-lg leading-8 text-gray-600">
                                    Prepare for your next job interview with confidence using our AI Mock Interview feature. Our advanced AI agent, Hannah, simulates a real interview environment, providing you with personalized questions based on your job description and input. Receive real-time feedback on your responses, including content quality and pronunciation. Whether you're practicing technical skills or refining your behavioral responses, our AI Mock Interview tool helps you improve and excel in actual interviews.                                </h2>

                            </div>
                            <div className="mt-10 mb-10 flex items-center gap-x-6">
                                {user && user.userId ? (
                                    <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/mockInterview"}>Get started</a>

                                ):(
                                    <a className="mx-auto group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get started-It's free</a>
                                )}


                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:order-first">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg ">
                                <button
                                    type="button"
                                    onClick={() => {
                                        playVideo();
                                    }}
                                    className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Watch our AI mock interview sample video to learn more</span>
                                    <video
                                        src={process.env.SITE_URL+"/videos/frontpage/mockInterviewSample.mp4"}
                                        className=" w-full h-full "
                                        playsInline
                                        onEnded={handleVideoEnd}
                                        ref={videoRef}
                                    />
                                    <span aria-hidden="true" className="absolute inset-0 flex h-full w-full items-center justify-center">
                                {videoPlaying ? (
                                    <></>
                                ) :(
                                    <svg fill="currentColor" viewBox="0 0 84 84" className="h-20 w-20 text-blue-600" >
                                        <circle r={42} cx={42} cy={42} fill="white" opacity="0.9" />
                                        <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                                    </svg>
                                )}

                  </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="px-8 lg:px-24">
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

            <Faqs_v1 faq_questions={mockInterviewFrontEndFAQs} />
        </CommonLayout>
    )
}

export default InterviewQuestions;
