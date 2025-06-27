import { actionDispatcher } from '../pages/lib/actionDispatcher';
import countryList, {countryListSearch} from "../../../../utils/staticObjects/countryList";
const userStatusCollectionName = 'userStatus';
const userCollectionName = 'user';

// Database actions
const insertOneUserStatus = async (client, params) => {
    const { data } = params;
    const userStatusCollection = client.collection(userStatusCollectionName);
    const dataInsertUpdate = await userStatusCollection.insertOne({

            userId: data.userId,
            clientIpAddress:data.clientIpAddress,
            city:data.city,
            region:data.region,
            country:data.country,
            countryCode:data.countryCode,
            path:data.path,
            statusType:data.statusType,
            createdAt: new Date()

    });

    return dataInsertUpdate;
};

const findExistingUserByFirebaseId = async (client, params) => {
    const { data } = params;
    const userCollection = client.collection(userCollectionName);
    const userData = await userCollection.findOne({
        firebaseID: data.firebaseID
    });
    return userData;
}
const findExistingUserByUserId = async (client, params) => {
    const { data } = params;
    const userCollection = client.collection(userCollectionName);
    const userData = await userCollection.findOne({
        userId: data.userId
    });
    return userData;
}
const addNewUser = async (client, params) => {
    const { data } = params;
    const userCollection = client.collection(userCollectionName);
    const newUserInsert = await userCollection.insertOne({
        firebaseID:data.firebaseID,
        userId: data.userId,
        email: data.email,
        about:data.about,
        city:data.city,
        region:data.region,
        country:data.country ,
        signupCredit: data.signupCredit,
        createdAt: new Date(),
        signupId: data.signupId,
        providerId: data.providerId,
        providerUId: data.providerUId,
        displayName: data.displayName,
        firstName: data.firstName,
        lastName: data.lastName,
        newFirebaseOnlyLogin: data.newFirebaseOnlyLogin,
    });
    if (newUserInsert.insertedId) {
        // Fetch the inserted document
        const insertedData = await userCollection.findOne({ _id: newUserInsert.insertedId });
        return insertedData;
    } else {
        return null;
    }
}
const findUserAndUpdateByUserId = async (client, params) => {
    const { data } = params;
    const userCollection = client.collection(userCollectionName);
    const userDataFindOneAndUpdate = await userCollection
        .findOneAndUpdate({ userId: data.userId },
            {
                $set : {
                    firstName: data.userData.firstName,
                    lastName: data.userData.lastName,
                    ...(data.userData.country && { country: data.userData.country }),
                    city: data.userData.city,
                    region: data.userData.region,
                    phoneNumber: data.userData.phoneNumber,
                    ...(data.userData.about && { about: data.userData.about }),
                    ...(data.userData.website && { website: data.userData.website }),
                    ...(data.userData.linkedin && { linkedin: data.userData.linkedin }),
                },
                $push:{
                    "emailHistory": data.userData.email
                }
            });
    if (userDataFindOneAndUpdate.ok){
        return userDataFindOneAndUpdate;
    } else {
        return null;
    }



}
// Action router
const actionHandlers = {
    insertOneUserStatus,
    findExistingUserByFirebaseId,
    findExistingUserByUserId,
    addNewUser,
    findUserAndUpdateByUserId
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
