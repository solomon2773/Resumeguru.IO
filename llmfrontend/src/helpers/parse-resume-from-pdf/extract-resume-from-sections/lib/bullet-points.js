/**
 * List of bullet points
 * Reference: https://stackoverflow.com/questions/56540160/why-isnt-there-a-medium-small-black-circle-in-unicode
 * U+22C5   DOT OPERATOR (⋅)
 * U+2219   BULLET OPERATOR (∙)
 * U+1F784  BLACK SLIGHTLY SMALL CIRCLE (🞄)
 * U+2022   BULLET (•) -------- most common
 * U+2981   Z NOTATION SPOT (⦁)
 * U+26AB   MEDIUM BLACK CIRCLE (⚫︎)
 * U+25CF   BLACK CIRCLE (●)
 * U+2B24   BLACK LARGE CIRCLE (⬤)
 * U+26AC   MEDIUM SMALL WHITE CIRCLE ⚬
 * U+25CB   WHITE CIRCLE ○
 */
export const BULLET_POINTS = [
  "⋅",
  "∙",
  "🞄",
  "•",
  "⦁",
  "⚫︎",
  "●",
  "⬤",
  "⚬",
  "○",
];

/**
 * Convert bullet point lines into a string array aka descriptions.
 */
export const getBulletPointsFromLines = (lines) => {
  // Simply return all lines with text item joined together if there is no bullet point
  const firstBulletPointLineIndex = getFirstBulletPointLineIdx(lines);
  if (firstBulletPointLineIndex === undefined) {
    return lines.map((line) => line.map((item) => item.text).join(" "));
  }

  // Otherwise, process and remove bullet points
  let lineStr = "";
  for (let item of lines.flat()) {
    const text = item.text;
    if (!lineStr.endsWith(" ") && !text.startsWith(" ")) {
      lineStr += " ";
    }
    lineStr += text;
  }

  const commonBulletPoint = getMostCommonBulletPoint(lineStr);
  const firstBulletPointIndex = lineStr.indexOf(commonBulletPoint);
  if (firstBulletPointIndex !== -1) {
    lineStr = lineStr.slice(firstBulletPointIndex);
  }

  return lineStr
      .split(commonBulletPoint)
      .map((text) => text.trim())
      .filter((text) => !!text);
};

const getMostCommonBulletPoint = (str) => {
  const bulletToCount = BULLET_POINTS.reduce((acc, cur) => {
    acc[cur] = 0;
    return acc;
  }, {});
  let bulletWithMostCount = BULLET_POINTS[0];
  let bulletMaxCount = 0;
  for (let char of str) {
    if (bulletToCount.hasOwnProperty(char)) {
      bulletToCount[char]++;
      if (bulletToCount[char] > bulletMaxCount) {
        bulletWithMostCount = char;
      }
    }
  }
  return bulletWithMostCount;
};

const getFirstBulletPointLineIdx = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    for (let item of lines[i]) {
      if (BULLET_POINTS.some((bullet) => item.text.includes(bullet))) {
        return i;
      }
    }
  }
  return undefined;
};

const isWord = (str) => /^[^0-9]+$/.test(str);
const hasAtLeast8Words = (item) =>
    item.text.split(/\s/).filter(isWord).length >= 8;

export const getDescriptionsLineIdx = (lines) => {
  let idx = getFirstBulletPointLineIdx(lines);
  if (idx === undefined) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length === 1 && hasAtLeast8Words(line[0])) {
        idx = i;
        break;
      }
    }
  }
  return idx;
};
