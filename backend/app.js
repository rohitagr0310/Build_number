const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database");
const appRoutes = require("./router/Router");
const authRoutes = require("./router/authRouter");
const cartRoutes = require("./router/cartRouter");
const BOMRoutes = require("./router/BOMRouter");

const authMiddleware = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Protected routes
app.use("/api", authMiddleware, appRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/subassemblies", authMiddleware, BOMRoutes);
app.use("/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
