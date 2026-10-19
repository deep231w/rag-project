import { Request, Response, Router } from "express";
import OllamaQuestionToEmbedded from "../lib/ollamaQembedded";
import askAi from "../services/askAi.service";
import { CheckHashedCaching, MultipleTypeQuestionCache, NormalisedCacheChecking } from "../redis/qaCache";
import { CacheSemantic } from "../semanticCache/semanticCache";
import { checkSemanticCache } from "../services/checkSemantic.service";
import { ApiProviderConfig } from "../models/apiProviderConfig";
import { GetEmbeddedProvider } from "../providers/GetEmbeddedProvider";
import { env } from "../config/env";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { Bot } from "../models/botSchema";

export const router= Router();

interface AskAiApiConfigForLlm {
    apiKey?: string 
    model?:  string 
    type?: "ollama" | "gemini" | "openai" | null
}

router.post("/", requireAuth, async(req: AuthRequest, res:Response)=>{
    try{
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const {question, botId } = req.body;

        if(!question || !botId) {
            return res.status(400).json({ message:"credential missing" });
        }

        const bot = await Bot.findOne({ _id: botId, adminId: user.userId });
        if (!bot) {
            return res.status(403).json({ message: "You do not have access to this bot." });
        }

        const HashedCacheHit= await CheckHashedCaching(question ,botId);
        if(HashedCacheHit){
            return res.status(200).json({ message:"success!", answer:HashedCacheHit });
        }

        const normlzAns= await NormalisedCacheChecking(question ,botId);
        if(normlzAns){
            return res.status(200).json({ message:"success!", answer:normlzAns });
        }

        const isProd = process.env.NODE_ENV === "production";
        const LlmApiConfig= await ApiProviderConfig.findOne({adminId: user.userId})

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
            embeddedQuestion = await GetEmbeddedProvider(
                "gemini",
                {
                    apiKey:env.EMBEDDING_API_KEY,
                    model:env.EMBEDDING_MODEL
                }
            ).generateEmbedding(question)
        }

        const semanticCacheHit= await checkSemanticCache(botId ,embeddedQuestion);

        if(semanticCacheHit){
            return res.status(200).json({ message:"success!", answer:semanticCacheHit });
        }

        const llmCOnfig:AskAiApiConfigForLlm={
            apiKey:LlmApiConfig?.llmApiKey ?? undefined,
            model:LlmApiConfig?.llmModel ?? undefined,
            type:LlmApiConfig?.llmProvider
        }
        
        const answer= await askAi(embeddedQuestion, question, botId , llmCOnfig);

        const cachedq = await MultipleTypeQuestionCache(question ,answer , botId);
        const semanticCached= await CacheSemantic(botId , question , answer ,embeddedQuestion);

        return res.status(200).json({ message:"success!", answer });
    }catch(e){
        console.log("error in ask question api -", e);
        return res.status(500).json({ message: "Internal server error" });
    }
})

