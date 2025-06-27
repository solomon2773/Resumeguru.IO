import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "resume";


// Database actions
const updateResumeEducation = async (client, params) => {
    const { resumeId, educationIndex, educationData } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(resumeId);
    const updateField = `resumeOriginalData.education.${educationIndex}`;
    const updatedResume = await resumeCollection.updateOne(
        { _id: objectId },
        { $set: { [updateField]: educationData } }
    );

    return updatedResume;
};

const removeResumeEducation = async (client, params) => {
    const { resumeId, educationIndex } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(resumeId);
    const resume = await resumeCollection.findOne({_id: objectId});
    if (resume && resume.resumeOriginalData && resume.resumeOriginalData.education && resume.resumeOriginalData.education[educationIndex]) {
        const educationItem = resume.resumeOriginalData.education[educationIndex];

        // Remove the specific education entry from the array
        const updatedResume = await resumeCollection.updateOne(
            { _id: objectId },
            { $pull: { "resumeOriginalData.education": educationItem } }
        );

        return updatedResume;
    } else {
        throw new Error('Invalid educationIndex');
    }
};

const addNewResumeEducation = async (client, params) => {
    const { resumeId, educationData } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(resumeId);
    const updatedResume = await resumeCollection.updateOne(
        { _id: objectId },
        { $push: { "resumeOriginalData.education": educationData } }
    );

    return updatedResume;
};

const updateResumeEducationOrder = async (client, params) => {
    const { resumeId, oldIndex, newIndex } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }
    const objectId = new ObjectId(resumeId);

    const resume = await resumeCollection.findOne({_id: objectId});

    if (resume && resume.resumeOriginalData && resume.resumeOriginalData.education) {
        const education = resume.resumeOriginalData.education;
        const [removed] = education.splice(oldIndex, 1);
        education.splice(newIndex, 0, removed);

        const updatedResume = await resumeCollection.updateOne(
            { _id: objectId },
            { $set: { "resumeOriginalData.education": education } }
        );

        return updatedResume;
    } else {
        throw new Error('Invalid educationIndex');
    }
};



// Action router
const actionHandlers = {
    updateResumeEducation,
    removeResumeEducation,
    addNewResumeEducation,
    updateResumeEducationOrder
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
