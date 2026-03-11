# RAG Project

A Retrieval-Augmented Generation (RAG) backend system with caching and database support.

---

# Architecture Overview

This project uses the following stack:

* **MongoDB** → Main database
* **Mongo Express** → Web UI for MongoDB
* **Redis** → Caching layer
* **Docker Compose** → Local development environment

---

# MongoDB Web UI

This project uses **Mongo Express**, a web-based GUI for MongoDB running locally.

It allows you to:

* Inspect collections
* View documents
* Edit database records
* Debug stored data easily

---

# Running the Project (Local Development)

Start the full stack using Docker Compose.

```bash
docker compose up --build --watch
```

This will start:

* Application server
* MongoDB
* Mongo Express
* Redis

---

# Caching Strategy

The project uses **Redis** to cache responses for previously asked questions.

Two caching techniques are implemented:

1. **Hash-based caching**
2. **Normalized question caching**

---

# 1. Hash-Based Cache

A SHA-256 hash of the raw question is used as the cache key.

This ensures **exact question match caching**.

### Example

```ts
const hashedq = hashQuestion(question);
if (hashedq) console.log("question hashed..");

const hkey = `rag:${botId}:qhash:${hashedq}`;

const hashedRedisCache = await SetCache(hkey, answer);

if (hashedRedisCache) console.log("hashed question cached...");
```

### Hash Function

```ts
function hashQuestion(q: string) {
  const hashedQ = crypto
    .createHash("sha256")
    .update(q)
    .digest("hex");

  return hashedQ;
}
```

Example Redis Key:

```
rag:bot123:qhash:ab3429f9c83a...
```

---

# 2. Normalized Question Cache

To improve cache hits, the question is **normalized** before hashing.

Normalization steps:

* Convert to lowercase
* Remove punctuation
* Collapse multiple spaces
* Trim whitespace
* Hash the normalized text

### Example

```ts
const normq = normlizedQuestion(question);

if (normq) console.log("question normalized...", normq);

const normlzqKey = `rag:${botId}:qnormlz:${normq}`;

const normalisedRedisCache = await SetCache(normlzqKey, answer);

if (normalisedRedisCache) console.log("cached normalized question...");
```

### Normalization Function

```ts
function normlizedQuestion(q: string) {
  const normlzq = q
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const normlzhashedq = crypto
    .createHash("sha256")
    .update(normlzq)
    .digest("hex");

  return normlzhashedq;
}
```

Example Redis Key:

```
rag:bot123:qnormlz:98a2bca1a42...
```

---

# Why Two Caches?

### Hash Cache

Fast lookup for **exact repeated questions**

Example:

```
"What is RAG?"
"What is RAG?"
```

---

### Normalized Cache

Handles **small variations**

Example:

```
"What is RAG?"
"what is rag"
"What is rag??"
```

All normalize to the same key.

---

# Redis Key Structure

```
rag:{botId}:qhash:{hash}
rag:{botId}:qnormlz:{hash}
```

Example:

```
rag:bot42:qhash:abcdef123
rag:bot42:qnormlz:9981abcc
```

---

# Development Notes

* Redis is used only for **question → answer caching**
* MongoDB stores the main application data
* Docker Compose manages all services locally

---
