"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Parse from "@/lib/parse";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(Parse.User.current());
    setLoading(false);
  }, []);

  async function register(username, password, email) {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    if (email) user.set("email", email);
    await user.signUp();
    setUser(user);
    return user;
  }

  async function login(username, password) {
    const user = await Parse.User.logIn(username, password);
    setUser(user);
    return user;
  }

  async function logout() {
    await Parse.User.logOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
