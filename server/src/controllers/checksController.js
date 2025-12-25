function createChecksController({ checksService }) {
  return {
    create(req, res, next) {
      try {
        const userId = req.user.id;
        const { label, text } = req.body || {};
        const check = checksService.createCheck(userId, { label, text });
        res.status(201).json(check);
      } catch (e) { next(e); }
    },

    list(req, res, next) {
      try {
        const userId = req.user.id;
        const items = checksService.listChecks(userId);
        res.json({ items });
      } catch (e) { next(e); }
    },

    getOne(req, res, next) {
      try {
        const userId = req.user.id;
        const check = checksService.getCheck(userId, req.params.id);
        res.json(check);
      } catch (e) { next(e); }
    },

    patch(req, res, next) {
      try {
        const userId = req.user.id;
        const check = checksService.updateCheck(userId, req.params.id, req.body || {});
        res.json(check);
      } catch (e) { next(e); }
    },

    del(req, res, next) {
      try {
        const userId = req.user.id;
        const out = checksService.deleteCheck(userId, req.params.id);
        res.json(out);
      } catch (e) { next(e); }
    }
  };
}

module.exports = { createChecksController };
