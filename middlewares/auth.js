const User = require('../models/User');

// Admin middleware
exports.admin = (req, res, next) => {
  // This assumes that the 'protect' middleware has already run and attached the user to the request.
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as an admin' });
  }
};
