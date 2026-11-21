// import dotenv from "dotenv";
// dotenv.config();

import "dotenv/config";

import { Worker } from "bullmq";

import redisConnection from "./config/redis.js";
import connectDB from "./config/db.js";
// import Task from "../../../shared/models/task.model.js";

import { executeTask } from "./services/task.service.js";

const startWorker = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

    // Create BullMQ worker
    const worker = new Worker(
      "task-queue",
      async (job) => {
        console.log(`Processing job: ${job.id}`);

        return await executeTask(job);
      },
      {
        connection: redisConnection,

        concurrency: Number(process.env.WORKER_CONCURRENCY || 5),
      },
    );

    worker.on("completed", (job, result) => {
      console.log(`Job ${job.id} completed`, result);
    });

    worker.on("failed", (job, error) => {
      console.error(`Job ${job?.id} failed:`, error.message);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    console.log("Node.js Worker Started Successfully");

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Worker shutting down...");

      await worker.close();
      await redisConnection.quit();
      const mongoose = await import("mongoose");
      await mongoose.default.disconnect();

      process.exit(0);
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (error) {
    console.error("Worker startup failed:", error);

    await redisConnection.quit().catch(() => {});

    process.exit(1);
  }
};

startWorker();
