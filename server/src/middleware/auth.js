const { httpError } = require('./errors');
const { verifyToken } = require('../services/authService');

function authRequired(req, res, next) {
  const h = String(req.headers.authorization || '');
  if (!h.startsWith('Bearer ')) return next(httpError(401, 'NO_TOKEN', 'Authorization Bearer token required'));
  const token = h.slice('Bearer '.length).trim();
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (e) {
    return next(httpError(401, 'BAD_TOKEN', 'Invalid or expired token'));
  }
}

module.exports = { authRequired };
