export const dashboardData = {
  valid: {
    stats: [
      { id: 1, label: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up' },
      { id: 2, label: 'Revenue', value: '$48,290', change: '+8.2%', trend: 'up' },
      { id: 3, label: 'Active Orders', value: '1,429', change: '-3.1%', trend: 'down' },
      { id: 4, label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' },
    ],
    activities: [
      { id: 1, user: 'Sarah Chen', action: 'Created new project "Alpha Launch"', timestamp: '2026-06-08T10:30:00Z', status: 'completed' },
      { id: 2, user: 'Marcus Johnson', action: 'Updated billing settings', timestamp: '2026-06-08T09:15:00Z', status: 'completed' },
      { id: 3, user: 'Elena Rodriguez', action: 'Submitted support ticket #4521', timestamp: '2026-06-08T08:45:00Z', status: 'pending' },
    ],
    searchQuery: 'Sarah',
    searchResult: 'Sarah Chen',
  },
  invalid: {},
  edge: {
    emptyActivities: [],
    singleActivity: [{ id: 1, user: 'Test User', action: 'Single action', timestamp: '2026-06-08T10:00:00Z', status: 'completed' }],
    longAction: [{ id: 1, user: 'Test', action: 'A'.repeat(500), timestamp: '2026-06-08T10:00:00Z', status: 'completed' }],
  },
  api: {
    statsEndpoint: '**/api/stats',
    activitiesEndpoint: '**/api/activities**',
  },
};
