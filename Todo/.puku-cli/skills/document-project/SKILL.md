---
name: document-project
description: Create or update this project's documentation in docs/. Use when the user runs /document-project, or asks to document the project, generate docs, refresh or sync the docs, or "update the documentation". If no docs exist it writes a full set; if docs exist it updates only what the code changes have made stale.
---

# Project Documentation

Keep the `docs/` folder accurate and complete for this project. Every run ends with docs that match the code as it is **right now**.

## Step 1 — Inventory and detect mode

Run the helper script from the project root:

```bash
node .puku-cli/skills/document-project/scripts/doc-state.mjs status
```

It prints JSON with:
- `mode`: `"create"` (no `docs/.doc-state.json` yet) or `"update"`
- `files`: every source file (build output, `node_modules`, lockfiles, and binaries are excluded)
- `changed`, `added`, `removed`: source files that differ since the last docs run (update mode only)

If update mode reports no changes at all, still do a quick check (Step 3) in case someone edited the docs by hand. Then report "docs already up to date" and stop. Don't rewrite files for no reason.

## Step 2 — Understand the project

Read every file in `files` that matters for behaviour: config (`package.json`, `tsconfig.json`, framework config), entry points, routes and pages, components, styles, and any API or data code. In update mode, read the changed, added, and removed files closely, plus the doc pages that cover them.

Document only what the code shows. Never make up features, env vars, commands, or APIs. If something is unclear, such as a component that looks unfinished, say so in the docs ("Note: ... is not wired up yet") instead of guessing.

## Step 3 — Write or update the docs

### Doc set

Write these files in `docs/`. Skip any page that would be empty for this project, and add a page if the project has something big that isn't covered (for example `api.md` once API routes exist).

| File | Contents |
|------|----------|
| `docs/index.md` | What the project is, its main features, tech stack with versions from `package.json`, and links to the other pages |
| `docs/getting-started.md` | Prerequisites, install, and every `package.json` script with what it does (dev, build, start, ...), plus the URL and port for local dev |
| `docs/architecture.md` | Folder structure as a tree, how the pieces fit together (layout → page → components), where state lives, how data flows, and whether data persists (and where) |
| `docs/components.md` | One section per component: purpose, props (name, type, required, default), internal state, key behaviour, and which components use it |
| `docs/styling.md` | How styling works: global CSS, CSS variables and themes, naming conventions, responsive breakpoints |
| `docs/changelog.md` | Newest first, one dated entry per docs run that found changes, summarising what changed in the **code** |

Use `mkdocs.yml` too if it already exists in the project: keep its `nav` in sync with the pages. Don't create one unless the user asks.

### Create mode

Write the full doc set from scratch. Start `changelog.md` with one entry: `## <today's date> — Initial documentation`.

### Update mode

- Edit pages in place with targeted changes. Keep any text a person wrote that is still accurate, including their wording and extra sections.
- For each `changed`/`added`/`removed` file, update every page that mentions it: props, behaviour, folder tree, scripts, dependency versions.
- Remove docs for anything deleted from the code. Add docs for anything new.
- Fix anything else you notice is stale, even if its file isn't in the changed list.
- Add a changelog entry at the top: `## <today's date>`, with bullets such as "Added `X` component", "`TodoApp` now persists to localStorage".

### Root README

- If a root `README.md`/`readme.md` exists and describes this project, keep a short project summary and a "Documentation" link to `docs/index.md` in it up to date.
- If it exists but is **not** project documentation (personal notes, class notes, scratch), **leave it untouched** and mention that in your report.
- If none exists, create `README.md` with a 1-paragraph summary, quick-start commands, and a link to `docs/index.md`.

### Style rules

- Plain Markdown with fenced code blocks tagged by language. Relative links between pages.
- Write for a developer who is new to the codebase. Be concise and specific: use real names, real paths, real commands.
- Refer to code as `path/to/file.tsx` and to symbols as `ComponentName`.

## Step 4 — Record state

Once the docs are written, save the snapshot so the next run can spot changes:

```bash
node .puku-cli/skills/document-project/scripts/doc-state.mjs save
```

## Step 5 — Report

Tell the user, briefly:
- Mode (created or updated)
- Which doc files were created, updated, or removed, with one line each on what changed
- Anything you couldn't document confidently, or that looked broken or unfinished in the code
- Whether the root README was left untouched, and why
