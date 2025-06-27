const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/resumeapi', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DB call failed:', error);
      throw error;
    }
};



export async function mongodbInsertNewResume(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'insertNewResume'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbInsertUpdateResume(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'insertUpdateResume'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbInsertUpdateResumeStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'insertUpdateResumeStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResumeSkillsStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateResumeSkillsStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateSkillsSelect(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateSkillsSelect'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateRegenerateResumeOverviewStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateRegenerateResumeOverviewStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateRegenerateResumeCoverLetterStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateRegenerateResumeCoverLetterStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateRegenerateResumeConnectionMessageStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateRegenerateResumeConnectionMessageStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResume(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResume'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbInsertNewJobDescription(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'insertNewJobDescription'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateJobDescription(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateJobDescription'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateJobDescriptionStreaming(inputData, userId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        action: 'updateJobDescriptionStreaming'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResumeprofessionalExperience(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumeprofessionalExperience'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}
export async function mongodbUpdateResumeprofessionalExperiences(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumeprofessionalExperiences'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbUpdateResumeCoverLetter(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumeCoverLetter'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResumeLinkedinConnectionMessage(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumeLinkedinConnectionMessage'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbUpdateResumePossibleInterviewQuestions(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumePossibleInterviewQuestions'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbUpdateResumePossibleInterviewQuestionAnswer(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumePossibleInterviewQuestionAnswer'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbUpdateResumeInterviewQuestionsToAsk(inputData, userId, resumeId) {
    const tResp = await makeDbCall({
        inputData : inputData,
        userId: userId,
        resumeId: resumeId,
        action: 'updateResumeInterviewQuestionsToAsk'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }

}

export async function mongodbInsertCallError(inputData  ) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'insertCallError'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function getResumeTemplateByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getResumeTemplateByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function getResumeTemplateByUserIdandDocID(userId, objectId) {
    const tResp = await makeDbCall({
        userId : userId,
        objectId: objectId,
        action: 'getResumeTemplateByUserIdandDocID'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function getResumeTemplateListByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getResumeTemplateListByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function getJdInfoTemplateByUserId(userId) {
    const tResp = await makeDbCall({
        userId : userId,
        action: 'getJdInfoTemplateByUserId'
    });

    if (tResp.success && Array.isArray(tResp.result)) {
        return tResp.result;
    } else {
        return false;
    }
}
