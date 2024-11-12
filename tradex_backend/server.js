// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000; // Use PORT from .env

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trades', tradeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});