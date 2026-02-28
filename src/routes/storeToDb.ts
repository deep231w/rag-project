import { Router , Request  ,Response} from "express";
import { ingestChunk } from "../services/ingent.service";
import multer from "multer";
import extractText from "../lib/extractTextFromPdf";

const upload =multer({dest:"uploads/"})
const router = Router();

router.post("/",upload.single("file"),  async(req:Request, res:Response)=>{
    try{
        const file= req.file;
        const {userId}=req.body;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const text =  await extractText(file.path)

        // console.log("PDF received:", file.path);


        console.log("extracted text- ", text);

        const response = await ingestChunk(userId,"docs", text, {
                                            source: "auth.pdf",
                                            page: 300,
                                        });

        console.log("response -", response);

        res.status(200).json({message:"success"})
    }catch(e){
        console.log("error in storetoDb api route-", e);
    }
})

export default router;