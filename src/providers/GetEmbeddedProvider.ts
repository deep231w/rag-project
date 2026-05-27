import { EmbeddedProvider } from "./EmbeddedProvider";
import { GoogleGeminiEmbedded } from "./embedding/gemini";
import { OllamaEmbedded } from "./embedding/ollama";
import { OpenAIEmbeddingProvider } from "./embedding/openAI";

interface ProviderConfig {
  apiKey?: string;
  model?: string;
}

export function GetEmbeddedProvider(type:string , config:ProviderConfig):EmbeddedProvider{
    switch(type){
        case "ollama":
            return new OllamaEmbedded();
        
        case "openai":
            if(! config.apiKey || !config.model){
                throw new Error("API config require")
            }
            return new OpenAIEmbeddingProvider({
                apiKey:config.apiKey,
                model:config.model
            })

        case "gemini":
            if(! config.apiKey || !config.model){
                throw new Error("API config require")
            }
            return new GoogleGeminiEmbedded({
                apiKey:config.apiKey,
                model:config.model
            })
     
        default:
            throw new Error("Unsupported provider");
    }

}