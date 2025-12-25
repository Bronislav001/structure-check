const { randomUUID } = require('crypto');

function now() {
  return Date.now();
}

// Генерация короткого id с префиксом (usr_, chk_ ...)
function makeId(prefix) {
  // randomUUID -> 32 hex + дефисы, уберём дефисы и укоротим
  const raw = randomUUID().replace(/-/g, '');
  return `${prefix}_${raw.slice(0, 10)}`;
}

module.exports = { makeId, now };
