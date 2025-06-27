import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "mockInterviewVideo";

// Database actions
const mockInterviewChunkInsert = async (client, params) => {
    const { inputData } = params;
    const mockInterviewVideoCollection = client.collection(collectionName);
    const dataResult = await mockInterviewVideoCollection.insertOne(inputData);
    return dataResult;
};

// Action router
const actionHandlers = {
    mockInterviewChunkInsert,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
