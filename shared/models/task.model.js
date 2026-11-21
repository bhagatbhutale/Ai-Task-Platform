import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["info", "success", "error"],
      default: "info",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    inputText: {
      type: String,
      required: true,
      maxlength: 100000,
    },

    operation: {
      type: String,
      required: true,
      enum: ["uppercase", "lowercase", "reverse", "wordcount"],
    },

    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "pending",
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    logs: {
      type: [logSchema],
      default: [],
    },

    errorMessage: {
      type: String,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// User task history
taskSchema.index({
  userId: 1,
  createdAt: -1,
});

// Task status filtering
taskSchema.index({
  status: 1,
  createdAt: -1,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
