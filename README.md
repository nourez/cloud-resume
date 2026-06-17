# Cloud Resume

A pnpm monorepo for a cloud-hosted resume project.

## Structure

```text
cloud-resume/
├── frontend/              # Static HTML/CSS/JS (Svelte later)
├── api/                   # Express API (TypeScript)
├── iac/                   # AWS CDK infrastructure
└── packages/
    └── shared-types/      # Shared API types
```

## Prerequisites

- Node.js >= 20
- Corepack enabled (`corepack enable`)
- pnpm only — `npm install` and `yarn` are blocked via `only-allow`

## Getting started

```bash
corepack enable
pnpm install
```

## Common commands

| Command | Description |
|---------|-------------|
| `pnpm dev:frontend` | Serve static frontend on port 8080 |
| `pnpm dev:api` | Run API dev server on port 3000 |
| `pnpm typecheck` | Typecheck all TypeScript packages |
| `pnpm -r build` | Build all packages |
| `pnpm --filter @cloud-resume/iac synth` | Synthesize CDK stack |

## Package manager enforcement

This repo uses three layers to enforce pnpm:

1. **Corepack** — pins pnpm to the version in root `package.json` (`packageManager` field)
2. **`only-allow`** — blocks npm/yarn in the `preinstall` script
3. **`engine-strict`** — enforces Node >= 20 and pnpm >= 11.7.0 via `.npmrc`
