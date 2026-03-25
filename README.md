# RAG Project

A Retrieval-Augmented Generation (RAG) backend system with **multi-layer caching** and database support.

---

# Architecture Overview

This project uses the following stack:

- **MongoDB** → Main database  
- **Mongo Express** → Web UI for MongoDB  
- **Redis** → Fast caching layer (exact + normalized)  
- **Qdrant** → Vector database for semantic caching  
- **Docker Compose** → Local development environment  

---

# MongoDB Web UI

This project uses **Mongo Express**, a web-based GUI for MongoDB running locally.

It allows you to:

- Inspect collections  
- View documents  
- Edit database records  
- Debug stored data easily  

---

# Running the Project

---

## 🖥️ Local Setup (Application runs locally, services in Docker)

### 1. Setup environment
```bash
cp .env.local.example .env.local
```

### 2. Start services
```bash
docker compose up --build --watch
```

### 3. Stop API container
```bash
docker stop rag-project-api-1
```

### 4. Run application locally
```bash
npm run dev
```

---

## 🐳 Docker Setup (Full containerized environment)

### 1. Setup environment
```bash
cp .env.docker.example .env.docker
```

### 2. Start application and services
```bash
docker compose up --build --watch
```

### Services started
- Application server  
- MongoDB  
- Mongo Express  
- Redis  
- Qdrant  
- Ollama  

---

# Caching Strategy

The project uses a **3-layer caching system** to optimize performance and reduce LLM calls:

1. **Hash-based caching (Redis)**  
2. **Normalized question caching (Redis)**  
3. **Semantic caching (Qdrant)**  

---

# 1. Hash-Based Cache (Redis)

A SHA-256 hash of the raw question is used as the cache key.

## Purpose

- Exact match caching  
- Fastest lookup  

## Example

```ts
const hashedq = hashQuestion(question);

const hkey = `rag:${botId}:qhash:${hashedq}`;

await SetCache(hkey, answer);
```

## Hash Function

```ts
function hashQuestion(q: string) {
  return crypto
    .createHash("sha256")
    .update(q)
    .digest("hex");
}
```

## Example Key

```
rag:bot123:qhash:ab3429f9c83a...
```

---

# 2. Normalized Question Cache (Redis)

Improves cache hits by normalizing the question before hashing.

## Normalization Steps

- Lowercase conversion  
- Remove punctuation  
- Collapse spaces  
- Trim whitespace  
- Hash normalized text  

## Example

```ts
const normq = normlizedQuestion(question);

const normlzqKey = `rag:${botId}:qnormlz:${normq}`;

await SetCache(normlzqKey, answer);
```

## Normalization Function

```ts
function normlizedQuestion(q: string) {
  const normlzq = q
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return crypto
    .createHash("sha256")
    .update(normlzq)
    .digest("hex");
}
```

## Example Key

```
rag:bot123:qnormlz:98a2bca1a42...
```

---

# 3. Semantic Cache (Qdrant)

This layer enables **meaning-based caching** using vector embeddings.

Instead of matching exact text, it matches **semantic similarity**.

---

## How It Works

### Step 1: Convert Question → Embedding

```ts
const embeddedQuestion = await OllamaQuestionToEmbedded(question);
```

---

### Step 2: Check Semantic Cache

```ts
const res = await qdrant.search("qa_cache", {
  vector: embedding,
  limit: 1,
  filter: {
    must: [
      {
        key: "botId",
        match: { value: botId }
      }
    ]
  }
});
```

---

### Step 3: Similarity Threshold

```ts
if (res.length && res[0].score > 0.92) {
  return res[0]?.payload?.answer;
}
```

---

### Step 4: Store in Semantic Cache

```ts
await qdrant.upsert("qa_cache", {
  points: [
    {
      id: crypto.randomUUID(),
      vector: embeddedQuestion,
      payload: {
        botId,
        question,
        answer
      }
    }
  ]
});
```

---

## Why Semantic Cache?

Handles different phrasing with same meaning.

### Example

```
"What is RAG?"
"Explain retrieval augmented generation"
"Tell me about RAG architecture"
```

---

# Request Flow

When a user asks a question:

```
1. Check Hash Cache (Redis)
2. Check Normalized Cache (Redis)
3. Generate Embedding
4. Check Semantic Cache (Qdrant)
5. Call LLM (if all miss)
6. Store result in:
   - Hash Cache
   - Normalized Cache
   - Semantic Cache
```

---

# Redis Key Structure

```
rag:{botId}:qhash:{hash}
rag:{botId}:qnormlz:{hash}
```

---

# Qdrant Collection

```
Collection: qa_cache
```

## Stored Payload

```json
{
  "botId": "bot123",
  "question": "What is RAG?",
  "answer": "..."
}
```

---

# Performance Tradeoff

| Cache Layer        | Speed ⚡ | Accuracy 🎯 | Use Case |
|-------------------|--------|------------|----------|
| Hash Cache        | Very High | Exact only | Same question |
| Normalized Cache  | High | Medium | Slight variation |
| Semantic Cache    | Medium | High | Meaning-based |

---

# Development Notes

- Redis → ultra-fast lookup caching  
- Qdrant → semantic similarity search  
- MongoDB → persistent data storage  
- Similarity threshold (`0.92`) can be tuned  

---

# Future Improvements

- Add TTL to Redis keys  
- Use top-k semantic matches instead of 1  
- Cache embeddings to avoid recomputation  
- Add metrics/logging for cache hit rates  