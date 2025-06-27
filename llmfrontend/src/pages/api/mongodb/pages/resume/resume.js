import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "resume";


const getResumeListByUserId = async (client, params) => {
    const { userId } = params;
    const resumeCollection = client.collection(collectionName);

    const resumeList = await resumeCollection.aggregate([
        {
            $match: {
                userId: { $eq: userId }
            }
        },
            {
                $sort: {
                    lastUpdate: -1  // Use -1 if you want descending order
                }
            },
        {
            $group: {

                _id: "$resumeTemplateName",
                resumes: {
                    $push: {
                        _id: "$_id",
                        resumeTemplateName: "$resumeTemplateName",
                        version: "$version",
                        lastUpdate: "$lastUpdate",
                        resumeBasicInfo: "$resumeBasicInfo",
                        companyName: "$postBodyJDInfoExtract.companyName", // Extract companyName
                        jobTitle: "$postBodyJDInfoExtract.jobTitle", // Extract jobTitle
                    },

                },

                // Include userId in the output if it's the same for all documents in the group and necessary for your use case
                userId: { $first: "$userId" },
                lastUpdate: { $max: "$lastUpdate" } // Assuming you want the latest lastUpdate for the group
            },

        }, {
                $project: {
                    resumes: 1,
                    userId: 1, // Include userId in the final projection if added in the group stage
                    lastUpdate: 1  // Include lastUpdate in the final projection if you want the latest lastUpdate for the group
                },

            },
            {
                $sort: {
                    lastUpdate: -1  // Use -1 if you want descending order
                }
            },


    ]).toArray();
    return resumeList;
};


const getResumeById = async (client, params) => {
    const { objectId } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(objectId);
    const resume = await resumeCollection.findOne({_id: _id});
    return resume;
};

const getResumesVersionByTemplateName = async (client, params) => {
    const { resumeTemplateName } = params;
    const resumeCollection = client.collection(collectionName);

    const resumes = await resumeCollection.aggregate([
        {
            $match:{
                resumeTemplateName: resumeTemplateName
            }
        },
        {
            $sort: {
                version: -1  // Use -1 if you want descending order
            }
        },
        {
            $project: {
                _id: 1,
                version: 1
            }
        }
    ]).toArray();
    return resumes;
};
const getResumeJobDescriptionByUserIdAndDocId = async (client, params) => {
    const { userId, objectId } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(objectId);
    const resume = await resumeCollection.findOne({
        userId: userId,
        _id: _id
    },
        {
            projection: {
                resumeTemplateName: 1,
                version: 1,
                userId: 1,
                lastUpdate: 1,
                postBodyJDInfoExtract: 1,
                resumeBasicInfo: 1,
            }
        });
    return resume;

};

const deleteResume = async (client, params) => {
    const { inputData } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(inputData.resumeObjectId);
    const filter = {
        _id: _id,
    };
    const rcDelete = await resumeCollection.deleteOne(filter);
    return rcDelete;
};

const getResumeCoverlettersByResumeIDVersion    = async (client, params) => {
    const { query } = params;
    const resumeCollection = client.collection("coverLetter");
    const coverletters = await resumeCollection.find(query,
        { projection: {
                _id: 1,
                createdAt: 1,
                parsedOutput: 1,
                advanceFeature: 1} }).toArray()
    return coverletters;
}

const getResumeQandAByResumeIDVersion    = async (client, params) => {
    const { query } = params;
    const resumeCollection = client.collection("interviewQuestion");
    const QuestionAndAnswers = await resumeCollection.find(query,
        { projection: {
                _id: 1,
                createdAt: 1,
                parsedOutput: 1,
                advanceFeature: 1}
        }).toArray()
    return QuestionAndAnswers;
}
// Action router
const actionHandlers = {
    getResumeListByUserId,
    getResumeById,
    getResumesVersionByTemplateName,
    getResumeJobDescriptionByUserIdAndDocId,
    deleteResume,
    getResumeCoverlettersByResumeIDVersion,
    getResumeQandAByResumeIDVersion,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
