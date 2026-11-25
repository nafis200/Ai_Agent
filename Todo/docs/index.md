# Todo

A small single-page todo app built with Next.js (App Router) and React. Everything runs in the browser and all state lives in React memory, so refreshing the page clears the list.

## Features

- Add todos (empty or whitespace-only input is ignored)
- Mark todos done or not done with a checkbox; done items are struck through
- Delete individual todos
- "N items left" counter and a "Clear completed" button
- Dark / light theme toggle (starts in dark mode)
- Floating feedback widget: pick a category, give a 0–5 star rating, write a message and an optional name. Submissions are only kept in memory and are not sent anywhere.

## Tech stack

| Package | Version |
|---------|---------|
| `next` | 15.5.29 |
| `react` | 19.1.1 |
| `react-dom` | 19.1.1 |
| `typescript` (dev) | 5.9.2 |
| `@types/node` (dev) | 22.18.6 |
| `@types/react` (dev) | 19.1.13 |
| `@types/react-dom` (dev) | 19.1.9 |

Styling is plain global CSS (`app/globals.css`) with CSS variables. There is no CSS framework, no backend, no database, and no test setup.

## Documentation

- [Getting started](getting-started.md): install, scripts, local dev
- [Architecture](architecture.md): folder layout, data flow, state
- [Components](components.md): `TodoApp` and `FeedbackWidget`
- [Styling](styling.md): theme variables and CSS classes
- [Changelog](changelog.md)
