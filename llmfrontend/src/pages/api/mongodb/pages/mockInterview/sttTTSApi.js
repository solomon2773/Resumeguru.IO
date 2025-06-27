import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";

const collectionName = "sttTTS";

// Database actions
const mockInterviewSttTtsInsert = async (client, params) => {
    const { data } = params;
    const sttTTSCollection = client.collection(collectionName);
    const sttTTSInsert = await sttTTSCollection.insertOne(
        {
            userId: data.userId,
            sessionId: data.sessionId,
            chatId: data.chatId ? data.chatId : "",
            message: data.message,
           // messageLength: data.message.replace(" ").length,
           // messageWordCount: data.message.trim().split(/\s+/).length,
           // avatarSpeakoutTime: data.message.trim().split(/\s+/).length / 150 * 60,
            msgResult: data.msgResult,
            type: data.type,
            sttResult: data.pronunciationAssessmentObjectResult,
            ttsResult: data.ttsResult,
            createdAt: new Date(),
        }
    );
    return sttTTSInsert;
};

const getSttTtsTextUsage = async (client, params) => {
    const { userId } = params;
    const sttTTSCollection = client.collection(collectionName);
    // Get the current date
    const now = new Date();
    // Get the first day of the current month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get the first day of the next month
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Search for the current month's usage and sum the timeUtilised field
    const sttTTSUsage = await sttTTSCollection.aggregate([
        {
            $match: {
                userId: userId,
                createdAt: {
                    $gte: firstDayOfMonth,
                    $lt: firstDayOfNextMonth
                }
            }
        },
        {
            $group: {
                _id: null,
                totalAvatarSpeakoutTime: { $sum: "$avatarSpeakoutTime" }
            }
        }
    ]).toArray();

    return sttTTSUsage.length > 0 ? sttTTSUsage[0].totalAvatarSpeakoutTime : 0;
};

const getUserInterviewSessions = async (client, params) => {
    const { userId } = params;
    const sttTTSCollection = client.collection(collectionName);
    // Get the current date
    const mockInterViews = await sttTTSCollection.aggregate([
        {
            $match: {
                userId: userId,
                sessionId: { $ne: "" }
            }
        },
        {
            $group: {
                _id: '$sessionId',
                numberOfChats: { $sum: 1 },
                createdAt: {$first: '$createdAt'},
                sessionName: { $first: { $ifNull: ["$sessionName", ""] } },
                chats: {
                    $push: {
                        _id: "$_id",
                        message: "$message",
                        sttResult: "$sttResult",
                    },
                },
            }
        },
        {
            $sort: { createdAt: -1 } // Use 1 for ascending order, -1 for descending
        }
    ]).toArray();

    return mockInterViews;
};


const getInterviewSessionConversations = async (client, params) => {
    const { userId, sessionId } = params;
    const sttTTSCollection = client.collection(collectionName);
    // Get the current date
    const conversations = await sttTTSCollection.aggregate([
        {
            $match: {
                userId: userId,
                sessionId: sessionId,
                createdAt: { $exists: true }
            }
        },
        {
            $sort: {
                createdAt: 1  // Use -1 if you want descending order
            }
        },
        {
            $project: {
                _id: 1,
                chatId: 1,
                message: 1,
                sessionId:1,
                sessionName: { $ifNull: ["$sessionName", ""] },
                messageLength: 1,
                msgResult:1,
                type:1,
                recommendedAnswer:1,
                sttResult:1,
                ttsResult:1,
                messageWordCount:1,
                avatarSpeakoutTime:1,
                createdAt:1
            }
        }
    ]).toArray();

    return conversations;
};


const updateSessionName = async (client, params) => {
    const { userId, sessionId, sessionNameInput } = params;
    const sttTTSCollection = client.collection(collectionName);
    const filter = {
        userId: userId,
        sessionId: sessionId
    };

    const sessionNameUpdate = await sttTTSCollection.updateMany(
        filter,
        {
            $set: {
                sessionName: sessionNameInput,
                lastUpdate: new Date(),
            },
        }
    );

    return sessionNameUpdate;
};

const updateRecommendedAnswerToSttTts = async (client, params) => {
    const { inputData } = params;
    const sttTTSCollection = client.collection(collectionName);
    const objectId = new ObjectId(inputData.objectId);
    const filter = {
        _id:objectId   ,
        // sessionId: sessionId
    };

    const sttTtsUpdate = await sttTTSCollection.updateOne(
        filter,
        {
            $set: {
                recommendedAnswer: inputData.recommendedAnswer,
                recommendedAnswerProcessingTime: inputData.recommendedAnswerProcessingTime,
                lastUpdateType: "recommendedAnswer",
                lastUpdate: new Date(),
            },
        }
    );

    return sttTtsUpdate;
        
};

// Action router
const actionHandlers = {
    mockInterviewSttTtsInsert,
    getSttTtsTextUsage,
    getUserInterviewSessions,
    getInterviewSessionConversations,
    updateSessionName,
    updateRecommendedAnswerToSttTts
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
