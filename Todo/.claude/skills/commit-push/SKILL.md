---
name: commit-push
description: Stage changes in Todo/, write a Conventional Commits message from the diff, commit, push to GitHub, then update CHANGELOG.md and publish a GitHub release with release notes. Use when the user runs /commit-push or asks to "commit and push", "commit with a conventional message", "push my changes", or "make a release / release notes".
argument-hint: "[optional hint, e.g. 'feat: dark mode', 'only components/', 'no release', 'release minor']"
---

# Commit & Push (Conventional Commits)

Commit the current changes with a [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) message, push to `origin`, then cut a versioned release: update `Todo/CHANGELOG.md`, bump `package.json`, tag, and publish GitHub release notes.

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

## 5. Release notes (CHANGELOG + GitHub release)

Run this after a successful push. Skip it if `$ARGUMENTS` contains `no release`, or if every new commit since the last release is `docs`, `style`, `test`, `ci` or `chore` only (say "no release-worthy changes" in the report). `release` in the arguments forces a release anyway.

### 5a. Find the last release and the new commits

Tags are prefixed `todo-` because the git root holds other projects:

```bash
LAST=$(git tag --list 'todo-v*' --sort=-v:refname | head -1)
git log --no-merges --format='%h%x09%s' ${LAST:+$LAST..}HEAD -- .
```

If there is no `todo-v*` tag yet, this is the first release: use the current `package.json` version (e.g. `0.1.0`) as-is, with no bump.

### 5b. Pick the next version (SemVer)

From the commit headers since `LAST`:

| Commits contain | Bump |
|-----------------|------|
| `!` after type, or a `BREAKING CHANGE:` footer | major (while version is `0.x`, bump minor instead) |
| any `feat` | minor |
| only `fix`, `perf`, `refactor`, `build`, `revert`, ... | patch |

`release major|minor|patch` in `$ARGUMENTS` overrides this.

### 5c. Write the notes

Group commits by type, skipping `chore(release)` commits. Write each entry as a human-readable line (rewrite the subject if needed), with the short hash:

```markdown
## [0.2.0] - 2026-11-26

### ⚠ Breaking Changes
- ...

### Features
- Add filter for completed todos (abc1234)

### Bug Fixes
- ...

### Performance
### Refactoring
### Documentation
### Other
```

- Omit empty sections. `docs` goes under Documentation; `build`/`chore`/`ci`/`style`/`test`/`revert` go under Other.
- Use today's date (YYYY-MM-DD). Don't invent changes.

Update `Todo/CHANGELOG.md`: newest release at the top, below this header (create the file with the header if missing):

```markdown
# Changelog

All notable changes to the Todo app. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).
```

Also save the same section (without the `## [x.y.z]` heading) to a scratch file for the GitHub release body.

### 5d. Commit, tag, push

Set `"version"` in `package.json` to the new version (and the top-level `version` fields in `package-lock.json`; edit the files, don't run `npm version`). Then:

```bash
git add -- CHANGELOG.md package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore(release): todo-vX.Y.Z

Co-Authored-By: ...
EOF
)"
git tag -a todo-vX.Y.Z -m "Todo vX.Y.Z"
git push origin HEAD
git push origin todo-vX.Y.Z
```

Never move or delete an existing tag.

### 5e. Publish the GitHub release

If the `gh` CLI is installed and authenticated (`gh auth status`):

```bash
gh release create todo-vX.Y.Z --title "Todo vX.Y.Z" --notes-file <scratch-notes-file> --verify-tag
```

Publish it as a normal release; add `--prerelease` only if the user asks.

If `gh` is missing or not logged in, don't try another API or token. Tell the user the tag and CHANGELOG are pushed, give them the prefilled link `https://github.com/<owner>/<repo>/releases/new?tag=todo-vX.Y.Z&title=Todo%20vX.Y.Z` (owner/repo from `git remote get-url origin`), print the release notes so they can paste them, and mention `gh auth login` for next time.

## 6. Report

Reply briefly with:

- the commit hash(es) and message header(s)
- the files committed
- the branch and remote pushed to
- the release version, tag, and release URL (or why no release was made, or the manual link if `gh` was unavailable)
- any files intentionally left out (e.g. `instruction.md`)
