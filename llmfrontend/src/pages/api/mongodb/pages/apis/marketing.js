import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "user";

// Database actions
const getUserProfileIncomplete = async (client, params) => {
    const userCollection = client.collection(collectionName);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pipeline = [
        {
            $match: {
                $or: [
                    { firstName: { $in: [null, ""] } },
                    { lastName: { $in: [null, ""] } },
                    { city: { $in: [null, ""] } },
                    { phoneNumber: { $in: [null, ""] } },
                    { country: { $in: [null, ""] } },
                    { region: { $in: [null, ""] } }
                ]
            }
        },
        {
            $lookup: {
                from: "marketingEmail",
                localField: "userId",
                foreignField: "userId",
                as: "emails"
            }
        },
        {
            $match: {
                $or: [
                    { "emails": { $size: 0 } },  // Includes users who have no marketing emails sent
                    { "emails": {
                            $elemMatch: {
                                createdAt: { $lt: thirtyDaysAgo }
                            }
                        } }
                ]
            }
        }
    ];

    const users = await userCollection.aggregate(pipeline).toArray();
    return users;
};

const getUserByTemplateId = async (client, params) => {
    const { templateId } = params;
    const userCollection = client.collection(collectionName);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const pipeline = [
        {
            $lookup: {
                from: "marketingEmail",
                localField: "userId",
                foreignField: "userId",
                as: "emails"
            }
        },
        {
            $match: {
                $or: [
                    { "emails": { $eq: [] } },  // Includes users who have no marketing emails sent
                    {
                        "emails": {
                            $not: {
                                $elemMatch: {
                                    emailType: "marketingEmailToAll-sendGrid",
                                    templateId: templateId,
                                    createdAt: { $gte: thirtyDaysAgo }
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                userId: 1,
                email: 1
            }
        }
    ];

    const users = await userCollection.aggregate(pipeline).toArray();
    return users;
};

const getJobSearchUser = async (client, params) => {
    const { templateId } = params;
    const userCollection = client.collection(collectionName);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 7);
    const pipeline = [
        {
            $lookup: {
                from: "marketingEmail",
                localField: "userId",
                foreignField: "userId",
                as: "emails"
            }
        },
        {
            $match: {
                $or: [
                    { "emails": { $eq: [] } },  // Includes users who have no marketing emails sent
                    {
                        "emails": {
                            $not: {
                                $elemMatch: {
                                    // emailType: "marketingEmailJobSearchWeekly-sendGrid",
                                    templateId: templateId,
                                    createdAt: { $gte: daysAgo }
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "jobSearch",
                localField: "userId",
                foreignField: "userId",
                as: "jobSearchInfo"
            }
        },
        {
            $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                userId: 1,
                email: 1,
                city:1,
                country:1,
                region:1,
                jobSearchInfo: {
                    $arrayElemAt: ["$jobSearchInfo", 0] // Get the first matching document from jobSearch
                }
            }
        },
        {
            $project: {
                firstName: 1,
                lastName: 1,
                userId: 1,
                email: 1,
                city:1,
                country:1,
                region:1,
                searchQueryParams: "$jobSearchInfo.searchQueryParams",
                // jobs: "$jobSearchInfo.jobs",
                jobCount: "$jobSearchInfo.jobCount",
                index: "$jobSearchInfo.index"
            }
        }
    ];

    const users = await userCollection.aggregate(pipeline).toArray();
    return users;
};

const marketingEmailSent = async (client, params) => {
    const { inputData } = params;
    const marketingEmailCollection = client.collection("marketingEmail");
    const user = await marketingEmailCollection.insertOne(
        {
            userId: inputData.userId ? inputData.userId : null,
            email: inputData.email,
            emailType:inputData.emailType,
            sent: true,
            templateId: inputData.templateId,
            response: inputData.response,
            createdAt: new Date(),

        }
    );
    return user;
};



// Action router
const actionHandlers = {
    getUserProfileIncomplete,
    getUserByTemplateId,
    getJobSearchUser,
    marketingEmailSent,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
