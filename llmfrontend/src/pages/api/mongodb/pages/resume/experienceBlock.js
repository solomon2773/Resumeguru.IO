import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from "uuid";
const collectionName = "resume";


// Database actions
const removeResumeExperience = async (client, params) => {
    const { resumeId, experienceIndex } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeId)) {
        throw new Error('Invalid resumeId');
    }

    const objectId = new ObjectId(resumeId);
    const resume = await resumeCollection.findOne({_id: objectId});
    if (resume && resume.professionalExperienceRewrite && resume.professionalExperienceRewrite[experienceIndex]) {
        const experienceItem = resume.professionalExperienceRewrite[experienceIndex];


        const updatedExperienceRewriteHistory = resume.professionalExperienceRewriteHistory.filter(
            (_, index) => index !== experienceIndex
        );
        const updatedExperienceRewriteHistoryArray = updatedExperienceRewriteHistory.map(item => [item]);

        // Update the document
        const updatedResume = await resumeCollection.updateOne(
            { _id: objectId },
            {
                $pull: { "professionalExperienceRewrite": experienceItem },
                $set: { "professionalExperienceRewriteHistory": updatedExperienceRewriteHistory }
            }
        );


        return updatedResume;
    }
};

const updateExperienceRewrite = async (client, params) => {
    const { inputData } = params;
    const resumeCollection = client.collection(collectionName);

    const _id = new ObjectId(inputData.resumeObjectId);
    const filter = {
        _id: _id,
    };
    const resumeDocument = await resumeCollection.findOne(filter, {projection: {
            professionalExperienceRewrite: 1,
            professionalExperienceRewriteHistory: 1
        }});
    const { professionalExperienceRewrite, professionalExperienceRewriteHistory } = resumeDocument;

    // Check if professionalExperienceRewriteHistory exists and is an array
    if (!professionalExperienceRewriteHistory || !Array.isArray(professionalExperienceRewriteHistory)) {
        // Initialize professionalExperienceRewriteHistory as an empty array or match it with the length of professionalExperienceRewrite
        const history = professionalExperienceRewrite ? new Array(professionalExperienceRewrite.length).fill([]) : [];
        // Update the document with the initialized or corrected array
        await resumeCollection.updateOne(filter, {
            $set: { professionalExperienceRewriteHistory: history }
        });
        //console.log('Initialized or corrected professionalExperienceRewriteHistory');
    } else {
        // console.log('professionalExperienceRewriteHistory is already initialized and correct.');
    }

    if (inputData.professionalExperienceContentSytle === "bullet"){
        const resumeExperienceUpdate = await resumeCollection.updateOne(
            filter,
            {$set: {
                    lastUpdate: new Date(),
                    ["professionalExperienceRewrite." + inputData.experienceEditIndex]:{
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescriptionBulletPoints: inputData.professionalExperienceDescriptionBulletPoints,
                        selectedVersion: inputData.selectedVersion,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                    }
                },
                $push: {
                    [`professionalExperienceRewriteHistory.${inputData.experienceEditIndex}`]: {
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescriptionBulletPoints: inputData.professionalExperienceDescriptionBulletPoints,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    }
                },
            });

        // console.log(experienceRewriteHistory);
        // console.log(dataUpdate);
    } else {
        const resumeExperienceUpdate = await resumeCollection.updateOne(
            filter,
            {$set: {
                    lastUpdate: new Date(),
                    ["professionalExperienceRewrite." + inputData.experienceEditIndex]:{
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescription: inputData.professionalExperienceDescription,
                        selectedVersion: inputData.selectedVersion,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                    }
                },
                $push: {
                    [`professionalExperienceRewriteHistory.${inputData.experienceEditIndex}`]: {
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescription: inputData.professionalExperienceDescription,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    }
                },
            });
    }
    const experienceRewriteHistory = await resumeCollection.findOne(filter, {projection: {professionalExperienceRewriteHistory: 1}});

    return experienceRewriteHistory;
};

const updateResumeExperienceOrder = async (client, params) => {
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

    }
};

const addNewExperienceRewrite = async (client, params) => {
    const { resumeObjectId, inputData } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeObjectId)) {
        throw new Error('Invalid resumeId');
    }

    const _id = new ObjectId(resumeObjectId);
    const filter = {
        _id: _id,
    };
    const resumeDocument = await resumeCollection.findOne(filter, {projection: {
            professionalExperienceRewrite: 1,
            professionalExperienceRewriteHistory: 1
        }});
    const { professionalExperienceRewrite, professionalExperienceRewriteHistory } = resumeDocument;

    // Check if professionalExperienceRewriteHistory exists and is an array
    if (!professionalExperienceRewriteHistory || !Array.isArray(professionalExperienceRewriteHistory)) {
        // Initialize professionalExperienceRewriteHistory as an empty array or match it with the length of professionalExperienceRewrite
        const history = professionalExperienceRewrite ? new Array(professionalExperienceRewrite.length).fill([]) : [];
        // Update the document with the initialized or corrected array
        await resumeCollection.updateOne(filter, {
            $set: { professionalExperienceRewriteHistory: history }
        });
    } else {
        // console.log('professionalExperienceRewriteHistory is already initialized and correct.');
    }

    if (inputData.professionalExperienceContentSytle === "bullet"){
        const resumeExperienceUpdate = await resumeCollection.updateOne(
            filter,
            {
                $push: {
                    professionalExperienceRewrite: {
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescriptionBulletPoints: inputData.professionalExperienceDescriptionBulletPoints,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        selectedVersion: 0,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    },
                    professionalExperienceRewriteHistory: [{
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescriptionBulletPoints: inputData.professionalExperienceDescriptionBulletPoints,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    }]
                }
            }
        );
        return resumeExperienceUpdate
    } else {
        const resumeExperienceUpdate = await resumeCollection.updateOne(
            filter,
            {
                $push: {
                    professionalExperienceRewrite: {
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescription: inputData.professionalExperienceDescription,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        selectedVersion: 0,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    },
                    professionalExperienceRewriteHistory: [{
                        companyName: inputData.companyName,
                        professionalExperienceTitle: inputData.professionalExperienceTitle,
                        matchingSkills: inputData.matchingSkills ? inputData.matchingSkills : [],
                        professionalExperienceDescription: inputData.professionalExperienceDescription,
                        jobStartDate: inputData.jobStartDate,
                        jobEndDate: inputData.jobEndDate,
                        uuid :uuidv4(),
                        timestamp: new Date()
                    }]
                }
            },
        );
        return resumeExperienceUpdate;
    }

};

const updateExperienceVersion = async (client, params) => {
    const { resumeObjectId, experienceIndex, versionIndex } = params;
    const resumeCollection = client.collection(collectionName);

    if (!ObjectId.isValid(resumeObjectId)) {
        throw new Error('Invalid resumeId');
    }

    const _id =  new ObjectId(resumeObjectId);
    const filter = {
        _id: _id,
    };
    const resumeDocument = await resumeCollection.findOne(filter, {
        projection: {
            professionalExperienceRewriteHistory: 1,

        }
    });
    const {professionalExperienceRewriteHistory} = resumeDocument;
    const experienceHistory = professionalExperienceRewriteHistory[experienceIndex];
    await resumeCollection.updateOne(
        filter,
        {
            $set: {
                ["professionalExperienceRewrite." + experienceIndex]: {
                    ...experienceHistory[versionIndex],
                    selectedVersion: versionIndex,
                }
            }
        }
    );
};

// Action router
const actionHandlers = {
    removeResumeExperience,
    updateExperienceRewrite,
    updateResumeExperienceOrder,
    addNewExperienceRewrite,
    updateExperienceVersion,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
