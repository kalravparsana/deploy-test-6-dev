import { pool } from '../db/pool.js';

export async function getActivities(search = '') {
  let query = `
    SELECT id, user_name AS user, action, timestamp, status
    FROM activities
  `;
  const params = [];

  if (search.trim()) {
    query += ` WHERE user_name ILIKE $1 OR action ILIKE $1`;
    params.push(`%${search.trim()}%`);
  }

  query += ' ORDER BY timestamp DESC';

  const result = await pool.query(query, params);
  return result.rows;
}
