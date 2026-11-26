# Components

Both components live in `components/`, are client components (`"use client"`), take no props, and are rendered only by `app/page.tsx`.

## `TodoApp`

`components/TodoApp.tsx`

The main todo list UI, wrapped in `<main className="container">`.

### Props

None.

### Types

```ts
type Todo = { id: string; text: string; done: boolean };
type Theme = "dark" | "light";
const LEAVE_MS = 220; // must match the `item-out` animation duration in globals.css
```

### State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `todos` | `Todo[]` | `[]` | The list |
| `text` | `string` | `""` | Value of the "What needs to be done?" input |
| `theme` | `Theme` | `"dark"` | Current colour theme |
| `leaving` | `Set<string>` | empty set | IDs of todos playing their exit animation |

### Behaviour

- **Header:** the "📝 Todo" title and a round theme toggle button (🌙 in dark mode, ☀️ in light mode). The button's `aria-label` names the theme it will switch to. The icon is wrapped in `<span className="theme-icon" key={theme}>`; changing the key remounts it, which replays its spin-in animation.
- **Theme sync:** a `useEffect` sets `document.documentElement.dataset.theme` whenever `theme` changes.
- **Add form:** the input has `autoFocus`. The Add button is disabled while the trimmed input is empty. `addTodo` calls `preventDefault`, trims the text, ignores empty values, appends the new todo with a `crypto.randomUUID()` id, and clears the input.
- **List:** each `<li className="item">` gets the extra class `done` when completed. It contains a checkbox label (`toggleTodo`) and a `×` button (`removeTodo`) whose `aria-label` is `Delete "<text>"`.
- **Animated removal:** `removeTodo` and `clearCompleted` both call `animateOut(ids)`. It adds the IDs to `leaving` (which gives each `<li>` the `leaving` class and starts the `item-out` animation), then after `LEAVE_MS` removes the todos from `todos` and the IDs from `leaving`.
- **Footer:** shown only when there is at least one todo. It shows "N item(s) left" (with correct singular/plural) and a "Clear completed" button, which is disabled when nothing is done.

## `FeedbackWidget`

`components/FeedbackWidget.tsx`

A floating feedback form in the bottom-right corner.

### Props

None.

### Constants and types

```ts
const CATEGORIES = [
  { id: "bug", label: "Bug", icon: "🐞" },
  { id: "suggestion", label: "Suggestion", icon: "💡" },
  { id: "praise", label: "Praise", icon: "👍" },
  { id: "other", label: "Other", icon: "💬" },
] as const;

type Category = "bug" | "suggestion" | "praise" | "other";
type Feedback = { id: string; category: Category; rating: number; message: string; name: string; createdAt: Date };
```

### State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `open` | `boolean` | `false` | Whether the panel is expanded |
| `category` | `Category` | `"bug"` | Selected category chip |
| `rating` | `number` | `0` | Selected star rating (0 means no rating) |
| `hover` | `number` | `0` | Star under the mouse, used for the hover preview |
| `message` | `string` | `""` | Feedback text (required) |
| `name` | `string` | `""` | Optional name |
| `submissions` | `Feedback[]` | `[]` | Submitted feedback. Only the setter is used. |
| `sent` | `boolean` | `false` | Shows the thank-you message |

### Behaviour

- **Closed:** renders only a round 💬 launcher button (`.feedback-launcher`). Clicking it sets `open` to `true`.
- **Open:** renders `<aside className="feedback">` with a header. Both the "Share feedback" title button and the `×` button close the panel.
- **Category chips:** a `role="radiogroup"` of buttons with `role="radio"` and `aria-checked`.
- **Stars:** five buttons. Hovering previews the fill. Clicking sets the rating, and clicking the current rating again clears it back to 0.
- **Submit:** disabled until `message.trim()` is non-empty. On submit, the widget appends a `Feedback` object to `submissions`, resets the form fields, and shows "Thanks for your feedback! 🎉" for 2.5 seconds (`setTimeout`). The panel stays open.

> Note: submissions are never read, displayed, sent or persisted. The state is declared as `const [, setSubmissions]`, so feedback is collected and then thrown away. Sending it to a backend is not wired up yet.
>
> Note: the `setTimeout` is not cleared on unmount.
