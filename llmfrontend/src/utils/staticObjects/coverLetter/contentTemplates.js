let contentTemplates = [];
export default contentTemplates = [
    {
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
    {
        id: 2,
        source : "https://blog.hubspot.com/marketing/best-cover-letter-examples",
        sourceName: "Data-Driven Cover Letter",
        structureExplain : "Emphasize quantifiable achievements using data and statistics to showcase your accomplishments." ,
        structureDetails : {
            "Introduction" : "Mention the job you're applying for and express your enthusiasm, briefly introducing the idea of using data to drive results.",
            "Body" : "Provide specific examples of quantifiable achievements in your career, using statistics to underscore your impact.",
            "Conclusion" : "Reiterate your ability to contribute to the company through data-driven insights and thank the reader for their time.",
        },
        promptExample:"Focus on a project or role where you made a measurable impact. Include specific numbers or outcomes to highlight your contribution."
    },
    {
        id: 3,
        source : "https://blog.hubspot.com/marketing/best-cover-letter-examples",
        sourceName: "Entry-Level Cover Letter",
        structureExplain : "Leverage education and minimal experience to demonstrate potential value, focusing on skills developed through education and internships." ,
        structureDetails : {
            "Introduction" : "Introduce yourself with your educational background and express your interest in the position.",
            "Body" : "Highlight skills developed through education and internships, focusing on how these experiences have prepared you for the workforce.",
            "Conclusion" : "Express eagerness to bring your fresh perspective and skills to the team, thanking the reader for the opportunity to apply.",
        },
        promptExample:"Discuss how your educational background and any internships or projects have prepared you for the workforce, emphasizing any specific skills or knowledge you gained."
    },
    {
        id: 4,
        source : "",
        sourceName: "Impact Cover Letter",
        structureExplain : "Showcase how your skills and successes can contribute to the company's goals, especially in problem-solving and project management." ,
        structureDetails : {
            "Introduction" : "Begin with your interest in the role and a brief mention of your relevant skills.",
            "Body" : "Describe specific situations where you used your problem-solving or project management skills to achieve results, aligning with the company\'s goals.",
            "Conclusion" : "State your enthusiasm to contribute to the company's success and express gratitude for considering your application.",
        },
        promptExample:"Describe a situation where you used your problem-solving or project management skills to achieve a significant outcome, aligning it with how you can contribute to the company's objectives."
    },
    {
        id: 5,
        source : "",
        sourceName: "Teacher Cover Letter",
        structureExplain : "Highlight the importance of passion and achievements in teaching, showcasing commitment to education and significant accomplishments." ,
        structureDetails : {
            "Introduction" : "Start by expressing your passion for teaching and the specific teaching position you're applying for.",
            "Body" : "Reflect on significant accomplishments in your teaching career and how these demonstrate your commitment and impact in education.",
            "Conclusion" : "Conclude by reiterating your dedication to education and your desire to make a positive impact in the role, thanking the reader for their time.",
        },
        promptExample:"Reflect on your passion for teaching and a notable achievement in your educational career. Explain how these experiences demonstrate your commitment to education and your potential impact in a teaching role."
    },
    {
        id: 6,
        source : "https://careerservices.fas.harvard.edu/resources/harvard-college-guide-to-resumes-cover-letters/",
        sourceName: "Harvard University Cover Letter",
        structureExplain : "Harvard suggests a professional approach focusing on highlighting your strongest assets, skills, and experiences. The emphasis is on tailoring the cover letter to demonstrate how you differentiate from other candidates." ,
        structureDetails : {
            "Introduction" : "Mention the position, your interest, and a brief connection to the company or role.",
            "Body" : "Discuss significant achievements, skills, and how they relate to the job requirements. Highlight your most relevant skills and experiences. Discuss why you are a good fit for the position and the organization.",
            "Conclusion" : "Reiterate interest and express anticipation for a future conversation.",
        },
        promptExample:"Write a cover letter for a position you are genuinely interested in, focusing on presenting your unique qualifications and how they align with the company's goals. Reflect on your most significant achievements and articulate how they prepare you for this role."
    },
    {
        id: 7,
        source : "https://www.careereducation.columbia.edu/resources/sample-cover-letters",
        sourceName : "Columbia University Cover Letter",
        structureExplain : "Columbia\'s samples suggest a narrative style that integrates personal experiences and professional achievements.",
        structureDetails : {
            "Introduction" : "Share a personal connection or story that leads you to the company or role.",
            "Body" : "Highlight editorial or field-specific skills through detailed examples and past job experiences.",
            "Conclusion" : "Express your enthusiasm for the role, willingness to relocate if necessary, and gratitude for consideration.",
        },
        promptExample:"Reflect on a personal experience or story that ignited your passion for the field you're applying to. Use this narrative to structure your cover letter, linking your skills and experiences to the job description."
    },
    {
        id: 8,
        source : "https://careerservices.upenn.edu/channels/cover-letters/",
        sourceName : "University of Pennsylvania Cover Letter",
        structureExplain : "Penn advises on specificity, encouraging the use of parts from previous cover letters when applicable and emphasizing the importance of matching your skills to the job qualifications." ,
        structureDetails : {
            "Introduction" : "Specify the role you're applying for and how you found the job listing.",
            "Body" : "Focus on explaining why your skills and experiences make you a good fit for the position, including soft skills and transferable skills.",
            "Conclusion" : "Mention any connections to the organization and express your interest in contributing to the team.",
        },
        promptExample:"Consider a job you're applying for where you have both direct and transferable skills. Craft a cover letter that matches these qualifications with the job description, using clear examples to demonstrate your fit."
    },
    {
        id: 9,
        source : "https://www.bu.edu/careers/how-to/cover-letters/",
        sourceName : "Boston University Cover Letter",
        structureExplain : "BU highlights the importance of matching the cover letter format with your resume and keeping the content concise." ,
        structureDetails : {
            "Introduction" : "Address the letter to a specific person if possible and clearly state the position you're applying for.",
            "Body" : "Divide this into two parts: one that explains your knowledge of the company and your interest in the role, and another that showcases your relevant skills and experiences.",
            "Conclusion" : "Close with a statement of gratitude and a note on looking forward to feedback.",
        },
        promptExample:"Write a cover letter for a job at a company you admire. Begin by addressing it to a specific individual (if possible), clearly state your interest in the position, and detail why your background makes you an ideal candidate."
    },
    {
        id: 10,
        source : "https://www.careers.ox.ac.uk/cover-letters/",
        sourceName : "Oxford University Cover Letter",
        structureExplain : "Oxford emphasizes a business letter format with brevity and tailoring content to the specific job and organization." ,
        structureDetails : {
            "Introduction" : "Mention where you saw the job ad and introduce yourself including your current study or professional status.",
            "Body" : "Explain why the job and the organization are attractive to you, and detail why you are a good fit, using evidence from your past experiences.",
            "Conclusion" : "Reiterate your desire to join the organization and end with a professional closing.",
        },
        promptExample:"Draft a cover letter for a job that aligns with your career aspirations. Start by stating where you found the job listing, why the role excites you, and how your academic or professional background makes you a suitable candidate. Close with a statement of anticipation to contribute to the company's success."
    },
];
