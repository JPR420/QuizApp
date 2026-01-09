// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

async function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // password_hash is NOT returned by findById anyway
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
