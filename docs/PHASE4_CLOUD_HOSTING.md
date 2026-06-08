# Phase 4 — Cloud Hosting Plan & IaC

**Release:** R1 / 1.0.1  
**IaC Tool:** AWS CloudFormation (`backend/cloudformation-template.yaml`)

## Hosting Checklist

- [x] DynamoDB table (`AppTable`) — single-table design
- [x] Lambda function (`ApiLambda`) — Node.js 20, routes all API paths
- [x] API Gateway HTTP API with 8 routes + CORS
- [x] IAM role with least-privilege DynamoDB access
- [x] CloudWatch log group (14-day retention)
- [x] S3 bucket for Lambda deployment artifacts
- [ ] Cognito — not provisioned (no auth surface in R1 UI)
- [ ] S3 + CloudFront frontend hosting — optional, out of scope

## Resource List

| Category | Resource | Purpose |
|---|---|---|
| DynamoDB | `AppTable` | Stats, activities, analytics, settings |
| Lambda | `ApiLambda` | REST API handler |
| API Gateway | `ApiGateway` + routes + stage | Public HTTP API |
| IAM | `ApiLambdaRole` | Lambda execution + DynamoDB |
| CloudWatch | `ApiLambdaLogGroup` | Structured logs |
| S3 | `ArtifactsBucket` | Lambda zip upload target |

## Stack Outputs → Frontend Env Vars

| Output | Env Var | Placeholder |
|---|---|---|
| `ApiBaseUrl` | `VITE_API_BASE_URL` | `https://<api-id>.execute-api.<region>.amazonaws.com` |
| `DynamoDBTableName` | `DYNAMODB_TABLE_NAME` | `deploy-test-6-app` |
| `AwsRegion` | `AWS_REGION` | `<region>` |

**Note:** No Cognito outputs — auth not required for R1.

## Credential Flow

Deploy operator loads credentials into environment (never commit):

- `AWS_ACCESS_KEY_ID=<redacted>`
- `AWS_SECRET_ACCESS_KEY=<redacted>`
- `AWS_SESSION_TOKEN=<redacted>` (if applicable)
- `AWS_REGION=<redacted>`

CloudFormation provider authenticates from these at deploy time.

## Deploy Instructions

```bash
# 1. Load AWS credentials into environment (variable names only — use your values locally)
export AWS_ACCESS_KEY_ID=<redacted>
export AWS_SECRET_ACCESS_KEY=<redacted>
export AWS_REGION=<redacted>

# 2. Package Lambda
cd backend
npm install
npm run package

# 3. Deploy stack (creates S3 bucket — upload artifact after first deploy or pre-stage)
aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name deploy-test-6-r1 \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides CorsOrigin=<your-frontend-origin>

# 4. Upload Lambda artifact to ArtifactsBucket (from stack output ArtifactsBucketName)
aws s3 cp dist/api-handler.zip s3://<ArtifactsBucketName>/api-handler.zip

# 5. Update Lambda code (if stack already existed)
aws lambda update-function-code \
  --function-name deploy-test-6-api \
  --s3-bucket <ArtifactsBucketName> \
  --s3-key api-handler.zip

# 6. Capture outputs and seed DynamoDB
export DYNAMODB_TABLE_NAME=<from DynamoDBTableName output>
npm run seed

# 7. Configure frontend
# Set VITE_API_BASE_URL=<from ApiBaseUrl output> in Frontend/.env
```

## Post-Deploy Verification

| Endpoint | UI Surface |
|---|---|
| `GET /health` | Infrastructure smoke |
| `GET /stats` | Dashboard stat cards |
| `GET /activities` | Dashboard activity list |
| `GET /activities?search=` | Dashboard search |
| `GET /analytics?period=` | Analytics tabs |
| `GET/PUT /settings/profile` | Settings profile form |
| `GET/PUT /settings/preferences` | Settings toggles |
