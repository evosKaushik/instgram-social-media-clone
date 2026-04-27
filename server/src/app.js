import express from "express";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import sanitizeHandler from "./middlewares/sanitize.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import metricsMiddleware from "./middlewares/debug.middleware.js";

const app = express();

// Connect to DB
await connectDB();

// Middleware
app.use(express.json()); // Replace body-parser with built-in middleware in JSON
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(cors({
  origin: "*", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
})); // Enable CORS for all routes (you can configure it further as needed)

//Custom Middleware
app.use(sanitizeHandler); // Sanitize data to prevent NoSQL injection

// Debugging Middleware
app.use(metricsMiddleware); // Log request metrics in development mode

// Routes
app.use("/api/v1/auth", authRoutes); // Auth routes

// Error handling middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
