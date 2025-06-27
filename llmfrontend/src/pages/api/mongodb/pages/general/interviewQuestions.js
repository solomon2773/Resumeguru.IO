import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "interviewQuestion";

// Database actions
const interviewQuestionAnswerStreamingInsert = async (client, params) => {
    const { inputData } = params;
    const interviewQuestionCollection = client.collection(collectionName);
    const dataInsert = await interviewQuestionCollection.updateOne({
        "userId": inputData.userId,
        "jobDescriptionObjectId": inputData.jobDescriptionObjectId ? inputData.jobDescriptionObjectId : "",
        "resumeObjectId": inputData.resumeObjectId ? inputData.resumeObjectId : "",
        "resumeVersion":inputData.resumeVersion ? inputData.resumeVersion : "",
    },
    {
        // Ensure the 'answers' array exists and push a new object into it
        "$push": {
            "parsedOutput.$[elem].answers": {
                // Your new object to push
                "$each": [{ answer: inputData.parsedOutput}],
            }
        },
        // Update lastUpdate field
        "$currentDate": {
            "lastUpdate": true
        },
        // Update lastUpdateType field
        "$set": {
            "lastUpdateType": "generateInterviewQuestionAnswerStreaming",
        }
    },
    {
        // Array filter to apply the update to the object within parsedOutput matching the given uuid
        "arrayFilters": [{"elem.uuid": inputData.questionUUID}],
        "upsert": false // Ensure this is false to prevent creating a new document if none match
    }).catch(err => {
        console.error(`Failed to update document: ${err}`);
        return err;
    });

    return dataInsert;
};

const interviewQuestionsStreamingInsert = async (client, params) => {
    const { inputData } = params;
    const interviewQuestionCollection = client.collection(collectionName);
    const dataInsert = await interviewQuestionCollection.insertOne({
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

const getInterviewQuestionListByUserId = async (client, params) => {
    const { userId } = params;
    const inteviewQuestionCollection = client.collection(collectionName);

    const cursor = await inteviewQuestionCollection.aggregate([
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
                resumeObjectId: { $first: "$resumeObjectId" }, // Assuming you want the first resumeObjectId value; adjust as needed
                resumeVersion: { $first: "$resumeVersion" }, // Assuming you want the first resumeVersion value; adjust as needed
                questionCount: { $sum: 1 } // Count the number of documents in each group
            }
        },
        {
            $sort: {
                "createdAt": -1 // Optionally, sort the grouped results by createdAt in ascending order
            }
        }
    ])

    const data = [];
    for await (const doc of cursor) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }

    return data;

};


const getInterviewQuestionByUserIdAndResumeId = async (client, params) => {
    const { userId, resumeObjectId } = params;
    const inteviewQuestionCollection = client.collection(collectionName);
    const pipeline = [
        {
            $match: {
                userId: userId, // Match by userId
                resumeObjectId: resumeObjectId // Match by document ObjectId
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
    const result = await inteviewQuestionCollection.aggregate(pipeline);

    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};


const getInterviewQuestionByResumeIdVersion = async (client, params) => {
    const { userId, resumeId, version } = params;
    const versionInt = parseInt(version, 10);
    const inteviewQuestionCollection = client.collection(collectionName);
    const cursor = await inteviewQuestionCollection.find(
        {
            userId: userId,
            resumeObjectId: resumeId,
            resumeVersion:versionInt
        },
        { projection: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                userContent:1,
                jobDescriptionObjectId:1,
                parsedOutput:1,
                advanceFeature:1,
            }
        },
        {
            sort: {
                "createdAt": -1
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
    interviewQuestionAnswerStreamingInsert,
    interviewQuestionsStreamingInsert,
    getInterviewQuestionListByUserId,
    getInterviewQuestionByUserIdAndResumeId,
    getInterviewQuestionByResumeIdVersion
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
