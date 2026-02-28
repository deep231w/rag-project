import { Request, Response, Router } from "express";
import OllamaQuestionToEmbedded from "../lib/ollamaQembedded";
import askAi from "../services/askAi.service";

export const router= Router();

router.post("/",async(req:Request , res:Response)=>{
    try{
        const {question}=req.body;


        console.log("question is -", question);
        if(!question) {
            res.status(400).json({
                message:"credential missing"
            })
            return;
        }

        const embeddedQuestion= await OllamaQuestionToEmbedded(question);

        await askAi(embeddedQuestion);

        console.log("question embedding in /ask  route =", embeddedQuestion);
        

        res.status(200).json({message:"success!"});
    }catch(e){
        console.log("error in ask question api -", e);
        throw e;
    }
})

