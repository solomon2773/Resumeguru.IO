import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "resumeBuildingSteps";

// Database actions
const insertCareerBuildingSteps = async (client, params) => {
    const { buildingSteps } = params;
    const collection = client.collection(collectionName);
    const buildStepData = await collection.insertMany(buildingSteps);
    return buildStepData;
};

const getUserCareerBuildingSteps = async (client, params) => {
    const { userId, statuFilter, status } = params;
    const collection = client.collection(collectionName);

    const query = {
        userId: userId
    }

    if (statuFilter) {
        query.status = status;
    }

    const userCareerBuildingSteps = await collection.find(query, {
        projection: {
            _id: 1,
            userId: 1,
            stepId: 1,
            label:1,
            description:1,
            status: 1
        }
    }).toArray();



    const seenSteps = new Set();
    const duplicates = [];

    for (const step of userCareerBuildingSteps) {
        if (seenSteps.has(step.stepId)) {
            duplicates.push(step._id); // Collect _id of duplicates
        } else {
            seenSteps.add(step.stepId);
        }
    }

    // Remove duplicates if any
    if (duplicates.length > 0) {
        await collection.deleteMany({ _id: { $in: duplicates } });
        console.log("Removed duplicate steps:", duplicates);
    }

    // Fetch cleaned data
    const cleanedSteps = await collection.find(query, {
        projection: {
            _id: 1,
            userId: 1,
            stepId: 1,
            label: 1,
            description: 1,
            status: 1,
        },
    }).toArray();

    return cleanedSteps;
};


const updateUserCareerBuildingSteps = async (client, params) => {
    const { userId, stepId, status } = params;
    const collection = client.collection(collectionName);
    const buildStepData = await collection.updateOne({
        userId: userId,
        stepId: stepId,
    }, {
        $set: {
            status: status,
            updatedAt: new Date(),
        }
    });
    return buildStepData;
};

// Action router
const actionHandlers = {
    insertCareerBuildingSteps,
    getUserCareerBuildingSteps,
    updateUserCareerBuildingSteps
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
