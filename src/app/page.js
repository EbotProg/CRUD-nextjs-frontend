"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Parse from "@/lib/parse";
import { useAuth } from "@/context/AuthContext";
import ItemForm from "@/components/ItemForm";
import ItemRow from "@/components/ItemRow";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    setError("");
    try {
      const query = new Parse.Query("Item");
      query.descending("createdAt");
      const results = await query.find();
      setItems(results);
    } catch (err) {
      setError(err.message || "Failed to load items.");
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

  async function handleCreate(name) {
    setError("");
    try {
      const Item = Parse.Object.extend("Item");
      const item = new Item();
      item.set("name", name);
      item.set("completed", false);
      const saved = await item.save();
      setItems((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to create item.");
    }
  }

  async function handleToggle(item) {
    setError("");
    try {
      item.set("completed", !item.get("completed"));
      await item.save();
      setItems((prev) => [...prev]);
    } catch (err) {
      setError(err.message || "Failed to update item.");
    }
  }

  async function handleEdit(item, name) {
    setError("");
    try {
      item.set("name", name);
      await item.save();
      setItems((prev) => [...prev]);
    } catch (err) {
      setError(err.message || "Failed to update item.");
    }
  }

  async function handleDelete(item) {
    setError("");
    try {
      await item.destroy();
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err.message || "Failed to delete item.");
    }
  }

  if (authLoading) {
    return <main className="mx-auto max-w-2xl px-4 py-10">Loading…</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-xl font-semibold">Welcome</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          Log in or register to manage your items.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/login" className="rounded bg-foreground px-4 py-2 text-sm text-background">
            Log in
          </Link>
          <Link href="/register" className="rounded border border-black/10 px-4 py-2 text-sm dark:border-white/10">
            Register
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">Your items</h1>

      <div className="mt-6">
        <ItemForm submitLabel="Add" onSubmit={handleCreate} />
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-6">
        {loadingItems ? (
          <p className="text-black/60 dark:text-white/60">Loading items…</p>
        ) : items.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">No items yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
