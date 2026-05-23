import axios from "axios";
import { EmbeddedProvider } from "../EmbeddedProvider";
import { env } from "../../config/env";
import { GoogleGenAI } from "@google/genai";

interface ModuleConfig{
    apiKey:string
    model:string
}
export class GoogleGeminiEmbedded implements EmbeddedProvider{

    private client:GoogleGenAI;
    private model:string;

    constructor (config: ModuleConfig){
        this.client= new GoogleGenAI({
            apiKey:config.apiKey
        })

        this.model= config.model
    }


    async generateEmbedding(text:string): Promise<number[]> {
        
        try{
            const res=await this.client.models.embedContent({
                model:this.model,
                contents:text
            })
            console.log("response of question to emb-", res);
        
            const embedding =res.embeddings?.[0]?.values;

            if (!embedding) {
                throw new Error(
                    "No embedding returned"
                );
            }

            return embedding;

        }catch(e){
            console.log("error during embedding GoogleGemini: ",e);
            throw new Error("Error during Gemini embedding");
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