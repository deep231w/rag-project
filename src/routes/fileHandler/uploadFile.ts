import { createUploadthing, type FileRouter } from "uploadthing/express";
import  z  from "zod";
import { Bot } from "../../models/botSchema";
import extractText from "../../lib/extractTextFromPdf";
import { ingestChunk } from "../../services/ingent.service";

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
          console.log("metadata in uploadFile =" ,metadata);
          console.log("file in uploadthing- ", file);


          const {botId, adminId}=metadata;
          if(!botId || !adminId){
            console.log("missing metadata in uploadthing url ");
            return;
          }

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

          //after upload
          const text =  await extractText(file.ufsUrl)
          console.log("extracted text- ", text);
          
          const response = await ingestChunk(botId, adminId,"docs", text, {
                                              source: file.name,
                                              page: 300,
                                          });
  
          console.log("response of ingest chunk -", response);

          console.log("file processed successfully.......... !!");


        }catch(e){
          console.log("error in file push to bot schema ",e);
        }
        
    }),
};