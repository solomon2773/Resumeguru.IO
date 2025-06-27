import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "jobSearch";

// Database actions
const jobsSearchResultInsert = async (client, params) => {
    const { data } = params;
    if (data.jobCount > 0) {
        const jobSearch = client.collection(collectionName);
        const existingDocument = await jobSearch.findOne({
            index: data.index,
            jobSearchPrompt: data.jobSearchPrompt,
            searchQueryParams: data.searchQueryParams
        });

        if (existingDocument) {
            // If a document with the same values already exists, return a message or handle accordingly
            return { status:false ,error: "Document already exists" };
        }

        // Insert the new document if unique
        const insertResult = await jobSearch.insertOne(data);
        return insertResult;
    } else {
        return { status:false ,error: "No jobs found" };
    }
};

const jobsSearchLastResultFind = async (client, params) => {
    const jobSearch = client.collection(collectionName);
    const findResult = await jobSearch.findOne({}, { sort: { _id: -1 } })    
    return findResult;
};

const jobsFindUserLikedJobs = async (client, params) => {
    const { userId } = params;
    const jobSearch = client.collection(collectionName);
    const findResult = await jobSearch.aggregate([
        { $match: { "jobs.likedUser": userId } },
        { $project: {
                jobs: {
                    $filter: {
                        input: "$jobs",
                        as: "job",
                        cond: {
                            $and: [
                                { $isArray: "$$job.likedUser" },
                                { $in: [userId, "$$job.likedUser"] }
                            ]
                        }
                    }
                }
            } }
    ]).toArray();

    return findResult;
};


const jobsUpdateLikedJob = async (client, params) => {
    const { uuid, userId } = params;
    const jobSearch = client.collection(collectionName);
    const updateResult = await jobSearch.updateOne(
        { "jobs.uuid": uuid },
        { $addToSet: { "jobs.$[elem].likedUser": userId } },
        { arrayFilters: [{ "elem.uuid": uuid }] }
    );

   return updateResult;
};

const jobsRemoveLikedJob = async (client, params) => {
    const { uuid, userId } = params;
    const jobSearch = client.collection(collectionName);
    const updateResult = await jobSearch.updateOne(
        { "jobs.uuid": uuid },
        { $addToSet: { "jobs.$[elem].likedUser": userId } },
        { arrayFilters: [{ "elem.uuid": uuid }] }
    );

   return updateResult;
};

const jobFindFromUUID = async (client, params) => {
    const { uuid } = params;
    const jobSearch = client.collection(collectionName);
    const findResult = await jobSearch.findOne({
        jobs: {
            $elemMatch: {
                $or: [
                    { uuid: uuid },
                    { id: uuid }
                ]
            }
        },

    }, { projection: { "jobs.$": 1, searchQueryParams:1, jobCount:1, fetchTime:1 },sort: { _id: -1 } })
    return findResult;
};

// Action router
const actionHandlers = {
    jobsSearchResultInsert,
    jobsSearchLastResultFind,
    jobsFindUserLikedJobs,
    jobsUpdateLikedJob,
    jobsRemoveLikedJob,
    jobFindFromUUID,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
