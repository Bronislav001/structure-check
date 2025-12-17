const { readUsers, writeUsers } = require('../services/userService');

function makeHash(pwd) {
  // Для ЛР-3 хватит так; в ЛР-4/5 заменишь на bcrypt
  return `hash:${pwd}`;
}

exports.register = (req, res) => {
  const { name = '', email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const users = readUsers();
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ message: 'email already registered' });
  }

  const user = {
    id: cryptoRandom(),
    name,
    email,
    passwordHash: makeHash(password),
  };

  users.push(user);
  writeUsers(users);

  res.status(201).json({
    message: 'registered',
    user: { id: user.id, email: user.email, name: user.name },
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: 'user not found' });

  const ok = user.passwordHash === `hash:${password}`;
  if (!ok) return res.status(401).json({ message: 'wrong password' });

  res.json({
    message: 'login ok',
    user: { id: user.id, email: user.email, name: user.name },
  });
};

// простой id
function cryptoRandom() {
  return cryptoRandomString(32);
}
function cryptoRandomString(len = 32) {
  const abc = 'abcdef0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += abc[(Math.random() * abc.length) | 0];
  return s;
}
