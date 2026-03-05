// src/Context/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import type { User } from "@/types/user";


interface AuthContextType {
  user: User | null;
  token: string | null;
  signup: (formData: FormData) => Promise<string>;
  login: (formData: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  submitting: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  // SIGNUP
  const signup = async (formData: FormData) => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.status !== "success") throw new Error(data.message);
      return data.message;
    } finally {
      setSubmitting(false);
    }
  };

  // LOGIN
  const login = async (formData: { email: string; password: string }) => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      if (data.status !== "success") throw new Error(data.message);

      const userData: User = data.data.user;
      const userToken: string = data.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);

      setUser(userData);
      setToken(userToken);

      return userData;
    } catch (err: any) {
      clearAuthData();
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      throw new Error(error.message);
    }
    finally {
      clearAuthData();
      navigate("/auth/login", { replace: true });
    }
  };

  // Restore session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
      } catch {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, signup, login, logout, submitting, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
