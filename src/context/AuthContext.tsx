"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Parse from "@/lib/parse";

interface AuthContextValue {
  user: Parse.User | null;
  loading: boolean;
  register: (username: string, password: string, email?: string) => Promise<Parse.User>;
  login: (username: string, password: string) => Promise<Parse.User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(Parse.User.current() ?? null);
    setLoading(false);
  }, []);

  async function register(username: string, password: string, email?: string): Promise<Parse.User> {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    if (email) user.set("email", email);
    await user.signUp();
    setUser(user);
    return user;
  }

  async function login(username: string, password: string): Promise<Parse.User> {
    const user = await Parse.User.logIn(username, password);
    setUser(user);
    return user;
  }

  async function logout(): Promise<void> {
    await Parse.User.logOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
