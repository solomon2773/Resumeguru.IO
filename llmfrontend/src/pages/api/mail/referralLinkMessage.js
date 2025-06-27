import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import { ReferralLinkMessage} from '../../../emailTemplates/referralLinkMessage';

export default async function sendEmail(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {

        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            try {
                const { to, from,  submitData } = req.body;
                const emailHtml = render(<ReferralLinkMessage submitData={submitData} />);
                await sgMail.send({
                    from: from,
                    to: to,
                    subject: " Welcome to ResumeGuru.io! Your Journey Begins Here!",
                    html: emailHtml,
                }).then((r)=>{
                    //console.log(r)
                });

                res.status(200).json({ status:true, message: 'Email sent successfully' });
            } catch (error) {
                console.error('Error sending email', error);
                res.status(500).json({ status:false, error: 'Error sending email' });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}
