const fs = require('fs');
const path = require('path');

const STORAGE = path.join(__dirname, '..', 'storage', 'users.json');

function ensureFile() {
  if (!fs.existsSync(STORAGE)) {
    fs.mkdirSync(path.dirname(STORAGE), { recursive: true });
    fs.writeFileSync(STORAGE, '[]', 'utf8');
  }
}

exports.readUsers = function readUsers() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(STORAGE, 'utf8'));
  } catch {
    return [];
  }
};

exports.writeUsers = function writeUsers(list) {
  ensureFile();
  fs.writeFileSync(STORAGE, JSON.stringify(list, null, 2), 'utf8');
};
