---
name: commit-push
description: Stage changes in Todo/, write a Conventional Commits message from the diff, commit, and push to GitHub. Use when the user runs /commit-push or asks to "commit and push", "commit with a conventional message", or "push my changes".
argument-hint: "[optional hint, e.g. 'feat: dark mode' or 'only components/']"
---

# Commit & Push (Conventional Commits)

Commit the current changes with a [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) message and push to `origin`.

The git root is the parent folder (`Ai_Agent/`), which holds other class projects. **Only commit files inside `Todo/`** unless the user says otherwise.

## 1. Inspect

Run from `Todo/`:

```bash
git status --short -- .
git diff -- .
git diff --cached -- .
git log --oneline -5
git branch --show-current
```

- If there are no changes in `Todo/`, say so and stop.
- If arguments were passed (`$ARGUMENTS`), treat them as a hint for the message or the scope of files to include.

## 2. Decide what to stage

- Stage files inside `Todo/` by explicit path: `git add -- <path> ...`. Never use `git add -A` or `git add .` from the repo root.
- **Never stage:** `instruction.md`, `image.png` (personal notes), `.env*`, credentials, `.claude/settings.local.json`, or generated files (`.next/`, `node_modules/`, `next-env.d.ts`, `*.tsbuildinfo`).
- If the changes cover unrelated concerns (e.g. a feature plus a docs change), prefer separate commits, one per concern.
- If anything is ambiguous (unknown untracked files, files outside `Todo/`), list them and ask before staging.

## 3. Write the message

Format:

```text
<type>(<optional scope>): <subject>

<optional body: what changed and why, wrapped at ~72 chars>

<optional footer, e.g. BREAKING CHANGE: ... or Closes #12>
```

Types:

| Type | Use for |
|------|---------|
| `feat` | A new user-facing feature |
| `fix` | A bug fix |
| `docs` | Documentation only (`docs/`, `readme.md`, `CLAUDE.md`) |
| `style` | Formatting/whitespace, no logic change (not CSS features; CSS changes that alter the UI are `feat`/`fix`) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Dependencies, `package.json`, Next/TS config |
| `ci` | CI configuration |
| `chore` | Tooling, skills in `.claude/`, other maintenance |
| `revert` | Reverting an earlier commit |

Rules:

- Scope is optional; use a short noun for the area: `todo`, `feedback`, `theme`, `layout`, `styles`, `docs`, `skills`.
- Subject: imperative mood ("add", not "added"), lowercase first letter, no trailing period, ≤ 72 chars total for the header.
- Add a body only when the "why" isn't obvious from the subject.
- Breaking changes: add `!` after the type/scope (`feat(todo)!: ...`) and a `BREAKING CHANGE:` footer.
- Describe the actual diff. Don't invent changes.
- End the message with the attribution line from the session's git attribution instructions, if any.

Commit with a heredoc so formatting is preserved:

```bash
git commit -m "$(cat <<'EOF'
feat(todo): add filter for completed todos

Co-Authored-By: ...
EOF
)"
```

Never use `--no-verify`, `--amend` or `--force` unless the user asks.

## 4. Push

```bash
git push origin HEAD
```

- If the branch has no upstream, use `git push -u origin HEAD`.
- If the push is rejected because the remote is ahead, run `git pull --rebase origin <branch>` and push again. If the rebase conflicts, stop and tell the user. Never force-push.

## 5. Report

Reply briefly with:

- the commit hash(es) and message header(s)
- the files committed
- the branch and remote pushed to
- any files intentionally left out (e.g. `instruction.md`)
