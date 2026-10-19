import { Request, Response, Router } from "express";
import { Bot } from "../models/botSchema";
import { requireAuth, type AuthRequest } from "../middleware/auth";

export const router= Router();

router.post("/create", requireAuth, async(req: AuthRequest, res:Response)=>{
    try{
        const user = req.user;
        const {name, description}=req.body;

        if(!user || !name || !description){
            return res.status(400).json({ message:"Please complete all required fields."});
        }

        const newBot= await Bot.create({
            name: String(name),
            adminId: user.userId,
            description: String(description),
        });

        return res.status(200).json({
            message:"bot created",
            bot:newBot,
        });

    }catch(e:any){
        if(e.code==11000){
            return res.status(400).json({
                message: "Bot with this name already exists for this user.",
            });
        }

        console.log("error in creat bot api- ", e); 
        return res.status(500).json({message:"server error"});
    }
})

router.get("/getbotsdata", requireAuth, async(req: AuthRequest, res:Response)=>{
    try{
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const bots= await Bot.find({adminId: user.userId});

        return res.status(200).json({
            message:"bots fetched",
            bots,
        });

    }catch(e){
        console.log("error in get bot data api-", e);
        return res.status(500).json({ message:"server error" });
    }
})
