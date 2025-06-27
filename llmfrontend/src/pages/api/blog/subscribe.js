import GhostAdminAPI from '@tryghost/admin-api'


export default async function handler(req, res) {
    const { authorization } = req.headers


    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
                const eamil = req.body.email;

                try
                {
                    const ghostAdminAPI = new GhostAdminAPI({
                        url: process.env.GHOST_BLOG_API_URL,
                        key: process.env.GHOST_BLOG_API_ADMIN_KEY,
                        version: "v4.0"
                    });

                    const memberAdd = await ghostAdminAPI.members.add(

                        {
                            "email": eamil,
                        }

                    );

                    res.status(200).json({
                        status: memberAdd && memberAdd.subscribed ? memberAdd.subscribed  : false,
                        data: memberAdd && memberAdd.subscribed ? {
                            id: memberAdd.id,
                            uuid: memberAdd.uuid,
                            email : memberAdd.email,
                        } : null,
                    })
                } catch (error) {
                    console.error('Error:', error);
                    res.status(200).json({
                        status: false,
                        data:  error,
                    })
                }


            }
            // else {
            //     res.status(401).send('Unauthorized');
            // }




    } else {
        res.status(405).send('Method not allowed');
    }
}


