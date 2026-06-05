import { GoogleGenAI } from "@google/genai";
import { LlmProvider } from "../LlmProvider";

interface ModelConfig{
    apiKey:string
    model:string
}

export class GeminiLlmProvider implements LlmProvider{

    private client: GoogleGenAI;
    private model: string;

    constructor(config: ModelConfig){
        this.client=new GoogleGenAI({
            apiKey:config.apiKey
        })

        this.model= config.model
    }
    
    async generate(question: string, context:string): Promise<string> {
        
        try{
            const response= await this.client.models.generateContent({
            model: this.model,
            contents: `
                    Answer the question only using the context below.
                    If not found, say "Not found in document.

                    context:
                    ${context}
    
                    question:
                    ${question}
                `,
            })

            console.log("Gemini llm res- ",response );
            // console.log("res text================", response.text)
            // console.dir(response, { depth: null });
            // console.log("candidates ........... ....res- ",   response?.candidates?.[0]?.content?.parts?.[0]?.text)

            return response.text ?? "";
        }catch(e){
            console.log("error during gemini llm gen : ",e)
            throw new Error("LLM generation error occured ");
        }
    }
}