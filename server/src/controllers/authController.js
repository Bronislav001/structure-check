const { httpError } = require('../middleware/errors');

function createAuthController({ usersService, authService }) {
  return {
    register(req, res, next) {
      try {
        const { email, name, password } = req.body || {};
        const user = usersService.createUser({ email, name, password });
        const token = authService.signToken(user);
        res.status(201).json({ user, token });
      } catch (e) { next(e); }
    },

    login(req, res, next) {
      try {
        const { email, password } = req.body || {};
        if (!email || !password) throw httpError(400, 'VALIDATION_ERROR', 'email and password are required');

        const user = usersService.verifyPassword(email, password);
        if (!user) throw httpError(401, 'INVALID_CREDENTIALS', 'invalid email or password');

        const token = authService.signToken(user);
        res.json({ user, token });
      } catch (e) { next(e); }
    }
  };
}

module.exports = { createAuthController };
