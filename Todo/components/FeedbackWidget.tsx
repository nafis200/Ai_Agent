"use client";

import { FormEvent, useState } from "react";

const CATEGORIES = [
  { id: "bug", label: "Bug", icon: "🐞" },
  { id: "suggestion", label: "Suggestion", icon: "💡" },
  { id: "praise", label: "Praise", icon: "👍" },
  { id: "other", label: "Other", icon: "💬" },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

type Feedback = {
  id: string;
  category: Category;
  rating: number;
  message: string;
  name: string;
  createdAt: Date;
};

// Submissions are kept in React memory only — nothing is sent or persisted.
export default function FeedbackWidget() {
  const [category, setCategory] = useState<Category>("bug");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [, setSubmissions] = useState<Feedback[]>([]);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  const canSend = message.trim().length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setSubmissions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        category,
        rating,
        message: message.trim(),
        name: name.trim(),
        createdAt: new Date(),
      },
    ]);
    setCategory("bug");
    setRating(0);
    setMessage("");
    setName("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="feedback-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open feedback form"
        title="Share feedback"
      >
        💬
      </button>
    );
  }

  return (
    <aside className="feedback" aria-label="Share feedback">
      <div className="feedback-header">
        <button
          type="button"
          className="feedback-title"
          onClick={() => setOpen(false)}
          title="Hide feedback form"
        >
          Share feedback
        </button>
        <button
          type="button"
          className="feedback-close"
          onClick={() => setOpen(false)}
          aria-label="Close feedback form"
        >
          ×
        </button>
      </div>

      {sent ? (
        <p className="feedback-thanks">Thanks for your feedback! 🎉</p>
      ) : (
        <form onSubmit={submit} className="feedback-form">
          <div className="chips" role="radiogroup" aria-label="Feedback type">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={category === c.id}
                className={`chip${category === c.id ? " active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                <span aria-hidden>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="stars" onMouseLeave={() => setHover(0)} aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star${n <= (hover || rating) ? " filled" : ""}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n === rating ? 0 : n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={n <= rating}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="feedback-input feedback-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What happened? What would you change?"
            rows={3}
            aria-label="Feedback message"
          />

          <input
            className="feedback-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            aria-label="Your name"
          />

          <button type="submit" className="feedback-send" disabled={!canSend}>
            Send feedback
          </button>
        </form>
      )}
    </aside>
  );
}
