import { qdrant } from "../lib/qdrant";
import { embededText } from "../lib/embeding";
export async function ingestChunk(
  collection: string,
  text: string,
  payload: Record<string, any>
) {
  const vector = await embededText(text);

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
