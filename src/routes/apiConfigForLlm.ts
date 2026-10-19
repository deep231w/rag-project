import { Router , Response ,Request } from "express";
import { ApiProviderConfig } from "../models/apiProviderConfig";
import z from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth";

export const route =  Router();

const SaveConfigSchema = z.object({
    llmProvider: z.string().min(1),
    llmApiKey: z.string().min(1),
    llmModel: z.string().min(1),
    embeddedProvider: z.string().min(1),
    embeddedApiKey: z.string().min(1),
    embeddedModel: z.string().min(1),
});

route.get("/getconfig", requireAuth, async(req: AuthRequest, res:Response)=>{
    try{
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const config= await ApiProviderConfig.findOne({adminId: user.userId});

        return res.status(200).json({
            message:"success",
            config,
        });

    }catch(e){
        console.log("error in get api config");
        return res.status(500).json({
            message: "Internal server error"
        });

    }
})

route.post("/saveconfig", requireAuth, async(req: AuthRequest, res:Response)=>{
    try{
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const parsed = SaveConfigSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid configuration payload." });
        }

        const configPayload = {
            adminId: user.userId,
            ...parsed.data,
        };

        const config = await ApiProviderConfig.findOneAndUpdate(
            { adminId: user.userId },
            { $set: configPayload },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Configuration saved.",
            config,
        });
    }catch(e){
        console.log("error in save config field - ", e);
        return res.status(500).json({ message: "Internal server error" });
    }
})