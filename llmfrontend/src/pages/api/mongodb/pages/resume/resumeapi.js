import { actionDispatcher } from '../lib/actionDispatcher';
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
const collectionName = "resume";


const insertNewResume = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const dataInsert = await resumeCollection.insertOne({
        userId: userId,
        resumeTemplateName: inputData.resumeTemplateName,
        postData: inputData.postData,
        postBodyJDInfoExtract: {},
        postBodyResumeOverviewRewrite: {},
        microsoftOpenAIResultJDInfoExtract:{},
        microsoftOpenAIResultOverviewRewrite:{},
        overview:{},

        timestamp: new Date(),

    });

    return dataInsert;
};

const insertUpdateResume = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const existingResult = await resumeCollection.count({
        userId: userId,
        resumeTemplateName: inputData.postData.resumeDetailData.resumeTemplateName,
    });
    //console.log("existingResult",existingResult);

    const filter = {
        userId: userId,
        version:existingResult + 1,
        resumeTemplateName: inputData.postData.resumeDetailData.resumeTemplateName,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {

                fetchTimeOverview:inputData.fetchTimeOverview,
                resumeOriginalData:inputData.postData.resumeDetailData,
                postBodyJDInfoExtract: inputData.postData.jdExtractResult,
                postBodyResumeOverviewRewrite: inputData.postBodyResumeOverviewRewrite,

                // microsoftOpenAIResultJDInfoExtract:inputData.microsoftOpenAIResultJDInfoExtract,
                microsoftOpenAIResultOverviewRewrite:inputData.microsoftOpenAIResultOverviewRewrite,
                overviewRewrite:inputData.overview,

                lastUpdate: new Date(),

            }},{upsert: true});

    return resumeUpdate;
};


const insertUpdateResumeStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const existingResult = await resumeCollection.count({
        userId: userId,
        resumeTemplateName: inputData.resumeDetailData.resumeTemplateName,
    });
    //console.log("existingResult",existingResult);

    const filter = {
        userId: userId,
        version:existingResult + 1,
        resumeTemplateName: inputData.resumeDetailData.resumeTemplateName,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                resumeBasicInfo:inputData.resumeBasicInfo,
                fetchTimeOverview:inputData.fetchTime,
                resumeOriginalData:inputData.resumeDetailData,
                postBodyJDInfoExtract: inputData.jdExtractResult,
                postBodyResumeOverviewRewrite: inputData.streamInputData,
                //microsoftOpenAIResultOverviewRewrite:inputData.microsoftOpenAIResultOverviewRewrite,
                overviewRewrite:inputData.overviewRewrite,

                lastUpdate: new Date(),

            },
            $push: {
                overviewRewriteHistory: {
                    overviewRewrite: inputData.overviewRewrite,
                    timestamp: new Date()
                }
            },},{upsert: true});

    // console.log(dataUpdate);
    return JSON.stringify(resumeUpdate);
};

const updateResumeSkillsStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const existingResult = await resumeCollection.count({
        userId: userId,
        resumeTemplateName: inputData.resumeTemplateName,
    });
    //console.log("existingResult",existingResult);

    const filter = {
        userId: userId,
        version:existingResult ,
        resumeTemplateName: inputData.resumeTemplateName,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimeOverview:inputData.fetchTime,
                skillsRewrite:inputData.parsedOutput,
                lastUpdate: new Date(),
            },
            $push: {
                skillsRewriteHistory: {
                    skillsRewrite: inputData.parsedOutput,
                    timestamp: new Date()
                }
            },});

    // console.log(dataUpdate);
    return JSON.stringify(resumeUpdate);
};

const updateSkillsSelect = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectId = new ObjectId(inputData.resumeObjectId);
    const filter = {
        userId: userId,
        _id: objectId,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                skillsRewrite:inputData.skillsRewrite,
                lastUpdate: new Date(),
            },
            $push: {
                skillsRewriteHistory: {
                    skillsRewrite: inputData.skillsRewrite,
                    timestamp: new Date()
                }
            },});

    return JSON.stringify(resumeUpdate);
};

const updateRegenerateResumeOverviewStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(inputData.resumeObjectId);

    const filter = {
        userId: userId,
        _id: objectid,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                lastUpdate: new Date(),
                overviewRewrite:inputData.parsedOutput,
            },
            $push: {
                overviewRewriteHistory: {
                    overviewRewrite: inputData.parsedOutput,
                    timestamp: new Date()
                }
            },
        });

    // console.log(dataUpdate);
    return JSON.stringify(resumeUpdate);
};

const updateRegenerateResumeCoverLetterStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = await new ObjectId(inputData.resumeObjectId);

    const filter = {
        userId: userId,
        _id: objectid,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {
            $set: {
                lastUpdate: new Date(),
                lastUpdateCoverLetter: new Date(),
                fetchTimeCoverLetter:inputData.fetchTime,
            },
            $push: {
                coverLetterAiGenerate: inputData.parsedOutput.coverLetterAiGenerate,
                coverLetterCandidateStrengthMessageContent: { $each:inputData.parsedOutput.coverLetterCandidateStrengthAiGenerate},
            },
        });

    // console.log(dataUpdate);
    return JSON.stringify(resumeUpdate);
};

const updateRegenerateResumeConnectionMessageStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(inputData.resumeObjectId);

    const filter = {
        userId: userId,
        _id: objectid,
    };
    // console.log(filter);

    const resumeUpdate = await resumeCollection.updateOne(
        filter,
        {
            $set: {
                lastUpdate: new Date(),
                lastUpdateLinkedinConnectionMessage: new Date(),
                fetchTimeLinkedinConnectionMessage:inputData.fetchTime,
            },
            $push: {
                linkedinConnectionMessageAiGenerate: inputData.parsedOutput.linkedinConnectionMessage,
            },
        });

    // console.log(dataUpdate);
    return JSON.stringify(resumeUpdate);
};

const updateResume = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const filter = {
        _id: resumeId.insertedId,
        userId: userId,
        resumeTemplateName: inputData.postData.resumeTemplateName,
    };
    // console.log(filter);
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTime:inputData.fetchTime,
                postBodyJDInfoExtract: inputData.postBodyJDInfoExtract,
                postBodyResumeOverviewRewrite: inputData.postBodyResumeOverviewRewrite,

                microsoftOpenAIResultJDInfoExtract:inputData.microsoftOpenAIResultJDInfoExtract,
                microsoftOpenAIResultOverviewRewrite:inputData.microsoftOpenAIResultOverviewRewrite,
                overview:inputData.overview,

                lastUpdate: new Date(),

            }});

    // console.log(dataUpdate);
    return dataUpdate;
};


const insertNewJobDescription = async (client, params) => {
    const { inputData, userId } = params;
    const jobDescriptionCollection = client.collection("jobDescription");

    const dataInsert = await jobDescriptionCollection.insertOne({
        userId: userId,
        jdTemplateName: inputData.jdTemplateName,
        postData: inputData.postData,
        postBodyJDInfoExtract: {},
        postBodyResumeOverviewRewrite: {},
        microsoftOpenAIResultJDInfoExtract:{},
        timestamp: new Date(),

    });

    return dataInsert;
};


const updateJobDescription = async (client, params) => {
    const { inputData, userId } = params;
    const jobDescriptionCollection = client.collection("jobDescription");
    
    const filter = {
        userId: userId,
        jdTemplateName: inputData.postData.jobDescriptionTemplateNameRef,
    };
    
    const dataUpdate = await jobDescriptionCollection.updateOne(
        filter,
        {$set: {
                fetchTime:inputData.fetchTime,
                postBodyJDInfoExtract: inputData.postData,
                JDInfoExtractMessageContent: inputData.JDInfoExtractMessageContent,
                jdTemplateName: inputData.jdTemplateName,
                prompt: inputData.prompt,
                lastUpdate: new Date(),

            }},
        {upsert: true});

    return dataUpdate;
};

const updateJobDescriptionStreaming = async (client, params) => {
    const { inputData, userId } = params;
    const jobDescriptionCollection = client.collection("jobDescription");
    
    const filter = {
        userId: userId,
        jdTemplateName: inputData.jdExtractorSubmitOriginalData.jobDescriptionTemplateNameRef,
    };

    const dataUpdate = await jobDescriptionCollection.updateOne(
        filter,
        {$set: {
                fetchTime:inputData.fetchTime,
                postBodyJDInfoExtract: inputData.jdExtractorSubmitOriginalData,
                JDInfoExtractMessageContent: inputData.jobDescriptionResult,
                jdTemplateName: inputData.jdExtractorSubmitOriginalData.jobDescriptionTemplateNameRef,
                prompt: inputData.prompt,
                lastUpdate: new Date(),

            }},
        {upsert: true});

    return dataUpdate;
};

const updateResumeprofessionalExperience = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };
    // console.log(filter);
    const newIdForPostData = uuidv4();
    const newIdForMicrosoftOpenAI = uuidv4();
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {
            $set: {
                // Set the time fields
                fetchTimeProfessionalExperience: inputData.fetchTime,
                lastUpdateProfessionalExperience: new Date(),
                lastUpdate: new Date(),
                // Initialize arrays if they don't exist
                postDataProfessionalExperience: {
                    $cond: {
                        if: { $not: [{ $ifNull: ["$postDataProfessionalExperience", false] }] },
                        then: [{ id: newIdForPostData, ...inputData.postDataProfessionalExperience }],
                        else: "$postDataProfessionalExperience"
                    }
                },
                microsoftOpenAIResultProfessionalExperienceRewrite: {
                    $cond: {
                        if: { $not: [{ $ifNull: ["$microsoftOpenAIResultProfessionalExperienceRewrite", false] }] },
                        then: [{ id: newIdForMicrosoftOpenAI, ...inputData.microsoftOpenAIResultProfessionalExperienceRewrite }],
                        else: "$microsoftOpenAIResultProfessionalExperienceRewrite"
                    }
                }
            },
            $push: {
                // Push new objects if arrays exist
                postDataProfessionalExperience: {
                    $cond: {
                        if: { $ifNull: ["$postDataProfessionalExperience", false] },
                        then: { id: newIdForPostData, ...inputData.postDataProfessionalExperience },
                        else: "$$REMOVE"
                    }
                },
                microsoftOpenAIResultProfessionalExperienceRewrite: {
                    $cond: {
                        if: { $ifNull: ["$microsoftOpenAIResultProfessionalExperienceRewrite", false] },
                        then: { id: newIdForMicrosoftOpenAI, ...inputData.microsoftOpenAIResultProfessionalExperienceRewrite },
                        else: "$$REMOVE"
                    }
                }
            }
        }
    );

    return dataUpdate;
};

const updateResumeprofessionalExperiences = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = await new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimeProfessionalExperience:inputData.fetchTime,
                professionalExperienceRewrite:inputData.professionalExperienceRewrite,
                advancedPromptFeature:inputData.advancedPromptFeature,
                postDataProfessionalExperience: inputData.postDataProfessionalExperience ? inputData.postDataProfessionalExperience : {},
                microsoftOpenAIResultProfessionalExperienceRewrite:inputData.microsoftOpenAIResultProfessionalExperienceRewrite ? inputData.microsoftOpenAIResultProfessionalExperienceRewrite : {},
                lastUpdateProfessionalExperience: new Date(),
                lastUpdate: new Date(),
            },
            $push: {
                professionalExperienceRewriteHistory: {
                    // $each: inputData.professionalExperienceRewrite || [],
                    $each: (inputData.professionalExperienceRewrite || []).map(exp => [exp])

                },
            },
        }
    );

    return dataUpdate;
};

const updateResumeCoverLetter = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };

    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {
            $set: {
                fetchTimeCoverLetter:inputData.fetchTime,
                postDataCoverLetter: inputData.postDataCoverLetter,
                microsoftOpenAIResultCoverLetter:inputData.microsoftOpenAIResultCoverLetter,
                lastUpdateCoverLetter: new Date(),
                lastUpdate: new Date(),
            },
            $push: {
                coverLetterAiGenerate:inputData.coverLetterAiGenerate,
                coverLetterCandidateStrengthMessageContent:{ $each: JSON.parse(inputData.coverLetterCandidateStrengthMessageContent)},
            }});

    return dataUpdate;
};

const updateResumeLinkedinConnectionMessage = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };

    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimeLinkedinConnectionMessage:inputData.fetchTime,
                // linkedinConnectionMessageAiGenerate:inputData.linkedinConnectionMessageAiGenerate,
                postDataLinkedinConnectionMessage: inputData.requestDataLinkedinConnectionMessage,
                microsoftOpenAIResultLinkedinConnectionMessage:inputData.microsoftOpenAIResultLinkedinConnectionMessage,
                lastUpdateLinkedinConnectionMessage: new Date(),
                lastUpdate: new Date(),
            },
            $push: {
                linkedinConnectionMessageAiGenerate: inputData.linkedinConnectionMessageAiGenerate
            }
        }
    );

    return dataUpdate;
};


const updateResumePossibleInterviewQuestions = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimePossibleInterviewQuestions:inputData.fetchTime,
                // linkedinConnectionMessageAiGenerate:inputData.linkedinConnectionMessageAiGenerate,
                requestDataPossibleInterviewQuestions: inputData.requestDataPossibleInterviewQuestions,
                microsoftOpenAIResultPossibleInterviewQuestions:inputData.microsoftOpenAIResultPossibleInterviewQuestions,
                lastUpdateInterviewQuestionsToAsk: new Date(),
                lastUpdate: new Date(),
            },
            $push: {
                // possibleInterviewQuestionsAiGenerate: { $each: JSON.parse(inputData.possibleInterviewQuestionsAiGenerate)}
                possibleInterviewQuestionsAiGenerate: {
                    $each: JSON.parse(inputData.possibleInterviewQuestionsAiGenerate).map((question) => ({
                        ...question,
                        uuid: uuidv4(), // Add a UUID field to each question
                    })),
                },
            }
        }
    );

    return dataUpdate;
};

const updateResumePossibleInterviewQuestionAnswer = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        "_id": objectid,
        "userId": userId,
        "possibleInterviewQuestionsAiGenerate.uuid": inputData.questionUUID, // Match the specific question inside the document

    };
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimePossibleInterviewQuestionAnswer:inputData.fetchTime,
                lastUpdate: new Date(),
            },
            $push: {
                "possibleInterviewQuestionsAiGenerate.$.answers": JSON.parse(inputData.possibleInterviewQuestionAnswer) // Update the answer of the matched question
            }
        });

    return dataUpdate;
};

const updateResumeInterviewQuestionsToAsk = async (client, params) => {
    const { inputData, userId, resumeId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const objectid = new ObjectId(resumeId);
    const filter = {
        _id: objectid,
        userId: userId,

    };
    // console.log(filter);
    const dataUpdate = await resumeCollection.updateOne(
        filter,
        {$set: {
                fetchTimeInterviewQuestionsToAsk:inputData.fetchTime,
                // linkedinConnectionMessageAiGenerate:inputData.linkedinConnectionMessageAiGenerate,
                requestDataInterviewQuestionsToAsk: inputData.requestDataInterviewQuestionsToAsk,
                microsoftOpenAIResultInterviewQuestionsToAsk:inputData.microsoftOpenAIResultInterviewQuestionsToAsk,
                lastUpdateInterviewQuestionsToAsk: new Date(),
                lastUpdate: new Date(),
            },
            $push: {
                interviewQuestionsToAskAiGenerate: { $each: JSON.parse(inputData.interviewQuestionsToAskAiGenerate)}
            }
        }
    );

    return dataUpdate;
};

const insertCallError = async (client, params) => {
    const { inputData } = params;
    const apiCallErrorCollection = client.collection("apiCallError");
    
    const dataInsert = await apiCallErrorCollection.insertOne(inputData);

    return dataInsert;
};


const getResumeTemplateByUserId = async (client, params) => {
    const { userId } = params;
    const resumeCollection = client.collection(collectionName);
    
    const pipeline = [
        {
            $match: {
                userId: userId,
            },
        },
        { $sort: { lastUpdate: -1 } },
        {
            $group: {
                _id: '$resumeTemplateName',
                docID: { $first: '$_id' },
                documents: { $push: '$$ROOT' },
            },
        },
    ];

    const result = await resumeCollection.aggregate(pipeline).toArray();
    return result;
};

const getResumeTemplateByUserIdandDocID = async (client, params) => {
    const { userId, objectId } = params;
    const resumeCollection = client.collection(collectionName);

    const objectid = new ObjectId(objectId);
    const pipeline = [
        {
            $match: {
                userId: userId,
                _id: objectid,
            },
        },
        { $sort: { lastUpdate: -1 } },

    ];

    const result = await resumeCollection.aggregate(pipeline);

    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            _id: doc._id.toString() // Convert ObjectId to string
        });
    }
    return data;
};

const getResumeTemplateListByUserId = async (client, params) => {
    const { userId } = params;
    const resumeCollection = client.collection(collectionName);

    const pipeline = [
        {
            $match: {
                userId: userId,
            },
        },
        { $sort: { lastUpdate: -1 } },

        {
            $group: {
                _id: '$resumeTemplateName',
                docID: { $first: '$_id' },
                // documents: { $push: '$$ROOT' },
            },
        },
    ];

    const result = await resumeCollection.aggregate(pipeline);

    const data = [];
    for await (const doc of result) {
        data.push({
            ...doc,
            docID: doc.docID.toString() // Convert ObjectId to string
        });
    }
    return data;
};

const getJdInfoTemplateByUserId = async (client, params) => {
    const { userId } = params;
    const jobDescriptionCollection = client.collection("jobDescription");

    const pipeline = [
        {
            $match: {
                userId: userId,
            },
        },
        { $sort: { timestamp: -1 } },
        {
            $group: {
                _id: '$jdTemplateName',
                docID: { $first: '$_id' },
                documents: { $push: '$$ROOT' },
            },
        },
    ];

    const result = await jobDescriptionCollection.aggregate(pipeline).toArray();

    return result;
};

// Action router
const actionHandlers = {
    insertNewResume,
    insertUpdateResume,
    insertUpdateResumeStreaming,
    updateResumeSkillsStreaming,
    updateSkillsSelect,
    updateRegenerateResumeOverviewStreaming,
    updateRegenerateResumeCoverLetterStreaming,
    updateRegenerateResumeConnectionMessageStreaming,
    updateResume,
    insertNewJobDescription,
    updateJobDescription,
    updateJobDescriptionStreaming,
    updateResumeprofessionalExperience,
    updateResumeprofessionalExperiences,
    updateResumeCoverLetter,
    updateResumeLinkedinConnectionMessage,
    updateResumePossibleInterviewQuestions,
    updateResumePossibleInterviewQuestionAnswer,
    updateResumeInterviewQuestionsToAsk,
    insertCallError,
    getResumeTemplateByUserId,
    getResumeTemplateByUserIdandDocID,
    getResumeTemplateListByUserId,
    getJdInfoTemplateByUserId,
};

export default async function handler(req, res) {
    await actionDispatcher(req, res, actionHandlers);
}
