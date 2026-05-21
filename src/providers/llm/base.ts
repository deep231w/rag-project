import { LlmProvider } from "../LlmProvider";

export class BaseLlmProvider implements LlmProvider{
    async generate(prompt: string, botId: number): Promise<string> {
        
        return ""
    }
}