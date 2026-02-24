import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
import OllamaLocalEmbded from "../lib/OllamaLocalEmbed";
import { chunckText } from "../lib/chunck";
export async function ingestChunk(
  collection: string,
  text: string,
  payload: Record<string, any>
) {

  const chunckedText= chunckText(text);
  
  // const vector = await OllamaLocalEmbded(chunckedText);

  // await qdrant.upsert(collection, {
  //   points: [
  //     {
  //       id: crypto.randomUUID(),
  //       vector,
  //       payload: {
  //         text,
  //         ...payload,
  //       },
  //     },
  //   ],
  // });
}
