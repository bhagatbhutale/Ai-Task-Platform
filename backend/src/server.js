
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

import errorHandler from "./middleware/error.middleware.js"

dotenv.config();

const app = express();

// Security
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use("/api", limiter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Task Platform API is running",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global error handler
app.use(errorHandler);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
























// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";

// dotenv.config();

// const app = express();

// // Security middleware
// app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   }),
// );

// // Request parsing
// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Logging
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
// });

// app.use("/api", limiter);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "AI Task Platform API is running",
//     service: "backend",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Root route
// app.get("/", (req, res) => {
//   res.send("AI Task Processing Platform Backend");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });









