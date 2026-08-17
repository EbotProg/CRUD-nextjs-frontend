"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-xl font-semibold">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
          required
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        No account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </main>
  );
}
