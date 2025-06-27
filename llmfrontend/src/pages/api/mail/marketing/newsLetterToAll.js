import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import {
    mongodbGetUserByTemplateId,
    mongodbGetUserProfileIncomplete,
    mongodbMarketingEmailSent
} from '../../../../helpers/mongodb/pages/api/mail/marketing';

export default async function sendEmail(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {

        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const sentTo = [];

            const {templateId } = req.body;

            if (!templateId){
                return res.status(400).json({ status:false, error: 'Template ID is required' });
            }

            try {
                const users = await mongodbGetUserByTemplateId(templateId);
                let emailCount = 0;
                // console.log(users.length)
                if (users.length > 0){
                    users.map(async(user)=>{
                        //console.log(user)
                        // if (user.emails){
                        if (emailCount < 2){
                            // console.log(user.email)
                            const emailsent = await sgMail.send({
                                "from": 'info@resumeguru.io',
                                "personalizations":[
                                    {
                                        "to":[
                                            {
                                                "email":user.email
                                            }
                                        ],
                                        "dynamic_template_data":{

                                            "firstName":user.firstName,
                                            "lastName":user.lastName,

                                        }
                                    }
                                ],
                                "template_id":templateId
                            }).then((response)=>{

                                sentTo.push(user.email);
                                return response;

                            });

                            await mongodbMarketingEmailSent({userId:user.userId,email:user.email,emailType:"marketingEmailToAll-sendGrid",templateId:templateId,response:emailsent});

                        }

                        emailCount = emailCount + 1;
                    });
                }




                res.status(200).json({ status:true, message: 'Email sent successfully to : '+users.length +" users" });
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
