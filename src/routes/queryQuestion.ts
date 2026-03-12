import { Request, Response, Router } from "express";
import OllamaQuestionToEmbedded from "../lib/ollamaQembedded";
import askAi from "../services/askAi.service";
import { CheckHashedCaching, MultipleTypeQuestionCache, NormalisedCacheChecking } from "../redis/qaCache";
import { CacheSemantic } from "../semanticCache/semanticCache";

export const router= Router();

router.post("/",async(req:Request , res:Response)=>{
    try{
        const {question,botId}=req.body;


        console.log("question is -", question);
        if(!question || !botId) {
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
        

        const embeddedQuestion= await OllamaQuestionToEmbedded(question);
        console.log("question embedding in /ask  route =", embeddedQuestion);

        const answer= await askAi(embeddedQuestion,question, botId);
        console.log("answer is = ", answer);

        //1: redis cache the question =>
        const cachedq = await MultipleTypeQuestionCache(question ,answer , botId);

        //semantic cache 1=>
        const semanticCached= await CacheSemantic(botId , question , answer ,embeddedQuestion);





        res.status(200).json({
            message:"success!",
            answer
        });
    }catch(e){
        console.log("error in ask question api -", e);
        throw e;
    }
})

