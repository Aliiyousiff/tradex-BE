// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const jwtSecret = process.env.APP_SECRET || "your_jwt_secret_key";
let tokenBlacklist = []; // In-memory token blacklist

// Registration Route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error("User not found:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch for user:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with userId and username
    const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    if (!tokenBlacklist.includes(token)) {
      tokenBlacklist.push(token);
      console.log("Token added to blacklist:", token);
      return res.status(200).json({ message: "Logged out successfully" });
    }
    console.warn("Token already blacklisted:", token);
    return res.status(400).json({ message: "Token already blacklisted" });
  } else {
    console.error("No token provided for logout");
    return res.status(400).json({ message: "Token not provided" });
  }
});

// Middleware to check if token is blacklisted
const isTokenBlacklisted = (token) => tokenBlacklist.includes(token);

module.exports = router;
module.exports.isTokenBlacklisted = isTokenBlacklisted;
