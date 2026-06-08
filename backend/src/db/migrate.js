import { pool } from './pool.js';

const migrations = `
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  change VARCHAR(20) NOT NULL,
  trend VARCHAR(10) NOT NULL CHECK (trend IN ('up', 'down'))
);

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'pending', 'failed'))
);

CREATE TABLE IF NOT EXISTS analytics_data (
  id SERIAL PRIMARY KEY,
  period VARCHAR(10) NOT NULL,
  dataset_label VARCHAR(50) NOT NULL,
  labels JSONB NOT NULL,
  data_points JSONB NOT NULL,
  UNIQUE (period, dataset_label)
);

CREATE TABLE IF NOT EXISTS user_profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  avatar VARCHAR(500) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  weekly_digest BOOLEAN NOT NULL DEFAULT true,
  dark_mode BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_name);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_analytics_period ON analytics_data(period);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(migrations);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
