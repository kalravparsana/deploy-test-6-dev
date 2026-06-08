import { getConfig } from './config.js';

export function jsonResponse(statusCode, body) {
  const { corsOrigin } = getConfig();
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export function success(body, statusCode = 200) {
  return jsonResponse(statusCode, body);
}

export function errorResponse(err) {
  if (err.name === 'ZodError') {
    return jsonResponse(400, {
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const status = err.status || 500;
  return jsonResponse(status, {
    message: err.message || 'Internal Server Error',
  });
}
