import { Router , Request  ,Response} from "express";
import { ingestChunk } from "../services/ingent.service";
import multer from "multer";

const upload =multer({dest:"uploads/"})
const router = Router();

router.post("/",upload.single("file"),  (req:Request, res:Response)=>{
    const file= req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("PDF received:", file.path);

    res.status(200).json({message:"success"})
})

export default router;