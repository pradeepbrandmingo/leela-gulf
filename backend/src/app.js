import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";

const app = express();

// Security
app.use(helmet());

// CORS configuration (Global environment-driven for localhost + production deployments)
const explicitAllowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://leela-gulf.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-side fetch)
      if (!origin) return callback(null, true);

      // Allow explicit origins or any Vercel deployment preview / production domain
      if (
        explicitAllowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV === "development"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// JSON body parser
app.use(
  express.json({
    limit: "2mb",
  })
);

// URL-encoded body parser
app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

// Cookie parser
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Leela Gulf Production API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Global API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/careers", careerRoutes);

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global API Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
