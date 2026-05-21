import { LlmProvider } from "../LlmProvider";

export class OllamaLlmProvider implements LlmProvider{
    async generate(prompt: string, botId: number): Promise<string> {
        
        return ""
    }
}