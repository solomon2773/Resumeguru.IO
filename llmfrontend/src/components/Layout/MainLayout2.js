import React, {useEffect, useState} from "react";
import Head from 'next/head'
// import favicon from "../../public/assets/images/favicon/Barrington-B-favicon-navy_1.png";
import ScrollToTopBtn from "../Header/ScrollToTop";
// import Footer from '../Footer/Footer'
// import NavBar from '../Header/NavBar'
// import FeedbackPopupModal from "../../components/feedback/feedbackPopupModal";
import {BannerDiscount} from "../banners/Banner";
import Image from "next/image";
// import { GoogleTagManager } from '@next/third-parties/google'
import * as gtag from "../../helpers/gtm/gtm";

const CommonLayout2 = ({ children, title, parent, subTitle, urlPath, meta_title, meta_keywords, meta_desc, mainMenu, ogType, ogUrl, ogImage, structuredData }) => {
    return (
        <>
            <Head>
                <title>{meta_title ? meta_title : title}</title>
                <meta charSet="utf-8"/>
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

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preconnect"
                    href="https://cdn.fontshare.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700&display=swap"
                />

            </Head>

            {/*<GoogleTagManager gtmId={gtag.GTM_ID} />*/}
            <>{children}</>

            <div
                className="mt-2 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
                <div className="flex space-x-6 md:order-2">
                    <div className="justify-center">

                        <a href="https://www.linkedin.com/company/resumeguruio" className="text-gray-500 hover:text-gray-400">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.226.792 24 1.771 24h20.451C23.206 24 24 23.226 24 22.271V1.729C24 .774 23.206 0 22.225 0zM7.119 20.452H3.563V9h3.556v11.452zM5.341 7.433c-1.144 0-2.07-.928-2.07-2.07 0-1.142.926-2.07 2.07-2.07s2.07.928 2.07 2.07c0 1.142-.926 2.07-2.07 2.07zm15.112 13.019h-3.556v-5.569c0-1.328-.027-3.038-1.849-3.038-1.852 0-2.135 1.448-2.135 2.944v5.663H9.368V9h3.414v1.561h.048c.476-.9 1.637-1.849 3.369-1.849 3.599 0 4.265 2.367 4.265 5.448v6.291z"/>
                            </svg>


                        </a>
                        {/*<a href="https://www.facebook.com/Resumeguru.IO" className="text-gray-500 hover:text-gray-400">*/}
                        {/*    <span class="sr-only">Facebook</span>*/}
                        {/*    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
                        {/*        <path fillRule="evenodd"*/}
                        {/*              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                        {/*              clipRule="evenodd"/>*/}
                        {/*    </svg>*/}
                        {/*</a>*/}
                        <a href="https://www.instagram.com/resumeguru.io/" className="text-gray-500 hover:text-gray-400">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                      clipRule="evenodd"/>
                            </svg>
                        </a>

                        {/*<a href="#" className="text-gray-500 hover:text-gray-400">*/}
                        {/*    <span class="sr-only">X</span>*/}
                        {/*    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
                        {/*        <path*/}
                        {/*            d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z"/>*/}
                        {/*    </svg>*/}
                        {/*</a>*/}
                        {/*<a href="#" className="text-gray-500 hover:text-gray-400">*/}
                        {/*    <span class="sr-only">GitHub</span>*/}
                        {/*    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
                        {/*        <path fillRule="evenodd"*/}
                        {/*              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                        {/*              clipRule="evenodd"/>*/}
                        {/*    </svg>*/}
                        {/*</a>*/}
                        {/*<a href="#" className="text-gray-500 hover:text-gray-400">*/}
                        {/*    <span class="sr-only">YouTube</span>*/}
                        {/*    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
                        {/*        <path fillRule="evenodd"*/}
                        {/*              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"*/}
                        {/*              clipRule="evenodd"/>*/}
                        {/*    </svg>*/}
                        {/*</a>*/}
                    </div>


                    <div className="justify-center">
                        <p>
                           <a href={process.env.SITE_URL+"/contact-us"}>Contact us</a>
                        </p>
                        <p>
                            <a href={process.env.SITE_URL+"/privacy"}>Privacy Policy</a>
                        </p>
                        <p>
                            <a href={process.env.SITE_URL+"/termsofservice"}>Terms of Service</a>
                        </p>
                    </div>

                </div>
                <p className="mt-0 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
                    <Image
                        width="256"
                        height="256"
                        src={process.env.SITE_URL+"/images/partnerbadges/MS_Startups_Celebration_Badge_Light.png"} alt="ResumeGuru is a proud member of the Microsoft for Startups Founders Hub." unoptimized
                    />
                    ResumeGuru is a proud member of the Microsoft for Startups Founders Hub.
                    &copy; {new Date().getFullYear()} ResumeGuru, a ST TECHNOLOGY LLC company. All rights reserved.
                </p>
            </div>


        </>
    );
};
export default CommonLayout2;


