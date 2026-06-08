import { pool } from '../db/pool.js';

const VALID_PERIODS = ['7d', '30d', '90d'];

export async function getAnalytics(period) {
  if (!VALID_PERIODS.includes(period)) {
    const err = new Error(`Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const result = await pool.query(
    'SELECT dataset_label, labels, data_points FROM analytics_data WHERE period = $1 ORDER BY id',
    [period]
  );

  if (result.rows.length === 0) {
    const err = new Error('Analytics data not found for period');
    err.status = 404;
    throw err;
  }

  const labels = result.rows[0].labels;
  const datasets = result.rows.map((row) => ({
    label: row.dataset_label,
    data: row.data_points,
  }));

  return { labels, datasets };
}
