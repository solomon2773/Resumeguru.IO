import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "user";


// Database actions
const UpdateBasicUserProfile = async (client, params) => {
    const { userId,  inputData } = params;
    const userCollection = client.collection(collectionName);
    const query = { "userId": userId };
    const update = {
        $set: {
            "firstName": inputData.firstName,
            "lastName": inputData.lastName,
            "displayName": inputData.firstName + " " + inputData.lastName,
            "phoneNumber": inputData.phoneNumber ? inputData.phoneNumber : '',
            "city": inputData.city ? inputData.city : '',
            "region": inputData.region ? inputData.region : '',
        },
        $push:{
            "emailHistory": inputData.email
        }
    };
    const result = await userCollection.updateOne(query, update);
    return result;
};

// Action router
const actionHandlers = {
    UpdateBasicUserProfile,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}

