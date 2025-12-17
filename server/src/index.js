const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/api/auth', require('./routes/auth'));
app.use(morgan('dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found', path: req.originalUrl }));

// error handler
app.use((err, req, res, next) => {
  console.error('ERR:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
