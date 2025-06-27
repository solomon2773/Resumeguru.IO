import Image from 'next/image'

import { Button } from '../Button'
import { Container } from '../Container'
import logoTesla from '../../../public/images/logos/tesla-icon.svg'
import logoDisney from '../../../public/images/logos/disney-ar21.svg'
import logoSiemens from '../../../public/images/logos/siemens-ar21.svg'
import logoPfizer from '../../../public/images/logos/pfizer-wordmark-1.svg'
import logoSalesforce from '../../../public/images/logos/salesforce-ar21.svg'
import logoIbm from '../../../public/images/logos/ibmicon.svg'
import logoMicrosoft from '../../../public/images/logos/microsoft-ar21.svg'

export function Hero() {
  return (
    <Container className="pb-6 pt-6 text-center lg:pt-20">
      <h1 className="mx-auto max-w-7xl font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
        Let AI {' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">super charge</span>
        </span>{' '}
        your resume.
      </h1>
      <h2 className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          Many job applications don't make it past automated screening processes. Our service, ResumeGuru, ensures your application stands out, helping you bypass the bots to secure your ideal role. We offer personalized resume optimization tailored to each job description, strategic advice for engaging with recruiters, and comprehensive interview preparation. With ResumeGuru.IO, land your dream job easily.
      </h2>
      <div className="mt-10 flex justify-center gap-x-6">
        <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Start for free</a>
        {/*<Button*/}
        {/*  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"*/}
        {/*  variant="outline"*/}
        {/*>*/}
        {/*  <svg*/}
        {/*    aria-hidden="true"*/}
        {/*    className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"*/}
        {/*  >*/}
        {/*    <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />*/}
        {/*  </svg>*/}
        {/*  <span className="ml-3">Watch video</span>*/}
        {/*</Button>*/}
      </div>

        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-zendesk"*/}

        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-drupal"*/}


        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-mozilla"*/}


        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-novartis"*/}
        {/*                 aria-hidden="true">*/}
        {/*                <use className="c-sprite-icon__use"*/}
        {/*                     href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-novartis"></use>*/}
        {/*            </svg>*/}
        {/*            <svg className="c-sprite-icon c-sprite-icon--partner-elsevier b-partners__slide"*/}
        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-elsevier"*/}
        {/*                 aria-hidden="true">*/}
        {/*                <use className="c-sprite-icon__use"*/}
        {/*                     href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-elsevier"></use>*/}
        {/*            </svg>*/}
        {/*            <svg className="c-sprite-icon c-sprite-icon--partner-tata b-partners__slide"*/}
        {/*                 data-sprite-icon-href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-tata"*/}
        {/*                 aria-hidden="true">*/}
        {/*                <use className="c-sprite-icon__use"*/}
        {/*                     href="/assets/images/sprite/partners/svg-symbols-5d4b85d124.svg#partner-tata"></use>*/}
        {/*            </svg>*/}

      <div className="mt-16 lg:mt-10">

          {/*<img*/}
          {/*  className="rounded-lg"*/}
          {/*   src={process.env.SITE_URL+"/images/pages/resume_create_simple.jpg"} alt="Generate AI help you to upscale your resume"*/}
          {/*/>*/}
          <h2 className="font-display text-2xl text-slate-900">
              Upgrade Your Resume with Advanced AI and Hired by Top Companies
          </h2>

        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
        >
          {[
            [
              { name: 'Tesla', logo: logoTesla , },
              { name: 'Siemens', logo: logoSiemens },
              { name: 'Disney', logo: logoDisney },
                {name: 'Microsoft', logo: logoMicrosoft},
            ],
            [
              { name: 'Pfizer', logo: logoPfizer },
              { name: 'IBM', logo: logoIbm },
              { name: 'Salesforce', logo: logoSalesforce },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul
                role="list"
                className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
              >
                {group.map((company) => (
                  <li key={company.name} className="flex">
                    <Image src={company.logo} alt={company.name + " icon."} unoptimized />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
