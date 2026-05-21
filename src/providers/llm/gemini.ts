import { LlmProvider } from "../LlmProvider";

export class GeminiLlmProvider implements LlmProvider{
    async generate(prompt: string, botId: number): Promise<string> {
        
        return ""
    }
}