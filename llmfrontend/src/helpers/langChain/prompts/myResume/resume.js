import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";

export const resumeRewritePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided job description, the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job position. Do not change the field 'professionalExperienceTitle' from professionalExperiences. " +
            "Focus on showcasing your ability to fulfill the keyResponsibilities as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your capability to handle the keyResponsibilities. Make sure to include ATS key word scan. " +
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. " +
            "ProfessionalExperienceRewrite array count needs to be the same as professionalExperience array count." +
            "Generate a unique UUID foe each experience."+
            "Experience start and end day will be the same, do not change the date and do not creating fake working experience nor working startDate / endDate. Only rewrite the professionalExperienceDescription. " +
            "If not enough input data to rewrite, just return 'Not enough data to rewrite this experience' to professionalExperienceRewrite array."
        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
export const resumeRewriteBulletPointsPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate( "You are a resume-rewritten chatbot.Convert the input {inputData} string into json object first and understand the json object data. " +
            "Based on the provided job description, the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job position. Do not change the field 'professionalExperienceTitle' from professionalExperiences. " +
            "Focus on showcasing your ability to fulfill the keyResponsibilities as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your capability to handle the keyResponsibilities. Make sure to include ATS key word scan. " +
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. " +
            "Please provide a list of bulletPointsCount bullet points , with a minimum of 100 words for each bullet point. The professionalExperienceRewrite array count needs to be the same as professionalExperiences array count. " +
            "Experience start and end day will be the same, do not change the date and do not creating fake working experience nor working startDate / endDate. Only rewrite the professionalExperienceDescription. " +
            "Generate a unique UUID foe each experience."+
            "If not enough input data to rewrite, just return 'Not enough data to rewrite this experience' to the same professionalExperienceDescription ." ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}")

    ],
    inputVariables: ["inputData"],

};
export const resumeRewriteAdvancePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided job description, the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job position. Do not change the field 'professionalExperienceTitle' from professionalExperiences. " +
            "Focus on showcasing your ability to fulfill the keyResponsibilities as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your capability to handle the keyResponsibilities. Make sure to include ATS key word scan. " +
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. " +
            "ProfessionalExperienceRewrite array count needs to be the same as professionalExperience array count." +
            "Experience start and end day will be the same, do not change the date and do not creating fake working experience nor working startDate / endDate. Only rewrite the professionalExperienceDescription. " +
            "Generate a unique UUID foe each experience."+
            "If not enough input data to rewrite, just return 'Not enough data to rewrite this experience' to professionalExperienceRewrite array."+
            "If professionalExperienceAdvancedPrompt has content, also consider the professionalExperienceAdvancedPrompt content description to rewrite the professionalExperienceDescription."),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
export const resumeRewriteBulletPointsAdvancePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate( "You are a resume-rewritten chatbot.Convert the input {inputData} string into json object first and understand the json object data. " +
            "Based on the provided job description, the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job position. Do not change the field 'professionalExperienceTitle' from professionalExperiences. " +
            "Focus on showcasing your ability to fulfill the keyResponsibilities as mentioned in the job description. Highlight any relevant experience or tasks that demonstrate your capability to handle the keyResponsibilities. Make sure to include ATS key word scan. " +
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. " +
            "Please provide a list of bulletPointsCount bullet points , with a minimum of 100 words for each bullet point. The professionalExperienceRewrite array count needs to be the same as professionalExperiences array count. " +
            "Experience start and end day will be the same, do not change the date and do not creating fake working experience nor working startDate / endDate. Only rewrite the professionalExperienceDescription. " +
            "Generate a unique UUID foe each experience."+
            "If not enough input data to rewrite, just return 'Not enough data to rewrite this experience' to the same professionalExperienceDescription ."+
            "If professionalExperienceAdvancedPrompt has content, also consider the professionalExperienceAdvancedPrompt content description to rewrite the professionalExperienceRewrite."),
        HumanMessagePromptTemplate.fromTemplate("{inputData}")

    ],
    inputVariables: ["inputData"],

};


export const resumeCreatePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided futureJobBasicInfo the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job title, resumeExperienceLevel, and resumeWorkingField." +
            "Existing jobTitle and working time should not be changed." +
            "Generate a unique UUID foe each experience."+
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. "
        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
export const resumeCreateBulletPointsPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate( "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided futureJobBasicInfo the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job title, resumeExperienceLevel, and resumeWorkingField." +
            "Existing jobTitle and working time should not be changed." +
            "Generate a unique UUID foe each experience."+
            "Please make sure the writing tone is 'writingTone' and with a minimum of 'paragraphLength' words. "+
        "Please provide a list of bulletPointsCount bullet points , with a minimum of 100 words for each bullet point for the professionalExperienceRewrite array " ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}")

    ],
    inputVariables: ["inputData"],

};
export const resumeCreateAdvancePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided futureJobBasicInfo the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the jobTitle, resumeExperienceLevel, and resumeWorkingField." +
            "Existing jobTitle and working time should not be changed." +
            "Generate a unique UUID foe each experience."+
            "If professionalExperienceAdvancedPrompt has content, also consider the professionalExperienceAdvancedPrompt content description to rewrite the professionalExperienceDescription."),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
export const resumeCreateBulletPointsAdvancePrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate( "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided futureJobBasicInfo the candidate's skills, certifications, education and professionalExperiences rewrite each professional experience to highlight skills and experiences that align with the job title, resumeExperienceLevel, and resumeWorkingField." +
            "Please provide a list of bulletPointsCount bullet points , with a minimum of 100 words for each bullet point for the professionalExperienceRewrite array "+
            "Existing jobTitle and working time should not be changed." +
            "Generate a unique UUID foe each experience."+
            "If professionalExperienceAdvancedPrompt has content, also consider the professionalExperienceAdvancedPrompt content description to rewrite the professionalExperienceRewrite."),
        HumanMessagePromptTemplate.fromTemplate("{inputData}")

    ],
    inputVariables: ["inputData"],

};

export const resumeAiTargetSkillsPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided job description extract all skills that in the job description. Each skill needs to be less than 3 words. Compare with the candidate's existing skills and then provide missing skills as well as recommended skills are not in the job description. "+
            "The output will have three arrays:existingSkills, missingSkills and recommendedSkills. The existingSkills array needs to have all the candidate's exising skills. "+
            "Inside each skill array are the skill objects and each skill object has a id ,skillName, skillDescription and a UUID in version 4 format."

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};

export const resumeRegularSkillsPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "You are a resume-rewritten chatbot. Convert the input {inputData} string into json object first and understand the json object data." +
            "Based on the provided targeted Industry, jobTitle, and experienceLevel to generated at least 6 recommended skills for this job. More would be better. Each skill needs to be less than 3 words.  "+
            "The output will have three arrays:existingSkills, missingSkills and recommendedSkills. The existingSkills array needs to have all the candidate's exising skills. " +
            "The missingSkills array need to be empty and put all generated skills in recommendedSkills "+
            "Inside recommendedSkills array , there are skill objects and each skill object has a id ,skillName, skillDescription and a UUID in version 4 format."

        ),
        HumanMessagePromptTemplate.fromTemplate("{inputData}"),
    ],
    inputVariables: ["inputData"],
};
