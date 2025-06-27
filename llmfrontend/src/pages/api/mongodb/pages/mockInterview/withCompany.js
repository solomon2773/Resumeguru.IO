import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "jobSearch";

// Database actions
const getJobDetailsByJobId = async (client, params) => {
    const { id } = params;
    const jobSearchCollection = client.collection(collectionName);
    const jobDetails = await jobSearchCollection.findOne
    (
        {
            jobs: {
                $elemMatch: { id: id } // Finds documents where jobs array contains an object with matching id
            },

        },
        {
            projection: {
                jobs: { $elemMatch: { id: id } } // Only returns the matching job object within the jobs array
            }
        }
        );
    return jobDetails;
};

// Action router
const actionHandlers = {
    getJobDetailsByJobId,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
