import { Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import { Admin } from "../models/adminSchema";
import jwt from 'jsonwebtoken';
import { env } from "../config/env";

export const route= Router();

const sanitizeUser = (admin: any) => ({
    userId: String(admin._id),
    email: admin.email,
    name: admin.name,
});

route.post("/signup", async(req:Request, res:Response)=>{
    try{
        const {name ,email , password}=req.body;

        if(!name || !email || !password){
            res.status(400).json({message:"Please complete all fields."});
            return;
        }

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            res.status(400).json({ message: "Invalid input." });
            return;
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedName || !trimmedEmail || password.length < 6) {
            res.status(400).json({ message: "Name, valid email, and a password with at least 6 characters are required." });
            return;
        }

        const existingUser= await Admin.findOne({email: trimmedEmail});

        if(existingUser){
            res.status(409).json({message:"An account with this email already exists."});
            return;
        }

        const hashedPassword= await bcrypt.hash(password, 12);

        const admin= await Admin.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword,
        })

        const payload = sanitizeUser(admin);

        if (!env.MY_JWT_SECRET) {
            throw new Error("MY_JWT_SECRET is missing");
        }

        const token=jwt.sign(payload , env.MY_JWT_SECRET  , {expiresIn:'1h'});

        res.status(200).json({
            message:"Account created successfully.",
            admin: payload,
            token,
        })

    }catch(e){
        console.log("error in admin signup page: ", e);
        res.status(500).json({
            message: "Unable to create account right now."
        });
    }
})

route.post("/signin", async(req:Request, res:Response)=>{
    try{
        const {email ,password}=req.body;

        if(!email || !password) {
            res.status(400).json({message:"Please enter your email and password."});
            return;
        }

        const trimmedEmail = String(email).trim().toLowerCase();
        const admin = await Admin.findOne({email: trimmedEmail});

        if(!admin){
            res.status(401).json({
                message:"Invalid email or password."
            })
            return;
        }

        const isValid= await bcrypt.compare(String(password), admin.password);

        if(!isValid){
            res.status(401).json({
                message:"Invalid email or password."
            })
            return;
        }

        const payload = sanitizeUser(admin);

        if (!env.MY_JWT_SECRET) {
            throw new Error("MY_JWT_SECRET is missing");
        }
        const token=jwt.sign(payload , env.MY_JWT_SECRET  , {expiresIn:'1h'});

        return res.status(200).json({
            message:"Signed in successfully.",
            admin: payload,
            token,
        })

    }catch(e){
        console.log("error in admin signup route =", e);
        return res.status(500).json({
            message: "Unable to sign in right now."
        });
    }
})