import { Request, Response, Router } from "express";
import OllamaQuestionToEmbedded from "../lib/ollamaQembedded";
import askAi from "../services/askAi.service";

export const router= Router();

router.post("/",async(req:Request , res:Response)=>{
    try{
        const {question,botId}=req.body;


        console.log("question is -", question);
        if(!question || !botId) {
            res.status(400).json({
                message:"credential missing"
            })
            return;
        }

        const embeddedQuestion= await OllamaQuestionToEmbedded(question);
        console.log("question embedding in /ask  route =", embeddedQuestion);

        const answer= await askAi(embeddedQuestion,question, botId);
        
        console.log("answer is = ", answer);

        res.status(200).json({
            message:"success!",
            answer
        });
    }catch(e){
        console.log("error in ask question api -", e);
        throw e;
    }
})

