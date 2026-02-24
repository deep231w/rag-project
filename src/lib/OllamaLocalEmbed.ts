import { env } from "../config/env";
import axios from "axios";

export default async function OllamaLocalEmbded(text:string[]){

    try{

        const res = await axios.post(`${env.OLLAMA_URL}/api/embeddings`, {
            model: "nomic-embed-text:latest",
            prompt: text,
        });

        console.log("text -", text);
        
        console.log("ollama text embded- ", res.data.embedding)
        
        return res.data.embedding;
    }catch(e){
        console.log("error in ollama embded - ", e);
    }

}