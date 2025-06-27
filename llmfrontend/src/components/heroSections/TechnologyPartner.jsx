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

export function TechnologyPartner() {
  return (
    <Container className="pb-6 pt-6 text-center lg:pt-20">


      <div className="mt-16 lg:mt-10">

          {/*<img*/}
          {/*  className="rounded-lg"*/}
          {/*   src={process.env.SITE_URL+"/images/pages/resume_create_simple.jpg"} alt="Generate AI help you to upscale your resume"*/}
          {/*/>*/}
          <h2 className="font-display text-2xl text-slate-900">
              Boost Your Career with AI-Powered Mock Interviews, Expert Resume Building and get Hired by Top Companies
          </h2>

          <ul
              role="list"
              className="mt-8 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
          >
              {[
                  [
                      { name: 'Tesla', logo: logoTesla },
                      { name: 'Siemens', logo: logoSiemens },
                      { name: 'Disney', logo: logoDisney },
                      { name: 'Microsoft', logo: logoMicrosoft },
                      { name: 'Pfizer', logo: logoPfizer },
                      { name: 'IBM', logo: logoIbm },
                      { name: 'Salesforce', logo: logoSalesforce },
                  ],
              ].map((group, groupIndex) => (
                  <li key={groupIndex}>
                      <ul
                          role="list"
                          className="grid grid-cols-5 gap-y-8 gap-x-8 sm:grid-cols-4 sm:gap-y-8 xl:grid-cols-8 xl:gap-x-12 "
                      >
                          {group.map((company) => (
                              <li key={company.name} className="flex justify-center">
                                  <Image src={company.logo} alt={`${company.name} icon`} unoptimized />
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
