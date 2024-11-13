require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dialogflow = require("dialogflow");

const { stripToken, verifyToken } = require("./middleware");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DB_URI;

// Log the DB_URI to verify it is correctly loaded
console.log("MongoDB URI:", DB_URI);

// MongoDB connection
mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
const auth = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const profileRoutes = require("./routes/Profile");

app.use("/api/auth", auth);
app.use("/api/users", stripToken, verifyToken, userRoutes);
app.use("/api/trades", stripToken, verifyToken, tradeRoutes);
app.use("/api/profile", stripToken, verifyToken, profileRoutes);

// Setup the Dialogflow client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEY_PATH,
});

// Dialogflow webhook route
app.post("/api/chatbot", async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    req.body.sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.query,
        languageCode: "en",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ fulfillmentText: result.fulfillmentText });
  } catch (err) {
    console.error("Dialogflow request failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
