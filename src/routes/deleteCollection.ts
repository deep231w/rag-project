import { Request, Response, Router } from "express";
import { qdrant } from "../lib/qdrant";

const router = Router();

router.delete('/',async(res:Response, req:Request)=>{
    try{
        const {collectionName}=req.body;
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