export const analyticsData = {
  valid: {
    chart7d: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: 'Revenue', data: [4200, 5100, 4800, 6200, 5800, 7100, 6500] },
        { label: 'Users', data: [120, 145, 132, 168, 155, 190, 175] },
      ],
    },
    chart30d: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        { label: 'Revenue', data: [28000, 32000, 29500, 35000] },
        { label: 'Users', data: [850, 920, 880, 1050] },
      ],
    },
    periods: ['7d', '30d', '90d'],
  },
  invalid: {
    badPeriod: 'invalid',
  },
  edge: {
    emptyChart: { labels: [], datasets: [] },
    singlePoint: {
      labels: ['Only'],
      datasets: [{ label: 'Revenue', data: [100] }],
    },
  },
  api: {
    analyticsEndpoint: '**/api/analytics**',
  },
};
