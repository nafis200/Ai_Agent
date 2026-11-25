# Styling

All styles are in one global stylesheet, `app/globals.css`, which `app/layout.tsx` imports. There are no CSS Modules, Tailwind or CSS-in-JS.

## Themes and CSS variables

Theme colours are CSS custom properties. They switch based on the `data-theme` attribute on `<html>`:

- `app/layout.tsx` renders `data-theme="dark"` on the server.
- `TodoApp` updates the attribute when the user toggles the theme.
- `:root` shares the dark values, so dark is also the fallback.

| Variable | Dark | Light | Used for |
|----------|------|-------|----------|
| `--bg` | `#161a2b` | `#f4f5fa` | Page background; feedback input background |
| `--bg-gradient` | `#1b2033 → #12151f` | `#f7f8fc → #eceef6` | Body background image |
| `--surface` | `#252a3d` | `#ffffff` | Inputs, list items, feedback panel |
| `--border` | `#353b52` | `#dde0ea` | Borders; empty stars |
| `--text` | `#e8eaf2` | `#1d2133` | Main text |
| `--muted` | `#9aa0b4` | `#6b7185` | Placeholders, done items, secondary text |
| `--accent` | `#6c5ce7` | `#6c5ce7` | Buttons, focus borders, checkbox, active chip |
| `--accent-hover` | `#7d6ff0` | `#5a4ad6` | Hover state of accent buttons |
| `--toggle-bg` | `#2d3348` | `#e6e8f1` | Theme toggle; inactive chips |

Hard-coded colours: `#fff` for text on accent buttons, `#f5b301` for filled stars, and `rgba(0,0,0,0.35)` for shadows.

To add a new theme, add a `[data-theme="<name>"]` block that defines every variable above, and extend the `Theme` type and toggle in `TodoApp`.

## Base styles

- `* { box-sizing: border-box }`
- `body`: system font stack, 14px, theme background and text. Background and colour change with a 0.2s transition when the theme switches.
- `button`: inherits the font and uses `cursor: pointer` (`not-allowed` when disabled).

## Class naming

Classes are flat and kebab-case, grouped by component. State is shown with modifier classes such as `.done`, `.active` and `.filled`, not with BEM.

| Area | Classes |
|------|---------|
| Layout (`TodoApp`) | `.container` (max-width 440px, centred), `.header`, `.theme-toggle` |
| Add form | `.add-form`, `.add-input`, `.add-btn` |
| List | `.list`, `.item`, `.item.done`, `.item-label`, `.item-text`, `.remove-btn` |
| Footer | `.footer`, `.clear-btn` |
| Feedback (`FeedbackWidget`) | `.feedback`, `.feedback-header`, `.feedback-title`, `.feedback-close`, `.feedback-launcher`, `.feedback-form`, `.chips`, `.chip`, `.chip.active`, `.stars`, `.star`, `.star.filled`, `.feedback-input`, `.feedback-textarea`, `.feedback-send`, `.feedback-thanks` |

Animation: `@keyframes feedback-in` fades and slides the feedback panel in over 0.15s.

## Responsive behaviour

There are no media queries or breakpoints. The layout adapts through:

- `.container` with `max-width: 440px` and 16px side padding
- `.feedback` with `width: 300px; max-width: calc(100vw - 32px)`
- `min-width: 0` and `overflow-wrap: anywhere` so long todo text wraps

The feedback panel and launcher are `position: fixed` at the bottom right (`z-index: 10`). On narrow screens they can cover the bottom of the todo list.
