# buzaao-fbbe

Turborepo with a Vite React TypeScript app and a Node TypeScript API.

## Apps and packages

- `apps/web` — React 19 + Vite + TypeScript
- `apps/api` — Express + TypeScript
- `packages/ui` — shared React components
- `packages/typescript-config` — shared TypeScript configs
- `packages/eslint-config` — shared ESLint configs

## Getting started

```bash
pnpm install
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:3001

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run web and API in watch mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint the workspace |
| `pnpm check-types` | Type-check the workspace |
