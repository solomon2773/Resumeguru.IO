import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.SITE_URL;
export function NewUserWelcomeMail(props) {
    const { submitData } = props;

    return (
        <Html>
            <Head />
            <Preview>New User Welcome</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg`}
                            width="256"
                            height="83"
                            alt="ResumeGuru.IO"
                        />
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            We're thrilled to welcome you to ResumeGuru.io! As part of our community, you're on the path to discovering new possibilities and unlocking your full potential.
                        </Text>

                        <Text style={paragraph}>
                            Prepare for your next job interview with AI agent Hannah. Get real-time feedback on content and pronunciation. Practice technical and behavioral questions with ResumeGuru.IO. Get ready for your next job interview with confidence.                        </Text>
                        <Button
                            px={10}
                            py={10}
                            style={button}
                            href={`${baseUrl}/user/dashboard/mockInterview`}
                        >
                            Mock Interview
                        </Button>

                        <Text style={paragraph}>
                            Avoid the old-fashioned method of using keywords to search for a job. Instead, use natural language, like the way you speak, to find job opportunities. ResumeGuru.IO will help you find the best job opportunities that match your skills and experience.
                        </Text>
                        <Button
                            px={10}
                            py={10}
                            style={button}
                            href={`${baseUrl}/jobs/search`}
                        >
                            Job Search
                        </Button>
                        <Text style={paragraph}>
                            Start to use the power of AI for your nex job. Refine your resume to meet the requirements for a specific job post and get interview.
                        </Text>
                        <Button
                            px={10}
                            py={10}
                            style={button}
                            href={`${baseUrl}/user/dashboard/myResume`}
                        >
                            Create Target Resume
                        </Button>
                        <Text style={paragraph}>
                            Leverage our AI Cover Letter Generator to craft a customized cover letter for your targeted job role. It analyzes the job description to spotlight essential skills, elevating your application's appeal. Just enter your personal information for a cover letter that's both relevant and personalized, designed to leave a strong first impression on employers. Ideal for job seekers determined to stand out.                        </Text>
                        <Button
                            px={10}
                            py={10}
                            style={button}
                            href={`${baseUrl}/user/dashboard/myCoverLetter`}
                        >
                            AI-Powered Cover Letter
                        </Button>
                        <Hr style={hr} />
                        {/*<Text style={paragraph}>*/}
                        {/*    If you haven't finished your integration, you might find our{' '}*/}
                        {/*    <Link style={anchor} href="https://resumeguru.io/docs">*/}
                        {/*        docs*/}
                        {/*    </Link>{' '}*/}
                        {/*    handy.*/}
                        {/*</Text>*/}
                        {/*<Text style={paragraph}>*/}
                        {/*    Once you're ready to start accepting payments, you'll just need to*/}
                        {/*    use your live{' '}*/}
                        {/*    <Link*/}
                        {/*        style={anchor}*/}
                        {/*        href="https://dashboard.resumeguru.io/login?redirect=%2Fapikeys"*/}
                        {/*    >*/}
                        {/*        API keys*/}
                        {/*    </Link>{' '}*/}
                        {/*    instead of your test API keys. Your account can simultaneously be*/}
                        {/*    used for both test and live requests, so you can continue testing*/}
                        {/*    while accepting live payments. Check out our{' '}*/}
                        {/*    <Link style={anchor} href="https://resumeguru.io/docs/dashboard">*/}
                        {/*        tutorial about account basics*/}
                        {/*    </Link>*/}
                        {/*    .*/}
                        {/*</Text>*/}
                        <Text style={paragraph}>
                            Need Help?<br/>
                            Our support team is always here to assist you. If you have any questions or need guidance, don't hesitate to reach out.
                        </Text>
                        <Text style={paragraph}>
                            Thank you for choosing ResumeGuru. We're excited to be part of your journey and can't wait to see all that you achieve.
                        </Text>
                        <Text style={paragraph}>
                            P.S. We love hearing from our users! Share your feedback and suggestions anytime. Your input helps us grow and improve. Welcome aboard! 🚀
                        </Text>
                        <Text style={paragraph}>— The ResumeGuru team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            © 2023 ResumeGuru.IO, a ST TECHNOLOGY LLC company. 17350 STATE HWY 249 STE 220 HOUSTON, TX. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}


const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const box = {
    padding: '0 48px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const paragraph = {
    color: '#525f7f',

    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left',
};

const anchor = {
    color: '#556cd6',
};

const button = {
    backgroundColor: 'rgb(37 99 235 )',
    borderRadius: '5px',
    padding:'5px',
    color: '#fff',
    fontSize: '14px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    width: '100%',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};
