require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dialogflow = require('dialogflow'); // Import Dialogflow SDK

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS for all routes

// Log the DB_URI to verify it is correctly loaded
console.log("MongoDB URI:", process.env.DB_URI); // Check if the URI is loaded correctly

// MongoDB connection with error handling
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Importing Routes
const auth = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

// Define routes
app.use('/api/auth', auth); // Auth routes
app.use('/api/users', userRoutes); // User routes (Protected with authMiddleware)
app.use('/api/trades', tradeRoutes); // Trade routes

// Setup the Dialogflow client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEY_PATH // Path to your Dialogflow service account key
});

// Route to handle Dialogflow webhook requests
app.post('/api/chatbot', async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID, 
    req.body.sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.query,
        languageCode: 'en',
      },
    },
  };

  try {
    // Send request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Send the response back to Dialogflow (this will be sent back to the client)
    res.json({
      fulfillmentText: result.fulfillmentText,  // Dialogflow's response
    });
  } catch (err) {
    console.error('Dialogflow request failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
