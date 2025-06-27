import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";


export  const coverLetterPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a resume expert. Create a professional yet creative cover letter draft based on the provided job description details such as {jobTitle},{keyResponsibilities},{requiredSkills},{qualifications}, tailored for a candidate. Incorporate with values, mission, products, or from the job description highlighting the essential skills and experience required for the job based on the job description.\n" +
            "Add {companyName}, {applicantName} and position to the cover letter. Make sure to put {applicantName} at the bottom of the letter. Put the cover letter content into coverLetterAiGenerate object.\n"+
            "{contentTemplatePrompt}"+
            "Also provide a minimum of candidate's top 4 strengths in the extra array coverLetterCandidateStrengthAiGenerate, do not include them in the main part of the cover letter. Each strength should be less than 4 words\n" +
            "Please make sure the return total word count is a maximum of {paragraphLength} words , the writing tone is {writingTone}, with header, footer, and few paragraph."+
            "The output will be an object with coverLetterAiGenerate and coverLetterCandidateStrengthAiGenerate."

        ),
        HumanMessagePromptTemplate.fromTemplate("{jobTitle},{keyResponsibilities},{requiredSkills},{qualifications},{applicantName},{companyName},{paragraphLength},{writingTone},{contentTemplatePrompt}"),
    ],
    inputVariables: ["jobTitle","keyResponsibilities","requiredSkills","qualifications","applicantName","companyName","paragraphLength","writingTone","contentTemplatePrompt"],
};



export  const coverLetterAdvancedPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a resume expert. Create a professional yet creative cover letter draft based on the provided job description details such as {jobTitle},{keyResponsibilities},{requiredSkills},{qualifications}, tailored for a candidate. Incorporate with values, mission, products, or from the job description highlighting the essential skills and experience required for the job based on the job description.\n" +
            "Add {companyName}, {applicantName} and position to the cover letter. Make sure to put {applicantName} at the bottom of the letter. Put the cover letter content into coverLetterAiGenerate object.\n"+
            "Also provide a minimum of candidate's top 4 strengths in the extra array coverLetterCandidateStrengthAiGenerate, do not include them in the main part of the cover letter. Each strength should be less than 4 words\n" +
            "{coverletterExtraPromptRef}." +
            "The output will be an object with coverLetterAiGenerate and coverLetterCandidateStrengthAiGenerate."


        ),
        HumanMessagePromptTemplate.fromTemplate("{jobTitle},{keyResponsibilities},{requiredSkills},{qualifications},{applicantName},{companyName},{coverletterExtraPromptRef}"),
    ],
    inputVariables: ["jobTitle","keyResponsibilities","requiredSkills","qualifications","applicantName","companyName","coverletterExtraPromptRef"],
};




export  const coverLetterIntelligentPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a resume expert. Create a professional yet creative cover letter draft for the field in {selectedField}, tailored for a candidate with {selectedExperienceLevel} experience. Incorporate with values, mission, products, or from the {jobTitle} and {companyName} highlighting the essential skills and experience required for the job.\n" +
            "Add {companyName}, {applicantName} and position to the cover letter. Make sure to put {applicantName} at the bottom of the letter. Put the cover letter content into coverLetterAiGenerate object.\n"+
            "{contentTemplatePrompt}"+
            "Also provide a minimum of candidate's top 4 strengths in the extra array coverLetterCandidateStrengthAiGenerate, do not include them in the main part of the cover letter. Each strength should be less than 4 words\n" +
            "Please make sure the return total word count is a maximum of {paragraphLength} words , the writing tone is {writingTone}, with header, footer, and few paragraph."+
            "The output will be an object with coverLetterAiGenerate and coverLetterCandidateStrengthAiGenerate."
        ),
        HumanMessagePromptTemplate.fromTemplate("{jobTitle},{companyName},{selectedField},{selectedExperienceLevel},{applicantName},{paragraphLength},{writingTone},{contentTemplatePrompt}"),
    ],
    inputVariables: ["jobTitle","companyName","selectedField","selectedExperienceLevel","applicantName","paragraphLength","writingTone","contentTemplatePrompt"],
};
export  const coverLetterIntelligentAdvancedPrompt = {
    promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
            "Act as a resume expert. Create a professional yet creative cover letter draft for the field in {selectedField}, tailored for a candidate with {selectedExperienceLevel} experience. Incorporate with values, mission, products, or from the {jobTitle} and {companyName} highlighting the essential skills and experience required for the job.\n" +
            "Add {companyName}, {applicantName} and position to the cover letter. Make sure to put {applicantName} at the bottom of the letter. Put the cover letter content into coverLetterAiGenerate object.\n"+
            "Also provide a minimum of candidate's top 4 strengths in the extra array coverLetterCandidateStrengthAiGenerate, do not include them in the main part of the cover letter. Each strength should be less than 4 words\n" +
            "{coverletterExtraPromptRef}." +
            "The output will be an object with coverLetterAiGenerate and coverLetterCandidateStrengthAiGenerate."


        ),
        HumanMessagePromptTemplate.fromTemplate("{jobTitle},{companyName},{selectedField},{selectedExperienceLevel},{applicantName},{coverletterExtraPromptRef}"),
    ],
    inputVariables: ["jobTitle","companyName","selectedField","selectedExperienceLevel","applicantName","coverletterExtraPromptRef"],
};
