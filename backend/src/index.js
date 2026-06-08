import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import statsRouter from './routes/stats.js';
import activitiesRouter from './routes/activities.js';
import analyticsRouter from './routes/analytics.js';
import settingsRouter from './routes/settings.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/stats', statsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/settings', settingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
