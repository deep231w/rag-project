import axios from "axios";
import { LlmProvider } from "../LlmProvider";
import { env } from "node:process";

export class OllamaLlmProvider implements LlmProvider{
    async generate(question: string, context:string): Promise<string> {

        try{
            const res= await axios.post(`${env.OLLAMA_URL}/api/generate`,{
                model:"phi3",
                prompt:`
                    Answer the question only using the context below.
                    If not found, say "Not found in document.

                    context:
                    ${question}
    
                    question:
                    ${context}
                `,
                stream:false
            })
        
            console.log("response of query question to ollama- ", res);
        
            return res.data.response;
        
        }catch(e){
            console.log("error during query to ollama - ",e );
            throw new Error("Error during generate answer ");
        }
    }
}