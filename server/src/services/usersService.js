const bcrypt = require('bcryptjs');
const { httpError } = require('../middleware/errors');
const { makeId, now } = require('../util');

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

function createUsersService(db) {
  const findByEmailStmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const insertStmt = db.prepare('INSERT INTO users (id, email, name, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?)');

  function findByEmail(email) {
    return findByEmailStmt.get(normalizeEmail(email)) || null;
  }

  function createUser({ email, name, password }) {
    const e = normalizeEmail(email);
    const n = String(name || '').trim();
    const p = String(password || '');

    if (!e || !e.includes('@')) throw httpError(400, 'VALIDATION_ERROR', 'email is invalid');
    if (!n || n.length < 2) throw httpError(400, 'VALIDATION_ERROR', 'name is required (min 2 chars)');
    if (!p || p.length < 6) throw httpError(400, 'VALIDATION_ERROR', 'password must be at least 6 chars');

    if (findByEmail(e)) throw httpError(409, 'ALREADY_EXISTS', 'user already exists');

    const user = {
      id: makeId('usr'),
      email: e,
      name: n,
      passwordHash: bcrypt.hashSync(p, 10),
      createdAt: now()
    };

    insertStmt.run(user.id, user.email, user.name, user.passwordHash, user.createdAt);
    return { id: user.id, email: user.email, name: user.name };
  }

  function verifyPassword(email, password) {
    const user = findByEmail(email);
    if (!user) return null;
    const ok = bcrypt.compareSync(String(password || ''), user.passwordHash);
    if (!ok) return null;
    return { id: user.id, email: user.email, name: user.name };
  }

  return { createUser, verifyPassword };
}

module.exports = { createUsersService };
