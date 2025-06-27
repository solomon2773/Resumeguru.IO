import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "coverLetter";

// Database actions
const coverLetterStreamingInsert = async (client, params) => {
    const { inputData } = params;
    const collection = client.collection(collectionName);
    const dataInsert = await collection.insertOne({
        userId: inputData.userId,
        jobDescriptionObjectId: inputData.jobDescriptionObjectId ? inputData.jobDescriptionObjectId : "",
        resumeObjectId: inputData.resumeObjectId ? inputData.resumeObjectId : "",
        resumeVersion:inputData.resumeVersion ? inputData.resumeVersion : "",
        chatPrompt : inputData.chatPrompt,
        userContent: inputData.userContent,
        parsedOutput:inputData.parsedOutput,
        coverletterType: inputData.coverletterType ? inputData.coverletterType : null,
        advanceFeature: inputData.advanceFeature ? inputData.advanceFeature : null,
        userInfo:inputData.userInformation ? inputData.userInformation : null,
        createdAt: new Date(),
    });
    return dataInsert;
};

const getLast24HoursCoverLetterData = async (client, params) => {
    const { userId } = params;
    const collection = client.collection(collectionName);

    const date = new Date();
    date.setDate(date.getDate() - 1);

    const cursor = await collection.find(
        {
            userId: userId, 
            createdAt: { $gte: date }
        },
        {
            projection: { 
                _id: 1,
                userId: 1,
                createdAt: 1
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

const getCoverLetterListByUserId = async (client, params) => {
    const { userId } = params;
    const collection = client.collection(collectionName);

    const cursor = await collection.find(
        {
            userId: userId, 
        },
        {
            projection: { 
                _id: 1,
                userId: 1,
                createdAt: 1,
                coverletterType: 1,
                userContent: {
                    companyName : 1,
                    jobTitle : 1,
                    writingTone: 1,
                }
            },
            sort: { createdAt: -1 }
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

const getCoverLetterDataByUserIdAndDocId = async (client, params) => {
    const { userId, docId } = params;
    const coverLetterCollection = client.collection(collectionName);

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
    const result = await coverLetterCollection.aggregate(pipeline);
    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }

    return data[0];
};


const getCoverLetterByResumeIdVersion = async (client, params) => {
    const { resumeId, version } = params;
    const coverLetterCollection = client.collection(collectionName);
    const versionInt = parseInt(version, 10);
    const cursor = await coverLetterCollection.find(
        {
            resumeObjectId: resumeId,
            resumeVersion:versionInt
        },
        {   
            projection: {
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

// Action router
const actionHandlers = {
    coverLetterStreamingInsert,
    getLast24HoursCoverLetterData,
    getCoverLetterListByUserId,
    getCoverLetterDataByUserIdAndDocId,
    getCoverLetterByResumeIdVersion
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
