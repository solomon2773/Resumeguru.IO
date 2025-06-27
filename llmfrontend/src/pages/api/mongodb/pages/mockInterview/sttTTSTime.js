import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "sttTTSTime";

// Database actions
const mockInterviewSttTtsTimeInsert = async (client, params) => {
    const { data } = params;
    const sttTTSTimeCollection = client.collection(collectionName);
    const sttTTSTimeCollectionInsert = await sttTTSTimeCollection.insertOne(
        {
            userId: data.userId,
            chatId: data.chatId,
            sessionId: data.sessionId,
            type: data.type,
            timeUtilised: data.timeUtilised,
            createdAt: new Date(),
        }
    );
    return sttTTSTimeCollectionInsert;
};

const sttTimeUpdate = async (client, params) => {
    const { data } = params;
    const sttTTSTimeCollection = client.collection(collectionName);
    const dataInsertUpdate = await sttTTSTimeCollection.updateOne({
        _id: data.insertedId
    }, {
        $inc: {
            timeUtilised: data.timeUtilised,
        },
        $set: {
            updatedAt: new Date(),
        }
    });

    return dataInsertUpdate;
};

const getAudioSttTtsTimeUsage = async (client, params) => {
    const { userId } = params;
    const sttTTSTimeCollection = client.collection(collectionName);
    const now = new Date();
    // Get the first day of the current month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get the first day of the next month
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Search for the current month's usage and sum the timeUtilised field
    const audioUsage = await sttTTSTimeCollection.aggregate([
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
                totalTimeUtilised: { $sum: "$timeUtilised" }
            }
        }
    ]).toArray();

    return audioUsage.length > 0 ? audioUsage[0].totalTimeUtilised : 0;
};

const getAudioSttTtsTimeUsageBuildingSteps = async (client, params) => {
    const { userId } = params;
    const sttTTSTimeCollection = client.collection(collectionName);
    const now = new Date();


    // Search for the current month's usage and sum the timeUtilised field
    const audioUsage = await sttTTSTimeCollection.aggregate([
        {
            $match: {
                userId: userId,

            }
        },
        {
            $group: {
                _id: null,
                totalTimeUtilised: { $sum: "$timeUtilised" }
            }
        }
    ]).toArray();

    return audioUsage.length > 0 ? audioUsage[0].totalTimeUtilised : 0;
};

// Action router
const actionHandlers = {
    mockInterviewSttTtsTimeInsert,
    sttTimeUpdate,
    getAudioSttTtsTimeUsage,
    getAudioSttTtsTimeUsageBuildingSteps,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
