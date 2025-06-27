import CommonLayout2 from "../components/Layout/MainLayout2";
import React,{useRef, useState} from "react";
import { useRouter } from 'next/router'

import {HeroMockInterview} from "../components/heroSections/HeroMarketing1";
import {FeaturesMarketing1} from "../components/featureSection/FeaturesMarketing1";
import {IntroductionMarketing1} from "../components/introduction/IntroductionMarketing1";
// import {SecondaryFeatures} from "../components/SecondaryFeatures";
import {CallToActionMarketing1} from "../components/callToAction/CallToActionMarketing1";
import {TestimonialsMarketing1} from "../components/testimonialsSection/TestimonialsMarketing1";
import {TechnologyPartner} from "../components/heroSections/TechnologyPartner";
// import {Pricing_V2} from "../../components/Pricing/Pricing_v2";

export default function MarketingHome1() {
    const router = useRouter()


    return (



        <CommonLayout2
            parent="home"
            title="Resume Guru - Start your new career today!"
            meta_title="Resume Guru - Start your new career today!"
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >
            <div className="mx-auto mt-2 max-w-7xl justify-center ">

                <a href={process.env.SITE_URL}>
                    <img
                        className="block w-auto h-10 m-3"
                        src={process.env.SITE_URL+"/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
                        alt="ResumeGuru.IO Logo"
                    />
                </a>



            </div>

            <HeroMockInterview />
            <FeaturesMarketing1 />
            <TestimonialsMarketing1 />
            <IntroductionMarketing1 />
            <TechnologyPartner />
            <CallToActionMarketing1 />




        </CommonLayout2>

    )
}
