import { Router } from 'express';
import * as analyticsService from '../services/analyticsService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const period = req.query.period || '7d';
    const data = await analyticsService.getAnalytics(period);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
