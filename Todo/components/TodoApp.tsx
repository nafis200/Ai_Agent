"use client";

import { FormEvent, useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type Theme = "dark" | "light";

// All state lives in React memory only — no localStorage, no backend.
// Refreshing the page resets the list.
export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: value, done: false }]);
    setText("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.done));

  const itemsLeft = todos.filter((t) => !t.done).length;
  const hasCompleted = todos.some((t) => t.done);

  return (
    <main className="container">
      <header className="header">
        <h1>📝 Todo</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </header>

      <form className="add-form" onSubmit={addTodo}>
        <input
          className="add-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          autoFocus
        />
        <button type="submit" className="add-btn" disabled={!text.trim()}>
          Add
        </button>
      </form>

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id} className={`item${todo.done ? " done" : ""}`}>
            <label className="item-label">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="item-text">{todo.text}</span>
            </label>
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeTodo(todo.id)}
              aria-label={`Delete "${todo.text}"`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <footer className="footer">
          <span>
            {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
          </span>
          <button
            type="button"
            className="clear-btn"
            onClick={clearCompleted}
            disabled={!hasCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </main>
  );
}
