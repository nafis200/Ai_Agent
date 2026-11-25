# Architecture

## Folder structure

```text
Todo/
├── app/
│   ├── globals.css        # All styles: theme variables + component classes
│   ├── layout.tsx         # Root layout: <html data-theme="dark">, metadata, imports globals.css
│   └── page.tsx           # Home route "/": renders TodoApp + FeedbackWidget
├── components/
│   ├── FeedbackWidget.tsx # Floating feedback launcher and form (client component)
│   └── TodoApp.tsx        # Todo list UI and theme toggle (client component)
├── docs/                  # This documentation
├── next.config.ts         # Empty Next.js config
├── tsconfig.json          # TypeScript config, "@/*" path alias
├── package.json
└── readme.md              # Personal class notes, not project docs
```

`.next/`, `node_modules/`, `next-env.d.ts` and `*.tsbuildinfo` are generated and git-ignored. There is also an `image.png` in the root that the code doesn't reference.

## How the pieces fit together

```text
app/layout.tsx  (server component: RootLayout)
└── app/page.tsx  (server component: Home, route "/")
    ├── <TodoApp />         "use client"
    └── <FeedbackWidget />  "use client"
```

- `RootLayout` sets page metadata (`title: "Todo"`, `description: "Simple in-memory todo app"`), imports `globals.css`, and renders `<html lang="en" data-theme="dark">`.
- `Home` is the only route. It renders the two client components next to each other. They don't share props or state.

## State and data flow

All state is local `useState` inside each component. There is no context, no global store, and no data fetching.

| Component | State |
|-----------|-------|
| `TodoApp` | `todos: Todo[]`, `text` (input value), `theme: "dark" \| "light"` |
| `FeedbackWidget` | `category`, `rating`, `hover`, `message`, `name`, `submissions`, `sent`, `open` |

**Theme:** `TodoApp` owns `theme`. A `useEffect` writes it to `document.documentElement.dataset.theme`, and the CSS variables in `globals.css` switch on `[data-theme]`. This is why the theme also restyles `FeedbackWidget`, even though the widget doesn't receive the theme as a prop.

**Todos:** user input → `text` → on submit, `addTodo` appends `{ id: crypto.randomUUID(), text, done: false }`. Toggle, remove and clear-completed all derive a new array from the previous one.

## Persistence

Nothing persists. There is no `localStorage`, cookie, API route or backend. Reloading the page resets the todos and feedback submissions, and the theme goes back to dark.
