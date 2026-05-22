import { LlmProvider } from "../LlmProvider";

export class OpenaiLlmProvider implements LlmProvider{
    async generate(prompt: string, botId: number): Promise<string> {
        
        return ""
    }
}