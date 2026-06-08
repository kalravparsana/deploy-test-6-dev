# Phase 2 — Implementation Plan

## Database (PostgreSQL)

- [x] `stats` — id, label, value, change, trend
- [x] `activities` — id, user_name, action, timestamp, status
- [x] `analytics_data` — period, dataset_label, labels (JSONB), data_points (JSONB)
- [x] `user_profile` — name, email, role, avatar (singleton)
- [x] `user_preferences` — 4 boolean toggles (singleton)
- [x] Migration script: `backend/src/db/migrate.js`
- [x] Seed script ports all mock data: `backend/src/db/seed.js`

## API Layer

- [x] Express app with CORS, JSON parsing, centralized error handler
- [x] Routes: stats, activities, analytics, settings
- [x] Zod validation on settings PUT endpoints
- [x] Parameterized SQL queries via pg pool

## Frontend Wire-up

- [x] Data access layer: `Frontend/src/api/client.js`
- [x] Pages call API with mock fallback on failure
- [x] Env vars: `VITE_API_BASE_URL`, `VITE_PORT`, `VITE_API_PROXY`

## Verification Checklist

- [ ] GET /api/stats → Dashboard stat cards
- [ ] GET /api/activities → Dashboard activity list
- [ ] GET /api/activities?search=chen → Filtered activities
- [ ] GET /api/analytics?period=7d → Analytics chart (7 Days tab)
- [ ] GET /api/analytics?period=30d → Analytics chart (30 Days tab)
- [ ] GET /api/settings/profile → Settings profile form
- [ ] PUT /api/settings/profile → Save profile changes
- [ ] GET /api/settings/preferences → Settings toggles
- [ ] PUT /api/settings/preferences → Save toggle changes
