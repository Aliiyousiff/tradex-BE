const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../routes/auth');

const stripToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Authorization header is missing or malformed.");
      return res.status(401).json({ message: "No token provided or invalid format." });
    }

    const token = authHeader.split(' ')[1];
    req.token = token;
    console.log("Token extracted successfully:", token);
    next();
  } catch (error) {
    console.error("Error in stripToken middleware:", error.message);
    return res.status(500).json({ message: "Error extracting token.", error: error.message });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.token;
    if (!token) {
      console.error("Token is missing from request object.");
      return res.status(401).json({ message: "Token not found." });
    }

    if (isTokenBlacklisted(token)) {
      console.warn("Token is blacklisted.");
      return res.status(401).json({ message: "Token is blacklisted." });
    }

    const decoded = jwt.verify(token, process.env.APP_SECRET || 'your_jwt_secret_key');
    console.log("Token verified. Decoded payload:", decoded);

    if (!decoded || !decoded.userId) {
      console.error("Decoded token does not contain userId.");
      return res.status(401).json({ message: "Invalid token payload." });
    }

    req.user = decoded; // Set the decoded user information on the request object
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token.", error: err.message });
  }
};

module.exports = { stripToken, verifyToken };
