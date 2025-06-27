import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "referal";


const insertReferralCode = async (client, params) => {
    const { referralCode, userId } = params;
    const referralLinkCollection = client.collection(collectionName);

    const referralCodeUpdate = await referralLinkCollection.insertOne(
        {
            referralCode:referralCode,
            userId:userId,
            createdAt: new Date(),
        });

    return referralCodeUpdate;
};


const getUserReferralCodes = async (client, params) => {
    const { userId } = params;
    const referralLinkCollection = client.collection(collectionName);
    const referralCodes = await referralLinkCollection.find({
        userId: userId
    },
    {
        projection: {
            _id: 1,
            referralCode: 1,
            createdAt: 1
        }
    }).toArray();

    return referralCodes;
};

const checkUniqueReferralCode = async (client, params) => {
    const { referralCode } = params;
    const referralLinkCollection = client.collection(collectionName);
    const query = { referralCode: referralCode };
    const referralUserCode = await referralLinkCollection.findOne(query);
    return referralUserCode;
};


const getReferralByCode = async (client, params) => {
    const { referralCode } = params;
    const referralLinkCollection = client.collection(collectionName);
    const referralLink = await referralLinkCollection.findOne({ referralCode: referralCode });
    return referralLink;
};


const deleteReferralCode = async (client, params) => {
    const { referralId } = params;
    const referralLinkCollection = client.collection(collectionName);
    const _id = new ObjectId(referralId);
    const filter = {
        _id: _id,
    };
    const rcDelete = await referralLinkCollection.deleteOne(filter);
    return rcDelete;
};


// Action router
const actionHandlers = {
    insertReferralCode,
    getUserReferralCodes,
    checkUniqueReferralCode,
    getReferralByCode,
    deleteReferralCode,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
