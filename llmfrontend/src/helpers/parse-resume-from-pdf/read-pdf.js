// Getting pdfjs to work is tricky. The following 3 lines would make it work
// https://stackoverflow.com/a/63486898/7699841
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Step 1: Read pdf and output textItems by concatenating results from each page.
 *
 * To make processing easier, it returns a new TextItem type, which removes unused
 * attributes (dir, transform), adds x and y positions, and replaces loaded font
 * name with original font name.
 *
 * @example
 * const onFileChange = async (e) => {
 *     const fileUrl = URL.createObjectURL(e.target.files[0]);
 *     const textItems = await readPdf(fileUrl);
 * }
 */
export const readPdf = async (fileUrl) => {
  const pdfFile = await pdfjs.getDocument(fileUrl).promise;
  let textItems = [];

  for (let i = 1; i <= pdfFile.numPages; i++) {
    // Parse each page into text content
    const page = await pdfFile.getPage(i);
    const textContent = await page.getTextContent();

    // Wait for font data to be loaded
    await page.getOperatorList();
    const commonObjs = page.commonObjs;

    // Convert Pdfjs TextItem type to new TextItem type
    const pageTextItems = textContent.items.map((item) => {
      const {
        str: text,
        dir, // Remove text direction
        transform,
        fontName: pdfFontName,
        ...otherProps
      } = item;

      // Extract x, y position of text item from transform.
      // As a side note, origin (0, 0) is bottom left.
      // Reference: https://github.com/mozilla/pdf.js/issues/5643#issuecomment-496648719
      const x = transform[4];
      const y = transform[5];

      // Use commonObjs to convert font name to original name (e.g. "GVDLYI+Arial-BoldMT")
      // since non system font name by default is a loaded name, e.g. "g_d8_f1"
      // Reference: https://github.com/mozilla/pdf.js/pull/15659
      const fontObj = commonObjs.get(pdfFontName);
      const fontName = fontObj.name;

      // pdfjs reads a "-" as "-­‐" in the resume example. This is to revert it.
      // Note "-­‐" is "-&#x00AD;‐" with a soft hyphen in between. It is not the same as "--"
      const newText = text.replace(/-­‐/g, "-");

      const newItem = {
        ...otherProps,
        fontName,
        text: newText,
        x,
        y,
      };
      return newItem;
    });

    // Add text items of each page to total
    textItems.push(...pageTextItems);
  }

  // Filter out empty space textItem noise
  const isEmptySpace = (textItem) =>
      !textItem.hasEOL && textItem.text.trim() === "";
  textItems = textItems.filter((textItem) => !isEmptySpace(textItem));

  return textItems;
};
