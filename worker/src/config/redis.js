import IORedis from "ioredis";

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),

  maxRetriesPerRequest: null,

  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redisConnection.on("connect", () => {
  console.log("Worker Redis connected");
});

redisConnection.on("error", (error) => {
  console.error("Worker Redis error:", error.message);
});

export default redisConnection;
