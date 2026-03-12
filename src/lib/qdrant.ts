import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: "http://qdrant:6333",
  checkCompatibility: false,

});

export async function ensureCollection() {
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
        size:768,
        distance:"Cosine"
      }
    })
    console.log("qudrant collection 'docs' created");
  }

  if(!existCache){
    await qdrant.createCollection("qa_cache",{
      vectors:{
        size:768,
        distance:"Cosine"
      }
    })

    console.log("qdrant collection 'qa_cache' created !!");
  }

  console.log("qudrant collection 'docs' && 'qa_cache' established! ");

}