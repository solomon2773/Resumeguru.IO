import CommonLayout from "../components/Layout/MainLayout";
import Link from "next/link";
const faqs = [
    {
        "id":1,
        "question": "What is AI-driven resume enhancement?",
        "answer": "It's a service where artificial intelligence is used to optimize your resume based on specific job descriptions or industry standards, ensuring it stands out to potential employers and passes through Application Tracking Systems (ATS)."
    },
    {
        "id": 2,
        "question": "How secure is my personal information when I upload my resume?",
        "answer": "We prioritize your privacy. All resumes uploaded are processed in real-time and are not stored beyond your session. Our platform uses advanced encryption to ensure data security."
    },
    {
        "id":3,
        "question": "Will the AI edit the visual design of my resume?",
        "answer": "Our primary focus is content optimization to match job descriptions. However, we offer suggestions on presentation and layout that you can implement for a visually appealing resume."
    },
    {
        "id": 4,
        "question": "Can I customize the changes the AI suggests?",
        "answer": "Absolutely! Our AI provides recommendations, but you have complete control over which suggestions to accept or modify, ensuring your resume remains authentic to your experiences."
    },
    {
        "id":5,
        "question": "How do I know the AI's suggestions are accurate?",
        "answer": "Our AI is trained on vast datasets of successful resumes and job descriptions across industries. While it offers data-driven suggestions, it's essential to review its recommendations to ensure they align with your personal career journey."
    },
    {
        "id":6,
        "question": "How does the AI handle industry-specific jargon or terms?",
        "answer": "Our AI is designed to recognize and understand industry-specific terminology. It ensures that relevant jargon is highlighted or recommended based on the job description provided."
    },



]

const FAQ = () =>{
    return (
        <CommonLayout parent="home"
                      title="Resume Guru - Login"
                      meta_title={process.env.SEO_DEFAULT_TITLE}
                      meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >
        <div className="bg-white">
            <div className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
                <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600">
                    Have a different question and can’t find the answer you’re looking for? Reach out to our support team by{' '}
                    <Link href={process.env.SITE_URL+"/contact-us"} className="font-semibold text-indigo-600 hover:text-indigo-500">
                        sending us an email or using our contact form
                    </Link>{' '}
                    and we’ll get back to you as soon as we can.
                </p>
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
                        {faqs.map((faq) => (
                            <div key={"faq_"+faq.id}>
                                <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
        </CommonLayout>
    )
}
export default FAQ
