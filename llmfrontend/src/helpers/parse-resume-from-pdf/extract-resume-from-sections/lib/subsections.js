import { BULLET_POINTS } from "./bullet-points";
import { isBold } from "./common-features";

/**
 * Divide lines into subsections based on difference in line gap or bold text.
 *
 * For profile section, we can directly pass all the text items to the feature
 * scoring systems. But for other sections, such as education and work experience,
 * we have to first divide the section into subsections since there can be multiple
 * schools or work experiences in the section. The feature scoring system then
 * process each subsection to retrieve each's resume attributes and append the results.
 */
export const divideSectionIntoSubsections = (lines) => {
  // The main heuristic to determine a subsection is to check if its vertical line gap
  // is larger than the typical line gap * 1.4
  const isLineNewSubsectionByLineGap =
      createIsLineNewSubsectionByLineGap(lines);

  let subsections = createSubsections(lines, isLineNewSubsectionByLineGap);

  // Fallback heuristic if the main heuristic doesn't apply to check if the text item is bolded
  if (subsections.length === 1) {
    const isLineNewSubsectionByBold = (line, prevLine) => {
      if (
          !isBold(prevLine[0]) &&
          isBold(line[0]) &&
          // Ignore bullet points that sometimes being marked as bolded
          !BULLET_POINTS.includes(line[0].text)
      ) {
        return true;
      }
      return false;
    };

    subsections = createSubsections(lines, isLineNewSubsectionByBold);
  }

  return subsections;
};

const createIsLineNewSubsectionByLineGap = (lines) => {
  // Extract the common typical line gap
  const lineGapToCount = {};
  const linesY = lines.map((line) => line[0].y);
  let lineGapWithMostCount = 0;
  let maxCount = 0;
  for (let i = 1; i < linesY.length; i++) {
    const lineGap = Math.round(linesY[i - 1] - linesY[i]);
    if (!lineGapToCount[lineGap]) lineGapToCount[lineGap] = 0;
    lineGapToCount[lineGap] += 1;
    if (lineGapToCount[lineGap] > maxCount) {
      lineGapWithMostCount = lineGap;
      maxCount = lineGapToCount[lineGap];
    }
  }
  // Use common line gap to set a sub section threshold
  const subsectionLineGapThreshold = lineGapWithMostCount * 1.4;

  const isLineNewSubsection = (line, prevLine) => {
    return Math.round(prevLine[0].y - line[0].y) > subsectionLineGapThreshold;
  };

  return isLineNewSubsection;
};

const createSubsections = (lines, isLineNewSubsection) => {
  const subsections = [];
  let subsection = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0) {
      subsection.push(line);
      continue;
    }
    if (isLineNewSubsection(line, lines[i - 1])) {
      subsections.push(subsection);
      subsection = [];
    }
    subsection.push(line);
  }
  if (subsection.length > 0) {
    subsections.push(subsection);
  }
  return subsections;
};
