

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (req.method === 'POST') {

            if (authorization === 'Bearer ' + process.env.SKA_API_AUTH_TOKEN) {
                const postData = req.body.data;

                const startTime = Date.now();
                try{
                    const jobsSearch = await fetch('https://jobs-api14.p.rapidapi.com/v2/list?query='+encodeURIComponent(postData.query)+'&location='+encodeURIComponent(postData.location?postData.location : 'United States')+'&distance='+encodeURIComponent(postData.distance)+'&language='+encodeURIComponent(postData.language)+'&remoteOnly='+encodeURIComponent(postData.remoteOnly)+'&datePosted='+encodeURIComponent(postData.datePosted)+'&employment='+encodeURIComponent(postData.employment)+'&index='+postData.index, {
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
                    res.status(200).json({
                        status: true,
                        jobsSearch: result,
                        apiTime: timeDiff,
                    })
                } catch (error) {
                    console.log('error: ', error);
                    res.status(200).json({
                        status: false,
                        error: error,
                    })
                }

            }



    } else {
        res.status(405).send('Method not allowed');
    }
}


