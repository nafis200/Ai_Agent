# Changelog

## 2026-11-26

- Added animations throughout the UI: page and footer fade-in, todos animate in on add and slide out on delete or "Clear completed", animated strike-through on completed todos, checkbox and star "pop", spinning theme icon, hover/press feedback on buttons, focus rings on inputs, and a springier feedback panel, launcher and thank-you message.
- `TodoApp` now has a `leaving` state and an `animateOut` helper, which delay removing todos by `LEAVE_MS` (220ms) so the exit animation can play.
- Animations respect `prefers-reduced-motion`.

## 2026-11-22 — Initial documentation

- Documented the Next.js 15 / React 19 todo app: `TodoApp` (add, toggle, delete, clear completed, dark/light theme) and `FeedbackWidget` (floating feedback form whose submissions are kept in memory only).
- Added `index.md`, `getting-started.md`, `architecture.md`, `components.md`, `styling.md`, and this changelog.
