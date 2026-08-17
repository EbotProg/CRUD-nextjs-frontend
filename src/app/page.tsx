"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Parse, { type ItemAttributes, type ItemObject } from "@/lib/parse";
import { useAuth } from "@/context/AuthContext";
import ItemForm from "@/components/ItemForm";
import ItemRow from "@/components/ItemRow";

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ItemObject[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    setError("");
    try {
      const query = new Parse.Query<ItemObject>("Item");
      query.descending("createdAt");
      const results = await query.find();
      setItems(results);
    } catch (err) {
      setError(errorMessage(err, "Failed to load items."));
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

  async function handleCreate(name: string) {
    setError("");
    try {
      const item = new Parse.Object<ItemAttributes>("Item");
      item.set("name", name);
      item.set("completed", false);
      const saved = await item.save();
      setItems((prev) => [saved, ...prev]);
    } catch (err) {
      setError(errorMessage(err, "Failed to create item."));
    }
  }

  async function handleToggle(item: ItemObject) {
    setError("");
    try {
      item.set("completed", !item.get("completed"));
      await item.save();
      setItems((prev) => [...prev]);
    } catch (err) {
      setError(errorMessage(err, "Failed to update item."));
    }
  }

  async function handleEdit(item: ItemObject, name: string) {
    setError("");
    try {
      item.set("name", name);
      await item.save();
      setItems((prev) => [...prev]);
    } catch (err) {
      setError(errorMessage(err, "Failed to update item."));
    }
  }

  async function handleDelete(item: ItemObject) {
    setError("");
    try {
      await item.destroy();
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(errorMessage(err, "Failed to delete item."));
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
