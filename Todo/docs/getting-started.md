# Getting started

## Prerequisites

- Node.js: Next.js 15 needs Node 18.18 or newer. The project pins `@types/node` 22, so Node 22 is a safe choice.
- npm (the repo includes `package-lock.json`)

## Install

```bash
npm install
```

## Scripts

All scripts are defined in `package.json`.

| Script | Command | What it does |
|--------|---------|--------------|
| `npm run dev` | `next dev` | Starts the development server with hot reload |
| `npm run build` | `next build` | Creates an optimised production build in `.next/` |
| `npm run start` | `next start` | Serves the production build (run `build` first) |

There are no `lint` or `test` scripts.

## Local development

```bash
npm run dev
```

Then open <http://localhost:3000>. 3000 is the Next.js default port; the project doesn't change it. To use a different port, run `npm run dev -- -p 4000`.

## Configuration

- `next.config.ts`: empty `NextConfig`, so all Next.js defaults apply.
- `tsconfig.json`: strict mode, `moduleResolution: "bundler"`, and the path alias `@/*` → project root (for example, `import TodoApp from "@/components/TodoApp"`).
- No environment variables are used.
