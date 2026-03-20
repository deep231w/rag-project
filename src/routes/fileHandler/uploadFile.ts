import { createUploadthing, type FileRouter } from "uploadthing/express";
import  z  from "zod";

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
        //   if (!metadata) throw new Error("missing metadata");

          console.log("file url-", file.ufsUrl);
          console.log("botId =", metadata.botId);
        
    }),
};