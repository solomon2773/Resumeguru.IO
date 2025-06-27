import React, {useEffect, useState} from "react";
import Head from 'next/head'
// import favicon from "../../public/assets/images/favicon/Barrington-B-favicon-navy_1.png";
import ScrollToTopBtn from "../Header/ScrollToTop";
import Footer from '../Footer/Footer'
import NavBar from '../Header/NavBar'
// import FeedbackPopupModal from "../../components/feedback/feedbackPopupModal";

import * as gtag from "../../helpers/gtm/gtm";
// import { GoogleTagManager } from '@next/third-parties/google'

const CommonLayout = ({ children, title, parent, subTitle, urlPath, meta_title, meta_keywords, meta_desc, mainMenu, ogType, ogUrl, ogImage, structuredData }) => {
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
            {/*<BannerDiscount />*/}
            {/*<GoogleTagManager gtmId={gtag.GTM_ID} />*/}
            <NavBar  menu={mainMenu}/>

            <>{children}</>

            <Footer />
            {/*<div className="fixed bottom-0 left-0 mb-2 ml-2 p-1 ">*/}
            {/*    <FeedbackPopupModal />*/}
            {/*</div>*/}

            <ScrollToTopBtn />

        </>
    );
};
export default CommonLayout;


