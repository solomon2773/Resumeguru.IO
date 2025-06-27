
import {
    getJdInfoTemplateByUserId,

} from '../../helpers/mongodb/pages/api/resume';



export default async function handler(req, res) {
    const { authorization } = req.headers

    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
                const postData = req.body.data;

                const userTemplates = await getJdInfoTemplateByUserId( req.body.userId);


                res.status(200).json({
                    status: true,
                    userTemplates: userTemplates,
                })

            }




    } else {
        res.status(405).send('Method not allowed');
    }
}


