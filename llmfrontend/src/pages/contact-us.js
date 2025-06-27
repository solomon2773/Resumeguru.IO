import {useRef} from "react";
import CommonLayout from "../components/Layout/MainLayout";
import {toast} from "react-toastify";
// import emailjs from '@emailjs/browser';


const ContactUs = () => {
    const firstName = useRef();
    const lastName = useRef();
    const email = useRef();
    const phone = useRef();
    const message = useRef();
    const company = useRef();
    async function sendMail(submitData) {
        const emailData = {
            to: 'info@resumeguru.io',
            from: 'info@resumeguru.io',
            subject: 'Contact Us Form',
            submitData,
        };

        const response = await fetch('/api/mail/contactUs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
            },
            body: JSON.stringify(emailData),
        });

        const data = await response.json();
        if (data.status){
            toast.success("Thank you for your message! We will get back to you shortly. ");

        } else {
            toast.error("Oops! Something went wrong. Please try again later. ");
        }

        firstName.current.value = "";
                lastName.current.value = "";
                email.current.value = "";
                phone.current.value = "";
                message.current.value = "";
                company.current.value = "";

    }



    const handleSubmit = (e) => {
        e.preventDefault();
        const emailCurrentValue = email.current.value;
        const firstNameCurrentValue = firstName.current.value;
        const lastNameCurrentValue = lastName.current.value;
        const phoneCurrentValue = phone.current.value;
        const messageCurrentValue = message.current.value;
        const companyCurrentValueReEnter = company.current.value;

        const submitData = {
            firstName: firstNameCurrentValue,
            lastName: lastNameCurrentValue,
            email: emailCurrentValue,
            phone: phoneCurrentValue,
            message: messageCurrentValue,
            company: companyCurrentValueReEnter,
        }
        if (firstNameCurrentValue === ""){

            toast.error("First Name is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        } else if (lastNameCurrentValue === ""){
            toast.error("Last Name is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        } else if (emailCurrentValue === ""){
            toast.error("Email is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }else if (messageCurrentValue === ""){
            toast.error("Message is required! ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        var regex = /^[a-zA-Z0-9 ]+$/; // Regular expression to match only alphanumeric characters
        var regexPhone = /^\d{10}$/; // Regular expression to match 10-digit phone numbers
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression to match email addresses

        if (!regex.test(firstNameCurrentValue)) {
            toast.error("Invalid input for First Name. Only alphanumeric characters are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else if (!regex.test(lastNameCurrentValue)) {
            toast.error("Invalid input for Last Name. Only alphanumeric characters are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else if (companyCurrentValueReEnter && !regex.test(companyCurrentValueReEnter)) {
            toast.error("Invalid input for Company. Only alphanumeric characters are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else if (!regex.test(messageCurrentValue)) {
            toast.error("Invalid input for Message. Only alphanumeric characters are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else if (phoneCurrentValue && !regexPhone.test(phoneCurrentValue)) {
            toast.error("Invalid input for Phone. Only 10-digit phone numbers are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else if (!regexEmail.test(emailCurrentValue)) {
            toast.error("Invalid input for Email. Only email addresses are allowed. ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        } else {

            sendMail(submitData);
          }

    }
    return (
        <CommonLayout parent="home"
                      title="ResumeGuru.IO - Contact Us"
                      meta_title={process.env.SEO_DEFAULT_TITLE}
                      meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
                      meta_keywords={process.env.SEO_DEFAULT_KEYWORDS}

                      ogUrl="https://resumeguru.io/contact-us"
                      ogImage={`${process.env.NEXT_PUBLIC_CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/images/pages/photo-1559136555-9303baea8ebd.jpeg`}
                      ogImageAlt="ResumeGuru.IO - Contact Us"
                      ogType={"website"}
        >

        <div className="relative bg-white" aria-label="ResumeGuru.IO - Contact Us">
            <div className="lg:absolute lg:inset-0 lg:left-1/2">
                <img
                    className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
                    src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/images/pages/photo-1559136555-9303baea8ebd.jpeg`}
                    alt="ResumeGuru.IO - let's work together"
                />
            </div>
            <h1 className="sr-only">ResumeGuru.IO Contact Us</h1>
            <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
                <div className="px-6 lg:px-8">
                    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Let&#39;s work together</h1>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Welcome to the ResumeGuru.io Contact Us page! We're delighted to have you here and eager to connect with you. Should you have any queries, feedback, or inquiries regarding our services, feel free to reach out to us. You can send an email to <a href="mailto:info@resumeguru.io">info@resumeguru.io</a> or simply fill out the contact form provided below. We will promptly respond to your message.

                        </p>
                        <p className="mt-2 text-lg leading-8 text-gray-600">

                            At ResumeGuru.io, we highly value your input and strive to ensure your utmost satisfaction with our resume creation services. Whether you seek further information about our cutting-edge technology, require assistance with a specific question, or simply wish to say hello, our dedicated team is here to support you. We appreciate your decision to choose ResumeGuru.io and eagerly anticipate hearing from you soon!
                        </p>
                        <form action="#" method="POST" className="mt-16">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                        First name *
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            ref={firstName}
                                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Last name *
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            ref={lastName}
                                            autoComplete="family-name"
                                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Email *
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            ref={email}
                                            autoComplete="email"
                                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="flex justify-between text-sm leading-6">
                                    <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Company
                                    </label>
                                    <p id="company-description" className="text-gray-600">
                                        Optional
                                    </p>
                                        </div>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="company"
                                            id="company"
                                            ref={company}
                                            autoComplete="organization"
                                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="flex justify-between text-sm leading-6">
                                        <label htmlFor="phone" className="block font-semibold text-gray-900">
                                            Phone
                                        </label>
                                        <p id="phone-description" className="text-gray-600">
                                            Optional
                                        </p>
                                    </div>
                                    <div className="mt-2.5">
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            ref={phone}
                                            autoComplete="tel"
                                            aria-describedby="phone-description"
                                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="flex justify-between text-sm leading-6">
                                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                            How can we help you? *
                                        </label>
                                        <p id="message-description" className="text-gray-600">
                                            Max 1000 characters
                                        </p>
                                    </div>
                                    <div className="mt-2.5">
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        maxLength={1000}
                        ref={message}
                        aria-describedby="message-description"
                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                    />
                                    </div>
                                </div>
                                {/*<fieldset className="sm:col-span-2">*/}
                                {/*    <legend className="block text-sm font-semibold leading-6 text-gray-900">Expected budget</legend>*/}
                                {/*    <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">*/}
                                {/*        <div className="flex gap-x-2.5">*/}
                                {/*            <input*/}
                                {/*                id="budget-under-25k"*/}
                                {/*                name="budget"*/}
                                {/*                defaultValue="under_25k"*/}
                                {/*                type="radio"*/}
                                {/*                className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-600"*/}
                                {/*            />*/}
                                {/*            <label htmlFor="budget-under-25k">Less than $25K</label>*/}
                                {/*        </div>*/}
                                {/*        <div className="flex gap-x-2.5">*/}
                                {/*            <input*/}
                                {/*                id="budget-25k-50k"*/}
                                {/*                name="budget"*/}
                                {/*                defaultValue="25k-50k"*/}
                                {/*                type="radio"*/}
                                {/*                className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-600"*/}
                                {/*            />*/}
                                {/*            <label htmlFor="budget-25k-50k">$25K – $50K</label>*/}
                                {/*        </div>*/}
                                {/*        <div className="flex gap-x-2.5">*/}
                                {/*            <input*/}
                                {/*                id="budget-50k-100k"*/}
                                {/*                name="budget"*/}
                                {/*                defaultValue="50k-100k"*/}
                                {/*                type="radio"*/}
                                {/*                className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-600"*/}
                                {/*            />*/}
                                {/*            <label htmlFor="budget-50k-100k">$50K – $100K</label>*/}
                                {/*        </div>*/}
                                {/*        <div className="flex gap-x-2.5">*/}
                                {/*            <input*/}
                                {/*                id="budget-over-100k"*/}
                                {/*                name="budget"*/}
                                {/*                defaultValue="over_100k"*/}
                                {/*                type="radio"*/}
                                {/*                className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-600"*/}
                                {/*            />*/}
                                {/*            <label htmlFor="budget-over-100k">$100K+</label>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</fieldset>*/}
                            </div>
                            <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                >
                                    Send message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </CommonLayout>
    )
}

export default ContactUs
