import { body } from "express-validator";

const operations = ["uppercase", "lowercase", "reverse", "wordcount"];

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("inputText")
    .isString()
    .withMessage("Input text must be a string.")
    .notEmpty()
    .withMessage("Input text is required.")
    .isLength({ max: 100000 })
    .withMessage("Input text is too long."),

  body("operation").isIn(operations).withMessage("Invalid task operation."),
];

export const updateTaskValidator = [
  body("title").optional().trim().notEmpty().isLength({ max: 100 }),

  body("inputText").optional().isString().isLength({ max: 100000 }),

  body("operation")
    .optional()
    .isIn(operations)
    .withMessage("Invalid task operation."),
];