import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import analyzeRouter from "./routes/analyze.js";
import { configureCors } from "./utils/security.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());
app.use(express.json());

// CORS
app.use(
  cors(
    configureCors({
      frontendUrl: process.env.FRONTEND_URL,
    }),
  ),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api", analyzeRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

