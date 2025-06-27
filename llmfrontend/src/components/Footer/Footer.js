import React, {useRef} from "react";
import {toast} from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import {useSelector} from "react-redux";



const Footer = () =>{

    const user = useSelector((state) => state.user.profile);
    const emailRef = useRef();
    const subscribeClick = async (event) => {
        event.preventDefault();
        const email = emailRef.current.value;

        if (!email) {
            toast.error("Please enter your email", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        const response = await fetch(process.env.SITE_URL+"/api/blog/subscribe", {
            method: 'POST',
            body: JSON.stringify({email: email}),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
            }
        });
        const data = await response.json();

        if (data.status){
            emailRef.current.value = "";
            toast.success("newsletter subscribe success !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }   else {
            toast.error("newsletter subscribe error ! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }


    }
   // console.log(user)
    const navigation = {
        account: [
            { name: user && user.userId ? 'Dashboard' : 'Sign Up', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard' : process.env.SITE_URL+'/freecredit/startfree' },
            { name: 'Mock Interview', href: user && user.userId ? process.env.SITE_URL+'/mockInterview' : process.env.SITE_URL+'/mockInterview' },
            { name: 'My Resumes', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard/myResume' : process.env.SITE_URL+'/user/createMyResume' },
            { name: 'My Cover Letter', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard/myCoverLetter' : process.env.SITE_URL+'/user/aiResumeCoverLetter'},
            { name: 'Connection Message', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard/linkedInMessage' : process.env.SITE_URL+'/freecredit/startfree'},
            { name: 'Interview Questions', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard/interviewQuestion' : process.env.SITE_URL+'/freecredit/startfree'},
            { name: 'My Documents', href: user && user.userId ? process.env.SITE_URL+'/user/dashboard/myDocument' : process.env.SITE_URL+'/freecredit/startfree'},

        ],
        support: [
            { name: 'Blog', href: process.env.SITE_URL+'/blog' },
            { name: 'Faq', href: process.env.SITE_URL+'/blog/tag/faq/' },
            { name: 'News', href: process.env.SITE_URL+'/blog/tag/news/' },
            { name: 'Contact Us', href: process.env.SITE_URL+'/contact-us' },
        ],


        social: [
            // {
            //     name: 'Facebook',
            //     href: 'https://www.facebook.com/#/',
            //     icon: (props) => (
            //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            //             <path
            //                 fillRule="evenodd"
            //                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            //                 clipRule="evenodd"
            //             />
            //         </svg>
            //     ),
            // },
            {
                name: 'Instagram',
                href: 'https://www.instagram.com/resumeguru.io/',
                icon: (props) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
            {
                name: 'LinkedIn',
                href: 'https://www.linkedin.com/company/resumeguruio',
                icon: (props) => (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.226.792 24 1.771 24h20.451C23.206 24 24 23.226 24 22.271V1.729C24 .774 23.206 0 22.225 0zM7.119 20.452H3.563V9h3.556v11.452zM5.341 7.433c-1.144 0-2.07-.928-2.07-2.07 0-1.142.926-2.07 2.07-2.07s2.07.928 2.07 2.07c0 1.142-.926 2.07-2.07 2.07zm15.112 13.019h-3.556v-5.569c0-1.328-.027-3.038-1.849-3.038-1.852 0-2.135 1.448-2.135 2.944v5.663H9.368V9h3.414v1.561h.048c.476-.9 1.637-1.849 3.369-1.849 3.599 0 4.265 2.367 4.265 5.448v6.291z"/>
                    </svg>
                ),
            },
                // {
                //     name: 'Twitter',
                //     href: 'https://twitter.com/#',
                //     icon: (props) => (
                //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                //             <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                //         </svg>
                //     ),
                // },
            // {
            //     name: 'Discord',
            //     href: 'https://discord.gg/CDBPrM5Dk6',
            //     icon: (props) => (
            //         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
            //             <path fillRule="evenodd" d="M20.317 4.4921C18.7873 3.80147 17.147 3.29265 15.4319 3.00122C15.4007 2.9956 15.3695 3.00965 15.3534 3.03777C15.1424 3.40697 14.9087 3.88862 14.7451 4.26719C12.9004 3.99545 11.0652 3.99545 9.25832 4.26719C9.09465 3.8802 8.85248 3.40697 8.64057 3.03777C8.62449 3.01059 8.59328 2.99654 8.56205 3.00122C6.84791 3.29172 5.20756 3.80054 3.67693 4.4921C3.66368 4.49772 3.65233 4.5071 3.64479 4.51928C0.533392 9.09311 -0.31895 13.5545 0.0991801 17.9606C0.101072 17.9822 0.11337 18.0028 0.130398 18.0159C2.18321 19.4993 4.17171 20.3998 6.12328 20.9967C6.15451 21.0061 6.18761 20.9949 6.20748 20.9695C6.66913 20.3492 7.08064 19.6952 7.43348 19.0073C7.4543 18.967 7.43442 18.9192 7.39186 18.9033C6.73913 18.6597 6.1176 18.3626 5.51973 18.0253C5.47244 17.9981 5.46865 17.9316 5.51216 17.8997C5.63797 17.8069 5.76382 17.7104 5.88396 17.613C5.90569 17.5952 5.93598 17.5914 5.96153 17.6026C9.88928 19.3672 14.1415 19.3672 18.023 17.6026C18.0485 17.5905 18.0788 17.5942 18.1015 17.612C18.2216 17.7095 18.3475 17.8069 18.4742 17.8997C18.5177 17.9316 18.5149 17.9981 18.4676 18.0253C17.8697 18.3692 17.2482 18.6597 16.5945 18.9024C16.552 18.9183 16.533 18.967 16.5538 19.0073C16.9143 19.6942 17.3258 20.3483 17.7789 20.9686C17.7978 20.9949 17.8319 21.0061 17.8631 20.9967C19.8241 20.3998 21.8126 19.4993 23.8654 18.0159C23.8834 18.0028 23.8948 17.9831 23.8967 17.9616C24.3971 12.8676 23.0585 8.4428 20.3482 4.52021C20.3416 4.5071 20.3303 4.49772 20.317 4.4921ZM8.02002 15.2778C6.8375 15.2778 5.86313 14.2095 5.86313 12.8976C5.86313 11.5857 6.8186 10.5175 8.02002 10.5175C9.23087 10.5175 10.1958 11.5951 10.1769 12.8976C10.1769 14.2095 9.22141 15.2778 8.02002 15.2778ZM15.9947 15.2778C14.8123 15.2778 13.8379 14.2095 13.8379 12.8976C13.8379 11.5857 14.7933 10.5175 15.9947 10.5175C17.2056 10.5175 18.1705 11.5951 18.1516 12.8976C18.1516 14.2095 17.2056 15.2778 15.9947 15.2778Z" />
            //         </svg>
            //     ),
            // },

            // {
            //     name: 'YouTube',
            //     href: '#',
            //     icon: (props) => (
            //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            //             <path
            //                 fillRule="evenodd"
            //                 d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            //                 clipRule="evenodd"
            //             />
            //         </svg>
            //     ),
            // },
        ],
    }

    return (
        <footer className="bg-white pt-0" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-6 pt-20 sm:pt-6 lg:px-3 lg:pt-6">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">Account</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.account.map((item) => (
                                        <li key={item.name}>
                                            <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">AI Tools</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li >
                                        <Link href={process.env.SITE_URL+"/jobs/search"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            AI Job Search
                                        </Link>
                                    </li>
                                    <li >
                                        <Link href={process.env.SITE_URL+"/user/aiTargetResume"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            AI Target Resume
                                        </Link>
                                    </li>
                                    <li >
                                        <Link href={process.env.SITE_URL+"/user/aiResumeCoverLetter"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            AI Cover Letter
                                        </Link>
                                    </li>
                                    <li >
                                        <Link href={process.env.SITE_URL+"/user/aiJdExtractor"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            AI JD Extractor
                                        </Link>
                                    </li>
                                    <li >
                                        <Link href={process.env.SITE_URL+"/user/interviewQuestions"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            Interview Preparation
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">Policies</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                        <li >
                                            <Link href={process.env.SITE_URL+"/privacy"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                                Privacy Policy
                                            </Link>
                                        </li>
                                    <li >
                                        <Link href={process.env.SITE_URL+"/termsofservice"} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            Terms of Service
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 xl:mt-0">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">Subscribe to our newsletter</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            The latest news, articles, and resources, sent to your inbox weekly.
                        </p>
                        <form className="mt-6 sm:flex sm:max-w-md">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                autoComplete="email"
                                ref={emailRef}
                                required
                                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                                placeholder="Enter your email"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                                <button
                                    onClick={subscribeClick}
                                    type="submit"
                                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-12">
                    <div className="flex space-x-6 md:order-2">
                        {navigation.social.map((item) => (
                            <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" aria-hidden="true" />
                            </a>
                        ))}
                    </div>

                    <p className="mt-0 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
                        <Image
                            width="256"
                            height="256"
                            src={process.env.SITE_URL+"/images/partnerbadges/MS_Startups_Celebration_Badge_Light.png"} alt="ResumeGuru is a proud member of the Microsoft for Startups Founders Hub." unoptimized
                        />
                        ResumeGuru is a proud member of the Microsoft for Startups Founders Hub.
                        &copy; {new Date().getFullYear()} ResumeGuru, a ST TECHNOLOGY LLC company. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    )
}

export default Footer;
