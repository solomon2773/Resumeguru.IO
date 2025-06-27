
export default async function handler(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {
        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const documentUrl = req.body.documentUrl; // URL of the document to analyze
            const apiKey = process.env.MICROSOFT_DOC_INTELLIGENCE_KEY; // Use environment variable for the API key
            // console.log(modelId)
            // console.log(documentUrl)
            // console.log(JSON.stringify({ urlSource: documentUrl }))
            try {
                const response = await fetch(documentUrl, {
                    method: 'GET',
                    headers: {
                        'Ocp-Apim-Subscription-Key': apiKey
                    }
                });
                //
                // console.log(response.status)
                const data = await response.json();
                res.status(200).json(data);


            } catch (error) {
                //console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }


}
