import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import {
    mongodbGetNonUserEmails,
    mongodbMarketingEmailSent
} from '../../../../helpers/mongodb/pages/api/mail/marketing';

import {v4 as uuidv4} from "uuid";

//curl -X POST https://resumeguru.io/api/mail/marketing/futureUser   -H "Authorization: Bearer r5KurJ070CrH2I4C9D_jmxdJifLbPFV0kRMkh"    -H "Content-Type: application/json"     -d '{ "templateId":"d-1caf130a9f5743bb8a4e9b2e58c75681"}'

export default async function sendEmail(req, res) {

    const { authorization } = req.headers

    let emailCount = 0;
    if (req.method === 'POST') {

        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const sentTo = [];

            const {templateId } = req.body;

            if (!templateId){
                return res.status(400).json({ status:false, error: 'Template ID is required' });
            }

            try {
                const users = await mongodbGetNonUserEmails(templateId);

                if (users.length > 0){


                    for (const user of users) {
                        if (emailCount < 80) {


                                try {
                                    const emailsent = await sgMail.send({
                                        "from": 'info@resumeguru.io',
                                        "personalizations":[
                                            {
                                                "to":[
                                                    {
                                                        "email":user
                                                    }
                                                ],
                                                // "dynamic_template_data":{
                                                //     "firstName":user.firstName,
                                                //     "lastName":user.lastName,
                                                //
                                                // }
                                            }
                                        ],
                                        "template_id":templateId
                                    });

                                   // console.log(" Email sent to : "+user.email);
                                   // console.log(user)
                                    sentTo.push(user);
                                    emailCount += 1;

                                    await mongodbMarketingEmailSent({
                                        userId: "0",
                                        email: user,
                                        emailType: "futureUser-sendGrid",
                                        templateId: templateId,
                                        response: emailsent
                                    });

                                } catch (error) {
                                    console.error("Error sending email to: " + user, error);
                                }

                        }
                    }

                    res.status(200).json({
                        status:true,
                        sendTo: sentTo,
                        message: 'Email sent successfully to : '+sentTo.length +" users" });
                } else {
                    res.status(200).json({ status:true, message: 'No users found' });
                }
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

