# Phase 1 — API Contract

**Release:** R1 / 1.0.1  
**Base URL:** `VITE_API_BASE_URL` (populated from CloudFormation output `ApiBaseUrl` after deploy)

## Error Format

```json
{ "message": "Human-readable error" }
```

Validation errors (400):
```json
{ "message": "Validation failed", "errors": [{ "field": "email", "message": "Enter a valid email" }] }
```

## Endpoints

| Method | Path | Purpose | Auth | Lambda Route |
|---|---|---|---|---|
| GET | `/health` | Health check | None | `GET /health` |
| GET | `/stats` | List dashboard stat cards | None | `GET /stats` |
| GET | `/activities?search=` | List activities, optional search | None | `GET /activities` |
| GET | `/analytics?period=7d\|30d\|90d` | Chart data for period | None | `GET /analytics` |
| GET | `/settings/profile` | Get user profile | None | `GET /settings/profile` |
| PUT | `/settings/profile` | Update user profile | None | `PUT /settings/profile` |
| GET | `/settings/preferences` | Get notification preferences | None | `GET /settings/preferences` |
| PUT | `/settings/preferences` | Update notification preferences | None | `PUT /settings/preferences` |

### GET /stats

**Response 200:**
```json
[
  { "id": 1, "label": "Total Users", "value": "12,847", "change": "+12.5%", "trend": "up" }
]
```

### GET /activities

**Query:** `search` (optional, filters user and action)

**Response 200:**
```json
[
  { "id": 1, "user": "Sarah Chen", "action": "Created new project", "timestamp": "2026-06-08T10:30:00Z", "status": "completed" }
]
```

### GET /analytics

**Query:** `period` — `7d` (default), `30d`, or `90d`

**Response 200:**
```json
{
  "labels": ["Mon", "Tue", "Wed"],
  "datasets": [
    { "label": "Revenue", "data": [4200, 5100, 4800] },
    { "label": "Users", "data": [120, 145, 132] }
  ]
}
```

### GET/PUT /settings/profile

**GET Response 200:**
```json
{ "name": "Alex Morgan", "email": "alex.morgan@example.com", "role": "Product Manager", "avatar": "" }
```

**PUT Body:**
```json
{ "name": "string", "email": "string", "role": "string", "avatar": "string (optional)" }
```

### GET/PUT /settings/preferences

**GET Response 200:**
```json
{ "emailNotifications": true, "pushNotifications": false, "weeklyDigest": true, "darkMode": false }
```

**PUT Body:** Same shape as GET response.

## API Gateway Mapping

| Route | Integration | Authorizer |
|---|---|---|
| `GET /health` | ApiLambda | None |
| `GET /stats` | ApiLambda | None |
| `GET /activities` | ApiLambda | None |
| `GET /analytics` | ApiLambda | None |
| `GET /settings/profile` | ApiLambda | None |
| `PUT /settings/profile` | ApiLambda | None |
| `GET /settings/preferences` | ApiLambda | None |
| `PUT /settings/preferences` | ApiLambda | None |

**CORS:** All routes return `Access-Control-Allow-Origin` from `CORS_ORIGIN` env var. `OPTIONS` handled by API Gateway auto-CORS.
