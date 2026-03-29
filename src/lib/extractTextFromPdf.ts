import fs from "fs";

// pdf-parse export shape varies by version
const pdfParse = require("pdf-parse");

// In your case, the function is at PDFParse
const pdf = pdfParse.PDFParse ?? pdfParse.default ?? pdfParse;

export default async function extractText(pdfUrl: string): Promise<string> {

    try{
      const res= await fetch(pdfUrl);
      const buffer=await res.arrayBuffer();
      console.log("Using pdf function:", pdf?.name);

      const dataBuffer = Buffer.from(buffer);

      const data = await pdf(dataBuffer);
      return data.text;
    
    }catch(err){
      console.error("PDF extraction error:", err);
      throw err;
    }
}
