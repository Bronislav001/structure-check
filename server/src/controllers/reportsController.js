const templates = require('../storage/templates.json');
const { findMissingSections } = require('../services/validationService');

exports.getTemplates = async (req, res, next) => {
  try {
    res.json(templates);
  } catch (e) { next(e); }
};

exports.validateReport = async (req, res, next) => {
  try {
    const text = (req.body && req.body.text) || '';
    const required = (templates.templates && templates.templates[0]?.sections) || [];
    const missing = findMissingSections(text, required);
    res.json({
      ok: missing.length === 0,
      missing,
      ai: { enabled: false, note: 'AI not connected yet' }
    });
  } catch (e) { next(e); }
};
