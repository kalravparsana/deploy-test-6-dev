# Phase 2 — Implementation Plan

**Release:** R1 / 1.0.1  
**Mode:** Cloud Mode (Lambda + DynamoDB + API Gateway)

## Database (DynamoDB)

- [x] Single table `AppTable` with `pk` (partition) and `sk` (sort)
- [x] Stats items: `pk=STAT`, `sk=STAT#{id}` — id, label, value, change, trend
- [x] Activity items: `pk=ACTIVITY`, `sk=ACTIVITY#{id}` — id, user, action, timestamp, status
- [x] Analytics items: `pk=ANALYTICS`, `sk={period}` — labels, datasets (denormalized)
- [x] Profile item: `pk=SETTINGS`, `sk=PROFILE` — name, email, role, avatar
- [x] Preferences item: `pk=SETTINGS`, `sk=PREFERENCES` — four boolean toggles
- [x] Access pattern: Query `pk=STAT` → Dashboard stat cards
- [x] Access pattern: Query `pk=ACTIVITY` + FilterExpression → Dashboard activity search
- [x] Access pattern: GetItem `pk=ANALYTICS, sk={period}` → Analytics chart tabs
- [x] Access pattern: GetItem/UpdateItem `pk=SETTINGS` → Settings profile & preferences
- [x] Seed script: `backend/scripts/seed.js` ports mock data faithfully

## API Layer

- [x] Single Lambda handler with path/method routing
- [x] Shared: config loader, DynamoDB DocumentClient, CORS, error handler, Zod validation
- [x] Services: stats, activities, analytics, settings
- [x] Structured logging via `console.log` JSON
- [x] No Cognito (no auth surface in UI)

## Frontend Wire-up

- [x] Data access layer: `Frontend/src/api/client.js` (unchanged contract)
- [x] Pages call API with mock fallback on failure
- [x] Env vars: `VITE_API_BASE_URL` (from stack output `ApiBaseUrl`)
- [x] Optional local proxy via `VITE_API_PROXY` for dev against deployed API

## Infrastructure (Phase 4)

- [x] DynamoDB table
- [x] Lambda function + IAM role
- [x] API Gateway HTTP API + routes + CORS
- [x] S3 bucket for Lambda deployment artifacts
- [x] CloudWatch log group
- [ ] Cognito — skipped (no auth in R1)
- [ ] S3 + CloudFront frontend hosting — optional, out of scope

## Verification Checklist

- [ ] GET /health → 200 ok
- [ ] GET /stats → Dashboard stat cards
- [ ] GET /activities → Dashboard activity list
- [ ] GET /activities?search=chen → Filtered activities
- [ ] GET /analytics?period=7d → Analytics chart (7 Days tab)
- [ ] GET /analytics?period=30d → Analytics chart (30 Days tab)
- [ ] GET /settings/profile → Settings profile form
- [ ] PUT /settings/profile → Save profile changes
- [ ] GET /settings/preferences → Settings toggles
- [ ] PUT /settings/preferences → Save toggle changes
