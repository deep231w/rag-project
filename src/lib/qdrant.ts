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

  if(!exist){
    await qdrant.createCollection('docs',{
      vectors:{
        size:768,
        distance:"Cosine"
      }
    })
    console.log("qudrant collection 'docs' created");
  }

  console.log("qudrant collection 'docs' established! ");

}