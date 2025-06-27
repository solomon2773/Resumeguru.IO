import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "resume";


// Database actions
const updateSkillsSelect = async (client, params) => {
    const { resumeObjectId, skillsRewrite } = params;
    const resumeCollection = client.collection(collectionName);
    const objectId = new ObjectId(resumeObjectId);
    const filter = {
        _id: objectId,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                skillsRewrite:skillsRewrite,
                lastUpdate: new Date(),
            },
            $push: {
                skillsRewriteHistory: {
                    skillsRewrite: skillsRewrite,
                    timestamp: new Date()
                }
            },});

    // console.log(dataUpdate);
    //return JSON.stringify(resumeUpdate);
    return resumeUpdate;
};

const addNewSkill = async (client, params) => {
    const { resumeObjectId, newSkill } = params;
    const resumeCollection = client.collection(collectionName);
    const objectId = new ObjectId(resumeObjectId);

    const filter = {
        _id: objectId,
    };
    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$push: {
                "skillsRewrite.existingSkills": newSkill,
            },
            });

    // console.log(dataUpdate);
    //return JSON.stringify(resumeUpdate);
    return resumeUpdate;
};

const moveResumeDetailsSkills = async (client, params) => {
    const { resumeObjectId, skillFromIndex, skillTypeFrom, skillTypeTo } = params;
    const resumeCollection = client.collection(collectionName);
    const objectId = new ObjectId(resumeObjectId);

    const filter = {
        _id: objectId,
    };
    const existingSkills = await resumeCollection.findOne(filter);
    const skillsRewrite = existingSkills.skillsRewrite;

    if (!skillsRewrite || !skillsRewrite[skillTypeFrom]) {
        throw new Error(`Skills array '${skillTypeFrom}' not found in the document`);
    }

    const skillToMove = skillsRewrite[skillTypeFrom][skillFromIndex];
    if (!skillToMove) {
        throw new Error("Skill not found at the specified index");
    }

    // Perform the update
    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {
            $push: {
                [`skillsRewrite.${skillTypeTo}`]: skillToMove,
            },
            $pull: {
                [`skillsRewrite.${skillTypeFrom}`]: skillToMove,
            }
        }
    );

    // console.log(dataUpdate);
    //return JSON.stringify(resumeUpdate);
    return resumeUpdate;
};


// Action router
const actionHandlers = {
    updateSkillsSelect,
    addNewSkill,
    moveResumeDetailsSkills
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}

