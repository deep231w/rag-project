import crypto from "crypto";
import { SetCache } from "./cache";

//caching
export async function MultipleTypeQuestionCache(question:string ,answer:any  ,botId:string){
    console.log("question inside multiplecache func- ", question);

    //cache hashed question
    const hkey= hashQuestion(question ,botId);
    const hashedRedisCache = await SetCache(hkey ,answer );
    if(hashedRedisCache) console.log("hashedquestion cached ...");

    //polish the question then add in id to cache
    const normq= normlizedQuestion(question ,botId);
    const normalisedRedisCache= await SetCache(normq , answer);
    if(normalisedRedisCache) console.log("cached normalised question.....");

}


function hashQuestion(q:string ,botId:string){
    const hashedQ= crypto.createHash("sha256").update(q).digest("hex");
    if(hashedQ) console.log("questioned hashed ..");
    const hkey= `rag:${botId}:qhash:${hashedQ}`;
    
    return hkey;
}


function normlizedQuestion(q:string , botId:string){
    const normlzq =  q
                    .toLowerCase()
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
    const normlzhashedq= crypto.createHash("sha256").update(normlzq).digest("hex");
    if(normlzhashedq) console.log("question normalised .....- ",normlzhashedq);
    const normq= `rag:${botId}:qnormlz:${normlzhashedq}`;


    return normq;

}

//check caching
export async function CheckCaching(question:string,botId:string) {
    
}