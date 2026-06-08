import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getConfig } from './config.js';

let client;

export function getDocClient() {
  if (!client) {
    const { region } = getConfig();
    const dynamo = new DynamoDBClient({ region });
    client = DynamoDBDocumentClient.from(dynamo, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return client;
}

export function getTableName() {
  return getConfig().tableName;
}
