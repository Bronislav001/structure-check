const express = require('express');

function buildAuthRouter(authController) {
  const r = express.Router();
  r.post('/register', authController.register);
  r.post('/login', authController.login);
  return r;
}

module.exports = { buildAuthRouter };
