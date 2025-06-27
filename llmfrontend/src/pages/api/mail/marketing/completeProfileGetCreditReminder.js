import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import { UserProfileUpdatePromo} from '../../../../emailTemplates/profileUpdateCredit';
import {
    mongodbGetUserProfileIncomplete,
    mongodbMarketingEmailSent
} from '../../../../helpers/mongodb/pages/api/mail/marketing';

export default async function sendEmail(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {

        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const sentTo = [];
            let to = [];
            try {
                const users = await mongodbGetUserProfileIncomplete();

                users.map(async(user)=>{
                   //console.log(user)
                   // if (user.emails){
                        const submitData = "";
                        to = user.email;
                        const emailHtml = render(<UserProfileUpdatePromo submitData={submitData} />);
                        const emailsent = await sgMail.send({
                            from: 'info@resumeguru.io',
                            to: to,
                            subject: "Update Your Profile and Earn 3000 AI Credits!",
                            html: emailHtml,
                        }).then((response)=>{

                            sentTo.push(to);
                            return response;

                        });

                        await mongodbMarketingEmailSent({userId:user.userId,email:user.email,emailType:"profileUpdateCredit",response:emailsent});

                  //  }


                });



                res.status(200).json({ status:true, message: 'Email sent successfully to : '+sentTo.join(',') });
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
