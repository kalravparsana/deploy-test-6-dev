export function getConfig() {
  return {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'deploy-test-6-app',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    region: process.env.AWS_REGION || 'us-east-1',
  };
}
