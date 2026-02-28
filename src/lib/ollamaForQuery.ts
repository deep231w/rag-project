import axios from "axios";
import { env } from "../config/env";

export async function OllamaQueryQuestion(context:string[], question:string){
    try{
        const res= axios.post(`${env.OLLAMA_URL}/api/generate`,{
            model:"phi3",
            prompt:`
                Answer the question only using the context below.
                If not found, say "Not found in document.

                context:
                ${context}

                question:
                ${question}
            `,
            stream:false
        })

        console.log("response of query question to ollama- ", res);
        
    }catch(e){
        console.log("error during query to ollama - ",e );
    }
}