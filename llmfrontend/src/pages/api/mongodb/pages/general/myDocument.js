import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "documentIntelligence";


const coverLetterStreamingInsert = async (client, params) => {
    const { inputData } = params;
    const docIntelligenceCollection = client.collection(collectionName);
        const dataInsert = await docIntelligenceCollection.insertOne({
            userId: inputData.userId,
            jobDescriptionObjectId: inputData.jobDescriptionObjectId ? inputData.jobDescriptionObjectId : "",
            resumeObjectId: inputData.resumeObjectId ? inputData.resumeObjectId : "",
            resumeVersion:inputData.resumeVersion ? inputData.resumeVersion : "",
            chatPrompt : inputData.chatPrompt,
            userContent: inputData.userContent,
            parsedOutput:inputData.parsedOutput,
            advanceFeature: inputData.advanceFeature ? inputData.advanceFeature : null,
            userInfo:inputData.userInformation ? inputData.userInformation : null,
            createdAt: new Date(),
        });
        return dataInsert;
};


const getMyDocumentListByUserId = async (client, params) => {
    const { userId } = params;
    const myDocumentCollection = client.collection(collectionName);
    const cursor = await myDocumentCollection.find(
        {userId: userId},
        { projection: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                documentUrl: 1,
                fileInfo: 1,
        }
        }
    );
    const data = [];
    for await (const doc of cursor) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};

const getMyDocumentDataByUserIdAndDocId = async (client, params) => {
    const { userId, docId } = params;
    const myDocumentCollection = client.collection(collectionName);
    const pipeline = [
        {
            $match: {
                userId: userId, // Match by userId
                _id: new ObjectId(docId) // Match by document ObjectId
            }
        },
        {
            $lookup: {
                from: "jobDescription", // Collection to join
                let: { jobDescObjId: "$jobDescriptionObjectId" }, // Define variable for use in pipeline
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", { $toObjectId: "$$jobDescObjId" }] // Convert string to ObjectId and match
                            }
                        }
                    }
                ],
                as: "jobDescriptionDetails" // Array field added to output documents containing the joined document(s)
            }
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                userContent: 1,
                userInfo: 1,
                parsedOutput: 1,
                advanceFeature: 1,
                jobDescriptionDetails: 1, // Include the joined data
            }
        }
    ];
    const result = await myDocumentCollection.aggregate(pipeline);
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
    coverLetterStreamingInsert,
    getMyDocumentListByUserId,
    getMyDocumentDataByUserIdAndDocId,

};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
