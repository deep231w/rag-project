import { createUploadthing, type FileRouter } from "uploadthing/express";
import  z  from "zod";
import { Bot } from "../../models/botSchema";

const f = createUploadthing<{
  pdfUploader: {
    input: { botId: string ,adminId:string};

  };
}>();

export const UploadRouter: FileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
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
          const {botId}=metadata;

          if(!botId){
            console.log("botId missing in uploadFile on uploadcomplete handler")
            return;
          }

          await Bot.findByIdAndUpdate(
            botId,
            {
              $push:{
                files:{
                  name:file.name,
                  url:file.ufsUrl,
                  size:file.size,
                  type:file.type
                }
              }
            },
            {returnDocument:'after'}
          )

          console.log("file updated in bot !!");

        }catch(e){
          console.log("error in file push to bot schema ",e);
        }
        
    }),
};