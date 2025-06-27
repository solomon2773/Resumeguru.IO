
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
export function UserProfileUpdatePromo(props) {
    const { firstName, lastName } = props;

    return (
        <Html>
            <Head />
            <Preview>Update Your Profile and Earn 3000 AI Credits!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`https://resumeguru.io/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg`}
                            width="256"
                            height="83"
                            alt="ResumeGuru.IO"
                        />
                        <Hr style={hr} />

                        <h1>Don't Forget to Update Your Profile and Earn 3000 AI Credits!</h1>
                        <Text style={paragraph}>
                            We're offering an exclusive opportunity to enhance your profile and get rewarded. Here's how you can take advantage:                        </Text>
                        <Text style={paragraph}>
                            <strong>Public Information Section : </strong>
                            Update your public profile information to increase your visibility and networking potential. A well-maintained profile attracts more connections and opens new doors in your professional journey.
                        </Text>
                        <Text style={paragraph}>
                            <strong>Resume Information Section : </strong>
                            By updating your resume information section, you enable us to create highly personalized resumes, cover letters, and professional messages. This tailored content is designed to give you an edge in your job applications and professional engagements.
                        </Text>
                        <Text style={paragraph}>
                            <strong>  Earn 3000 AI Credits:</strong>
                            Once you complete updates for all fields in the "resume information section" of your profile, we'll add 3000 AI credits to your account. Use these credits to access our advanced tools and services that can further boost your career prospects.
                        </Text>
                        <Text style={paragraph}>
                            Don’t wait—update your profile today and unlock these exciting benefits. Just a few minutes of your time can lead to countless opportunities.
                        </Text>
                        <Button
                            px={10}
                            py={10}
                            style={button}
                            href={`${baseUrl}/user/dashboard/profile`}
                        >
                            Update My Profile
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            We can’t wait to help you achieve more, connect with others, and make your professional dreams a reality.
                        </Text>

                        <Text style={paragraph}>
                            Need Help?<br/>
                            Our support team is always here to assist you. If you have any questions or need guidance, don't hesitate to reach out.
                        </Text>
                        <Text style={paragraph}>
                            Thank you for choosing ResumeGuru.IO We're excited to be part of your journey and can't wait to see all that you achieve.
                        </Text>
                        <Text style={paragraph}>
                            P.S. We love hearing from our users! Share your feedback and suggestions anytime. Your input helps us grow and improve. Welcome aboard! 🚀
                        </Text>
                        <Text style={paragraph}>— The ResumeGuru team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            © 2024 ResumeGuru.IO, a ST TECHNOLOGY LLC company. 17350 STATE HWY 249 STE 220 HOUSTON, TX. All rights reserved.
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
    padding: '20px 0 12px',
    marginBottom: '64px',
};

const box = {
    padding: '0 12px',
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
