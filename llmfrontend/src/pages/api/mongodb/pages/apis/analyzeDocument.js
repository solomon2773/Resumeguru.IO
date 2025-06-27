import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "documentIntelligence";

// Database actions
const insertNewLinkedinPdfResumeUpload = async (client, params) => {
    const { inputData, documentUrl,  userId } = params;
    const resumeCollection = client.collection(collectionName);
    const dataInsert = await resumeCollection.insertOne({
        userId: userId,
        documentUrl: documentUrl,
        fileInfo: inputData,
        uploadType: 'linkedinPdfResume',

        createdAt: new Date(),

    });

    return dataInsert;
};


// Action router
const actionHandlers = {
    insertNewLinkedinPdfResumeUpload,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
