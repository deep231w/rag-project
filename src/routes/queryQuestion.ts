import { Request, Response, Router } from "express";

export const router= Router();

router.post("/",async(req:Request , res:Response)=>{
    try{
        const {question}=req.body;

        console.log("question is -", question);

        res.status(200).json({message:"success!"});
    }catch(e){
        console.log("error in ask question api -", e);
        throw e;
    }
})

