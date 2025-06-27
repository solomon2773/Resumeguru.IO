import aiModels from "../aiModels";

let defaultAdvancedFeatures = {};
export default defaultAdvancedFeatures =
    {
        advanceSection:  false,
        coverletterExtraPromptRef : false,
        paragraphLength :  250,
        selectedAiModel : aiModels[0],
        writingTone : "professional",
        selectedContentTemplate : {
            id: 1,
            source : "",
            sourceName: "Default Cover Letter",
            structureExplain : "Highlight career achievements, current responsibilities, and challenges overcome, blending personalization with professionalism." ,
            structureDetails : {
                "Introduction" : "Start by introducing yourself, the position you're applying for, and a brief mention of a significant professional achievement.",
                "Body" : "Discuss your current responsibilities, highlighting how they align with the job requirements, and detail a challenge you've overcome, showcasing your problem-solving skills.",
                "Conclusion" : "Summarize your interest in the role and how your experiences make you an ideal candidate, thanking the reader for their consideration.",
            },
            promptExample:"Write about a significant professional achievement, how you handle your current responsibilities, and a challenge you've faced and overcome."
        },
    }
;
