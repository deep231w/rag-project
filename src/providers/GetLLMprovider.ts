import { BaseLlmProvider } from "./llm/base";
import { GeminiLlmProvider } from "./llm/gemini";
import { OllamaLlmProvider } from "./llm/ollama";
import { OpenaiLlmProvider } from "./llm/OpenAI";
import { LlmProvider } from "./LlmProvider";

interface ProviderConfig {
  apiKey?: string;
  model?: string;
}

export function getLLMProvider(type: string , config:ProviderConfig): LlmProvider {
  switch (type) {
    case "gemini":
      if (!config.apiKey || !config.model) {
        throw new Error(" API config require !!!");
      }
      return new GeminiLlmProvider({
        apiKey:config.apiKey,
        model:config.model
      });

    case "ollama":
      return new OllamaLlmProvider();

    case "base":
      return new BaseLlmProvider();
    
    case "openai":
      if (!config.apiKey || !config.model) {
        throw new Error(" API config require !!!");
      }

      return new OpenaiLlmProvider({
        apiKey:config.apiKey,
        model:config.model
      });


    default:
      throw new Error("Unsupported provider");
  }
}