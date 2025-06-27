import { Head, Html, Main, NextScript } from 'next/document'
//import PrelineScript from '@/components/PrelineScript';
import Script from 'next/script'
import * as gtag from "../helpers/gtm/gtm";
import React from "react";

export default function Document() {
  return (
    <Html className="scroll-smooth bg-white antialiased" lang="en">
      <Head>

          {/*<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />*/}
          <link rel="icon" type="image/x-icon" href={"https://resumeguru.io/images/logos/rg/icons/ResumeGuru_Icon_ResumeGuru_Icon-04.svg"} sizes="any" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />


          <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`} async defer/>

          {/*GTM*/}
          <script
              dangerouslySetInnerHTML={{
                  __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtag.GTM_ID}');
            `,
              }}
          />


          {/*<Script strategy="lazyOnload" src="../../node_modules/preline/dist/preline.js"></Script>*/}


      </Head>
      <body>
      {/*GTM*/}
      <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtag.GTM_ID}`}
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
            />
      </noscript>
      {/*<noscript*/}
      {/*    dangerouslySetInnerHTML={{*/}
      {/*        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtag.GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;" />`,*/}
      {/*    }}*/}
      {/*/>*/}
        <Main />
        <NextScript />
        {/*<PrelineScript />*/}
        {/*<Script src="https://cdn.jsdelivr.net/npm/flowbite@latest/dist/flowbite.min.js"></Script>*/}

      </body>
    </Html>
  )
}
