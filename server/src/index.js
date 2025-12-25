const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { initDb } = require('./db');
const authService = require('./services/authService');
const { createUsersService } = require('./services/usersService');
const { createChecksService } = require('./services/checksService');

const { createAuthController } = require('./controllers/authController');
const { createChecksController } = require('./controllers/checksController');

const { buildAuthRouter } = require('./routes/auth');
const { buildChecksRouter } = require('./routes/checks');
const { buildHealthRouter } = require('./routes/health');

const { notFound, errorHandler } = require('./middleware/errors');

const PORT = process.env.PORT || 8080;

function main() {
  const db = initDb();
  const usersService = createUsersService(db);
  const checksService = createChecksService(db);

  const authController = createAuthController({ usersService, authService });
  const checksController = createChecksController({ checksService });

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.use('/api/health', buildHealthRouter());
  app.use('/api/auth', buildAuthRouter(authController));
  app.use('/api/checks', buildChecksRouter(checksController));

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main();
