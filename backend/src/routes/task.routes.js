import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/task.validator.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.post("/", createTaskValidator, validate, createTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.patch("/:id", updateTaskValidator, validate, updateTask);

router.delete("/:id", deleteTask);

export default router;
