import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// JSON body
app.use(
  express.json({
    limit: "16kb",
  }),
);

// URL-encoded body
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

// Cookies
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Leela Gulf API is running",
  });
});

export default app;
