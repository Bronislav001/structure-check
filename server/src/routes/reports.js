const router = require('express').Router();
const ctrl = require('../controllers/reportsController');

router.get('/templates', ctrl.getTemplates);
router.post('/validate', ctrl.validateReport);

module.exports = router;
