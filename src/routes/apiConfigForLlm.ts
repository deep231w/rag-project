import { Router , Response ,Request} from "express";
import { ApiProviderConfig } from "../models/apiProviderConfig";
import z from "zod";

const route =  Router();

const GetConfigSchema= z.object({
    adminId:z.string().min(1)
})

route.get("/getconfig",async(req :Request, res:Response)=>{
    try{
        const parsed= GetConfigSchema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: parsed.error.flatten()
            });
        }

        const {adminId}= parsed.data;

        const config= await ApiProviderConfig.findOne({adminId});

        return res.status(200).json({
            message:"success",
            config:config
        })

    }catch(e){
        console.log("error in get api config")
        return res.status(500).json({
            message: "Internal server error"
        });

    }
})

route.post("",(req:Request , res:Response)=>{
    try{


    }catch(e){
        console.log("error in save config fiel - ", e);
        return res.status(500).json({
            message: "Internal server error"
        });

    }
})