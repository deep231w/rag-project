import axios from "axios";
import { qdrant } from "../lib/qdrant";
import { OllamaQueryQuestion } from "../lib/ollamaForQuery";

export default async function askAi(queryEmbedding:number[],question:string, botId:string) {
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
    const answer= await OllamaQueryQuestion(context ,question);
    
    return answer;
}