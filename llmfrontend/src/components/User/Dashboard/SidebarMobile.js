import Link from 'next/link';
import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {
    ArrowPathRoundedSquareIcon,
    CalendarDaysIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    XMarkIcon,
    DocumentMagnifyingGlassIcon,
    EnvelopeIcon,
    LinkIcon,
    ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";
import {useAuth} from "../../../context/AuthContext";
import {dashboardSideBarNav} from "../../../utils/staticObjects/dashboard/dashboardNav";
import {Modal} from "flowbite-react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

import {useDispatch, useSelector} from "react-redux";
import {handleBuildingSteps} from "../../../utils/buildingsteps";
// import FeedbackPopupModal from "../../feedback/feedbackPopupModal";
const SidebarMobile = ({sideBarOpen, sideBarClose}) => {
    const { } = useAuth()
    const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false)
    useEffect(() => {
        setSidebarOpenMobile(sideBarOpen)
    },[sideBarOpen])
    //console.log(sidebarOpenMobile)

    const user = useSelector(state => state.user);
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
        <Transition.Root show={sidebarOpenMobile} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => {
                setSidebarOpenMobile(false);
                sideBarClose(false);
            }}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" className="-m-2.5 p-2.5" onClick={() => {
                                        setSidebarOpenMobile(false);
                                        sideBarClose(false);
                                    }}>
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </Transition.Child>
                            {/* Sidebar Mobile component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <a href={dashboardUrl ? process.env.SITE_URL+dashboardUrl : process.env.SITE_URL}><img
                                        className="h-10 w-auto mt-6"
                                        src={process.env.SITE_URL+"/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
                                        alt="Resume Guru Logo"
                                    /></a>
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {dashboardSideBarNav.map((item) => (
                                                    <li key={item.name}>
                                                       {/*  <a
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
                                                        > */}
                                                        <Link
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={classNames(
                                                                    item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                                    'h-6 w-6 shrink-0'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </Link>
                                                        {/* </a> */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        {/*                  <li>*/}
                                        {/*                      <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>*/}
                                        {/*                      <ul role="list" className="-mx-2 mt-2 space-y-1">*/}
                                        {/*                          {teams.map((team) => (*/}
                                        {/*                              <li key={team.name}>*/}
                                        {/*                                  <a*/}
                                        {/*                                      href={team.href}*/}
                                        {/*                                      className={classNames(*/}
                                        {/*                                          team.current*/}
                                        {/*                                              ? 'bg-gray-50 text-indigo-600'*/}
                                        {/*                                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',*/}
                                        {/*                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'*/}
                                        {/*                                      )}*/}
                                        {/*                                  >*/}
                                        {/*<span*/}
                                        {/*    className={classNames(*/}
                                        {/*        team.current*/}
                                        {/*            ? 'text-indigo-600 border-indigo-600'*/}
                                        {/*            : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',*/}
                                        {/*        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'*/}
                                        {/*    )}*/}
                                        {/*>*/}
                                        {/*  {team.initial}*/}
                                        {/*</span>*/}
                                        {/*                                      <span className="truncate">{team.name}</span>*/}
                                        {/*                                  </a>*/}
                                        {/*                              </li>*/}
                                        {/*                          ))}*/}
                                        {/*                      </ul>*/}
                                        {/*                  </li>*/}
                                        {/**Setting Mobile**/}
                                        {/*<li className="mt-auto">*/}
                                        {/*    <a*/}
                                        {/*        href="#"*/}
                                        {/*        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"*/}
                                        {/*    >*/}
                                        {/*        <Cog6ToothIcon*/}
                                        {/*            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"*/}
                                        {/*            aria-hidden="true"*/}
                                        {/*        />*/}
                                        {/*        Settings*/}
                                        {/*    </a>*/}
                                        {/*</li>*/}
                                    </ul>
                                </nav>
                                {/*<FeedbackPopupModal />*/}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
export default SidebarMobile;
