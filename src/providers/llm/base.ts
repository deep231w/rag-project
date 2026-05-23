import { LlmProvider } from "../LlmProvider";

export class BaseLlmProvider implements LlmProvider{
    async generate(question: string, context:string): Promise<string> {
        
        return ""
    }
}