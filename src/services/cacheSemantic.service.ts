import { qdrant } from "../lib/qdrant";
import crypto from 'crypto'
export  async function CacheSemanticService(botId:string , question:string ,answer:any, embeddedQuestion:any) {
    try{
        const res = await  qdrant.upsert("qa_cache",{
            points:[
                {
                    id:crypto.randomUUID(),
                    vector:embeddedQuestion,
                    payload:{
                        botId,
                        question,
                        answer
                    }
                }
            ]
        })

        console.log("cache upsorted - ", res);
    }catch(e){
        console.log("error in cache semantic service = " ,e);
    }
}