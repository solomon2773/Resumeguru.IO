import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import {
    mongodbGetJobSearchUser,
    mongodbMarketingEmailSent
} from '../../../../helpers/mongodb/pages/api/mail/marketing';
import {toast} from "react-toastify";

import {mongodbJobsSearchResultInsert} from "../../../../helpers/mongodb/pages/jobs/search";
import {v4 as uuidv4} from "uuid";

const getJobs = async (postData) => {
    const startTime = Date.now();
    try{
        const jobsSearch = await fetch('https://jobs-api14.p.rapidapi.com/list?query='+encodeURIComponent(postData.query)+'&location='+encodeURIComponent(postData.location?postData.location : 'United States')+'&distance='+encodeURIComponent(postData.distance)+'&language='+encodeURIComponent(postData.language)+'&remoteOnly='+encodeURIComponent(postData.remoteOnly)+'&datePosted='+encodeURIComponent(postData.datePosted)+'&employment='+encodeURIComponent(postData.employment)+'&index='+postData.index, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': process.env.RAPIDAPI_HOST,
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            }
        });
        const result = await jobsSearch.text();
        const endTime = Date.now();
        const timeDiff = endTime - startTime;
        return JSON.stringify( {
            status: true,
            jobsSearch: result,
            apiTime: timeDiff,
        })
    } catch (error) {
        console.log('error: ', error);
       return JSON.stringify({
            status: false,
            error: error,
        })
    }

}
const addUUIDToJobs = async (jobsArray) => {
    return jobsArray.map(job => ({
        ...job,
        uuid: uuidv4(),
    }));
};
const searchJobs = async (jobSearchParam) => {


    try {
        const startTime = Date.now();
        const jobSearch = await getJobs(jobSearchParam);
        const endTime = Date.now();
        const fetchTime = endTime - startTime;
        const parsedJobsData = await JSON.parse(jobSearch);
        if (!parsedJobsData.status){
            return;
        }
        parsedJobsData.jobs = await addUUIDToJobs(await JSON.parse(parsedJobsData.jobsSearch).jobs);

        await mongodbJobsSearchResultInsert({
            fetchTime: fetchTime,
            userId: "0",
            jobSearchPrompt: "marketing email job search - "+jobSearchParam.query,
            searchQueryParams:jobSearchParam,
            errors: parsedJobsData.errors,
            loadMore: false,
            jobs: parsedJobsData.jobs,
            jobCount: parsedJobsData.jobs.length,
            index: 0,
            hasError: false,

        }).then((result) => {

        }).catch((err) => {
            //  toast.error("Regenerate Linkedin Connectionn Message Error 1001...")  ;
        })
        return parsedJobsData;
    } catch (error) {
           console.log(error)
        //toast.error("Search Error ... ")
    }

}
// Array of popular job titles
const jobTitles = [
    "Software Engineer",
    "Data Scientist",
    "Project Manager",
    "Graphic Designer",
    "Product Manager",
    "Marketing Specialist",
    "Sales Associate",
    "UX/UI Designer",
    "Business Analyst",
    "HR Manager",
    "Financial Analyst",
    "Customer Support Specialist"
];

// Function to shuffle an array
async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
// Function to pick three random job titles
async function getThreeRandomJobTitles() {
    const shuffledTitles = await shuffleArray([...jobTitles]); // Create a copy and shuffle
    const selectedTitles = shuffledTitles.slice(0, 2); // Get the first three elements
    return selectedTitles.join(' , '); // Join the titles into a single string
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer r5KurJ070CrH2I4C9D_jmxdJifLbPFV0kRMkh" -d '{"templateId":"d-b05f767f61e84deaacf2fcd679e7b230"}' "https://resumeguru.io/api/mail/marketing/weeklyJobSearch"


export default async function sendEmail(req, res) {

    const { authorization } = req.headers

    let emailCount = 0;
    if (req.method === 'POST') {

        if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
            const sentTo = [];

            const {templateId } = req.body;

            if (!templateId){
                return res.status(400).json({ status:false, error: 'Template ID is required' });
            }

            try {
                const users = await mongodbGetJobSearchUser(templateId);

                if (users.length > 0){
                    let jobSearchResult = null;
                    const rendomJobTitles = await getThreeRandomJobTitles();

                    for (const user of users) {
                        if (emailCount < 25) {
                            if (user.searchQueryParams) {
                                jobSearchResult = await searchJobs(user.searchQueryParams);
                                await delay(300);
                            } else {
                                jobSearchResult = await searchJobs({
                                    query: rendomJobTitles,
                                    location:  "United States",
                                    distance:  "",
                                    language: "",
                                    remoteOnly: false,
                                    datePosted: "",
                                    employment: "",
                                    index: 0,});
                            }
                            // console.log(jobSearchResult.jobs.length);
                            if (jobSearchResult.jobs.length > 5) {
                                try {
                                    const emailsent = await sgMail.send({
                                        "from": 'info@resumeguru.io',
                                        "personalizations":[
                                            {
                                                "to":[
                                                    {
                                                        "email":user.email
                                                    }
                                                ],
                                                "dynamic_template_data":{
                                                    "firstName":user.firstName,
                                                    "lastName":user.lastName,
                                                    "userId":user.userId,
                                                    "jobSearchResult": jobSearchResult.jobs,
                                                }
                                            }
                                        ],
                                        "template_id":templateId
                                    });

                                   // console.log(" Email sent to : "+user.email);
                                    sentTo.push(user.email);
                                    emailCount += 1;

                                    await mongodbMarketingEmailSent({
                                        userId: user.userId,
                                        email: user.email,
                                        emailType: "weeklyJobSearch-sendGrid",
                                        templateId: templateId,
                                        response: emailsent
                                    });

                                } catch (error) {
                                    console.error("Error sending email to: " + user.email, error);
                                }
                            }
                        }
                    }

                    res.status(200).json({
                        status:true,
                        sendTo: sentTo,
                        message: 'Email sent successfully to : '+sentTo.length +" users" });
                } else {
                    res.status(200).json({ status:true, message: 'No users found' });
                }
            } catch (error) {
                console.error('Error sending email', error);
                res.status(500).json({ status:false, error: 'Error sending email' });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}

