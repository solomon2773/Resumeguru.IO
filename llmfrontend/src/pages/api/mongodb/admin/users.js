import { actionDispatcher } from '../pages/lib/actionDispatcher';
const collectionName = "user";

// Database actions
const getUserIdByUserEmail = async (client, params) => {
    const { email } = params;
    const usersCollection = client.collection(collectionName);
    
    const existingUser = await usersCollection.findOne({
        email: email
    });
    if (existingUser) {
        return existingUser.userId;
    } else {
        return null;
    }
};



// Action router
const actionHandlers = {
    getUserIdByUserEmail,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
