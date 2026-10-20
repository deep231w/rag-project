import { createClient } from "redis";
import { env } from "../config/env";

export const redis = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      if (retries > 10) {
        console.error("Redis: maximum reconnect attempts reached");
        return new Error("Redis reconnect limit reached");
      }

      return Math.min(retries * 500, 5000);
    },
  },
});

redis.on("error", (err) => {
  console.error("Redis client error:", err.message);
});

redis.on("connect", () => {
  console.log("Redis TCP connection established");
});

redis.on("ready", () => {
  console.log("Redis client ready");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redis.on("end", () => {
  console.log("Redis connection closed");
});