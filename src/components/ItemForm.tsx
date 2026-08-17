"use client";

import { useState, type FormEvent } from "react";

interface ItemFormProps {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function ItemForm({
  initialName = "",
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: ItemFormProps) {
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="flex-1 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
        autoFocus
      />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="rounded bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-black/10 px-4 py-2 text-sm dark:border-white/10"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
