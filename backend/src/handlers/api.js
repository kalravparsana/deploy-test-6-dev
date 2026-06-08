import { z } from 'zod';
import { success, errorResponse } from '../shared/response.js';
import * as statsService from '../services/statsService.js';
import * as activityService from '../services/activityService.js';
import * as analyticsService from '../services/analyticsService.js';
import * as settingsService from '../services/settingsService.js';

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

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    const err = new Error('Invalid JSON body');
    err.status = 400;
    throw err;
  }
}

function getQueryParam(event, name, defaultValue = '') {
  const params = event.queryStringParameters || {};
  return params[name] ?? defaultValue;
}

function normalizePath(event) {
  const raw = event.rawPath || event.path || '';
  return raw.replace(/\/+$/, '') || '/';
}

export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';
  const path = normalizePath(event);

  console.log(JSON.stringify({ level: 'info', method, path }));

  try {
    if (method === 'GET' && path === '/health') {
      return success({ status: 'ok' });
    }

    if (method === 'GET' && path === '/stats') {
      return success(await statsService.getAllStats());
    }

    if (method === 'GET' && path === '/activities') {
      const search = getQueryParam(event, 'search');
      return success(await activityService.getActivities(search));
    }

    if (method === 'GET' && path === '/analytics') {
      const period = getQueryParam(event, 'period', '7d');
      return success(await analyticsService.getAnalytics(period));
    }

    if (method === 'GET' && path === '/settings/profile') {
      return success(await settingsService.getProfile());
    }

    if (method === 'PUT' && path === '/settings/profile') {
      const data = profileSchema.parse(parseBody(event));
      return success(await settingsService.updateProfile(data));
    }

    if (method === 'GET' && path === '/settings/preferences') {
      return success(await settingsService.getPreferences());
    }

    if (method === 'PUT' && path === '/settings/preferences') {
      const data = preferencesSchema.parse(parseBody(event));
      return success(await settingsService.updatePreferences(data));
    }

    const err = new Error('Not Found');
    err.status = 404;
    throw err;
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', message: err.message }));
    return errorResponse(err);
  }
}
