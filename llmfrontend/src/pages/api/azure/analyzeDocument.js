import {mongodbInsertNewLinkedinPdfResumeUpload} from "../../../helpers/mongodb/pages/api/azure/analyzeDocument";
export default async function handler(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {
        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
        const modelId = req.body.modelId; // or from query string
        const documentUrl = req.body.documentUrl; // URL of the document to analyze
        const fileInfo = req.body.fileInfo; // fileInfo = {

        const apiKey = process.env.MICROSOFT_DOC_INTELLIGENCE_KEY; // Use environment variable for the API key
        const endpoint = process.env.MICROSOFT_DOC_INTELLIGENCE_END_POINT;
        // console.log(modelId)
        // console.log(documentUrl)
        // console.log(JSON.stringify({ urlSource: documentUrl }))
            mongodbInsertNewLinkedinPdfResumeUpload(fileInfo, documentUrl, fileInfo.userId);
        try {
                const response = await fetch(`${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=2023-10-31-preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': apiKey
                    },
                    body: JSON.stringify({ urlSource: documentUrl })
                });
                //
                // console.log(response.status)
                if (response.status !== 202 ){
                    res.status(500).json({ error: 'Internal Server Error Reading...' });
                    return;
                } else {
                    const operationLocation = await response.headers.get('Operation-Location');

                    //console.log(operationLocation)
                    res.status(200).json({operationLocation});
                }

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
