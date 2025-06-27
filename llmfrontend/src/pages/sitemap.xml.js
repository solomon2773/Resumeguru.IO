//pages/sitemap.xml.js
const EXTERNAL_GHOST_BLOG_API_URL = 'https://blog.resumeguru.io/ghost/api/';
const lastmod = "2024-03-24";
function generateSiteMap(posts) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://resumeguru.io/</loc>
        <lastmod>`+lastmod+`</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/jobs/search</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/user/aiTargetResume</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/user/aiJdExtractor</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
      <url>
       <loc>https://resumeguru.io/user/aiResumeCoverLetter</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/user/interviewQuestions</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/user/interviewQuestionToAsk</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/user/linkedInConnectionMessage</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://blog.resumeguru.io/</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/termsofservice</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/privacy</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/pricing</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://resumeguru.io/contact-us</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://blog.resumeguru.io/tag/news/</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://blog.resumeguru.io/tag/faq/</loc>
       <lastmod>`+lastmod+`</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     ${posts
        .map((blogPost, blogPostIndex) => {
            return `
       <url>
           <loc>${`${blogPost.url}`}</loc>
           <lastmod>`+lastmod+`</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       </url>
     `;
        })
        .join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    const request = await fetch(EXTERNAL_GHOST_BLOG_API_URL + 'content/posts/?key='+process.env.GHOST_BLOG_API_CONTENT_KEY+'&fields=feature_image,title,url,canonical_url');

    const postJSON = await request.json();


    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(postJSON.posts);
    //
    res.setHeader('Content-Type', 'text/xml');
    // // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;
