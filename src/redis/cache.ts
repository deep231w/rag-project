import { redis } from "./redis";

export async function SetCache(key:string , value:any , ttl=3600){
    try{
        const res= await redis.set(key , JSON.stringify(value) ,{
            EX:ttl
        })
        
        console.log("redis set res- ", res);
        return res;
    }catch(e){
        console.log("ERROR IN SET CACHE IN REDIS:",e);
        throw e;
    }
}

export async function GetCache(key:string){
    try{
        const data= await redis.get(key);
        
        if(!data) return null;

        return JSON.parse(data);

    }catch(e){
        console.log("error in det cache redis-" , e);
    }
}

export async function DeleteCache(key:string) {
    try{
        const res= await redis.del(key);
        console.log("deleted data res - ", res);

    }catch(e){
        console.log("error in delete cache from redis -", e);
        throw e;
    }
}