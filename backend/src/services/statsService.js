import { pool } from '../db/pool.js';

export async function getAllStats() {
  const result = await pool.query(
    'SELECT id, label, value, change, trend FROM stats ORDER BY id'
  );
  return result.rows;
}
