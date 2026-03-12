import { CacheSemanticService } from "../services/cacheSemantic.service";

export  async function CacheSemantic(botId:string , question:string ,answer:any ,embeddedQuestion:any){
    try{
        const cacheRes= await CacheSemanticService(botId ,question , answer ,embeddedQuestion);

    }catch(e){
        console.log("error in cache semantic=", e);
    }
}