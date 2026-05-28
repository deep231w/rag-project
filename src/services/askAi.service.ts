import axios from "axios";
import { qdrant } from "../lib/qdrant";
import { OllamaQueryQuestion } from "../lib/ollamaForQuery";
import { getLLMProvider } from "../providers/GetLLMprovider";
import { env } from "../config/env";

interface AskAiApiConfigForLlm {
    apiKey?: string 
    model?:  string 
    type?: "ollama" | "gemini" | "openai" | null
}

export default async function askAi(queryEmbedding:number[],question:string, botId:string , llmConfig:AskAiApiConfigForLlm) {

    const res= await qdrant.search("docs",{
        vector:queryEmbedding,
        limit:5,
        with_payload:true,
        filter:{
            must:[
                {
                    key:"botId",
                    match:{value:botId}
                }
            ]
        }
    })

    const context =  res.map(r=>((r.payload) as {text:string}).text).join("\n\n");
    console.log("response of query to top k from qdrant- ", context);


    console.log("Context length:", context.length);

    const isProd = process.env.NODE_ENV === "production";

    let answer;

    if(llmConfig.type){
        answer=await getLLMProvider(llmConfig.type, {
            apiKey:llmConfig.apiKey ?? undefined,
            model:llmConfig.model ?? undefined
        }).generate(question , context);

    }else if(!isProd){
        answer= await OllamaQueryQuestion(context ,question);
    }else{
        answer= await  getLLMProvider("gemini", {
            apiKey:env.GOOGLE_GEMINI_LLM_API_KEY,
            model:env.GOOGLE_GEMINI_LLM_MODEL
        }).generate(question , context)
    }
    
    return answer;
}