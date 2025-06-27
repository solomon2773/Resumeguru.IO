import { actionDispatcher } from '../lib/actionDispatcher';
const collectionName = "interviewQuestionToAsk";


const interviewQuestionsStreamingInsert = async (client, params) => {
    const { inputData } = params;
    const interviewQuestionCollection = client.collection(collectionName);
    const dataInsert = await interviewQuestionCollection.insertOne({
        userId: inputData.userId,
        jobDescriptionObjectId: inputData.jobDescriptionObjectId ? inputData.jobDescriptionObjectId : "",
        resumeObjectId: inputData.resumeObjectId ? inputData.resumeObjectId : "",
        resumeVersion:inputData.resumeVersion ? inputData.resumeVersion : "",
        chatPrompt : inputData.chatPrompt,
        userContent: inputData.userContent,
        resumeBasicInfo: inputData.resumeBasicInfo,
        parsedOutput:inputData.parsedOutput,
        advanceFeature: inputData.advanceFeature ? inputData.advanceFeature : null,
        userInfo:inputData.userInformation ? inputData.userInformation : null,
        createdAt: new Date(),

    });

    return dataInsert;
};


const getInterviewQuestionToAskByResumeIdVersion = async (client, params) => {
    const { userId, resumeId, version } = params;
    const versionInt = parseInt(version, 10);
    const inteviewQuestionCollection = client.collection(collectionName);
    const cursor = await inteviewQuestionCollection.find(
        {
            userId: userId,
            resumeObjectId: resumeId,
            resumeVersion:versionInt
        },
        { projection: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                userContent:1,
                jobDescriptionObjectId:1,
                parsedOutput:1,
                advanceFeature:1,
            }
        },
        {
            sort: {
                "createdAt": -1
            }
        }
    );
    const data = [];
    for await (const doc of cursor) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};

// Action router
const actionHandlers = {
    interviewQuestionsStreamingInsert,
    getInterviewQuestionToAskByResumeIdVersion,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
