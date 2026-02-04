import { env } from "../config/env";
import axios from "axios";

export async function embededText(input:String):Promise<number[]> {
    const res=await axios.post(`${env.EMBEDDING_API_URL}`,{
        model:env.EMBEDDING_MODEL,
        input
    },
        {
            headers:{
                "Authorization": `Bearer ${env.EMBEDDING_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    )

    console.log("response of embedings - ", res);
    const embedding = res.data.data[0].embedding;

    return embedding;
}