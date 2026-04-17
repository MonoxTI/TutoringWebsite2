import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./Routes/Route.js";
import connectDB from "./Config/DBconnect.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,           // set this in Vercel env vars
  "https://jazzy-baklava-993a51.netlify.app",
  "https://assmbledtutor.netlify.app",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use("/api", router);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Catch-all for 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
