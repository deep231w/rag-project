import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
import OllamaLocalEmbded from "../lib/OllamaLocalEmbed";
import { chunckText } from "../lib/chunck";
export async function ingestChunk(
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

      for(const vector of vectors ){
        await qdrant.upsert(collection, {
        points: [
          {
            id: crypto.randomUUID(),
            vector,
            payload: {
              text,
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
