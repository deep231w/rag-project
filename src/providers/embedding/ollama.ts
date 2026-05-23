import axios from "axios";
import { EmbeddedProvider } from "../EmbeddedProvider";
import { env } from "../../config/env";

export class OllamaEmbedded implements EmbeddedProvider{

    async generateEmbedding(text:string): Promise<number[]> {
        
        try{
            const res=await axios.post(`${env.OLLAMA_URL}/api/embeddings`, {
                    model:"nomic-embed-text:latest",
                    prompt:text
            })

            console.log("response of question to emb-", res);
        
            return res.data.embedding;

        }catch(e){
            console.log("error during embedding ollama: ",e);
            throw new Error("Error during ollama embedding");
        }
    }

    async generateEmbeddings(chuncks: string[]): Promise<number[][]> {
        
        return Promise.all(
            chuncks.map((chunk)=>
                this.generateEmbedding(chunk)
            )
        );
    };
    
}