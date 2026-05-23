import OpenAI from "openai";
import { LlmProvider } from "../LlmProvider";

interface ModelConfig {
    apiKey:string,
    model:string
}

export class OpenaiLlmProvider implements LlmProvider{

    private client: OpenAI;
    private model:string

    constructor(config: ModelConfig){
        this.client=new OpenAI({
            apiKey:config.apiKey
        })

        this.model=config.model 
    }

    async generate(question: string, context: string): Promise<string> {
        const res= await this.client.chat.completions.create({
            model:this.model,

            messages:[
                {
                    role:"system",
                    content:
                        `Answer only using provided context.
                        If not found say "Not found in document".`
                },
                {
                    role:"user",
                    content:`
                        context:
                        ${context}

                        question:
                        ${question}

                    `
                }
            ]
        })

        console.log("res of openai llm is - ", res);

        return ""
    }
}