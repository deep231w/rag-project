import { Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import { Admin } from "../model/adminSchema";
import jwt from 'jsonwebtoken';

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

        // const token;
        // if(!admin){
        //     res.status(403).json({message:"admin not created"})
        // }

        res.status(200).json({
            message:"admin created",
            admin:admin
        })

    }catch(e){
        console.log("error in admin signup page: ", e);
        throw e
    }
})
