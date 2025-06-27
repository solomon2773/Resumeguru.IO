const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/skillBlock', {
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

export async function mongodbUpdateSkillsSelect( resumeObjectId, skillsRewrite) {
    const tResp = await makeDbCall({
        resumeObjectId: resumeObjectId,
        skillsRewrite : skillsRewrite,
        action: 'updateSkillsSelect'
    });

    if (tResp.success) {
        return JSON.stringify(tResp.result);
    } else {
        return false;
    }

}
export async function mongodbAddNewSkill (resumeObjectId, newSkill){
    const tResp = await makeDbCall({
        resumeObjectId: resumeObjectId,
        newSkill : newSkill,
        action: 'addNewSkill'
    });

    if (tResp.success) {
        return JSON.stringify(tResp.result);
    } else {
        return false;
    }
}
export async function mongodbMoveResumeDetailsSkills (resumeObjectId, skillFromIndex, skillTypeFrom, skillTypeTo){
    const tResp = await makeDbCall({
        resumeObjectId: resumeObjectId,
        skillFromIndex : skillFromIndex,
        skillTypeFrom: skillTypeFrom,
        skillTypeTo: skillTypeTo,
        action: 'moveResumeDetailsSkills'
    });

    if (tResp.success) {
        return JSON.stringify(tResp.result);
    } else {
        return false;
    }
}
