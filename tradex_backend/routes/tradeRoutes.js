const express = require("express");
const router = express.Router();
const { stripToken, verifyToken } = require("../middleware");
const {
  createTrade,
  getTrades,
  deleteTrade,
  addFavorite,
  removeFavorite,
} = require("../controllers/Trade");

// Middleware for authentication
const authMiddleware = [stripToken, verifyToken];

// Create a new trade (Buy or Sell)
router.post("/create", authMiddleware, createTrade);

// Get all trades for the authenticated user
router.get("/user-trades", authMiddleware, getTrades);

// Delete a trade by trade ID
router.delete("/:tradeId", authMiddleware, deleteTrade);

// Add a stock to user's favorites
router.post("/favorites/add", authMiddleware, addFavorite);

// Remove a stock from user's favorites
router.delete("/favorites/remove", authMiddleware, removeFavorite);

module.exports = router;
