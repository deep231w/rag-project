import { createUploadthing, type FileRouter } from "uploadthing/express";

const f= createUploadthing();

export const UploadRouter ={
    pdfUploader:f({
        pdf:{
            maxFileSize:"8MB",
            maxFileCount:1
        },
    }).onUploadComplete(async({file , metadata})=>{
        console.log("file url-", file.url);
        //
        //
    }) 
}satisfies FileRouter;

export type OurFileRouter= typeof UploadRouter;