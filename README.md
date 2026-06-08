# deploy-test-6-dev

Development integration repository for **deploy-test-6** — Release R1 (1.0.0).

**Execution Mode:** Local Mode (Express + PostgreSQL)

## Structure

```
development-1/
├── Frontend/          # React + Vite dashboard (R1)
├── backend/           # Express + PostgreSQL API
├── docs/              # Phase 0–2 documentation
└── tests/             # Playwright test specs
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Environment Variables

Copy example files and fill values locally (never commit `.env`):

| Variable | Location | Purpose |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `PORT` | `backend/.env` | API server port (default 3001) |
| `CORS_ORIGIN` | `backend/.env` | Frontend origin for CORS |
| `VITE_API_BASE_URL` | `Frontend/.env` | API base URL for frontend |
| `VITE_PORT` | `Frontend/.env` | Vite dev server port |
| `BASE_URL` | test runner env | Playwright target URL |

## Quick Start

### 1. Database

```bash
createdb deploy_test_6
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run setup    # migrate + seed
npm run dev
```

### 3. Frontend

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

See [docs/PHASE1_API_SPEC.md](docs/PHASE1_API_SPEC.md) for full contract.

## Assumptions

- `launchpad-frontend/` submodule was inaccessible; Frontend built from scratch following Launchpad patterns
- No authentication in R1 (all endpoints public)
- Single-user settings model
