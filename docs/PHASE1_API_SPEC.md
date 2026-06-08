# Phase 1 — API Contract

**Base URL:** `http://localhost:3001/api` (configurable via `VITE_API_BASE_URL`)

## Error Format

```json
{ "message": "Human-readable error" }
```

Validation errors (400):
```json
{ "message": "Validation failed", "errors": [{ "field": "email", "message": "Enter a valid email" }] }
```

## Endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/health` | Health check | None |
| GET | `/stats` | List dashboard stat cards | None |
| GET | `/activities?search=` | List activities, optional search | None |
| GET | `/analytics?period=7d\|30d\|90d` | Chart data for period | None |
| GET | `/settings/profile` | Get user profile | None |
| PUT | `/settings/profile` | Update user profile | None |
| GET | `/settings/preferences` | Get notification preferences | None |
| PUT | `/settings/preferences` | Update notification preferences | None |

### GET /stats

**Response 200:**
```json
[
  { "id": 1, "label": "Total Users", "value": "12,847", "change": "+12.5%", "trend": "up" }
]
```

### GET /activities

**Query:** `search` (optional, filters user_name and action)

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
