const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../routes/auth');

const stripToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  req.token = token;
  next();
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.token;
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.APP_SECRET || 'your_jwt_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = { stripToken, verifyToken };
