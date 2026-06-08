export const settingsData = {
  valid: {
    profile: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'Product Manager',
      avatar: '',
    },
    updatedProfile: {
      name: 'Alex Updated',
      email: 'alex.updated@example.com',
      role: 'Engineering Lead',
      avatar: '',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      darkMode: false,
    },
  },
  invalid: {
    emptyName: { name: '', email: 'test@example.com', role: 'Manager' },
    badEmail: { name: 'Test', email: 'not-an-email', role: 'Manager' },
    emptyRole: { name: 'Test', email: 'test@example.com', role: '' },
    whitespaceName: { name: '     ', email: 'test@example.com', role: 'Manager' },
  },
  edge: {
    longName: { name: 'A'.repeat(1000), email: 'test@example.com', role: 'Manager' },
    specialChars: { name: '!@#$%^&*()', email: 'test@example.com', role: 'Manager' },
  },
  api: {
    profileEndpoint: '**/api/settings/profile',
    preferencesEndpoint: '**/api/settings/preferences',
  },
};
