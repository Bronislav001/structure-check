const express = require('express');
const { authRequired } = require('../middleware/auth');

function buildChecksRouter(checksController) {
  const r = express.Router();
  r.use(authRequired);

  r.get('/', checksController.list);
  r.post('/', checksController.create);

  r.get('/:id', checksController.getOne);
  r.patch('/:id', checksController.patch);
  r.delete('/:id', checksController.del);

  return r;
}

module.exports = { buildChecksRouter };
