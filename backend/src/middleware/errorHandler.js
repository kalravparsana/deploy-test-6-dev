export function errorHandler(err, _req, res, _next) {
  console.error(err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Not Found' });
}
