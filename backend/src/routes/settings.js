import { Router } from 'express';
import { z } from 'zod';
import * as settingsService from '../services/settingsService.js';

const router = Router();

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.string().min(1, 'Role is required'),
  avatar: z.string().optional(),
});

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  darkMode: z.boolean(),
});

router.get('/profile', async (_req, res, next) => {
  try {
    const profile = await settingsService.getProfile();
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const data = profileSchema.parse(req.body);
    const profile = await settingsService.updateProfile(data);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.get('/preferences', async (_req, res, next) => {
  try {
    const preferences = await settingsService.getPreferences();
    res.json(preferences);
  } catch (err) {
    next(err);
  }
});

router.put('/preferences', async (req, res, next) => {
  try {
    const data = preferencesSchema.parse(req.body);
    const preferences = await settingsService.updatePreferences(data);
    res.json(preferences);
  } catch (err) {
    next(err);
  }
});

export default router;
