const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const DB_PATH = path.join(STORAGE_DIR, 'app.db');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function initDb() {
  ensureDir(STORAGE_DIR);
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checks (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      label TEXT NOT NULL,
      text TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      inputLength INTEGER NOT NULL,
      ok INTEGER NOT NULL,
      templateJson TEXT NOT NULL,
      foundJson TEXT NOT NULL,
      missingJson TEXT NOT NULL,
      orderIssuesJson TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return db;
}

module.exports = { initDb, DB_PATH };
