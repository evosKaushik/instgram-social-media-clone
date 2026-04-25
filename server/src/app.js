import express from "express";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import sanitizeHandler from "./middlewares/sanitize.middleware.js";

const app = express();

// Connect to DB
await connectDB();

// Middleware
app.use(express.json()); // Replace body-parser with built-in middleware in JSON

//Custom Middleware
app.use(sanitizeHandler); // Sanitize data to prevent NoSQL injection

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
