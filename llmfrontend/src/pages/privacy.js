import CommonLayout from "../components/Layout/MainLayout";
import Link from "next/link";


const Privacy = () =>{
    return (
        <CommonLayout parent="home"
                      title="ResumeGuru - Privacy Policy"
                      meta_title="ResumeGuru - Privacy Policy"
                      meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >
        <div className="bg-white">
            <div className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
                <h1 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Privacy Policy</h1>
                <div className="mt-6 text-base leading-7 text-gray-600">
                    <h3>
                        <p>
                            This Privacy Policy governs the manner in which ResumeGuru.IO collects, uses, maintains and discloses information collected from users (each, a &quot;User&quot;) of the website https://resumeguru.io(&quot;Site&quot;). This privacy policy applies to the Site and all products and services offered by ResumeGuru.
                        </p><p>
                        Personal Identification Information
                    </p><p>
                        We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, fill out a form, subscribe to the newsletter, respond to a survey, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personal identification information, except that it may prevent them from engaging in certain Site-related activities.
                    </p><p>
                        Non-Personal Identification Information
                    </p><p>
                        We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users&#34; means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
                    </p><p>
                        Web Browser Cookies
                    </p><p>
                        Our Site may use &quot;cookies&quot; to enhance User experience. User&#34;s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. Users may choose to set their web browser to refuse cookies, or to alert them when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
                    </p><p>
                        How We Use Collected Information
                    </p><p>
                        ResumeGuru.IO collects and uses Users personal information for the following purposes:
                    </p><p>
                        <li>
                            To process transactions
                        </li><li>

                        To improve customer service
                    </li><li>
                        To personalize user experience
                    </li><li>
                        To improve our Site
                    </li><li>
                        To send periodic emails
                    </li><li>
                        How We Protect Your Information
                    </li>
                    </p><p>
                        We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information, and data stored on our Site.
                    </p><p>
                        Sharing Your Personal Information
                    </p><p>
                        We do not sell, trade, or rent Users&#34; personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                    </p><p>
                        Changes To This Privacy Policy
                    </p><p>
                        ResumeGuru.IO has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
                    </p><p>
                        Your Acceptance Of These Terms
                    </p><p>
                        By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
                    </p><p>
                        Contacting Us
                    </p><p>
                        If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at info@resumeguru.io.
                    </p><p>
                        This document was last updated on March/2024.
                    </p>

                    </h3>

                </div>

            </div>
        </div>
        </CommonLayout>
    )
}
export default Privacy
