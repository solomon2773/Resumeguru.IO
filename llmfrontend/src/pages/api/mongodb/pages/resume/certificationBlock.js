import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "resume";


// Database actions
const addNewCertification = async (client, params) => {
    const { inputData } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(inputData.resumeObjectId);
    const filter = {
        _id: _id,
    };

    const resumeCertificationsUpdate = await resumeCollection.updateOne(
        filter,
        {
            $push: {
                ["resumeOriginalData.certifications"]: inputData.certificateData
            }
        }
    );
    return resumeCertificationsUpdate;
};

const removeCertification = async (client, params) => {
    const { inputData } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(inputData.resumeObjectId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(inputData.resumeObjectId);
    

    const resume = await resumeCollection.findOne({_id: objectId});
    if (resume && resume.resumeOriginalData && resume.resumeOriginalData.certifications[inputData.certificationIndex]) {
        const certificationItem = resume.resumeOriginalData.certifications[inputData.certificationIndex];

        // Remove the specific experience entry from the array
        const updatedResume = await resumeCollection.updateOne(
            { _id: objectId },
            { $pull: { "resumeOriginalData.certifications": certificationItem } }
        );

        return updatedResume;
    } else {
        return false;
    }
};

const updateCertification = async (client, params) => {
    const { inputData } = params;
    const resumeCollection = client.collection(collectionName);

    const _id = new ObjectId(inputData.resumeObjectId);
    const filter = {
        _id: _id,
    };

    const resumeCertificationUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                lastUpdate: new Date(),
                ["resumeOriginalData.certifications." + inputData.certificationIndex]:inputData.certificateData
            },

        });

    return resumeCertificationUpdate;
};

const updateCertificationOrder = async (client, params) => {
    const { resumeId, oldIndex, newIndex } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(resumeId);

    const resumeDocument = await resumeCollection.findOne({_id: objectId});
    if (resumeDocument && resumeDocument.professionalExperienceRewrite && resumeDocument.professionalExperienceRewriteHistory) {
        const experienceArray = resumeDocument.professionalExperienceRewrite;
        const [removed] = experienceArray.splice(oldIndex, 1);
        experienceArray.splice(newIndex, 0, removed);

        const updatedResume = await resumeCollection.updateOne(
            { _id: objectId },
            { $set: { "professionalExperienceRewrite": experienceArray } }
        );

        // Initialize professionalExperienceRewriteHistory if it doesn't exist
        let experienceHistoryArray = resumeDocument.professionalExperienceRewriteHistory;
        if (!experienceHistoryArray) {
            experienceHistoryArray = [...experienceArray];
        } else {
            const [removedHistory] = experienceHistoryArray.splice(oldIndex, 1);
            experienceHistoryArray.splice(newIndex, 0, removedHistory);
        }


        const updatedResumeHistory = await resumeCollection.updateOne(
            { _id: objectId },
            { $set: { "professionalExperienceRewriteHistory": experienceHistoryArray } }
        );

        return { updatedResume, updatedResumeHistory};

    } else {
        return false;
    }
};

// Action router
const actionHandlers = {
    addNewCertification,
    removeCertification,
    updateCertification,
    updateCertificationOrder,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}

