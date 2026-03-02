import { Request, Response, Router } from "express";
import { Bot } from "../models/botSchema";

export const router= Router();

router.post("/create",async(req:Request, res:Response)=>{
    try{
        const {name, adminId}=req.body;

        if(!name || !adminId){
            res.status(400).json({
                message:"please complete credentials"
            })
            return;
        }

        const newBot= await Bot.create({
            name,
            adminId
        })

        res.status(200).json({
            message:"bot created",
            bot:newBot
        })

    }catch(e:any){
        if(e.code==11000){
            return res.status(400).json({
                message: "Bot with this name already exists for this admin",
            });
        }

        console.log("error in creat bot api- ", e); 
        res.status(500).json({message:"server error"});
    }
})