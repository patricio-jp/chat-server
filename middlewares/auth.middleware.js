const jwt = require('jsonwebtoken');

const httpAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.headers['authorization'] || socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Invalid token.'));
  }
};

module.exports = {
  httpAuthMiddleware,
  socketAuthMiddleware,
};
