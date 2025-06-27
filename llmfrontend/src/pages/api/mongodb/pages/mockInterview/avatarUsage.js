import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "avatarUsage";

// Database actions
const avatarUsageUpdateByChatId = async (client, params) => {
    const { data } = params;
    const avatarUsageCollection = client.collection(collectionName);
    const dataInsertUpdate = await avatarUsageCollection.updateOne({
        sessionId: data.sessionId
    }, {
        $set: {
            "userId": data.userId,
            "chatId": data.chatId,
            "sessionId": data.sessionId,
            "sessionStartTime": data.sessionStartTime,
            "textToSpeekStartTime": data.textToSpeekStartTime,
            "textToSpeek": data.textToSpeek,
            "textToSpeekEndTime": data.textToSpeekEndTime,
            "textToSpeekDuration": data.textToSpeekDuration,
            "sessionEndTime": data.sessionEndTime,
            "sessionDuration": data.sessionDuration,
            "status": data.status,
            "canceledReason": data.canceledReason,
            "updatedAt": new Date(),
        }
    }, {
        upsert: true
    });

    return dataInsertUpdate;
};

// Action router
const actionHandlers = {
    avatarUsageUpdateByChatId,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
