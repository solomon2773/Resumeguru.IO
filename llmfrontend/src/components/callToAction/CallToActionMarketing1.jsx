import Image from 'next/image'

import { Button } from '../Button'
import { Container } from '../Container'

export function CallToActionMarketing1() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={process.env.SITE_URL+"/images/background-call-to-action.jpg"}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          {/*<p className="mt-4 text-lg tracking-tight text-white">*/}
          {/*  Embark on your journey to career success with just a few clicks. Begin by creating your profile on our platform and let ResumeGuru elevate your job search. Don't wait for opportunities to come to you—seize them now with ResumeGuru and take the first step towards landing your dream job today.*/}
          {/*</p>*/}
          {/*<a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href={process.env.SITE_URL+"/freecredit/startfree"}>Get Started—It's free</a>*/}
          <Button href={process.env.SITE_URL+"/signup" } color="white" className="mt-10">
            Sign Up—It's free
          </Button>
        </div>
      </Container>
    </section>
  )
}
