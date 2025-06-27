import CommonLayout from "../components/Layout/MainLayout";
import { HeroMockInterviewV2 } from '../components/heroSections/HeroMockInterviewV2'
import { Introduction } from '../components/Introduction'
import { Testimonials } from '../components/testimonialsSection/Testimonials'
import { PrimaryFeatures } from '../components/featureSection/PrimaryFeatures'
import { CallToAction } from '../components/callToAction/CallToAction'

import { SecondaryFeatures } from '../components/featureSection/SecondaryFeatures'
import {Faqs_v1} from "../components/Faqs/Faqs_v1";
import {websiteFAQs} from "../utils/staticObjects/sections/faqs/frontEndIndexPage";
import Image from 'next/image';


export default function Home() {


  return (
    <>
        <CommonLayout
            parent="home"
            title="Enhance Your Interview Skills with AI-Powered Mock Interviews"
            meta_title="Enhance Your Interview Skills with AI-Powered Mock Interviews and Resume builder."
            meta_desc="Prepare for job interviews with our AI agent Hannah. Get real-time feedback on content, pronunciation, and performance. Start practicing today!"
            ogType={"website"}
            ogUrl={process.env.SITE_URL}
            ogImage={process.env.SEO_DEFAULT_OG_IMAGE}

        >


            <HeroMockInterviewV2 />
            <PrimaryFeatures />
            <Introduction />
            <SecondaryFeatures />
            <CallToAction />
            <Testimonials />
            <Faqs_v1 faq_questions={websiteFAQs} />



        </CommonLayout>
    </>
  )
}

