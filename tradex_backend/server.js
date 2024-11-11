const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
