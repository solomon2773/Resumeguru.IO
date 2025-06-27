import { actionDispatcher } from '../lib/actionDispatcher';

const collectionName = "resumeBuildingSteps";

// Database actions
const insertResumeBuildingSteps = async (client, params) => {
    const { userId, buildingStep, description } = params;
    const resumeBuildingStepsCollection = client.collection(collectionName);
    
    const buildStepData = await resumeBuildingStepsCollection.insertOne({
        userId: userId,
        buildingStep: buildingStep,
        description: description,
        createdAt: new Date(),
    });

    return buildStepData;
};


// Action router
const actionHandlers = {
    insertResumeBuildingSteps,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
