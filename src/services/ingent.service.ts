import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
import OllamaLocalEmbded from "../lib/OllamaLocalEmbed";
import { chunckText } from "../lib/chunck";
import { ApiProviderConfig } from "../models/apiProviderConfig";
import { GetEmbeddedProvider } from "../providers/GetEmbeddedProvider";
import { env } from "../config/env";
export async function ingestChunk(
  botId:string,
  adminId:string,
  collection: string,
  text: string,
  payload: Record<string, any>
) {

    try{
      const chunckedText= chunckText(text);

      //getting embedded config from db by admin id

      const embeddedConfig= await ApiProviderConfig.findOne({adminId});

      let vectors:number[][];

      //condition base embedded provider call:
      const isProd = process.env.NODE_ENV === "production";

      if(embeddedConfig?.embeddedProvider && embeddedConfig.embeddedApiKey && embeddedConfig.embeddedModel){
        vectors =await GetEmbeddedProvider(
          embeddedConfig.embeddedProvider ,{
            apiKey:embeddedConfig.embeddedApiKey,
            model:embeddedConfig.embeddedModel
          }
        ).generateEmbeddings(chunckedText)

      }else if(!isProd){
        vectors = await OllamaLocalEmbded(chunckedText);
      }else{
        vectors= await GetEmbeddedProvider(
          "gemini",{
            apiKey:env.EMBEDDING_API_KEY,
            model:env.EMBEDDING_MODEL
          }).generateEmbeddings(chunckedText)
      }

      console.log(vectors.length);
      console.log(vectors[0].length);

      for(let i=0; i<vectors.length; i++ ){
        await qdrant.upsert(collection, {
        points: [
          {
            id: crypto.randomUUID(),
            vector:vectors[i],
            payload: {
              adminId,
              botId,
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
