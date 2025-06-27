import * as cheerio from 'cheerio';

const extractTextFromHtml = (html) => {
    const regex = /<[^>]+>(.*?)<\/[^>]+>/g;
    const text = html.replace(regex, '');
    return text.trim();
};

const getJobDescription = async (url) => {
    try {
        const response = await fetch(url);
        const html = await response.text();

        const $ = cheerio.load(html);

       // const jobDescription = $('.description__text .show-more-less-html--more .show-more-less-html__markup').html();
        const jobDescriptionElement = $('.decorated-job-posting__details .description__text');
        const jobDescriptionHtml = jobDescriptionElement.find('section > div').html();
        const jobDescriptionText = jobDescriptionHtml ? extractTextFromHtml(jobDescriptionHtml) : '';



        return jobDescriptionText;
    } catch (error) {
        console.error('Error extracting job description:', error);
        return null;
    }
};

export default async function handler(req, res) {
    const { url } = req.query;
    console.log(url)
    if (!url) {
        res.status(400).json({ error: 'Missing URL parameter' });
        return;
    }

    const jobDescription = await getJobDescription(url);
    res.status(200).json({ jobDescription });
}


