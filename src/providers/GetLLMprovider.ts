import { GeminiLlmProvider } from "./llm/gemini";
import { OllamaLlmProvider } from "./llm/ollama";
import { LlmProvider } from "./LlmProvider";

export function getLLMProvider(type: string): LlmProvider {
  switch (type) {
    case "gemini":
      return new GeminiLlmProvider();

    case "ollama":
      return new OllamaLlmProvider();

    default:
      throw new Error("Unsupported provider");
  }
}