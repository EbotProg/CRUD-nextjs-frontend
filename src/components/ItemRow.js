"use client";

import { useState } from "react";
import ItemForm from "./ItemForm";

export default function ItemRow({ item, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (editing) {
    return (
      <li className="py-2">
        <ItemForm
          initialName={item.get("name")}
          submitLabel="Update"
          onCancel={() => setEditing(false)}
          onSubmit={async (name) => {
            await onEdit(item, name);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  const completed = !!item.get("completed");

  return (
    <li className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(item)}
        className="h-4 w-4"
      />
      <span className={`flex-1 ${completed ? "line-through text-black/40 dark:text-white/40" : ""}`}>
        {item.get("name")}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="rounded border border-black/10 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
      >
        Edit
      </button>
      <button
        onClick={async () => {
          setDeleting(true);
          try {
            await onDelete(item);
          } finally {
            setDeleting(false);
          }
        }}
        disabled={deleting}
        className="rounded border border-red-500/30 px-3 py-1 text-sm text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </li>
  );
}
