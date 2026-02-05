import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
import OllamaLocalEmbded from "../lib/OllamaLocalEmbed";

export async function ingestChunk(
  collection: string,
  text: string,
  payload: Record<string, any>
) {
  const vector = await OllamaLocalEmbded(text);

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
