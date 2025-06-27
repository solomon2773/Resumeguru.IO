import libre from 'libreoffice-convert';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    }
  };

export default async function handler(req, res) {
    const { authorization } = req.headers
    if (req.method === 'POST') {
        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const postData = req.body;
            const docxBuffer = Buffer.from(postData.docBuffer, 'base64');
            libre.convert(docxBuffer, 'pdf', undefined, (err, pdfBuffer) => {
                if (err) {
                    res.status(200).json({
                        status: false,
                        error: err,
                    });
                } else {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=randompdf.pdf');
                    res.status(200).send(pdfBuffer)
                }
            });
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}
