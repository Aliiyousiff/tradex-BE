require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS for all routes

// MongoDB connection with error handling
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Importing Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

// Define routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/users', userRoutes); // User routes (Protected with authMiddleware)
app.use('/api/trades', tradeRoutes); // Trade routes

// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
