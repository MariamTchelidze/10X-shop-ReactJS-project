import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../types/user";

interface AuthContextValue {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

const guestUser: AuthUser = { username: "", isLoggedIn: false };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(guestUser);

  const login = (username: string): void => {
    setUser({ username, isLoggedIn: true });
  };

  const logout = (): void => {
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
