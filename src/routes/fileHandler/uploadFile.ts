import { createUploadthing, type FileRouter } from "uploadthing/express";
import  z  from "zod";
import { Bot } from "../../models/botSchema";
import extractText from "../../lib/extractTextFromPdf";
import { ingestChunk } from "../../services/ingent.service";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

const f = createUploadthing<{
  pdfUploader: {
    input: { botId: string ,adminId:string};

  };
}>();

export const UploadRouter: FileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .input(
      z.object({
        botId: z.string(),
        adminId:z.string()
      })
    )
    .middleware(async({input})=>{
        return{
            botId:input.botId,
            adminId:input.adminId
        }
    })
    .onUploadComplete(async ({file ,metadata}) => {
        try{
          const {botId, adminId}=metadata;
          if(!botId || !adminId){
            console.log("missing metadata in uploadthing url ");
            return;
          }

          const bot = await Bot.findOne({ _id: botId, adminId });
          if (!bot) {
            console.log("Unauthorized upload attempt for bot ", botId);
            return;
          }

          const newFile = {
            _id: new mongoose.Types.ObjectId(),
            name: file.name,
            url: file.ufsUrl,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
          };

          const fileUploaded =await Bot.findByIdAndUpdate(
            botId,
            {
              $push:{
                files:newFile
              }
            },
            {returnDocument:'after'}
          )

          const text =  await extractText(file.ufsUrl)
          const response = await ingestChunk(botId, adminId,"docs", text, {
                                              source: file.name,
                                              page: 300,
                                              fileId:newFile._id
                                          });

          console.log("file processed successfully.......... !!");

        }catch(e){
          console.log("error in file push to bot schema ",e);
        }
    }),
};