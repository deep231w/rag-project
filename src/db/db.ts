import { MongoClient } from "mongodb";
import { env } from "../config/env";
import mongoose from "mongoose";


const MONGO_URI=env.LOCAL_MONGODB_URI;


// const client= new MongoClient(MONGO_URI,{
//     maxPoolSize:10
// });

export async function conectMongo() {
    try{
        if(!MONGO_URI) throw new Error("MONGO URI is missing");
    
        await mongoose.connect(MONGO_URI);
        console.log("mongodb conneted !!");
        
    }catch(e){
        console.log("error in mongodb connection")
        throw e
    }

    // await client.connect();
    // console.log("mongodb connected");
    // return client.db();
}