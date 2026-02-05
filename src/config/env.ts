import "dotenv/config"

export  const env= {
    EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY!,
    EMBEDDING_API_URL: process.env.EMBEDDING_API_URL!,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL!,
    OLLAMA_URL:process.env.OLLAMA_URL
}