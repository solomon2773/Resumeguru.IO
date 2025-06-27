import Link from 'next/link'

import { CheckIcon } from './CheckIcon'
import { Container } from './Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-16 pt-20 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        {/*  */}

        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          Unlock Your Potential: AI-Driven Resume Enhancements for the Modern Job Seeker
        </p>
          <p className="mt-4">
          Leverage the precision of AI to tailor your resume perfectly to your dream job! Our system efficiently scans and comprehends online job descriptions, aligning your resume's content to the specific requirements and preferences of potential employers. Watch your employability quotient rise as our algorithm emphasizes your most relevant experiences, skills, and qualifications. Here&#39;s what our service offers:        </p>



        <ul role="list" className="mt-8 space-y-3">
          {[
            'The AI deeply evaluates the online job description to discern primary and secondary qualifications, desired soft and hard skills, as well as cultural and role-specific requirements.',
            'The AI aligns your skills with those specified in the job description, highlighting your most relevant competencies. Any missing skills are subtly indicated, offering you insights into potential areas for growth or learning.',
            'Our rewrite takes into consideration the Application Tracking Systems (ATS) that many employers use. By ensuring your resume is keyword-rich and structurally compliant, we elevate your chances of passing these electronic gatekeepers.',
            'The algorithm crafts a custom summary that integrates keywords from the job description, giving potential employers an instant snapshot of your suitability.',
            'As job market dynamics shift and new keywords or skills emerge in various industries, our AI system stays updated, ensuring your resume remains contemporary and competitive.',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4">{feature}</span>
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
