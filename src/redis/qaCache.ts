import crypto from "crypto";
import { SetCache } from "./cache";

export async function MultipleTypeQuestionCache(question:string,embeddedQuestion:any ,answer:any  ,botId:string){
    console.log("question inside multiplecache func- ", question);

    //cache hashed question
    const hashedq= hashQuestion(question);
    if(hashedq) console.log("questioned hashed ..");
    const hkey= `rag:${botId}:qhash:${hashedq}`;
    const hashedRedisCache = await SetCache(hkey ,answer );
    if(hashedRedisCache) console.log("hashedquestion cached ...");

    //polish the question then add in id to cache
    const normq= normlizedQuestion(question);
    if(normq) console.log("question normalised .....- ",normq);
    const normlzqKey= `rag:${botId}:qnormlz:${normq}`;
    const normalisedRedisCache= await SetCache(normlzqKey , answer);
    if(normalisedRedisCache) console.log("cached normalised question.....");

    //vectorised cache




}


function hashQuestion(q:string){
    const hashedQ= crypto.createHash("sha256").update(q).digest("hex");
    
    return hashedQ;
}


function normlizedQuestion(q:string){
    const normlzq =  q
                    .toLowerCase()
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
    const normlzhashedq= crypto.createHash("sha256").update(normlzq).digest("hex");

    return normlzhashedq;

}

function VectoriseCache(q:string){
    
}