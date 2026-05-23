export interface EmbeddedProvider{
    generateEmbedding(text:string):Promise<number[]>

    generateEmbeddings(chuncks:string[]):Promise<number[][]>
}