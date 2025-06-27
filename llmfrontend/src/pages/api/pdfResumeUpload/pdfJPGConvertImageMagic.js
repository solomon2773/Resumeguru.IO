const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { uploadFilePublic } = require('../../../helpers/s3/s3client');

async function convertPDFToImages(pdfUrl, userId) {
    const outputDir = 'output/';
    const time = Date.now();
    const imageUrl = [];

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Define the output format for ImageMagick
    const outputPattern = `${outputDir}${time}_${userId}_%d.jpg`;

    /// sudo apt-get install imagemagick
    // ImageMagick convert command // for version newer than 7.0.10-34 use magick instead of convert
    const convertCommand = `convert -density 300 ${pdfUrl} -quality 90 ${outputPattern}`;

    return new Promise((resolve, reject) => {
        exec(convertCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting PDF to images: ${error.message}`);
                return reject(`Conversion failed: ${error.message}`);
            }

            try {
                // Get all the generated images and upload them
                const files = fs.readdirSync(outputDir).filter(file => file.startsWith(`${time}_${userId}_`));
                for (let i = 0; i < files.length; i++) {
                    const filePath = path.join(outputDir, files[i]);
                    const fileName = files[i];
                    const data = fs.readFileSync(filePath);

                    await uploadFilePublic('userResumeUploadCache', {
                        data,
                        userId: userId,
                        type: 'image/jpeg',
                        size: data.length,
                        name: fileName,
                    });

                    imageUrl.push(`${process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/userResumeUploadCache/${userId}/${fileName}`);

                    // Clean up the local file after upload
                    fs.unlinkSync(filePath);
                }

                resolve(imageUrl);
            } catch (uploadError) {
                console.error(`Error during upload or cleanup: ${uploadError.message}`);
                reject(`Upload failed: ${uploadError.message}`);
            }
        });
    });
}

export default async function handler(req, res) {
    const { authorization } = req.headers;

    if (req.method === 'POST') {
        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const postData = req.body;
            const startTime = Date.now();
            const pdfUrl = `${process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/userResumeUpload/${postData.userId}/${postData.fileName}`;
            try {
                const images = await convertPDFToImages(pdfUrl, postData.userId);

                const resumeJPGImages = images.map(imgSrc => ({
                    type: "image_url",
                    image_url: { url: imgSrc }
                }));

                const endTime = Date.now();
                const fetchTime = endTime - startTime;

                res.status(200).json({
                    status: true,
                    resumeJPGImages: resumeJPGImages,
                });
            } catch (error) {
                res.status(500).json({ status: false, message: error });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}
