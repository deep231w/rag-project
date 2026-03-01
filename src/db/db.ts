import { MongoClient } from "mongodb";
import { env } from "../config/env";


const MONGO_URI=env.LOCAL_MONGODB_URI;

if(!MONGO_URI) throw new Error("MONGO URI is missing");

const client= new MongoClient(MONGO_URI,{
    maxPoolSize:10
});

export async function conectMongo() {
    await client.connect();
    console.log("mongodb connected");
    return client.db();
}