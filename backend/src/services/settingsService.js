import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, getTableName } from '../shared/dynamodb.js';

async function getSettingsItem(sk) {
  const result = await getDocClient().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: 'SETTINGS', sk },
    })
  );

  if (!result.Item) {
    const err = new Error(sk === 'PROFILE' ? 'Profile not found' : 'Preferences not found');
    err.status = 404;
    throw err;
  }

  return result.Item;
}

export async function getProfile() {
  const item = await getSettingsItem('PROFILE');
  return {
    name: item.name,
    email: item.email,
    role: item.role,
    avatar: item.avatar || '',
  };
}

export async function updateProfile({ name, email, role, avatar }) {
  const result = await getDocClient().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: 'SETTINGS', sk: 'PROFILE' },
      UpdateExpression: 'SET #name = :name, email = :email, #role = :role, avatar = :avatar',
      ExpressionAttributeNames: { '#name': 'name', '#role': 'role' },
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':role': role,
        ':avatar': avatar || '',
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  const item = result.Attributes;
  return {
    name: item.name,
    email: item.email,
    role: item.role,
    avatar: item.avatar || '',
  };
}

export async function getPreferences() {
  const item = await getSettingsItem('PREFERENCES');
  return {
    emailNotifications: item.emailNotifications,
    pushNotifications: item.pushNotifications,
    weeklyDigest: item.weeklyDigest,
    darkMode: item.darkMode,
  };
}

export async function updatePreferences(prefs) {
  const result = await getDocClient().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: 'SETTINGS', sk: 'PREFERENCES' },
      UpdateExpression:
        'SET emailNotifications = :en, pushNotifications = :pn, weeklyDigest = :wd, darkMode = :dm',
      ExpressionAttributeValues: {
        ':en': prefs.emailNotifications,
        ':pn': prefs.pushNotifications,
        ':wd': prefs.weeklyDigest,
        ':dm': prefs.darkMode,
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  const item = result.Attributes;
  return {
    emailNotifications: item.emailNotifications,
    pushNotifications: item.pushNotifications,
    weeklyDigest: item.weeklyDigest,
    darkMode: item.darkMode,
  };
}
