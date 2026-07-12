require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercises');
const planRoutes = require('./routes/plans');
const scheduleRoutes = require('./routes/schedule');
const sessionRoutes = require('./routes/sessions');
const goalRoutes = require('./routes/goals');
const measurementRoutes = require('./routes/measurements');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
