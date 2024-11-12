const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token'); // Look for the token in the header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET || 'your_jwt_secret_key' // Use APP_SECRET from .env, fallback to default
    );
    req.user = decoded; // Attach decoded token to the request object for use in routes
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
