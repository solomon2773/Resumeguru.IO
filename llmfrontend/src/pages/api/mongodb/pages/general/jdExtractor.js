import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "jobDescription";


const getJdExtractorListByUserId = async (client, params) => {
    const { userId } = params;
    const jobDescriptionCollection = client.collection(collectionName);
    const jdList = await jobDescriptionCollection.aggregate([
        {
            $match: {
                userId: { $eq: userId }
            }
        },
        {
            $sort: {
                lastUpdate: -1  // Use -1 if you want descending order
            }
        },

        {
            $project: {
                _id: 1,
                userId: 1, // Include userId in the final projection if added in the group stage
                lastUpdate: 1,  // Include lastUpdate in the final projection if you want the latest lastUpdate for the group
                jdTemplateName: 1,
                JDInfoExtractMessageContent:  {
                    salaryRange: 1,
                    jobTitle: 1,
                    location: 1,
                    companyName: 1,
                },

            }
        }
    ]).toArray();
    return jdList;
};


const getJdExtractorDataByUserIdAndDocId = async (client, params) => {
    const { userId, docId } = params;
    const jobDescriptionCollection = client.collection(collectionName);
    const pipeline = [
        {
            $match: {
                userId: userId, // Match by userId
                _id: new ObjectId(docId) // Match by document ObjectId
            }
        },

        {
            $project: {
                _id: 1,
                jdTemplateName: 1,
                userId: 1,
                lastUpdate: 1,

                JDInfoExtractMessageContent: 1,

            }
        }
    ];
    const result = await jobDescriptionCollection.aggregate(pipeline);
    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data[0];
};

// Action router
const actionHandlers = {
    getJdExtractorDataByUserIdAndDocId,
    getJdExtractorListByUserId,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
