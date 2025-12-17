const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

router.get('/live', (req, res) => res.json({ status: 'live' }));

router.get('/ready', async (req, res) => {
  // здесь можно проверять БД/файлы; пока всё ок
  const deps = { storage: true };
  const ready = Object.values(deps).every(Boolean);
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready', deps });
});

module.exports = router;
