import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "feedback";

const addNewFeedback = async (client, params) => {
    const { inputData } = params;
    const feedbackCollection = client.collection(collectionName);
    const dataResult = await feedbackCollection.insertOne(inputData);

    return dataResult;
};


// Action router
const actionHandlers = {
    addNewFeedback,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
