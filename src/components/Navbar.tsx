"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Items
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!loading && user && (
            <>
              <span className="text-black/60 dark:text-white/60">
                {user.get("username")}
              </span>
              <button
                onClick={handleLogout}
                className="rounded border border-black/10 px-3 py-1 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                Log out
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
