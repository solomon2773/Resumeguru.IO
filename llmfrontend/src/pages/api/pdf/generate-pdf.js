import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const { html, fileName } = req.body;

    if (!html || !fileName) {
        return res.status(400).json({ error: 'HTML and fileName are required' });
    }

    try {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: "new",  // Opt-in to the new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'],  // Add these args to avoid root issues
        });
        const page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF from the HTML content
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm',
            },
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
}

