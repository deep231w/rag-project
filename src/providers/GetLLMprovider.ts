import { BaseLlmProvider } from "./llm/base";
import { GeminiLlmProvider } from "./llm/gemini";
import { OllamaLlmProvider } from "./llm/ollama";
import { OpenaiLlmProvider } from "./llm/OpenAI";
import { LlmProvider } from "./LlmProvider";

export function getLLMProvider(type: string): LlmProvider {
  switch (type) {
    case "gemini":
      return new GeminiLlmProvider();

    case "ollama":
      return new OllamaLlmProvider();

    case "base":
      return new BaseLlmProvider();
    
    case "openai":
      return new OpenaiLlmProvider();

    default:
      throw new Error("Unsupported provider");
  }
}