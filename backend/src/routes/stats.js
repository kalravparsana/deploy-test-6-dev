import { Router } from 'express';
import * as statsService from '../services/statsService.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const stats = await statsService.getAllStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
