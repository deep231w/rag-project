import { env } from "../config/env";
import axios from "axios";

export async function embededText(input:String):Promise<number[]> {
    const res = await axios.post(
    `${process.env.EMBEDDING_API_URL}?key=${env.EMBEDDING_API_KEY}`,
    {
      content: {
        parts: [{ text: input }],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("res of emped -", res.data.embedding.values)
  return res.data.embedding.values;

}