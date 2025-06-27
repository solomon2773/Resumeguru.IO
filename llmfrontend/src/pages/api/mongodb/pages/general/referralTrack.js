import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "referalTracking";
const creditCollection = "creditUsage";

const insertReferralTrackData = async (client, params) => {
    const { inputData } = params;
    const referralTrackCollection = client.collection(collectionName);

    const referralTrackData = await referralTrackCollection.insertOne(inputData);

    return referralTrackData;
};

const insertRefereeCreditData = async (client, params) => {
    const { inputData } = params;
    const creditUsageCollection = client.collection(creditCollection);

    const referralTrackData = await creditUsageCollection.insertOne(inputData);

    return referralTrackData;
};



// Action router
const actionHandlers = {
    insertReferralTrackData,
    insertRefereeCreditData,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
