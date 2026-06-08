# deploy-test-6-dev

Development integration repository for **deploy-test-6** — Release R1 (1.0.1).

**Execution Mode:** Cloud Mode (AWS Lambda + API Gateway + DynamoDB)

## Structure

```
development-1/
├── Frontend/          # React + Vite dashboard (R1)
├── backend/           # Lambda handlers + DynamoDB + CloudFormation
├── docs/              # Phase 0–4 documentation
└── tests/             # Playwright test specs
```

## Environment Variables

Copy example files and fill values locally (never commit `.env`):

| Variable | Location | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `Frontend/.env` | API base URL (from stack output `ApiBaseUrl`) |
| `VITE_PORT` | `Frontend/.env` | Vite dev server port |
| `DYNAMODB_TABLE_NAME` | `backend/.env` | DynamoDB table (from stack output) |
| `AWS_REGION` | `backend/.env` | AWS region for seed script |
| `CORS_ORIGIN` | CloudFormation param | Frontend origin for API CORS |
| `BASE_URL` | test runner env | Playwright target URL |
| `AWS_ACCESS_KEY_ID` | deploy env only | CloudFormation deploy credentials |
| `AWS_SECRET_ACCESS_KEY` | deploy env only | CloudFormation deploy credentials |

## Deploy Backend (CloudFormation)

See [docs/PHASE4_CLOUD_HOSTING.md](docs/PHASE4_CLOUD_HOSTING.md) for full instructions.

```bash
cd backend
npm install
npm run package

aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name deploy-test-6-r1 \
  --capabilities CAPABILITY_NAMED_IAM

# Upload artifact, seed data, configure frontend env vars
```

## Run Frontend Locally

```bash
cd Frontend
cp .env.example .env
# Set VITE_API_BASE_URL to deployed API URL
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

See [docs/PHASE1_API_SPEC.md](docs/PHASE1_API_SPEC.md) for full contract.

## Assumptions

- `launchpad-frontend/` submodule was inaccessible; Frontend built following Launchpad patterns
- No authentication in R1 (all endpoints public; Cognito not provisioned)
- Single-user settings model
- Frontend hosting via S3/CloudFront is optional and out of scope
