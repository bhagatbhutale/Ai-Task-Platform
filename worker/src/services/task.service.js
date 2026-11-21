// import Task from "../../../shared/models/task.model.js";

import Task from "../../../shared/models/task.model.js";

import processText from "../processors/task.processor.js";

export const executeTask = async (job) => {
  const { taskId } = job.data;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  // Do not process an already completed task again
  if (task.status === "success") {
    return {
      taskId,
      skipped: true,
      message: "Task already completed",
    };
  }

  // Update task status
  await Task.findByIdAndUpdate(taskId, {
    $set: {
      status: "running",
      startedAt: task.startedAt || new Date(),
      errorMessage: null,
    },
    $inc: {
      attempts: 1,
    },
    $push: {
      logs: {
        message: "Worker started processing task.",
        level: "info",
        timestamp: new Date(),
      },
    },
  });

  try {
    const result = processText(task.inputText, task.operation);

    await Task.findByIdAndUpdate(taskId, {
      $set: {
        status: "success",
        result,
        completedAt: new Date(),
        errorMessage: null,
      },
      $push: {
        logs: {
          message: "Task processed successfully.",
          level: "success",
          timestamp: new Date(),
        },
      },
    });

    console.log(`Task completed: ${taskId}`);

    return {
      taskId,
      result,
      status: "success",
    };
  } catch (error) {
    const maxAttempts = job.opts.attempts || 1;

    const isFinalAttempt = job.attemptsMade + 1 >= maxAttempts;

    await Task.findByIdAndUpdate(taskId, {
      $set: isFinalAttempt
        ? {
            status: "failed",
            errorMessage: error.message,
            completedAt: new Date(),
          }
        : {
            status: "running",
            errorMessage: error.message,
          },

      $push: {
        logs: {
          message: isFinalAttempt
            ? `Task failed: ${error.message}`
            : `Attempt failed. Retrying: ${error.message}`,

          level: "error",
          timestamp: new Date(),
        },
      },
    });

    throw error;
  }
};