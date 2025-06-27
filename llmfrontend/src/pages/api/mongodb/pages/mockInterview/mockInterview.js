import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "mockInterview";

// Database actions
const mockInterviewMessageInsert = async (client, params) => {
    const { data } = params;
    const mockInterviewCollection = client.collection(collectionName);
    const mockInterviewInsert = await mockInterviewCollection.insertOne(
        {
            userId: data.userId,
            sessionId: data.sessionId,
            chatId: data.chatId ? data.chatId : "",
            message: data.message.message,
            messageLength: data.message.message.replace(/\s+/g, '').length,
            messageId: data.message.id,
            messageTimeStamp: data.message.timeStamp,
            messageLocalTimeString: data.message.localTimeString,
            msg_from: data.message.msg_from,
            pronunciationAssessment: data.pronunciationAssessment ? data.pronunciationAssessment : "",
            createdAt: new Date(),
        }
    );
    return mockInterviewInsert;
};

// Action router
const actionHandlers = {
    mockInterviewMessageInsert,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
