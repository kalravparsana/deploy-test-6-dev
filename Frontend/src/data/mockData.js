export const mockStats = [
  { id: 1, label: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up' },
  { id: 2, label: 'Revenue', value: '$48,290', change: '+8.2%', trend: 'up' },
  { id: 3, label: 'Active Orders', value: '1,429', change: '-3.1%', trend: 'down' },
  { id: 4, label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' },
];

export const mockActivities = [
  { id: 1, user: 'Sarah Chen', action: 'Created new project "Alpha Launch"', timestamp: '2026-06-08T10:30:00Z', status: 'completed' },
  { id: 2, user: 'Marcus Johnson', action: 'Updated billing settings', timestamp: '2026-06-08T09:15:00Z', status: 'completed' },
  { id: 3, user: 'Elena Rodriguez', action: 'Submitted support ticket #4521', timestamp: '2026-06-08T08:45:00Z', status: 'pending' },
  { id: 4, user: 'James Wilson', action: 'Failed payment retry attempt', timestamp: '2026-06-08T07:20:00Z', status: 'failed' },
  { id: 5, user: 'Aisha Patel', action: 'Invited 3 team members', timestamp: '2026-06-07T16:00:00Z', status: 'completed' },
];

export const mockAnalytics = {
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

export const mockProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'Product Manager',
  avatar: '',
};

export const mockPreferences = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  darkMode: false,
};
