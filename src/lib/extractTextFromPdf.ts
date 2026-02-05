import fs from "fs";

// pdf-parse export shape varies by version
const pdfParse = require("pdf-parse");

// In your case, the function is at PDFParse
const pdf = pdfParse.PDFParse ?? pdfParse.default ?? pdfParse;

export default async function extractText(filepath: string): Promise<string> {

    console.log("Using pdf function:", pdf?.name);

  const dataBuffer = fs.readFileSync(filepath);
  const data = await pdf(dataBuffer);
  return data.text;
}
