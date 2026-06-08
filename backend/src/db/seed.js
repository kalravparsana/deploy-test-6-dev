import { pool } from './pool.js';

const stats = [
  { label: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up' },
  { label: 'Revenue', value: '$48,290', change: '+8.2%', trend: 'up' },
  { label: 'Active Orders', value: '1,429', change: '-3.1%', trend: 'down' },
  { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' },
];

const activities = [
  { user_name: 'Sarah Chen', action: 'Created new project "Alpha Launch"', timestamp: '2026-06-08T10:30:00Z', status: 'completed' },
  { user_name: 'Marcus Johnson', action: 'Updated billing settings', timestamp: '2026-06-08T09:15:00Z', status: 'completed' },
  { user_name: 'Elena Rodriguez', action: 'Submitted support ticket #4521', timestamp: '2026-06-08T08:45:00Z', status: 'pending' },
  { user_name: 'James Wilson', action: 'Failed payment retry attempt', timestamp: '2026-06-08T07:20:00Z', status: 'failed' },
  { user_name: 'Aisha Patel', action: 'Invited 3 team members', timestamp: '2026-06-07T16:00:00Z', status: 'completed' },
];

const analytics = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Revenue', data: [4200, 5100, 4800, 6200, 5800, 7100, 6500] },
      { label: 'Users', data: [120, 145, 132, 168, 155, 190, 175] },
    ],
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Revenue', data: [28000, 32000, 29500, 35000] },
      { label: 'Users', data: [850, 920, 880, 1050] },
    ],
  },
  '90d': {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      { label: 'Revenue', data: [95000, 102000, 118000] },
      { label: 'Users', data: [3200, 3450, 4100] },
    ],
  },
};

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM stats');
    await client.query('DELETE FROM activities');
    await client.query('DELETE FROM analytics_data');
    await client.query('DELETE FROM user_profile');
    await client.query('DELETE FROM user_preferences');

    for (const stat of stats) {
      await client.query(
        'INSERT INTO stats (label, value, change, trend) VALUES ($1, $2, $3, $4)',
        [stat.label, stat.value, stat.change, stat.trend]
      );
    }

    for (const activity of activities) {
      await client.query(
        'INSERT INTO activities (user_name, action, timestamp, status) VALUES ($1, $2, $3, $4)',
        [activity.user_name, activity.action, activity.timestamp, activity.status]
      );
    }

    for (const [period, data] of Object.entries(analytics)) {
      for (const dataset of data.datasets) {
        await client.query(
          'INSERT INTO analytics_data (period, dataset_label, labels, data_points) VALUES ($1, $2, $3, $4)',
          [period, dataset.label, JSON.stringify(data.labels), JSON.stringify(dataset.data)]
        );
      }
    }

    await client.query(
      'INSERT INTO user_profile (name, email, role, avatar) VALUES ($1, $2, $3, $4)',
      ['Alex Morgan', 'alex.morgan@example.com', 'Product Manager', '']
    );

    await client.query(
      'INSERT INTO user_preferences (email_notifications, push_notifications, weekly_digest, dark_mode) VALUES ($1, $2, $3, $4)',
      [true, false, true, false]
    );

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
