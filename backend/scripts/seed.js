import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const tableName = process.env.DYNAMODB_TABLE_NAME;
const region = process.env.AWS_REGION || 'us-east-1';

if (!tableName) {
  console.error('DYNAMODB_TABLE_NAME is required');
  process.exit(1);
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const stats = [
  { id: 1, label: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up' },
  { id: 2, label: 'Revenue', value: '$48,290', change: '+8.2%', trend: 'up' },
  { id: 3, label: 'Active Orders', value: '1,429', change: '-3.1%', trend: 'down' },
  { id: 4, label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' },
];

const activities = [
  { id: 1, user: 'Sarah Chen', action: 'Created new project "Alpha Launch"', timestamp: '2026-06-08T10:30:00Z', status: 'completed' },
  { id: 2, user: 'Marcus Johnson', action: 'Updated billing settings', timestamp: '2026-06-08T09:15:00Z', status: 'completed' },
  { id: 3, user: 'Elena Rodriguez', action: 'Submitted support ticket #4521', timestamp: '2026-06-08T08:45:00Z', status: 'pending' },
  { id: 4, user: 'James Wilson', action: 'Failed payment retry attempt', timestamp: '2026-06-08T07:20:00Z', status: 'failed' },
  { id: 5, user: 'Aisha Patel', action: 'Invited 3 team members', timestamp: '2026-06-07T16:00:00Z', status: 'completed' },
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

function buildItems() {
  const items = [];

  for (const stat of stats) {
    items.push({
      pk: 'STAT',
      sk: `STAT#${stat.id}`,
      ...stat,
    });
  }

  for (const activity of activities) {
    items.push({
      pk: 'ACTIVITY',
      sk: `ACTIVITY#${activity.id}`,
      ...activity,
    });
  }

  for (const [period, data] of Object.entries(analytics)) {
    items.push({
      pk: 'ANALYTICS',
      sk: period,
      labels: data.labels,
      datasets: data.datasets,
    });
  }

  items.push({
    pk: 'SETTINGS',
    sk: 'PROFILE',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Product Manager',
    avatar: '',
  });

  items.push({
    pk: 'SETTINGS',
    sk: 'PREFERENCES',
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    darkMode: false,
  });

  return items;
}

async function batchWriteAll(items) {
  const chunks = [];
  for (let i = 0; i < items.length; i += 25) {
    chunks.push(items.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await client.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: chunk.map((item) => ({ PutRequest: { Item: item } })),
        },
      })
    );
  }
}

async function seed() {
  const items = buildItems();
  await batchWriteAll(items);
  console.log(`Seeded ${items.length} items into ${tableName}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
