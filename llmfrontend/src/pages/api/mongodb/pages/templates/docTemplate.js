import { actionDispatcher } from '../lib/actionDispatcher';

const collectionName = "docTemplate";

// Database actions
const getResumeTemplate = async (client, params) => {
    const { templateType, formatType } = params;
    const collection = client.collection(collectionName);
    const filter = { templateType: formatType && formatType === "bullet" ? templateType + "-" + formatType : templateType + "-paragraph" , enable: true};

    const docTemplateData = await collection.find(filter).toArray();
    return docTemplateData;
};


// Action router
const actionHandlers = {
    getResumeTemplate,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
