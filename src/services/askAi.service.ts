import axios from "axios";
import { qdrant } from "../lib/qdrant";

export default async function askAi(queryEmbedding:number[]) {
    const res= await qdrant.search("docs",{
        vector:queryEmbedding,
        limit:5,
        with_payload:true
    })

    const context =  res.map(r=>((r.payload) as {text:string}).text).join("\n\n");
    console.log("response of query to top k from qdrant- ", context);


}