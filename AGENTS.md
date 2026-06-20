# AGENTS.md

## Cursor Cloud specific instructions

This is the **Cloud Resume** pnpm monorepo (Node >= 20, pnpm 11.7.0). Dependencies are
installed automatically by the startup update script (`corepack enable` + `pnpm install`),
so you normally do not need to install anything manually.

### Services

| Service | Dir | Dev command | Port | Notes |
|---------|-----|-------------|------|-------|
| Frontend (static résumé site) | `frontend/` | `pnpm dev:frontend` | 8080 | The product; renders the résumé client-side from `frontend/js/resume-data.js`. Does NOT call the API. |
| API (Express health stub) | `api/` | `pnpm dev:api` | 3000 | Only exposes `GET /health` → `{"status":"ok"}`. Scaffold for future dynamic features. |

Build-only packages (not long-running services): `packages/shared-types` (shared TS types,
`tsc`) and `iac` (AWS CDK deploy tooling). Standard commands live in `README.md` and the
root `package.json` scripts.

### Non-obvious caveats

- **pnpm is mandatory.** `npm`/`yarn` are blocked by an `only-allow pnpm` preinstall hook and
  `engine-strict` in `.npmrc`. Always use pnpm.
- `pnpm typecheck` builds `@cloud-resume/shared-types` first (the API imports its compiled
  output), so run it (or build shared-types) before typechecking the API in isolation.
- `pnpm lint` is currently a stub (`echo "Lint not configured yet"`) — it is a no-op, not a
  real linter.
- No database, no `.env`, and no secrets are required to run anything locally.
