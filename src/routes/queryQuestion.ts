import { Request, Response, Router } from "express";
import OllamaQuestionToEmbedded from "../lib/ollamaQembedded";
import askAi from "../services/askAi.service";
import { CheckHashedCaching, MultipleTypeQuestionCache, NormalisedCacheChecking } from "../redis/qaCache";
import { CacheSemantic } from "../semanticCache/semanticCache";
import { checkSemanticCache } from "../services/checkSemantic.service";
import { ApiProviderConfig } from "../models/apiProviderConfig";
import { GetEmbeddedProvider } from "../providers/GetEmbeddedProvider";
import { env } from "../config/env";

export const router= Router();

interface AskAiApiConfigForLlm {
    apiKey?: string 
    model?:  string 
    type?: "ollama" | "gemini" | "openai" | null
}

router.post("/",async(req:Request , res:Response)=>{
    try{
        const {question,botId , adminId}=req.body;


        console.log("question is -", question);
        if(!question || !botId || !adminId) {
            res.status(400).json({
                message:"credential missing"
            })
            return;
        }

        //2:redis hashed cache checking from redis =>
        const HashedCacheHit= await CheckHashedCaching(question ,botId);
        console.log("cache hit in quesry route -", HashedCacheHit);
        if(HashedCacheHit){
            console.log("hashed cache hit successfully in query route -", HashedCacheHit);
            return res.status(200).json({
                message:"success!",
                answer:HashedCacheHit
            })
            
        }else{
            console.log(" hashed cache check missed ---------------------");
        }


        //3:redis normalised cache checking =>
        const normlzAns= await NormalisedCacheChecking(question ,botId);
        console.log("Normalised cache in quesry route -", normlzAns);
        if(normlzAns){
            console.log("normalised cache hit successfully in query route -", normlzAns);
            return res.status(200).json({
                message:"success!",
                answer:normlzAns
            })
        }else{
            console.log("normalised cache missed =================================");
        }
        
        //fetch admin id from db

        const isProd = process.env.NODE_ENV === "production";
        const LlmApiConfig= await ApiProviderConfig.findOne({adminId})

        let embeddedQuestion:number[]; 

        if(LlmApiConfig?.embeddedProvider && LlmApiConfig.embeddedApiKey && LlmApiConfig.embeddedModel){
           embeddedQuestion= await GetEmbeddedProvider(
                LlmApiConfig.embeddedProvider, 
                {
                    apiKey:LlmApiConfig.embeddedApiKey,
                    model:LlmApiConfig.embeddedModel
                }
            ).generateEmbedding(question)
        }
        else if(!isProd){
            embeddedQuestion=await OllamaQuestionToEmbedded(question);
        }
        else{
            //free version of google gemini embedded cloud
            embeddedQuestion = await GetEmbeddedProvider(
                "gemini",
                {
                    apiKey:env.EMBEDDING_API_KEY,
                    model:env.EMBEDDING_MODEL
                }
            ).generateEmbedding(question)
        }

        //conver question to embedded 
        // const embeddedQuestion= await OllamaQuestionToEmbedded(question);

        //check semantic cache 
        const semanticCacheHit= await checkSemanticCache(botId ,embeddedQuestion);

        if(semanticCacheHit){
            console.log("semantic cache hit in quesry route",semanticCacheHit);
            return res.status(200).json({
                message:"success!",
                answer:semanticCacheHit
            })
        }else{
            console.log("semantic cache missed =================================");
        }

        
        console.log("question embedding in /ask  route =", embeddedQuestion);

        //config
        const llmCOnfig:AskAiApiConfigForLlm={
            apiKey:LlmApiConfig?.llmApiKey ?? undefined,
            model:LlmApiConfig?.llmModel ?? undefined,
            type:LlmApiConfig?.llmProvider
        }
        
        const answer= await askAi(embeddedQuestion,question, botId , llmCOnfig);
        console.log("answer is = ", answer);

        //1: redis cache the question =>
        const cachedq = await MultipleTypeQuestionCache(question ,answer , botId);

        //semantic cache 1=>
        const semanticCached= await CacheSemantic(botId , question , answer ,embeddedQuestion);


        return res.status(200).json({
            message:"success!",
            answer
        });
    }catch(e){
        console.log("error in ask question api -", e);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

