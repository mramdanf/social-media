require('dotenv').config();
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ error: true, errorMessage: 'Token is required' });
  }

  try {
    const decoded = await jwt.verify(
      token,
      `${process.env.MAIN_SERVICE_JWT_PRIVATE_KEY}`
    );
    req._id = decoded._id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: true, errorMessage: 'Invalid token' });
  }
}

module.exports = verifyToken;
