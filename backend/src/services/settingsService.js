import { pool } from '../db/pool.js';

export async function getProfile() {
  const result = await pool.query(
    'SELECT name, email, role, avatar FROM user_profile ORDER BY id LIMIT 1'
  );
  if (result.rows.length === 0) {
    const err = new Error('Profile not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

export async function updateProfile({ name, email, role, avatar }) {
  const result = await pool.query(
    `UPDATE user_profile SET name = $1, email = $2, role = $3, avatar = $4
     WHERE id = (SELECT id FROM user_profile ORDER BY id LIMIT 1)
     RETURNING name, email, role, avatar`,
    [name, email, role, avatar || '']
  );
  if (result.rows.length === 0) {
    const err = new Error('Profile not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

export async function getPreferences() {
  const result = await pool.query(
    `SELECT email_notifications AS "emailNotifications",
            push_notifications AS "pushNotifications",
            weekly_digest AS "weeklyDigest",
            dark_mode AS "darkMode"
     FROM user_preferences ORDER BY id LIMIT 1`
  );
  if (result.rows.length === 0) {
    const err = new Error('Preferences not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

export async function updatePreferences(prefs) {
  const result = await pool.query(
    `UPDATE user_preferences SET
       email_notifications = $1,
       push_notifications = $2,
       weekly_digest = $3,
       dark_mode = $4
     WHERE id = (SELECT id FROM user_preferences ORDER BY id LIMIT 1)
     RETURNING email_notifications AS "emailNotifications",
               push_notifications AS "pushNotifications",
               weekly_digest AS "weeklyDigest",
               dark_mode AS "darkMode"`,
    [prefs.emailNotifications, prefs.pushNotifications, prefs.weeklyDigest, prefs.darkMode]
  );
  if (result.rows.length === 0) {
    const err = new Error('Preferences not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}
