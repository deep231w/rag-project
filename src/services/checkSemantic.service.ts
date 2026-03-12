import { qdrant } from "../lib/qdrant";

export async function checkSemanticCache(botId:string , embedding:number[]){
    try{
        const res= await  qdrant.search("qa_cache", {
            vector:embedding,
            limit:1,
            filter:{
                must:[
                    {
                        key:"botId",
                        match:{value:botId}
                    }
                ]
            }
        })

        if(res.length && res[0].score >0.92){
            return res[0]?.payload?.answer;
        }

        return null;

    }catch(e){
        console.log("error in check semantic cache-", e);
    }
}