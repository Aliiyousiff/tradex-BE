const express = require("express");
const router = express.Router();
const { stripToken, verifyToken } = require("../middleware");
const { createTrade, getTrades, deleteTrade } = require("../controllers/Trade");

// Authentication middleware
const authMiddleware = [stripToken, verifyToken];

// Create a new trade
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trade = await createTrade(userId, symbol, quantity, price);
    res.status(201).json({ message: "Trade created successfully", trade });
  } catch (err) {
    console.error("Error creating trade:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all trades for the authenticated user
router.get("/user-trades", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const trades = await getTrades(userId);

    if (!trades || trades.length === 0) {
      return res.status(404).json({ message: "No trades found" });
    }

    res.status(200).json(trades);
  } catch (err) {
    console.error("Error fetching trades:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a trade by trade ID
router.delete("/:tradeId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tradeId } = req.params;

    const result = await deleteTrade(userId, tradeId);

    if (!result) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (err) {
    console.error("Error deleting trade:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
