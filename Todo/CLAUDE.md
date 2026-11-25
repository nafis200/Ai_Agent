# CLAUDE.md

Guidance for Claude Code when working in this project.

## Project overview

A single-page todo app built with **Next.js 15 (App Router)**, **React 19** and **TypeScript** (strict). Users can add, complete, delete and clear todos, toggle dark/light theme, and send feedback through a floating widget.

All state lives in React memory. There is no backend, API route, database or `localStorage`, so a page refresh resets everything. Keep it that way unless asked to add persistence.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also the type check, run it after changes)
npm run start    # serve the production build
```

There is no lint script, no test framework and no formatter configured. Use `npm run build` (or `npx tsc --noEmit`) to verify changes.

## Structure

```text
app/
  layout.tsx            # Root layout: metadata, <html data-theme="dark">, imports globals.css
  page.tsx              # Only route "/": renders <TodoApp /> and <FeedbackWidget />
  globals.css           # ALL styles: theme CSS variables + component classes
components/
  TodoApp.tsx           # Todo list + theme toggle (client component)
  FeedbackWidget.tsx    # Floating feedback launcher/form (client component)
docs/                   # Project documentation (maintained by the document-project skill)
.claude/skills/         # Project skills (document-project)
```

Generated and git-ignored: `.next/`, `node_modules/`, `next-env.d.ts`, `*.tsbuildinfo`. Don't edit them.

## Architecture notes

- `app/layout.tsx` and `app/page.tsx` are server components. Interactive components go in `components/` and start with `"use client"`.
- State is local `useState` per component. No context, global store or data fetching. `TodoApp` and `FeedbackWidget` share nothing via props.
- **Theme:** `TodoApp` owns `theme` and writes it to `document.documentElement.dataset.theme` in a `useEffect`. CSS variables in `globals.css` switch on `[data-theme="dark" | "light"]`, which is how the theme also restyles `FeedbackWidget`.
- IDs come from `crypto.randomUUID()`.
- State updates are immutable (`setX(prev => ...)` with `map`/`filter`/spread).

## Conventions

- TypeScript strict mode; type props and state explicitly (`type Todo = {...}`), use `as const` for fixed option lists.
- Import with the `@/*` path alias (e.g. `@/components/TodoApp`).
- Styling: plain global CSS in `app/globals.css` only. No Tailwind, CSS modules or CSS-in-JS. Use the existing CSS variables (`--bg`, `--surface`, `--border`, `--text`, `--muted`, `--accent`, ...) and define any new color for **both** dark and light themes.
- Accessibility: icon-only buttons need `aria-label`; use `type="button"` on non-submit buttons; keep existing `role`/`aria-*` patterns.
- Function components with default exports, one component per file in `components/`.
- Don't add dependencies without asking.

## Documentation

- User-facing docs live in [docs/](docs/) (start at [docs/index.md](docs/index.md)); [readme.md](readme.md) is a short intro.
- After code changes that affect features, structure or styling, update the docs with the `/document-project` skill (it tracks state in `docs/.doc-state.json`).
- `instruction.md` and `image.png` are personal class notes, not part of the app. Ignore them.

## Don't

This project is a **frontend-only, offline app** and must stay that way. Never turn it into a backend or connect it to an online database, even if a task seems to call for it. If a request would need any of the items below, stop and tell the user instead of implementing it.

- Don't add a backend: no API routes (`app/api/`), Route Handlers, Server Actions (`"use server"`), middleware, or a custom/Express server.
- Don't add an online or remote database or backend-as-a-service: no Supabase, Firebase, MongoDB/Atlas, PlanetScale, Neon, Postgres, MySQL, Redis, Prisma, Drizzle, Mongoose, or similar.
- Don't send app data over the network: no `fetch`/axios calls to save or load todos or feedback, no third-party form or analytics services.
- Don't add authentication, user accounts, sessions, or cookies.
- Don't add environment secrets or `.env` files for database or API credentials.
- Don't add dependencies without asking (see Conventions).
- Don't add Tailwind, CSS modules or CSS-in-JS.
- Don't edit generated files (`.next/`, `node_modules/`, `next-env.d.ts`, `*.tsbuildinfo`).
- Don't treat `instruction.md` or `image.png` as project files.

If persistence is ever requested, the only allowed option is browser-local storage (`localStorage`/IndexedDB), and only after the user explicitly asks for it.

## Git

The git repository root is the parent folder (`Ai_Agent/`), which also holds other class projects. Keep commits scoped to `Todo/` unless asked otherwise.
