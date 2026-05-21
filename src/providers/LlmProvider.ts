export interface LlmProvider{
    generate(prompt:string , botId:number):Promise<string>
}