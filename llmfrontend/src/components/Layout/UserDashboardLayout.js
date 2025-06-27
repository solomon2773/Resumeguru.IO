import React, {Fragment, useEffect, useState} from "react";
import Head from 'next/head'
// import favicon from "../../public/assets/images/favicon/Barrington-B-favicon-navy_1.png";
// import ScrollToTopBtn from "../Header/ScrollToTop";
import {
    Bars3Icon,

} from "@heroicons/react/24/outline";
import {Dialog, Menu, Transition} from "@headlessui/react";
import Image from "next/image";
import {ChevronDownIcon, UserCircleIcon} from "@heroicons/react/20/solid";
import {useAuth} from "../../context/AuthContext";
import SidebarDesktop from "../User/Dashboard/Sidebar";
import SidebarMobile from "../User/Dashboard/SidebarMobile";
// import { Dropdown } from "flowbite-react";
import {useSelector} from "react-redux";
// import { GoogleTagManager } from '@next/third-parties/google'
import * as gtag from "../../helpers/gtm/gtm";
import {removeCookie} from "../../utils/cookies";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const UserDashboardCommonLayout = ({ children, title, parent, subTitle, urlPath, meta_title, meta_keywords, meta_desc, mainMenu, ogType, ogUrl, ogImage, structuredData }) => {
    const {   logout } = useAuth();
    const user = useSelector(state => state.user)

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const userImage = {
        imageUrl:
            user.profile && user.profile.profileImage && user.profile.profileImage.bucket ? process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + user.profile.profileImage.bucket+"/"+user.profile.profileImage.key : "/images/author-placeholder.jpg",
        imageAlt: user.profile && user.profile.firstName && user.profile.lastName ?  user.profile.firstName+" "+user.profile.lastName+" thumbnails" : "",
    }
    const userNavigation = [
        { name: 'My Profile', href: process.env.SITE_URL+'/user/dashboard/profile/' },
        { name: 'Give us a feedback', href: process.env.SITE_URL+'/contact-us' },

    ]
    useEffect(() => {
        // Set up the redirection only if there is no valid user
        let timer;
        if (!user.profile || !user.profile.userId) {
             timer = setTimeout(() => {
                // Redirect to the login page or any appropriate URL
                window.location.href = process.env.SITE_URL;
            }, 5000); // 10000 milliseconds = 10 seconds

            // Cleanup function to clear the timer if the component unmounts early
            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        }
        // No cleanup needed if there is a valid user
    }, [user]);


    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <title>{meta_title ? meta_title : title}</title>
                <meta name="title" content={meta_title} />
                <meta name="description" content={meta_desc} />
                <meta name="keywords" content={meta_keywords} />
                <meta name="robots" content="INDEX,FOLLOW" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content={meta_title} />
                <meta property="og:description"  content={meta_desc} />
                <meta property="og:type" content={ogType ? ogType : "website"} />
                <meta property="og:url" content={ogUrl ? ogUrl : process.env.SITE_URL}/>
                <meta property="og:image" content={ogImage ? ogImage : process.env.SITE_URL + "/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg" } />

                <link rel="icon" type="image/x-icon" href={ process.env.SITE_URL +"/images/logos/rg/icons/ResumeGuru_Icon_ResumeGuru_Icon-04.svg"} />
                {structuredData && (
                    <script
                        key="structured-data"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}


            </Head>
            {/*<GoogleTagManager gtmId={gtag.GTM_ID} />*/}
            {user.profile && user.profile.userId ? (
            <div>

                {/* Static sidebar for Mobile */}
                <SidebarMobile sideBarOpen={mobileSidebarOpen} sideBarClose={(msg)=>{setMobileSidebarOpen(msg)}}/>

                {/*/!* Static sidebar for desktop *!/*/}
                <SidebarDesktop  />


                <div className="lg:pl-60 md:pl-50">

                    <div className="sticky top-0 z-40 w-auto lg:mx-auto lg:max-w-full lg:px-0">
                        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                onClick={() => setMobileSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>


                            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

                                <div className="relative flex flex-1"></div>
                                <div className="flex items-center gap-x-4 lg:gap-x-6">

                                    <Menu as="div" className="relative p-2" >
                                        <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                            <span className="sr-only">Open user menu</span>
                                            {user.profile && user.profile.firstName ? (
                                                <Image
                                                    className="h-8 w-8 rounded-full"
                                                    src={userImage.imageUrl}
                                                    width="32"
                                                    height="32"
                                                    alt={userImage.imageAlt} />
                                            ) : (
                                                <UserCircleIcon
                                                    className="h-8 w-8 rounded-full text-gray-500"

                                                />
                                            )}
                                            <span className="hidden lg:flex lg:items-center">
                        <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                            {user.profile.firstName} {user.profile.lastName}
                        </span>
                        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            <a
                                                                href={item.href}
                                                                className={classNames(
                                                                    active ? 'bg-gray-50' : '',
                                                                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                                <div
                                                    onClick={async ()=>{

                                                        logout();
                                                    }}
                                                    className="cursor-pointer block px-3 py-1 text-sm leading-6 text-gray-900">
                                                    Sign out
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="py-2">
                        <div className="mx-auto max-w-full px-2 sm:px-1 lg:px-4">{children}</div>
                    </main>


                </div>
            </div>
                ):(
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="sr-only">
                            Loading user Dashboard section...
                        </h1>
                        <div role="status">
                            <svg aria-hidden="true"
                                 className="w-20 h-20 mx-auto animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
                                 viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <h2 className="p-5">Loading user dashboard...</h2>
                            <a href={process.env.SITE_URL} className="text-blue-500 cursor-pointer">Back to Home</a>
                        </div>
                    </div>
                </div>


            )}



        </>
    );
};
export default UserDashboardCommonLayout;
