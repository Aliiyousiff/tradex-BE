require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 

// MongoDB connection with error handling
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));


  // Routes
const auth = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', userRoutes);
app.use('/api/trades', tradeRoutes);


// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
