export interface LlmProvider{
    generate(question:string , context:string):Promise<string>
}