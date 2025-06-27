import Link from 'next/link'

import { CheckIcon } from '../CheckIcon'
import { Container } from '../Container'

export function IntroductionMarketing1() {
  const features = [
    {
      "title":"Personalized Career Support",
      "description":"Get tailored guidance on creating a resume and preparing\n" +
          "for interviews to stand out in today’s competitive job market."
    },
    {
        "title":"Improved Job Application Success",
        "description":"Utilize AI tools to enhance your resume and cover\n" +
            "letter, boosting your chances of landing interviews."
    },
    {
      "title":"Confidence in Interviews",
      "description":"Gain confidence through AI-powered mock interviews with\n" +
          "real-time feedback and suggestions."
    },
    {
      "title":"Faster Job Placement",
      "description":"Experience a shorter job search period with advanced tools that\n" +
          "streamline the application process."
    },
  ]
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-10 pt-10 sm:pb-10 md:pt-16 lg:py-16"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        {/*  */}

        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          Unlock Your Career Potential
        </p>
          {/*<p className="mt-4">*/}
          {/*Leverage the precision of AI to tailor your resume perfectly to your dream job! Our system efficiently scans and comprehends online job descriptions, aligning your resume's content to the specific requirements and preferences of potential employers. Watch your employability quotient rise as our algorithm emphasizes your most relevant experiences, skills, and qualifications. Here&#39;s what our service offers:       */}
          {/*</p>*/}



        <ul role="list" className="mt-8 space-y-3">
          {features.map((feature, featureIndex) => (
            <li key={"feature-"+featureIndex} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <div className="ml-4 "><span className="font-bold">{feature.title} : </span> {feature.description}</div>

            </li>
          ))}
        </ul>
        {/*<p className="mt-8">*/}
        {/*  By the end of the book, you’ll have all the confidence you need to dig*/}
        {/*  in and start creating beautiful icons that can hold their own against*/}
        {/*  any of the sets you can find online.*/}
        {/*</p>*/}
        {/*<p className="mt-10">*/}
        {/*  <Link*/}
        {/*    href="#free-chapters"*/}
        {/*    className="text-base font-medium text-blue-600 hover:text-blue-800"*/}
        {/*  >*/}
        {/*    Get two free chapters straight to your inbox{' '}*/}
        {/*    <span aria-hidden="true">&rarr;</span>*/}
        {/*  </Link>*/}
        {/*</p>*/}
      </Container>
    </section>
  )
}
