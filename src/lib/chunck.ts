
export function chunckText(text:string ,chunkSize=800, overlap=100){
    const words= text.split('/\s+/');

    const chuncks:string[]=[];

    let i=0;
    while(i<words.length){
        const chunck=words.slice(i,i+chunkSize).join(" ");
        chuncks.push(chunck);
        i+=chunkSize-overlap;
    }

    console.log("chunks converted -",chuncks);
    return chuncks;
}