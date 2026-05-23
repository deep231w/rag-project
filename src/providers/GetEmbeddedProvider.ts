import { EmbeddedProvider } from "./EmbeddedProvider";
import { OllamaEmbedded } from "./embedding/ollama";

export function GetEmbeddedProvider(type:string):EmbeddedProvider{
    switch(type){
        case "ollama":
            return new OllamaEmbedded();
     
        default:
            throw new Error("Unsupported provider");
    }

}