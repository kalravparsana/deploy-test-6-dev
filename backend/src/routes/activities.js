import { Router } from 'express';
import * as activityService from '../services/activityService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const activities = await activityService.getActivities(search);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

export default router;
