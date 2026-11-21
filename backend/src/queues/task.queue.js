import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
});

connection.on("error", (error) => {
  console.error("Backend Redis error:", error.message);
});

export const taskQueue = new Queue("task-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: {
      count: 1000,
    },

    removeOnFail: {
      count: 5000,
    },
  },
});

export const enqueueTask = async (task) => {
  const job = await taskQueue.add(
    "process-task",
    {
      taskId: task._id.toString(),
    },
    {
      jobId: task._id.toString(),
    },
  );

  return job;
};
