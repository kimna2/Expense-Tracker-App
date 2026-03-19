const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    // [IMPROVE] Check if req.user is null (deleted user with valid token) before calling next()
    next();
  } catch (err) {
    // [IMPROVE] Distinguish between expired token (401 + "Token expired") vs invalid token for better client UX
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
