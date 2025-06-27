import React, {Fragment, useContext,  useState, useEffect} from 'react'
import {MagnifyingGlassIcon, PlusIcon, UserCircleIcon, ChevronDownIcon, PhoneIcon, PlayCircleIcon, ChatBubbleBottomCenterTextIcon, QuestionMarkCircleIcon, ChatBubbleLeftEllipsisIcon, ChatBubbleLeftRightIcon, DocumentTextIcon} from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
// import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/router'
import UserLoginBlock from "../User/UserLoginBlock";
// import { Button, Navbar, MegaMenu } from "flowbite-react";
import UserQuickCreateContext from "../../context/UserQuickCreateContext";
import {
    Disclosure,
    Popover,
    Transition,
} from '@headlessui/react'

import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import {useDispatch, useSelector} from "react-redux";
import {handleBuildingSteps} from "../../utils/buildingsteps";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NavBar = ({menu}) =>{
    const user = useSelector(state => state.user)

    const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);
    const router = useRouter()
    const [newNotification, setNewNotification] = useState(false);
    //console.log(totalCredits)



    // let {loading, data} = useQuery(gql`${GetMainNavCategories}`);
    let mainMenuNavigation = [
        // { title:"Home", name: 'Home', href: process.env.SITE_URL+'/' },
    ];
    const adminMenuNavigation =
        [
            // Admin tools can be added here if needed

        ]
       ;


    const resumeAiTools = [
        { name: 'AI Target Resume',
            description: 'Optimize your resume with our AI Target Resume service. Tailored to meet specific job descriptions, our technology enhances your resume\'s relevance and impact, increasing your chances of landing your dream job.',
            href: process.env.SITE_URL+"/user/aiTargetResume", icon: CursorArrowRaysIcon },
        { name: 'AI JD Extractor', description: "Extract key information from a job post. Let you easily understand what are they looking for. Free, No credit needed.", href: process.env.SITE_URL+"/user/aiJdExtractor", icon: FingerPrintIcon },
        { name: 'AI Cover Letter', description: 'Create a cover letter for a specific job and your own custom prompt. Free, No credit needed.', href: process.env.SITE_URL+"/user/aiResumeCoverLetter", icon: DocumentTextIcon },

    ]
    // const coverLetterAiTools = [
    //     { name: 'AI Cover Letter', description: 'Create a cover letter for a specific job and your own custom prompt. Free, No credit needed.', href: process.env.SITE_URL+"/user/aiResumeCoverLetter", icon: ChartPieIcon },
    // ]
    const CommunicationTools = [
        { name: 'LinkedIn Connection Message', description: '\n' +
                'Craft compelling LinkedIn connection messages with our service. Personalize your outreach to make a lasting impression, expand your network effectively, and open doors to new professional opportunities. Perfect for engaging potential contacts with professionalism and courtesy.',
            href: process.env.SITE_URL+"/user/linkedInConnectionMessage", icon: ChatBubbleBottomCenterTextIcon },
    ]
    const InterviewPreparationTools = [
        { name: 'AI-powered mock interview',
            description: 'Practice job interviews with our AI agent Hannah. Get real-time feedback on your responses, pronunciation, and performance.' ,
            href: process.env.SITE_URL+"/user/dashboard/mockInterview", icon: ChatBubbleLeftRightIcon },
        { name: 'Interview question and answer',
            description: 'Explore our Interview Question and Answer service, designed to help you prepare for any job interview effectively. Generate custom questions and craft detailed answers using the STAR method, ensuring you\'re ready to impress potential employers.' ,
            href: process.env.SITE_URL+"/user/interviewQuestions", icon: QuestionMarkCircleIcon },
        { name: 'Interview Question To Ask' ,
            description: 'Discover key questions to ask in your next job interview with our Interview Question to Ask service. Tailor-made to help you stand out as an informed and engaged candidate, these questions are designed to impress interviewers and demonstrate your keen interest in the role and the company.',
            href: process.env.SITE_URL+"/user/interviewQuestionToAsk", icon: ChatBubbleLeftEllipsisIcon },
    ]
    const jobBoardTools = [
        {  name:"Job Search",
            description: 'Use natural language, like the way you speak, to find job opportunities. and apply with ease using your optimized resume and cover letter. Never use old-school key words search again.',
            href: process.env.SITE_URL+"/jobs/search", icon: MagnifyingGlassIcon },
    ]
    const callsToAction = [
        { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
        { name: 'Contact sales', href: '#', icon: PhoneIcon },
    ]

    const dispatch = useDispatch();
    const [dashboardUrl, setDashboardUrl] = useState(null);

    useEffect(()=>{
        const getBuildingStepsUrl = async () => {
            let buildingStepsStatus = false;
            if (!user.isBuildingStepsChecked) {
                buildingStepsStatus =  await handleBuildingSteps(dispatch, user.profile.userId);
            } else {
                buildingStepsStatus = user.isBuildingStepsCompleted;
            }

            if (buildingStepsStatus) {
                setDashboardUrl("/user/dashboard");
            } else {
                setDashboardUrl("/user/dashboard/welcome");
            }
        }

        if (!dashboardUrl && user.profile && user.profile.userId) {
            getBuildingStepsUrl();
        }

    },[user])

    return (
        <>


            <UserLoginBlock/>


            <Disclosure as="header" className="bg-white shadow">

                {({ open }) => (
                    <>
                        <div className="mx-auto mt-2 max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
                            <div className="relative flex  justify-between">
                                <div className="relative z-10 flex px-2 ">
                                    <div className="flex flex-shrink-0 items-center ">
                                        <a href={process.env.SITE_URL}>
                                            <img
                                                className="block w-auto h-10 m-3"
                                                src={process.env.SITE_URL+"/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
                                                alt="ResumeGuru.IO Logo"
                                            />
                                        </a>

                                    </div>
                                </div>
                                <div className="relative flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0 float-right">

                                    {/*<div className="w-full">*/}

                                    {/*</div>*/}
                                    <div className="w-3/4  float-right">
                                        <nav className="hidden lg:flex lg:space-x-4 lg:py-2 float-right" aria-label="Global">
                                            {/*{mainMenuNavigation.map((item,itemI) => (*/}
                                            {/*    <div  key={"mainMenuDesktop-"+itemI}>*/}
                                            {/*    <a  className="" href={item.href} className="text-sm font-semibold leading-6 text-gray-900">*/}
                                            {/*        {item.name}*/}
                                            {/*    </a>*/}
                                            {/*    </div>*/}
                                            {/*))}*/}

                                            {user.profile && user.profile.role === "admin" && (
                                                <div className=" ">
                                                    <Popover className="">
                                                        <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                            <span>Admin Tools</span>
                                                            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                        </Popover.Button>

                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-200"
                                                            enterFrom="opacity-0 translate-y-1"
                                                            enterTo="opacity-100 translate-y-0"
                                                            leave="transition ease-in duration-150"
                                                            leaveFrom="opacity-100 translate-y-0"
                                                            leaveTo="opacity-0 translate-y-1"
                                                        >
                                                            <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                    <div className="p-3">
                                                                        {adminMenuNavigation.map((item) => (
                                                                            <div key={"adminMenuDesktop"+item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                                    <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                                </div>
                                                                                <div>
                                                                                    <a href={item.href} className="font-semibold text-gray-900">
                                                                                        {item.name}
                                                                                        <span className="absolute inset-0" />
                                                                                    </a>
                                                                                    <p className="mt-1 text-gray-600">{item.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                                    {/*    {callsToAction.map((item) => (*/}
                                                                    {/*        <a*/}
                                                                    {/*            key={item.name}*/}
                                                                    {/*            href={item.href}*/}
                                                                    {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                                    {/*        >*/}
                                                                    {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                                    {/*            {item.name}*/}
                                                                    {/*        </a>*/}
                                                                    {/*    ))}*/}
                                                                    {/*</div>*/}
                                                                </div>
                                                            </Popover.Panel>
                                                        </Transition>
                                                    </Popover>
                                                </div>
                                            )}


                                            <div className=" ">
                                                <Popover className="">
                                                    <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                        <span>Resume Tools</span>
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0 translate-y-1"
                                                        enterTo="opacity-100 translate-y-0"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100 translate-y-0"
                                                        leaveTo="opacity-0 translate-y-1"
                                                    >
                                                        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                <div className="p-3">
                                                                    {resumeAiTools.map((item) => (
                                                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                            </div>
                                                                            <div>
                                                                                <a href={item.href} className="font-semibold text-gray-900">
                                                                                    {item.name}
                                                                                    <span className="absolute inset-0" />
                                                                                </a>
                                                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                                {/*    {callsToAction.map((item) => (*/}
                                                                {/*        <a*/}
                                                                {/*            key={item.name}*/}
                                                                {/*            href={item.href}*/}
                                                                {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                                {/*        >*/}
                                                                {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                                {/*            {item.name}*/}
                                                                {/*        </a>*/}
                                                                {/*    ))}*/}
                                                                {/*</div>*/}
                                                            </div>

                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>

                                            </div>
                                            {/* CoverLetter*/}
                                            {/*<div className=" ">*/}
                                            {/*<Popover className="">*/}
                                            {/*    <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">*/}
                                            {/*        <span>Cover Letter</span>*/}
                                            {/*        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />*/}
                                            {/*    </Popover.Button>*/}

                                            {/*    <Transition*/}
                                            {/*        as={Fragment}*/}
                                            {/*        enter="transition ease-out duration-200"*/}
                                            {/*        enterFrom="opacity-0 translate-y-1"*/}
                                            {/*        enterTo="opacity-100 translate-y-0"*/}
                                            {/*        leave="transition ease-in duration-150"*/}
                                            {/*        leaveFrom="opacity-100 translate-y-0"*/}
                                            {/*        leaveTo="opacity-0 translate-y-1"*/}
                                            {/*    >*/}
                                            {/*        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">*/}
                                            {/*            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">*/}
                                            {/*                <div className="p-3">*/}
                                            {/*                    {coverLetterAiTools.map((item) => (*/}
                                            {/*                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">*/}
                                            {/*                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">*/}
                                            {/*                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />*/}
                                            {/*                            </div>*/}
                                            {/*                            <div>*/}
                                            {/*                                <a href={item.href} className="font-semibold text-gray-900">*/}
                                            {/*                                    {item.name}*/}
                                            {/*                                    <span className="absolute inset-0" />*/}
                                            {/*                                </a>*/}
                                            {/*                                <p className="mt-1 text-gray-600">{item.description}</p>*/}
                                            {/*                            </div>*/}
                                            {/*                        </div>*/}
                                            {/*                    ))}*/}
                                            {/*                </div>*/}
                                            {/*                /!*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*!/*/}
                                            {/*                /!*    {callsToAction.map((item) => (*!/*/}
                                            {/*                /!*        <a*!/*/}
                                            {/*                /!*            key={item.name}*!/*/}
                                            {/*                /!*            href={item.href}*!/*/}
                                            {/*                /!*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*!/*/}
                                            {/*                /!*        >*!/*/}
                                            {/*                /!*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*!/*/}
                                            {/*                /!*            {item.name}*!/*/}
                                            {/*                /!*        </a>*!/*/}
                                            {/*                /!*    ))}*!/*/}
                                            {/*                /!*</div>*!/*/}
                                            {/*            </div>*/}

                                            {/*        </Popover.Panel>*/}
                                            {/*    </Transition>*/}
                                            {/*</Popover>*/}
                                            {/*</div>*/}
                                            {/*Interview Question*/}
                                            <div className=" ">
                                                <Popover className="">
                                                    <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                        <span>Interview Preparation</span>
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0 translate-y-1"
                                                        enterTo="opacity-100 translate-y-0"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100 translate-y-0"
                                                        leaveTo="opacity-0 translate-y-1"
                                                    >
                                                        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                <div className="p-3">
                                                                    {InterviewPreparationTools.map((item) => (
                                                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                            </div>
                                                                            <div>
                                                                                <a href={item.href} className="font-semibold text-gray-900">
                                                                                    {item.name}
                                                                                    <span className="absolute inset-0" />
                                                                                </a>
                                                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                                {/*    {callsToAction.map((item) => (*/}
                                                                {/*        <a*/}
                                                                {/*            key={item.name}*/}
                                                                {/*            href={item.href}*/}
                                                                {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                                {/*        >*/}
                                                                {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                                {/*            {item.name}*/}
                                                                {/*        </a>*/}
                                                                {/*    ))}*/}
                                                                {/*</div>*/}
                                                            </div>

                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>
                                            </div>
                                            {/*Communication Tool*/}
                                            <div className=" ">
                                                <Popover className="">
                                                    <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                        <span>Communication Tools</span>
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0 translate-y-1"
                                                        enterTo="opacity-100 translate-y-0"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100 translate-y-0"
                                                        leaveTo="opacity-0 translate-y-1"
                                                    >
                                                        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                <div className="p-3">
                                                                    {CommunicationTools.map((item) => (
                                                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                            </div>
                                                                            <div>
                                                                                <a href={item.href} className="font-semibold text-gray-900">
                                                                                    {item.name}
                                                                                    <span className="absolute inset-0" />
                                                                                </a>
                                                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                                {/*    {callsToAction.map((item) => (*/}
                                                                {/*        <a*/}
                                                                {/*            key={item.name}*/}
                                                                {/*            href={item.href}*/}
                                                                {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                                {/*        >*/}
                                                                {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                                {/*            {item.name}*/}
                                                                {/*        </a>*/}
                                                                {/*    ))}*/}
                                                                {/*</div>*/}
                                                            </div>

                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>
                                            </div>
                                            {/*JobBoard Tool*/}
                                            <div className=" ">
                                                <Popover className="">
                                                    <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                        <span>Job Board</span>
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0 translate-y-1"
                                                        enterTo="opacity-100 translate-y-0"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100 translate-y-0"
                                                        leaveTo="opacity-0 translate-y-1"
                                                    >
                                                        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                <div className="p-3">
                                                                    {jobBoardTools.map((item) => (
                                                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                            </div>
                                                                            <div>
                                                                                <a href={item.href} className="font-semibold text-gray-900">
                                                                                    {item.name}
                                                                                    <span className="absolute inset-0" />
                                                                                </a>
                                                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                                {/*    {callsToAction.map((item) => (*/}
                                                                {/*        <a*/}
                                                                {/*            key={item.name}*/}
                                                                {/*            href={item.href}*/}
                                                                {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                                {/*        >*/}
                                                                {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                                {/*            {item.name}*/}
                                                                {/*        </a>*/}
                                                                {/*    ))}*/}
                                                                {/*</div>*/}
                                                            </div>

                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>
                                            </div>
                                            {/*{mainMenuNavigation && mainMenuNavigation.map((item) => (*/}
                                            {/*    <a*/}
                                            {/*        key={item.id}*/}
                                            {/*        href={item.url}*/}
                                            {/*        className={classNames(*/}
                                            {/*            'text-gray-900 hover:bg-gray-50 hover:text-gray-900',*/}
                                            {/*            'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium'*/}
                                            {/*        )}*/}
                                            {/*        // aria-current={item.current ? 'page' : undefined}*/}
                                            {/*    >*/}
                                            {/*        {item.title}*/}
                                            {/*    </a>*/}
                                            {/*))}*/}
                                        </nav>

                                        {/*<label htmlFor="search" className="sr-only">*/}
                                        {/*    Search*/}
                                        {/*</label>*/}
                                        {/*<div className="relative">*/}
                                        {/*    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">*/}
                                        {/*        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />*/}
                                        {/*    </div>*/}
                                        {/*    <input*/}
                                        {/*        id="search"*/}
                                        {/*        name="search"*/}
                                        {/*        onKeyDown={handleKeyDown}*/}
                                        {/*        // onClick={handleOnClick}*/}
                                        {/*        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"*/}
                                        {/*        placeholder="Search"*/}
                                        {/*        type="search"*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                                {/* Mobile menu button */}
                                <div className=" lg:hidden m-3 mr-0 ml-auto items-center justify-center">
                                    <div className="flex items-center px-4">



                                        <div className="ml-3">
                                            {dashboardUrl && user.profile && user.profile.firstName ? (
                                                <a
                                                    href={process.env.SITE_URL+dashboardUrl }
                                                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                >
                                                    <span className="">Dashboard</span>

                                                </a>
                                            ) : (
                                                <a
                                                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                                    href={process.env.SITE_URL}
                                                    onClick={(event)=>{
                                                        event.preventDefault();
                                                        // if (!user){
                                                            openOverlay();
                                                            return;
                                                        // }
                                                    }}
                                                >

                                                    <span className=""
                                                          onClick={()=>{

                                                              // if (!user){
                                                                  openOverlay();
                                                                  return;
                                                              // }
                                                          }}
                                                    >Sign-In </span>
                                                </a  >
                                            )}


                                        </div>

                                    </div>

                                </div>
                                <div className="relative z-10 flex items-center lg:hidden">

                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Open menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (

                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />

                                        )}
                                    </Disclosure.Button>

                                </div>

                                <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center float-end">


                                    {dashboardUrl && user.profile && user.profile.firstName ? (
                                        <a
                                            href={process.env.SITE_URL+dashboardUrl  }
                                            className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                        >
                                            <span className="">Dashboard</span>

                                        </a>
                                    ) : (
                                        <a
                                            className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                            href={process.env.SITE_URL}
                                            onClick={(event)=>{
                                                event.preventDefault();
                                                // if (!user){
                                                    openOverlay();
                                                    return;
                                                // }
                                            }}
                                        >
                                            <UserCircleIcon className="h-5 w-5 flex-none text-white" aria-hidden="true" />

                                            <span className=""
                                                 onClick={()=>{

                                                     // if (!user){
                                                         openOverlay();
                                                         return;
                                                     // }
                                                 }}
                                            >Sign-In </span>
                                        </a  >
                                    )}
                                    {/*{newNotification ? (*/}
                                    {/*    <div className="inline-block relative">*/}
                                    {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700"*/}
                                    {/*             fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                    {/*            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
                                    {/*                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>*/}
                                    {/*        </svg>*/}
                                    {/*        <span className="sr-only">View new notifications</span>*/}
                                    {/*        <span*/}
                                    {/*            className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-400 bg-green-600"></span>*/}
                                    {/*    </div>*/}
                                    {/*):(*/}
                                    {/*    <div className="inline-block relative">*/}
                                    {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400"*/}
                                    {/*             fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                    {/*            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
                                    {/*                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>*/}
                                    {/*        </svg>*/}
                                    {/*        <span className="sr-only">View notifications</span>*/}

                                    {/*    </div>*/}
                                    {/*)}*/}




                                    {/* Profile dropdown */}
                                    {/*<Menu as="div" className="relative ml-4 flex-shrink-0">*/}
                                    {/*    <div>*/}

                                    {/*        <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">*/}
                                    {/*            <span className="sr-only">User Menu</span>*/}
                                    {/*            {user && user.firstName ? (*/}
                                    {/*                <Image*/}
                                    {/*                    className="h-8 w-8 rounded-full"*/}
                                    {/*                    width="32"*/}
                                    {/*                    height="32"*/}
                                    {/*                    src={user.imageUrl}*/}
                                    {/*                    alt={user.firstName ? user.firstName : "" + " " + user.lastName ? user.lastName : ""} />*/}
                                    {/*            ) : (*/}
                                    {/*                <div  aria-label="user login"><UserCircleIcon*/}
                                    {/*                    className="h-8 w-8 rounded-full text-gray-500"*/}
                                    {/*                    onClick={()=>{*/}
                                    {/*                        if (!user){*/}
                                    {/*                            openOverlay();*/}
                                    {/*                            return;*/}
                                    {/*                        }*/}
                                    {/*                    }}*/}
                                    {/*                /></div>*/}
                                    {/*            )}*/}

                                    {/*        </Menu.Button>*/}
                                    {/*    </div>*/}
                                    {/*    {user && user.firstName && (*/}
                                    {/*        <Transition*/}
                                    {/*            as={Fragment}*/}
                                    {/*            enter="transition ease-out duration-100"*/}
                                    {/*            enterFrom="transform opacity-0 scale-95"*/}
                                    {/*            enterTo="transform opacity-100 scale-100"*/}
                                    {/*            leave="transition ease-in duration-75"*/}
                                    {/*            leaveFrom="transform opacity-100 scale-100"*/}
                                    {/*            leaveTo="transform opacity-0 scale-95"*/}
                                    {/*        >*/}
                                    {/*            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">*/}
                                    {/*                <Menu.Item>*/}
                                    {/*                    <div className="block py-2 px-4 text-sm text-gray-700">*/}
                                    {/*                        <div>{user.firstName ? user.firstName : ""} {user.lastName ? user.lastName : ""}</div>*/}
                                    {/*                        <div className="text-sm text-blue-700 p-0 ">credit : {totalCredits ? totalCredits.toLocaleString() : 0}</div>*/}
                                    {/*                    </div>*/}

                                    {/*                </Menu.Item>*/}
                                    {/*                {userNavigation.map((item) => {*/}
                                    {/*                    if (item.name === 'Sign Out') {*/}
                                    {/*                        return ( <Menu.Item key={item.name}>*/}
                                    {/*                            {({active}) => (*/}
                                    {/*                                <div*/}
                                    {/*                                    onClick={logout}*/}
                                    {/*                                    className={classNames(*/}
                                    {/*                                        'cursor-pointer',*/}
                                    {/*                                        active ? 'bg-gray-100' : '',*/}
                                    {/*                                        'block py-2 px-4 text-sm text-gray-700'*/}
                                    {/*                                    )}*/}
                                    {/*                                >{item.name}</div>*/}
                                    {/*                            )}*/}
                                    {/*                        </Menu.Item>);*/}
                                    {/*                    } else {*/}
                                    {/*                        return(<Menu.Item key={item.name}>*/}
                                    {/*                            {({active}) => (*/}
                                    {/*                                <Link*/}
                                    {/*                                    href={item.href}*/}
                                    {/*                                    className={classNames(*/}
                                    {/*                                        active ? 'bg-gray-100' : '',*/}
                                    {/*                                        'block py-2 px-4 text-sm text-gray-700'*/}
                                    {/*                                    )}*/}
                                    {/*                                >*/}
                                    {/*                                    {item.name}*/}
                                    {/*                                </Link>*/}
                                    {/*                            )}*/}
                                    {/*                        </Menu.Item>)*/}
                                    {/*                    }*/}


                                    {/*                })}*/}


                                    {/*            </Menu.Items>*/}
                                    {/*        </Transition>*/}
                                    {/*    )}*/}

                                    {/*</Menu>*/}
                                    {/*mini cart*/}
                                    {/*<SideMiniCart />*/}
                                </div>
                            </div>




                        </div>

                        {/*Mobile Menu*/}


                        <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
                            {/*Mobile Main Menu*/}
                            <div className="space-y-2 py-4">
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-0 px-6 text-base font-medium text-gray-900 hover:bg-gray-50">
                                                Resume AI Tools
                                                <ChevronDownIcon
                                                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...resumeAiTools].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-1 pl-8 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>

                                        </>
                                    )}

                                </Disclosure>
                                {/*<Disclosure as="div" className="-mx-3">*/}
                                {/*    {({ open }) => (*/}
                                {/*        <>*/}
                                {/*            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-0 px-6 text-base font-medium text-gray-900 hover:bg-gray-50">*/}
                                {/*                Cover Letter AI Tools*/}
                                {/*                <ChevronDownIcon*/}
                                {/*                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}*/}
                                {/*                    aria-hidden="true"*/}
                                {/*                />*/}
                                {/*            </Disclosure.Button>*/}
                                {/*            <Disclosure.Panel className="mt-2 space-y-2">*/}
                                {/*                {[...coverLetterAiTools].map((item) => (*/}
                                {/*                    <Disclosure.Button*/}
                                {/*                        key={item.name}*/}
                                {/*                        as="a"*/}
                                {/*                        href={item.href}*/}
                                {/*                        className="block rounded-lg py-1 pl-8 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-gray-900"*/}
                                {/*                    >*/}
                                {/*                        {item.name}*/}
                                {/*                    </Disclosure.Button>*/}
                                {/*                ))}*/}
                                {/*            </Disclosure.Panel>*/}
                                {/*        </>*/}
                                {/*    )}*/}

                                {/*</Disclosure>*/}
                                {/*mobile interview question tools*/}
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-0 px-6 text-base font-medium text-gray-900 hover:bg-gray-50">
                                                Interview Preparation
                                                <ChevronDownIcon
                                                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...InterviewPreparationTools].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-1 pl-8 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}

                                </Disclosure>
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-0 px-6 text-base font-medium text-gray-900 hover:bg-gray-50">
                                                Communication Tools
                                                <ChevronDownIcon
                                                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...CommunicationTools].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-1 pl-8 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}

                                </Disclosure>
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-0 px-6 text-base font-medium text-gray-900 hover:bg-gray-50">
                                                Job Board
                                                <ChevronDownIcon
                                                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...jobBoardTools].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-1 pl-8 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}

                                </Disclosure>
                                {/*{mainMenuNavigation.map((item,itemI) => (*/}
                                {/*    <div  key={"mainMenuDesktop-"+itemI}>*/}
                                {/*        <a   href={item.href} className="block rounded-md py-0 px-3 text-base font-semibold leading-7  text-gray-500 hover:bg-gray-50 hover:text-gray-900">*/}
                                {/*            {item.name}*/}
                                {/*        </a>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                                {user.profile && user.profile.role === "admin" && (
                                    <div className=" ">
                                        <Popover className="">
                                            <Popover.Button className=" inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                                <span>Admin Tools</span>
                                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                            </Popover.Button>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                        <div className="p-3">
                                                            {adminMenuNavigation.map((item) => (
                                                                <div key={"adminMenuDesktop"+item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                        <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                                    </div>
                                                                    <div>
                                                                        <a href={item.href} className="font-semibold text-gray-900">
                                                                            {item.name}
                                                                            <span className="absolute inset-0" />
                                                                        </a>
                                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {/*<div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">*/}
                                                        {/*    {callsToAction.map((item) => (*/}
                                                        {/*        <a*/}
                                                        {/*            key={item.name}*/}
                                                        {/*            href={item.href}*/}
                                                        {/*            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"*/}
                                                        {/*        >*/}
                                                        {/*            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />*/}
                                                        {/*            {item.name}*/}
                                                        {/*        </a>*/}
                                                        {/*    ))}*/}
                                                        {/*</div>*/}
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </Popover>
                                    </div>
                                )}
                            </div>
                            {/*<div className=" lg:hidden p-3 mr-0 ml-auto items-center justify-center">*/}
                            {/*    <div className="flex items-center px-4">*/}



                            {/*        <div className="ml-3">*/}
                            {/*            {user && user.firstName ? (*/}
                            {/*                <Link*/}
                            {/*                    href={process.env.SITE_URL+"/user/dashboard/"}*/}
                            {/*                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"*/}
                            {/*                >*/}
                            {/*                    <span className="">Dashboard</span>*/}

                            {/*                </Link>*/}
                            {/*            ) : (*/}
                            {/*                <Link*/}
                            {/*                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"*/}
                            {/*                    href={process.env.SITE_URL}*/}
                            {/*                    onClick={(event)=>{*/}
                            {/*                        event.preventDefault();*/}
                            {/*                        if (!user){*/}
                            {/*                            openOverlay();*/}
                            {/*                            return;*/}
                            {/*                        }*/}
                            {/*                    }}*/}
                            {/*                >*/}

                            {/*                        <span className=""*/}
                            {/*                              onClick={()=>{*/}

                            {/*                                  if (!user){*/}
                            {/*                                      openOverlay();*/}
                            {/*                                      return;*/}
                            {/*                                  }*/}
                            {/*                              }}*/}
                            {/*                        >Sign-In </span>*/}
                            {/*                </Link  >*/}
                            {/*            )}*/}


                            {/*        </div>*/}
                            {/*        /!*<button*!/*/}
                            {/*        /!*    type="button"*!/*/}
                            {/*        /!*    className="ml-auto flex-shrink-0 rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"*!/*/}
                            {/*        /!*>*!/*/}
                            {/*        /!*    <span className="sr-only">View notifications</span>*!/*/}
                            {/*        /!*    <BellIcon className="h-6 w-6" aria-hidden="true" />*!/*/}
                            {/*        /!*</button>*!/*/}
                            {/*    </div>*/}
                            {/*    /!*<div className="mt-3 space-y-1 px-2 m-2">*!/*/}
                            {/*    /!*    <a*!/*/}
                            {/*    /!*        href={process.env.SITE_URL+"/user/createMyResume"}*!/*/}
                            {/*    /!*        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*!/*/}
                            {/*    /!*    >*!/*/}
                            {/*    /!*        <span className="">Create target Resume</span>*!/*/}

                            {/*    /!*    </a>*!/*/}
                            {/*    /!*    {user && user.firstName && (*!/*/}
                            {/*    /!*        <>*!/*/}
                            {/*    /!*            {userNavigation.map((item,i) => {*!/*/}

                            {/*    /!*                if (item.name === 'Sign Out') {*!/*/}
                            {/*    /!*                    return (*!/*/}
                            {/*    /!*                        <Disclosure.Button*!/*/}
                            {/*    /!*                            key={"nav-"+item.name}*!/*/}
                            {/*    /!*                            onClick={logout}*!/*/}
                            {/*    /!*                            className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"*!/*/}

                            {/*    /!*                        >{item.name}</Disclosure.Button>*!/*/}
                            {/*    /!*                    );*!/*/}
                            {/*    /!*                } else {*!/*/}
                            {/*    /!*                    return (<Disclosure.Button*!/*/}
                            {/*    /!*                        key={"nav-"+item.name}*!/*/}
                            {/*    /!*                        as="a"*!/*/}
                            {/*    /!*                        href={item.href}*!/*/}
                            {/*    /!*                        className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"*!/*/}
                            {/*    /!*                    >*!/*/}
                            {/*    /!*                        {item.name}*!/*/}
                            {/*    /!*                    </Disclosure.Button>)*!/*/}
                            {/*    /!*                }*!/*/}
                            {/*    /!*            })}*!/*/}
                            {/*    /!*        </>*!/*/}
                            {/*    /!*    )}*!/*/}
                            {/*    /!*</div>*!/*/}
                            {/*</div>*/}

                        </Disclosure.Panel>

                    </>
                )}
            </Disclosure>
        </>

    )
}
export default NavBar;

