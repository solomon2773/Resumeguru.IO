import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
const collectionName = "resume";


// Database actions
const updateResumeOverview = async (client, params) => {
    const { resumeObjectId,  inputData } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(resumeObjectId);
    const filter = {
        _id: _id,
    };
    const resumeOverviewUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                lastUpdate: new Date(),
                overviewRewrite:{
                    overviewRewrite: inputData.overviewRewrite,
                    overviewRewriteTitle: inputData.overviewRewriteTitle,
                }
            },
            $push: {
                overviewRewriteHistory: {
                    overviewRewrite: {
                        overviewRewrite: inputData.overviewRewrite,
                        overviewRewriteTitle: inputData.overviewRewriteTitle,
                    },
                    timestamp: new Date()
                }
            },
        });

    // console.log(dataUpdate);
    return resumeOverviewUpdate;
};

const overviewSelectedVersion = async (client, params) => {
    const { resumeObjectId,  data } = params;
    const resumeCollection = client.collection(collectionName);
    const _id = new ObjectId(resumeObjectId);
    const filter = {
        _id: _id,
    };
    const resumeOverviewUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                lastUpdate: new Date(),
                overviewRewrite:{
                    overviewRewrite: data.overviewRewrite,
                    overviewRewriteTitle: data.overviewRewriteTitle,
                    selectedVersion: data.selectedVersion,
                }
            }
        });

    // console.log(dataUpdate);
    return resumeOverviewUpdate;
};


// Action router
const actionHandlers = {
    updateResumeOverview,
    overviewSelectedVersion
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}

