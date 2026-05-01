"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("joy-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Demo: check localStorage for registered users
    const usersStr = localStorage.getItem("joy-users") || "[]";
    const users: Array<{ email: string; password: string; name: string; phone: string }> = JSON.parse(usersStr);
    const found = users.find((u) => u.email === email && u.password === _password);
    if (found) {
      const userData: User = { id: "user-" + Date.now(), name: found.name, email: found.email, phone: found.phone };
      setUser(userData);
      localStorage.setItem("joy-user", JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    const usersStr = localStorage.getItem("joy-users") || "[]";
    const users: Array<{ email: string; password: string; name: string; phone: string }> = JSON.parse(usersStr);
    if (users.find((u) => u.email === email)) {
      return false; // Email exists
    }
    users.push({ name, email, phone, password });
    localStorage.setItem("joy-users", JSON.stringify(users));
    const userData: User = { id: "user-" + Date.now(), name, email, phone };
    setUser(userData);
    localStorage.setItem("joy-user", JSON.stringify(userData));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("joy-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}