import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const { html, fileName, htmlSelectorEId } = req.body;

    if (!html || !fileName) {
        return res.status(400).json({ error: 'HTML and fileName are required' });
    }

    try {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: "new",  // Opt-in to the new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],  // Add these args to avoid root issues
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        await page.waitForSelector('#' + htmlSelectorEId);

        const content = await page.$('#' + htmlSelectorEId);
        if (!content) {
            throw new Error('Resume template not found');
        }

        // Adjust viewport to fit the content if necessary
        const boundingBox = await content.boundingBox();
        await page.setViewport({
            width: Math.ceil(boundingBox.width),
            height: Math.ceil(boundingBox.height)
        });

        const imageBuffer = await content.screenshot({ omitBackground: true });

        await page.close();
        await browser.close();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename=${fileName}`);
        res.send(imageBuffer);
    } catch (error) {
        console.error('Failed to generate Thumbnail:', error);
        res.status(500).json({ error: 'Failed to generate Thumbnail' });
    }
}
