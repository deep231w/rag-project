import "dotenv/config"

export  const env= {
    EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
    EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
    OLLAMA_URL:process.env.OLLAMA_URL,
    LOCAL_MONGODB_URI:process.env.LOCAL_MONGODB_URI,
    MY_JWT_SECRET:process.env.MY_JWT_SECRET
}