import { Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import { Admin } from "../model/adminSchema";
import jwt from 'jsonwebtoken';
import { env } from "../config/env";

export const route= Router();

route.post("/signup", async(req:Request, res:Response)=>{
    try{
        const {name ,email , password}=req.body;

        if(!name || !email || !password){
            res.status(400).json({message:"missing credentials!"});
            return;
        }

        const hashedPassword= await bcrypt.hash(password , 12);

        const existingUser= await Admin.findOne({email});

        if(existingUser){
            res.status(403).json({message:"user with same gmail already exist , please try different email"});
            return;
        }

        const admin= await Admin.create({
            name,
            email,
            password:hashedPassword
        })

        const payload={
            userId:admin._id,
            email:admin.email,
            name:admin.name
        }

        if (!env.MY_JWT_SECRET) {
            throw new Error("MY_JWT_SECRET is missing");
        }


        const token=jwt.sign(payload , env.MY_JWT_SECRET  , {expiresIn:'1h'});

        // if(!admin){
        //     res.status(403).json({message:"admin not created"})
        // }

        res.status(200).json({
            message:"admin created",
            admin:payload,
            token:token
        })

    }catch(e){
        console.log("error in admin signup page: ", e);
        throw e
    }
})
