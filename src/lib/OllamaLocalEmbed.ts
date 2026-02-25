import { env } from "../config/env";
import axios from "axios";

export default async function OllamaLocalEmbded(chunks:string[]):Promise<number[][]>{

    try{

        // let embeddedArray:number[][]=[];


        const embeddedArray= await Promise.all(
            chunks.map(async(chunck)=>{
                const res = await axios.post<{embedding:number[]}>(`${env.OLLAMA_URL}/api/embeddings`, {
                model: "nomic-embed-text:latest",
                prompt:chunck 
            });
            return res.data.embedding as number[];
            })
        )
        
        // for(const chunck of chunks){
        //     const res = await axios.post(`${env.OLLAMA_URL}/api/embeddings`, {
        //         model: "nomic-embed-text:latest",
        //         prompt:chunck 
        //     });
        //     // let emb:string[]=res.data.embedding;
        //     embeddedArray.push(res.data.embedding);
        // }
        

        // console.log("text -", text);
        
        // console.log("ollama text embded- ", res.data.embedding)
        
        return embeddedArray;
    }catch(e){
        console.log("error in ollama embded - ", e);
        throw e;
    }

}