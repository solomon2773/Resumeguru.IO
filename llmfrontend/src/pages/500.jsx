import CommonLayout from "../components/Layout/MainLayout";
import * as Sentry from "@sentry/nextjs";
import CustomError from "./_error";

export default function Custom500() {
  return (
    <>
        <CommonLayout
            parent="home"
            title="ResumeGuru - 500 Internal Server Error"
            meta_title="ResumeGuru - 500 Internal Server Error"
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >


            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600">500</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Internal Server Error</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600"> Sorry, an internal server error occurred.
                        </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href={process.env.SITE_URL}
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Go back home
                        </a>
                        <a href={process.env.SITE_URL+"/contact-us/"} className="text-sm font-semibold text-gray-900">
                            Contact support <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>


        </CommonLayout>
    </>
  )
}

// Custom500.getInitialProps =  async (contextData) => {
//     const { res, err } = contextData;
//     const errorReference = Date.now().toString()+"-"+ Math.floor(Math.random() * 100000);
//     await Sentry.captureUnderscoreErrorException(contextData);
//     await Sentry.captureMessage("errorReference : "+errorReference);
//     const statusCode =  err ? err.statusCode : 404;
//     const errorMessage = err ? err.message : 'An unexpected error occurred';
//
//     return { statusCode, errorMessage, errorReference };
//
// };
