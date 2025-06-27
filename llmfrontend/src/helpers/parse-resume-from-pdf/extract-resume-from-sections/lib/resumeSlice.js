// import { createSlice } from "@reduxjs/toolkit";

export const initialProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject = {
  project: "",
  date: "",
  descriptions: [],
};

export const initialFeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills = Array(6).fill({ ...initialFeaturedSkill });
export const initialSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
};

// export const resumeSlice = createSlice({
//       name: "resume",
//       initialState: initialResumeState,
//       reducers: {
//     changeProfile: (
//       draft,
//       action: PayloadAction<{ field: keyof ResumeProfile; value: string }>
//     ) => {
//       const { field, value } = action.payload;
//       draft.profile[field] = value;
//     },
//     changeWorkExperiences: (
//       draft,
//       action: PayloadAction<
//         CreateChangeActionWithDescriptions<ResumeWorkExperience>
//       >
//     ) => {
//       const { idx, field, value } = action.payload;
//       const workExperience = draft.workExperiences[idx];
//       workExperience[field] = value as any;
//     },
//     changeEducations: (
//       draft,
//       action: PayloadAction<CreateChangeActionWithDescriptions<ResumeEducation>>
//     ) => {
//       const { idx, field, value } = action.payload;
//       const education = draft.educations[idx];
//       education[field] = value as any;
//     },
//     changeProjects: (
//       draft,
//       action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>
//     ) => {
//       const { idx, field, value } = action.payload;
//       const project = draft.projects[idx];
//       project[field] = value as any;
//     },
//     changeSkills: (
//       draft,
//       action: PayloadAction<
//         | { field: "descriptions"; value: string[] }
//         | {
//             field: "featuredSkills";
//             idx: number;
//             skill: string;
//             rating: number;
//           }
//       >
//     ) => {
//       const { field } = action.payload;
//       if (field === "descriptions") {
//         const { value } = action.payload;
//         draft.skills.descriptions = value;
//       } else {
//         const { idx, skill, rating } = action.payload;
//         const featuredSkill = draft.skills.featuredSkills[idx];
//         featuredSkill.skill = skill;
//         featuredSkill.rating = rating;
//       }
//     },
//     changeCustom: (
//       draft,
//       action: PayloadAction<{ field: "descriptions"; value: string[] }>
//     ) => {
//       const { value } = action.payload;
//       draft.custom.descriptions = value;
//     },
//     addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
//       const { form } = action.payload;
//       switch (form) {
//         case "workExperiences": {
//           draft.workExperiences.push(structuredClone(initialWorkExperience));
//           return draft;
//         }
//         case "educations": {
//           draft.educations.push(structuredClone(initialEducation));
//           return draft;
//         }
//         case "projects": {
//           draft.projects.push(structuredClone(initialProject));
//           return draft;
//         }
//       }
//     },
//     moveSectionInForm: (
//       draft,
//       action: PayloadAction<{
//         form: ShowForm;
//         idx: number;
//         direction: "up" | "down";
//       }>
//     ) => {
//       const { form, idx, direction } = action.payload;
//       if (form !== "skills" && form !== "custom") {
//         if (
//           (idx === 0 && direction === "up") ||
//           (idx === draft[form].length - 1 && direction === "down")
//         ) {
//           return draft;
//         }
//
//         const section = draft[form][idx];
//         if (direction === "up") {
//           draft[form][idx] = draft[form][idx - 1];
//           draft[form][idx - 1] = section;
//         } else {
//           draft[form][idx] = draft[form][idx + 1];
//           draft[form][idx + 1] = section;
//         }
//       }
//     },
//     deleteSectionInFormByIdx: (
//       draft,
//       action: PayloadAction<{ form: ShowForm; idx: number }>
//     ) => {
//       const { form, idx } = action.payload;
//       if (form !== "skills" && form !== "custom") {
//         draft[form].splice(idx, 1);
//       }
//     },
//     setResume: (draft, action: PayloadAction<Resume>) => {
//       return action.payload;
//     },
//   },
// });

// export const {
//   changeProfile,
//   changeWorkExperiences,
//   changeEducations,
//   changeProjects,
//   changeSkills,
//   changeCustom,
//   addSectionInForm,
//   moveSectionInForm,
//   deleteSectionInFormByIdx,
//   setResume,
// } = resumeSlice.actions;
//
// export const selectResume = (state) => state.resume;
// export const selectProfile = (state) => state.resume.profile;
// export const selectWorkExperiences = (state) => state.resume.workExperiences;
// export const selectEducations = (state) => state.resume.educations;
// export const selectProjects = (state) => state.resume.projects;
// export const selectSkills = (state) => state.resume.skills;
// export const selectCustom = (state) => state.resume.custom;
//
// export default resumeSlice.reducer;
