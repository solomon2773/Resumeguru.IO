import {
    mongodbInsertUpdateResumeStreaming,
    mongodbUpdateResumeprofessionalExperiences,
    mongodbUpdateResumeSkillsStreaming,
    mongodbUpdateSkillsSelect
} from "./api/resume";

import {estimateTokenCount} from "../../../utils/openAi";


export async function mongodbCreateMyResumeOverviewStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.streamInputData), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.overviewRewrite), 1.0);


    const resumeOverviewUpdate = await mongodbInsertUpdateResumeStreaming(data,  data.userId);
    //
    //
    return resumeOverviewUpdate;

}


export async function mongodbCreateMyResumeProfessionalExperienceRewriteStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.chatPrompt), 1.0);
    const userContentTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.parsedOutput), 1.0);

    // console.log("data",data)
    const professionalExperienceUpdate = await mongodbUpdateResumeprofessionalExperiences({

        fetchTime: data.fetchTime,
        professionalExperienceRewrite:data.parsedOutput.professionalExperienceRewrite,
        advancedPromptFeature: data.advanceFeature,
    },  data.userId, data.resumeObjectId);


    //
    //
    return professionalExperienceUpdate;

}

export async function mongodbUpdateMyResumeSkillsStreaming(data) {


    const promptTokens = await estimateTokenCount(JSON.stringify(data.userContent), 1.0);
    const completionTokens = await estimateTokenCount(JSON.stringify(data.parsedOutput), 1.0);


    const resumeSkillsUpdate = await mongodbUpdateResumeSkillsStreaming(data,  data.userId);


    //
    //
    return resumeSkillsUpdate;

}


export async function mongodbUpdateSkills(data) {

    const resumeSkillsUpdate = await mongodbUpdateSkillsSelect(data,  data.userId);

    return resumeSkillsUpdate;

}
