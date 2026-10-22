import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser, RegisteredUser } from "../types/user";

type LoginResult = "success" | "not-found" | "invalid";
type RegisterResult = "success" | "exists";

interface AuthContextValue {
  user: AuthUser;
  login: (email: string, password: string) => LoginResult;
  register: (fullName: string, email: string, password: string) => RegisterResult;
  updateProfile: (details: Pick<AuthUser, "fullName" | "email" | "address">) => void;
  logout: () => void;
}

const USERS_KEY = "10x-shop-users";
const CURRENT_USER_KEY = "10x-shop-current-user";
const guestUser: AuthUser = { username: "", fullName: "", email: "", address: "", isLoggedIn: false };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readRegisteredUsers(): RegisteredUser[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    return Array.isArray(value) ? value as RegisteredUser[] : [];
  } catch {
    return [];
  }
}

function readCurrentUser(): AuthUser {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? "null");
    if (typeof value === "object" && value !== null && "email" in value && "fullName" in value) {
      return { ...guestUser, ...(value as Omit<AuthUser, "isLoggedIn">), isLoggedIn: true };
    }
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  return guestUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(readCurrentUser);

  const login = (email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const registered = readRegisteredUsers().find((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (!registered) return "not-found";
    if (registered.password !== password) return "invalid";
    const nextUser: AuthUser = { username: registered.email, fullName: registered.fullName, email: registered.email, address: registered.address, isLoggedIn: true };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return "success";
  };

  const register = (fullName: string, email: string, password: string): RegisterResult => {
    const users = readRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((entry) => entry.email.toLowerCase() === normalizedEmail)) return "exists";
    const registered: RegisteredUser = { fullName: fullName.trim(), email: normalizedEmail, password, address: "" };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, registered]));
    const nextUser: AuthUser = { username: normalizedEmail, fullName: registered.fullName, email: normalizedEmail, address: "", isLoggedIn: true };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return "success";
  };

  const updateProfile: AuthContextValue["updateProfile"] = (details) => {
    setUser((current) => {
      if (!current.isLoggedIn) return current;
      const nextUser = { ...current, ...details, username: details.email || current.username };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
      const users = readRegisteredUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(users.map((entry) =>
        entry.email.toLowerCase() === current.email.toLowerCase()
          ? { ...entry, fullName: details.fullName, email: details.email, address: details.address }
          : entry,
      )));
      return nextUser;
    });
  };

  const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(guestUser);
  };

  return <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
