import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, getTableName } from '../shared/dynamodb.js';

export async function getAllStats() {
  const result = await getDocClient().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': 'STAT' },
    })
  );

  return (result.Items || [])
    .map(({ id, label, value, change, trend }) => ({ id, label, value, change, trend }))
    .sort((a, b) => a.id - b.id);
}
