import axios from "axios";
import { env } from "../config/env";
export default async function OllamaQuestionToEmbedded(text :string) {
 try{
    
    const res=await axios.post(`${env.OLLAMA_URL}/api/embeddings`, {
        model:"nomic-embed-text:latest",
        prompt:text
    })

    console.log("response of question to emb-", res);

    return res.data.embedding;

 }catch(e){
    console.log("error in question to embedded convert in ollama-", e);
    throw e;
 }
}