import { CacheSemanticService } from "../services/cacheSemantic.service";

export  async function CacheSemantic(botId:string , question:string ,answer:any){
    try{
        const cacheRes= CacheSemanticService(botId ,question , answer);
        
    }catch(e){
        console.log("error in cache semantic=", e);
    }
}