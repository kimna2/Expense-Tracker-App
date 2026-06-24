require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// [IMPROVE] Add helmet() middleware for security headers: app.use(require('helmet')())
// [IMPROVE] Add rate limiting on auth routes: app.use('/api/v1/auth', rateLimit({ windowMs: 15*60*1000, max: 20 }))
// [IMPROVE] Add express.json({ limit: '10kb' }) to prevent large payload attacks

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // [SECURITY] Fallback to "*" allows any origin — remove the fallback in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// [IMPROVE] Add a global error-handling middleware instead of try/catch in every controller:
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
