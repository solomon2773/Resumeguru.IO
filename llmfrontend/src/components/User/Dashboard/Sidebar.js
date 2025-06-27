import React, {useEffect, useState} from "react";
import Link from 'next/link';
import {useAuth} from "../../../context/AuthContext";
import {dashboardSideBarNav} from "../../../utils/staticObjects/dashboard/dashboardNav";


import {useDispatch, useSelector} from "react-redux";
import {handleBuildingSteps} from "../../../utils/buildingsteps";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const SidebarDesktop = () => {
    const { } = useAuth()

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
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 md:w-50 lg:flex-col " >
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                    <a href={dashboardUrl ? process.env.SITE_URL+dashboardUrl : process.env.SITE_URL}><img
                        className="h-10 w-auto mt-6"
                        src={process.env.SITE_URL+"/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
                        alt="ResumeGuru.IO Logo"
                    /></a>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {dashboardSideBarNav.map((item) => (
                                    <li key={item.name}>
                                        {/* <a
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


                        {/*<li>*/}
                        {/*    <ul role="list" className="-mx-2 space-y-1">*/}
                        {/*    <li key="refer">*/}
                        {/*        <a*/}
                        {/*            href={process.env.SITE_URL+'/user/dashboard/referrallink'}*/}
                        {/*            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'*/}
                        {/*        >*/}
                        {/*            <ShareIcon*/}
                        {/*                className='text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0'*/}
                        {/*                aria-hidden="true"*/}
                        {/*            />*/}
                        {/*            Refer a Friend*/}
                        {/*        </a>*/}
                        {/*        </li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        {/*          <li>*/}
                        {/*              <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>*/}
                        {/*              <ul role="list" className="-mx-2 mt-2 space-y-1">*/}
                        {/*                  {teams.map((team) => (*/}
                        {/*                      <li key={team.name}>*/}
                        {/*                          <a*/}
                        {/*                              href={team.href}*/}
                        {/*                              className={classNames(*/}
                        {/*                                  team.current*/}
                        {/*                                      ? 'bg-gray-50 text-indigo-600'*/}
                        {/*                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',*/}
                        {/*                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'*/}
                        {/*                              )}*/}
                        {/*                          >*/}
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
                        {/*                              <span className="truncate">{team.name}</span>*/}
                        {/*                          </a>*/}
                        {/*                      </li>*/}
                        {/*                  ))}*/}
                        {/*              </ul>*/}
                        {/*          </li>*/}
                        {/*settings*/}
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
                {/*<FeedbackPopupModal/>*/}
            </div>
        </div>

    );
}

export default SidebarDesktop;
