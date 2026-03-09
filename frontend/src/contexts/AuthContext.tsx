import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authAPI } from "@/api/services";

interface User {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  is_seller: boolean;
  is_customer: boolean;
  is_staff: boolean;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name?: string; phone_number?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      refreshProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    await refreshProfile();
  };

  const register = async (regData: { email: string; password: string; name?: string; phone_number?: string }) => {
    await authAPI.register(regData);
    await login(regData.email, regData.password);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
