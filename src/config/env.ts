// import "dotenv/config"
import dotenv from "dotenv"
const ENV=process.env.NODE_ENV || "development";

if(ENV ==="docker"){
    dotenv.config({path:".env.docker"})
}else if(ENV!=="production"){
    dotenv.config({path:".env.local"})
}

export  const env= {
    EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
    EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
    OLLAMA_URL:process.env.OLLAMA_URL,
    
    LOCAL_MONGODB_URI:process.env.LOCAL_MONGODB_URI,
    MY_JWT_SECRET:process.env.MY_JWT_SECRET,
    REDIS_URL:process.env.REDIS_URL,
    QDRANT_VECTORDB_URL:process.env.QDRANT_VECTORDB_URL
}



// import z from "zod"

// const envSchema=z.object({
//     NODE_ENV:z.enum(["development", "docker", "production"]),

//     LOCAL_MONGODB_URI:z.string().min(1),
//     REDIS_URL:z.string().min(1),
//     QDRANT_VECTORDB_URL:z.string().min(1),

//     MY_JWT_SECRET:z.string().min(1),
//     PORT:z.coerce.number().default(3000)

// })


// const ENV={
//     development:{
//         EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
//         EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
//         EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
//         OLLAMA_URL:process.env.OLLAMA_URL,

//         //local setup for testing the uploadthing only these url will change
//         LOCAL_MONGODB_URI:process.env.LOCAL_MONGODB_URI,
//         MY_JWT_SECRET:process.env.MY_JWT_SECRET,
//         REDIS_URL:process.env.REDIS_URL,
//         QDRANT_VECTORDB_URL:process.env.QDRANT_VECTORDB_URL
//     },

//     docker:{
//         EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
//         EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
//         EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
//         OLLAMA_URL:process.env.OLLAMA_URL,

//         //docker setup when the whole app is running in docker 
//         LOCAL_MONGODB_URI:process.env.LOCAL_MONGODB_URI,
//         MY_JWT_SECRET:process.env.MY_JWT_SECRET,
//         REDIS_URL:process.env.REDIS_URL,
//         QDRANT_VECTORDB_URL:process.env.QDRANT_VECTORDB_URL
//     },
//     production:{
//         EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
//         EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
//         EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
//         OLLAMA_URL:process.env.OLLAMA_URL,

//         LOCAL_MONGODB_URI:process.env.LOCAL_MONGODB_URI,
//         MY_JWT_SECRET:process.env.MY_JWT_SECRET,
//         REDIS_URL:process.env.REDIS_URL,
//         QDRANT_VECTORDB_URL:process.env.QDRANT_VECTORDB_URL
//     }
// }

