import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { createCanvas } from 'canvas';
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatOpenAI } from "@langchain/openai";
import {uploadFilePublic} from "../../../helpers/s3/s3client";


async function convertPDFToImages(pdfUrl, userId) {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images = [];
    const imageUrl = [];

    const time = Date.now();
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convert image to black and white
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            // Convert to grayscale
            const gray = 0.3 * red + 0.59 * green + 0.11 * blue;

            // Set all color channels to the same value (grayscale)
            data[i] = data[i + 1] = data[i + 2] = gray;

            // Optionally, remove any color background by setting it to white if it is close to white
            if (gray > 240) {
                data[i] = data[i + 1] = data[i + 2] = 255; // white
            }
        }

        context.putImageData(imageData, 0, 0);

        images.push(canvas.toDataURL('image/jpeg')); // Converts to base64 JPEG
        await uploadFilePublic('userResumeUploadCache', {
            data: canvas.toBuffer(),
            userId: userId,
            type: 'image/jpeg',
            size: canvas.toBuffer().length,
            name: `${time}_${userId}_${pageNum}.jpg`,
        });
        imageUrl.push(`${process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/userResumeUploadCache/${userId}/${time}_${userId}_${pageNum}.jpg`);
    }

    return imageUrl;
}


export default async function handler(req, res) {
    const { authorization } = req.headers

    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {

                const postData = req.body;
                const startTime = Date.now();
                const pdfUrl = `${process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC}/userResumeUpload/${postData.userId}/${postData.fileName}`;
                const images = await convertPDFToImages(pdfUrl, postData.userId);

                const resumeJPGImages = images.map(imgSrc => ({
                    type: "image_url",
                    image_url: {url: imgSrc}
                }));


                const endTime = Date.now();


                const fetchTime = endTime - startTime;
               // console.log('Time taken:', fetchTime);

                res.status(200).json({
                    status: true,
                    resumeJPGImages: resumeJPGImages,

                })

            }
            // else {
            //     res.status(401).send('Unauthorized');
            // }




    } else {
        res.status(405).send('Method not allowed');
    }
}


