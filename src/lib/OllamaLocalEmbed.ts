import { env } from "../config/env";
import axios from "axios";

export default async function OllamaLocalEmbded(text:string):Promise<number[]>{
    const res = await axios.post(`${env.OLLAMA_URL}/api/embeddings`, {
    model: "bge-small",
    prompt: text,
  });

  console.log("text -", text);
  
  console.log("ollama text embded- ", res.data.embedding)
  return res.data.embedding;

}