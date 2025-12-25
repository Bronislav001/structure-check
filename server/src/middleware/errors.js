function httpError(status, code, message) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

function notFound(req, res, next) {
  next(httpError(404, 'NOT_FOUND', 'not found'));
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = Number(err.status) || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'internal error';
  res.status(status).json({ code, message });
}

module.exports = { httpError, notFound, errorHandler };
