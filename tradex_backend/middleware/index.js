// middleware/index.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token'); // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET || 'your_jwt_secret_key' // Use APP_SECRET from .env
    );
    req.user = decoded; // Attach decoded token to request object
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;