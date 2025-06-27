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
export function ReferralLinkMessage(props) {
    const { submitData } = props;

    return (
        <Html>
            <Head />
            <Preview>Hello {submitData.fullName}</Preview>
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
                        <Text style={paragraph}>
                        Hi  {submitData.fullName}
                        </Text>
                        <Text style={paragraph}>
                            I hope this message finds you well!
                        </Text>
                        <Text style={paragraph}>
                            I recently discovered an incredible AI-powered resume creation & interview preparation website called ResumeGuru.IO, and I think it could be a game-changer for you. It has helped me create a professional and eye-catching resume effortlessly, and I know it can do the same for you.
                        </Text>
                        <Text style={paragraph}>
                            Please click on this referral link below to explore more :

                        </Text>
                        <a href={submitData.refLink} className="text-sm ml-2 leading-6 ">
                            ResumeGuru.io
                        </a>

                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        © 2024 ResumeGuru.IO, a ST TECHNOLOGY LLC company. 17350 STATE HWY 249 STE 220 HOUSTON, TX 77064. All rights reserved.
                    </Text>
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
