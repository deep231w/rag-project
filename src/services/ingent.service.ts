import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
import OllamaLocalEmbded from "../lib/OllamaLocalEmbed";
import { chunckText } from "../lib/chunck";
export async function ingestChunk(
  userId:string,
  collection: string,
  text: string,
  payload: Record<string, any>
) {

    try{
      const chunckedText= chunckText(text);

      let vectors:number[][];
      vectors = await OllamaLocalEmbded(chunckedText);
      console.log(vectors.length);
      console.log(vectors[0].length);

      for(let i=0; i<vectors.length; i++ ){
        await qdrant.upsert(collection, {
        points: [
          {
            id: crypto.randomUUID(),
            vector:vectors[i],
            payload: {
              userId,
              text:chunckedText[i],
              ...payload,
            },
          },
        ],
      });
      }
      
    }catch(e){
      console.log("error in ingent service-",e);
      throw e;
    }
  
}
