import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";



export const resumeModel = {
    functions: [
        {
            name: "resumeRewriteModel",
            description: "AI Resume Rewrite model",
            parameters: zodToJsonSchema(
                z.object({
                    professionalExperienceRewrite: z.array(
                        z.object({
                            id: z.string(),
                            uuid: z.string().describe("An unique UUID"),
                            companyName: z.string().describe("Company Name, keep it the same as input data."),
                            professionalExperienceTitle: z.string().describe("Professional Experience Title, keep it the same as input data."),
                            professionalExperienceDescription: z.string().describe("Professional Experience Description"),
                            jobStartDate: z.string(),
                            jobEndDate: z.string(),
                        })
                    ),
                })
            ),
        },
    ],
    function_call: { name: "resumeRewriteModel" },
};

export const resumeBulletPointsModel = {
    functions: [
        {
            name: "resumeRewriteBulletPointsModel",
            description: "AI Resume Rewrite Bullet Points model",
            parameters: zodToJsonSchema(z.object({
                professionalExperienceRewrite: z.array(
                    z.object({
                        id:z.string(),
                        uuid:z.string().describe("An unique UUID"),
                        companyName: z.string().describe("Company Name, keep it the same as input data."),
                        professionalExperienceTitle:z.string().describe("Professional Experience Title, keep it the same as input data."),
                        professionalExperienceDescriptionBulletPoints:z.array(z.string()).describe("Array of object and each object is one bullet point of the professional experience."),
                        jobStartDate:z.string().describe("This job start date, keep it the same as input data."),
                        jobEndDate:z.string().describe("This job start date, keep it the same as input data."),
                    }
                    )

                ).describe("Each object inside the array is one professional experience from a job. The array count needs to be the same as professionalExperiences array count. The return needs to be in JSON format and only return the rewrite professional experience."),
            })),
        },
    ],
    function_call: { name: "resumeRewriteBulletPointsModel" },
};


export const resumeAiTargetSkillsModel = {
    functions: [
        {
            name: "resumeRewriteSkillsModel",
            description: "AI Resume Rewrite Skills model",
            parameters: zodToJsonSchema(
                z.object({
                    existingSkills: z.array(
                        z.object({
                            id: z.string(),
                            uuid: z.string().describe("An unique version 4 UUID"),
                            skillName: z.string().describe("Skill Name, keep it the same as input data."),

                        })
                    ),
                    missingSkills: z.array(
                        z.object({
                            id: z.string(),
                            uuid: z.string().describe("An unique version 4 UUID"),
                            skillName: z.string().describe("Skill Name 3 words or less, keep it the same as input data."),

                        })
                    ),
                    recommendedSkills: z.array(
                        z.object({
                            id: z.string(),
                            uuid: z.string().describe("An unique version 4 UUID"),
                            skillName: z.string().describe("Skill Name 3 words or less, keep it the same as input data."),

                        })
                    ),
                })
            ),
        },
    ],
    function_call: { name: "resumeRewriteSkillsModel" },
};
