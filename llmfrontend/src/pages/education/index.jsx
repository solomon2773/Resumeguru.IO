import CommonLayout from "../../components/Layout/MainLayout";
import {HeroEducation} from '../../components/heroSections/HeroEducation'
// import { Introduction } from '../components/Introduction'
// import { Testimonials } from '../components/testimonialsSection/Testimonials'
// import { PrimaryFeatures } from '../components/featureSection/PrimaryFeatures'
// import { CallToAction } from '../components/callToAction/CallToAction'
// import {Pricing_V2} from "../components/Pricing/Pricing_v2";
// import { SecondaryFeatures } from '../components/featureSection/SecondaryFeatures'
// import {Faqs_v1} from "../components/Faqs/Faqs_v1";
// import {websiteFAQs} from "../utils/staticObjects/sections/faqs/frontEndIndexPage";
// import Image from 'next/image';


export default function Education() {


  return (
    <>
        <CommonLayout
            parent="home"
            title="Train Smarter, Succeed Faster AI-Powered Career Advancement"
            meta_title="Train Smarter, Succeed Faster AI-Powered Career Advancement"
            meta_desc="Designed for Schools, Built for Students. Smarter interview training for students, effortless career coaching for schools."
            ogType={"website"}
            ogUrl={process.env.SITE_URL}
            ogImage={process.env.SEO_DEFAULT_OG_IMAGE}

        >


            <HeroEducation />
            {/*<PrimaryFeatures />*/}
            {/*<Introduction />*/}
            {/*<SecondaryFeatures />*/}
            {/*<CallToAction />*/}
            {/*<Testimonials />*/}
            {/*<Pricing_V2 />*/}
            {/*<Faqs_v1 faq_questions={websiteFAQs} />*/}



        </CommonLayout>
    </>
  )
}

