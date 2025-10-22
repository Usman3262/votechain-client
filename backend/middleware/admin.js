// backend/middleware/admin.js
const admin = (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'User is not admin' });
  }

  next();
};

module.exports = admin;