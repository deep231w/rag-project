import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "../config/env";

const config: ConstructorParameters<typeof QdrantClient>[0] = {
  url: env.QDRANT_VECTORDB_URL,
  checkCompatibility: false,
};

if (env.QDRANT_API_KEY) {
  config.apiKey = env.QDRANT_API_KEY;
}

export const qdrant = new QdrantClient(config);


export async function ensureCollection() {

  //for now its only support 3072 and 768 imension , 3072 for prod using gemini model and 768 for locally running ollama model 
  const isProd = process.env.NODE_ENV === "production";
  const VECTOR_SIZE = isProd ? 3072 : 768;


  const collection= await qdrant.getCollections();
  const exist = collection.collections.some(
    (c)=>c.name=='docs'
  )

  const existCache = collection.collections.some(
    (c)=>c.name=="qa_cache"
  )
  if(!exist){
    await qdrant.createCollection('docs',{
      vectors:{
        size:VECTOR_SIZE,
        distance:"Cosine"
      }
    })
    console.log("qudrant collection 'docs' created");
  }

  if(!existCache){
    await qdrant.createCollection("qa_cache",{
      vectors:{
        size:VECTOR_SIZE,
        distance:"Cosine"
      }
    })

    console.log("qdrant collection 'qa_cache' created !!");
  }

  console.log("qudrant collection 'docs' && 'qa_cache' established! ");

}