import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, getTableName } from '../shared/dynamodb.js';

export async function getActivities(search = '') {
  const result = await getDocClient().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': 'ACTIVITY' },
    })
  );

  let items = (result.Items || []).map(({ id, user, action, timestamp, status }) => ({
    id,
    user,
    action,
    timestamp,
    status,
  }));

  const term = search.trim().toLowerCase();
  if (term) {
    items = items.filter(
      (item) =>
        item.user.toLowerCase().includes(term) ||
        item.action.toLowerCase().includes(term)
    );
  }

  return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
