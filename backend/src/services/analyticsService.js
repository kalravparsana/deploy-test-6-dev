import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, getTableName } from '../shared/dynamodb.js';

const VALID_PERIODS = ['7d', '30d', '90d'];

export async function getAnalytics(period) {
  if (!VALID_PERIODS.includes(period)) {
    const err = new Error(`Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const result = await getDocClient().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: 'ANALYTICS', sk: period },
    })
  );

  if (!result.Item) {
    const err = new Error('Analytics data not found for period');
    err.status = 404;
    throw err;
  }

  return {
    labels: result.Item.labels,
    datasets: result.Item.datasets,
  };
}
