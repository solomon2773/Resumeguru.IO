import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import {
  DATE_FEATURE_SETS,
  hasNumber,
  getHasText,
  isBold,
} from "./lib/common-features";
import { divideSectionIntoSubsections } from "./lib/subsections";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "./lib/bullet-points";

const WORK_EXPERIENCE_KEYWORDS_LOWERCASE = ['work', 'experience', 'employment', 'history', 'job'];

const JOB_TITLES = ['Accountant', 'Administrator', /* ... (the rest of the job titles) */ 'Webmaster', 'Worker'];

const hasJobTitle = (item) =>
    JOB_TITLES.some((jobTitle) =>
        item.text.split(/\s/).some((word) => word === jobTitle)
    );
const hasMoreThan5Words = (item) => item.text.split(/\s/).length > 5;
const JOB_TITLE_FEATURE_SET = [
  [hasJobTitle, 4],
  [hasNumber, -4],
  [hasMoreThan5Words, -2],
];

export const extractWorkExperience = (sections) => {
  const workExperiences = [];
  const workExperiencesScores = [];
  const lines = getSectionLinesByKeywords(
      sections,
      WORK_EXPERIENCE_KEYWORDS_LOWERCASE
  );
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 2;

    const subsectionInfoTextItems = subsectionLines
        .slice(0, descriptionsLineIdx)
        .flat();
    const [date, dateScores] = getTextWithHighestFeatureScore(
        subsectionInfoTextItems,
        DATE_FEATURE_SETS
    );
    const [jobTitle, jobTitleScores] = getTextWithHighestFeatureScore(
        subsectionInfoTextItems,
        JOB_TITLE_FEATURE_SET
    );
    const COMPANY_FEATURE_SET = [
      [isBold, 2],
      [getHasText(date), -4],
      [getHasText(jobTitle), -4],
    ];
    const [company, companyScores] = getTextWithHighestFeatureScore(
        subsectionInfoTextItems,
        COMPANY_FEATURE_SET,
        false
    );

    const subsectionDescriptionsLines =
        subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(subsectionDescriptionsLines);

    workExperiences.push({ company, jobTitle, date, descriptions });
    workExperiencesScores.push({
      companyScores,
      jobTitleScores,
      dateScores,
    });
  }
  return { workExperiences, workExperiencesScores };
};
