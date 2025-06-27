import 'focus-visible'
import '../styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from '../context/AuthContext'
import { UserQuickCreateProvider} from '../context/UserQuickCreateContext'
// import { useApolloRealm } from '../helpers/apollo/apolloClient'
// import { ApolloProvider } from '@apollo/client';
import '../styles/global.css';
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Provider } from 'react-redux';
import store from '../store/store';
// import PrelineScript from "../components/PrelineScript";
import FeedbackPopupModal from "../components/feedback/feedbackPopupModal";

import React from 'react';
import * as gtag from "../helpers/gtm/gtm";
import {GTM_ID} from "../helpers/gtm/gtm";

const App = ({ Component, pageProps }) =>{

    // const apolloClientRealm = useApolloRealm(pageProps)

    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

  return (
      <>
          <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA4_TRACKING_ID}`}
              strategy="afterInteractive"
          />
          <Script
              id='google-analytics'
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                  __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtag.GA4_TRACKING_ID}', {
                            page_path: window.location.pathname,
                        });
                        `,
              }}
          />

          {/*GTM*/}
      {/*    <Script id="google-tag-manager" strategy="">*/}
      {/*        {`*/}
      {/*  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':*/}
      {/*  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],*/}
      {/*  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=*/}
      {/*  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);*/}
      {/*  })(window,document,'script','dataLayer',${gtag.GTM_ID});*/}
      {/*`}*/}
      {/*    </Script>*/}


          {/*<Script*/}
          {/*    id="Adsense-id"*/}
          {/*    data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}*/}
          {/*    async="true"*/}
          {/*    strategy="beforeInteractive"*/}
          {/*    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"*/}
          {/*/>*/}
          {/*<PrelineScript />*/}
          <Provider store={store}>
          <AuthProvider>

              {/*<ApolloProvider client={apolloClientRealm}>*/}
                  <UserQuickCreateProvider>


                          <Component {...pageProps} />
                      <div className="fixed bottom-0 left-0 mb-2 ml-2 p-1 " style={{   "zIndex": "100"}}>
                      <FeedbackPopupModal/>
                      </div>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                  </UserQuickCreateProvider>
              {/*</ApolloProvider>*/}

            </AuthProvider>
        </Provider>
      </>



  )
}
export default App;
