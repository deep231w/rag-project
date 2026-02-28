import { Request, Response, Router } from "express";
import { qdrant } from "../lib/qdrant";

export const router = Router();

router.delete('/',async( req:Request ,res:Response)=>{
    try{
        const {collectionName}=req.body;
        console.log("collection name-", collectionName);
        if(!collectionName){
            res.status(400).json({message:"please enter collection name"});
            return;
        }

        const response =await qdrant.deleteCollection(`${collectionName}`)
        console.log("delete collection route response- ", response);

        res.status(200).json({
            message:"collection deleted successfully !",
            collectionName:collectionName
        })

    }catch(e){
        console.log("error in delete collection route -",e);
    }
})