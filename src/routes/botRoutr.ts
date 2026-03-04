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

router.get("/getbotsdata", async(req:Request , res:Response)=>{
    try{
        const {adminId}=req.query;

        if(!adminId){
            res.status(400).json({message:"credentials misssing"});
            return;
        }

        const bots= await Bot.find({adminId});
        console.log("bots =" ,bots);

        if(!bots){
            res.status(404).json({
                message:"you dont have any bots"
            })
            return;
        }

        res.status(200).json({
            message:"bots fetched",
            bots:bots
        })

    }catch(e){
        console.log("error in get bot data api-", e);
        res.status(500).json({
            message:"server error "
        })
    }
})