import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "linkedinConnectionMessage";


const insertLinkedinConnectionMessageStreaming = async (client, params) => {
    const { inputData } = params;
    const linkedinMessageCollection = client.collection(collectionName);
    const dataInsert = await linkedinMessageCollection.insertOne({
        userId: inputData.userId,
        jobDescriptionObjectId: inputData.jobDescriptionObjectId ? inputData.jobDescriptionObjectId : "",
        resumeObjectId: inputData.resumeObjectId ? inputData.resumeObjectId : "",
        resumeVersion:inputData.resumeVersion ? inputData.resumeVersion : "",
        chatPrompt : inputData.chatPrompt,
        userContent: inputData.userContent,
        resumeBasicInfo: inputData.resumeBasicInfo,
        parsedOutput:inputData.parsedOutput,
        advanceFeature: inputData.advanceFeature ? inputData.advanceFeature : null,
        userInfo:inputData.userInformation ? inputData.userInformation : null,
        createdAt: new Date(),

    });

    return dataInsert;
};


const updateLinkedinConnectionMessageStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const linkedinMessageCollection = client.collection(collectionName);
    const objectid = new ObjectId(inputData.resumeObjectId);

    const filter = {
        userId: userId,
        _id: objectid,
    };

    const messageUpdate = await linkedinMessageCollection.updateOne(
        filter,
        {
            $set: {
                lastUpdate: new Date(),
                lastUpdateLinkedinConnectionMessage: new Date(),
                fetchTimeLinkedinConnectionMessage:inputData.fetchTime,
            },
            $push: {
                linkedinConnectionMessageAiGenerate: inputData.parsedOutput.linkedinConnectionMessage,
            },
        }
    );

    return messageUpdate;
};

const getLinkedinConnectionMessageByResumeIdVersion = async (client, params) => {
    const { resumeId, version } = params;
    const versionInt = parseInt(version, 10);
    const linkedinMessageCollection = client.collection(collectionName);
    const cursor = await linkedinMessageCollection.find(
        {
            resumeObjectId: resumeId,
            resumeVersion:versionInt
        },
        { projection: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                parsedOutput:1,
                advanceFeature:1,
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

const getLinkedinConnectionMessageListByUserId = async (client, params) => {
    const { userId } = params;
    const linkedinMessageCollection = client.collection(collectionName);
    const cursor = await linkedinMessageCollection.aggregate([
        {
            $match: {
                userId: userId // Filter by userId to process only relevant documents
            }
        },
        {
            $group: {
                _id: "$resumeObjectId", // Group by resumeObjectId
                userId: { $first: "$userId" }, // Since userId is the same for all grouped items, just take the first one
                createdAt: { $last: "$createdAt" }, // Assuming you want the last createdAt value; adjust as needed
                userContent: { $first: "$userContent" }, // Assuming you want the first userContent value; adjust as needed
                // parsedOutput: { $first: "$parsedOutput" }, // Assuming you want the first parsedOutput value; adjust as needed
                resumeObjectId: { $first: "$resumeObjectId" }, // Assuming you want the first resumeObjectId value; adjust as needed
                resumeVersion: { $first: "$resumeVersion" }, // Assuming you want the first resumeVersion value; adjust as needed
                advanceFeature: { $first: "$advanceFeature" }, // Assuming you want the first advanceFeature value; adjust as needed
                resumes: { $push: "$resumeInfo" }, // Collect all joined resume documents
                messageCount: { $sum: 1 } // Count the number of documents in each group
            }
        },
        {
            $sort: {
                "createdAt": -1 // Optionally, sort the grouped results by createdAt in ascending order
            }
        }
    ]);

    const data = [];
    for await (const doc of cursor) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};

const getLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion = async (client, params) => {
    const { userId, resumeObjectId, resumeVersion } = params;
    const linkedinMessageCollection = client.collection(collectionName);
    const pipeline = [
        {
            $match: {
                userId: userId, // Match by userId
                resumeObjectId: resumeObjectId, // Match by resume ObjectId
                resumeVersion: parseInt(resumeVersion, 10) // Match by resume Version
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
            }
        }
    ];
    const result = await linkedinMessageCollection.aggregate(pipeline);
    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};

// Action router
const actionHandlers = {
    insertLinkedinConnectionMessageStreaming,
    updateLinkedinConnectionMessageStreaming,
    getLinkedinConnectionMessageByResumeIdVersion,
    getLinkedinConnectionMessageListByUserId,
    getLinkedinConnectionMessageDataByUserIdResumeIdResumeVersion
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
