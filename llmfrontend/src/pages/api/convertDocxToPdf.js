import { NextApiRequest, NextApiResponse } from 'next';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const docxBuffer = Buffer.from(req.body.docx, 'base64');

    try {
        // Convert .docx to HTML
        const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });

        // Here we make an assumption that our document doesn't have complex layouts
        // If it does, you might want to use a more powerful solution (like using LibreOffice via a shell command)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        page.drawText(html);

        const pdfBytes = await pdfDoc.save();

        res.status(200).json({ pdf: pdfBytes.toString('base64') });
    } catch (error) {
        res.status(500).json({ error: 'Failed to convert.' });
    }
}
