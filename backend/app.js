const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database");
const router = require("./router/Routes");
const authMiddleware = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Protected routes
app.use("/api", authMiddleware, router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
