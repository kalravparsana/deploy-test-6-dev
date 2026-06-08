# Phase 0 — Discovery & Inventory

**Execution Mode:** Local Mode  
**Reason:** Environment variables were not provided (`(none provided — infer required variables...)`). Per execution mode rules, Local Mode is active when env vars are absent.

**Assumption:** `launchpad-frontend/` submodule (YorkIE-Launchpad/deploy-test-6) is inaccessible (private repo). Frontend R1 was built from scratch in `development-1/Frontend/` following Launchpad dashboard patterns.

---

## Data Source Inventory

| Source File | Entity | Field Shape | Used In | Mutated |
|---|---|---|---|---|
| `Frontend/src/data/mockData.js` | Stat | `{ id: number, label: string, value: string, change: string, trend: 'up'\|'down' }` | Dashboard stat cards | Read-only |
| `Frontend/src/data/mockData.js` | Activity | `{ id: number, user: string, action: string, timestamp: string, status: 'completed'\|'pending'\|'failed' }` | Dashboard activity list | Read-only |
| `Frontend/src/data/mockData.js` | Analytics | `{ labels: string[], datasets: { label: string, data: number[] }[] }` | Analytics chart | Read-only |
| `Frontend/src/data/mockData.js` | Profile | `{ name: string, email: string, role: string, avatar: string }` | Settings profile form | PUT on save |
| `Frontend/src/data/mockData.js` | Preferences | `{ emailNotifications: bool, pushNotifications: bool, weeklyDigest: bool, darkMode: bool }` | Settings toggles | PUT on save |

---

## UI Surface → Data Map

| Screen | Lists | Detail | Filters/Search | Forms/Actions |
|---|---|---|---|---|
| Dashboard `/` | 4 stat cards, activity list | Per-activity status badge | Search by user/action | None |
| Analytics `/analytics` | Chart bars, summary cards | Per-dataset totals/averages | Period tabs: 7d/30d/90d | Tab switch fetches new data |
| Settings `/settings` | Notification toggles | Profile fields | None | Profile form + Save Changes |

---

## Relationships

- Stats, Activities, Analytics are independent entities (no foreign keys)
- Profile and Preferences are singleton records (one user assumed for R1)
- Analytics data keyed by `period` with multiple datasets per period

## Derived/Computed Values

- Analytics summary cards: `total` and `avg` computed client-side from dataset arrays
- Activity timestamps formatted for display via `toLocaleString`
- Stat trend arrows derived from `trend` field

## Assumptions

- No authentication surface in R1 — all endpoints are public
- Single-user settings model (no user ID in requests)
- Frontend falls back to mock data when API is unavailable
