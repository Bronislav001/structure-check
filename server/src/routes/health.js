const express = require('express');

function buildHealthRouter() {
  const r = express.Router();
  r.get('/', (req, res) => res.json({ ok: true, ts: Date.now() }));
  return r;
}

module.exports = { buildHealthRouter };
