import fs from "fs";
const pdf = require("pdf-parse");

export  default async function extractText(filepath:string):Promise<string>{
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdf(dataBuffer);
    return data.text;

}