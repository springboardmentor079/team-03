const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).json({ message: 'No authorization header, access denied' });
    }

    const token = header.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretfallbackkey');
    req.user = decoded; // contains { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid, authorization denied' });
  }
};

module.exports = authMiddleware;
