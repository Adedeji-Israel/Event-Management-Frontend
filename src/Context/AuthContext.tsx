import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "@/lib/AxiosInterceptor";
import type { User } from "@/types/user";

export interface ApiResponse {
  status: "success" | "error";
  message: string;
}

interface AuthContextType {
  user: User | null;
  signup: (formData: FormData) => Promise<string>;
  login: (formData: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ApiResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<ApiResponse>;
  refreshUser: () => Promise<void>; 
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
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // REFRESH USER — re-pulls the latest user doc (e.g. after organizerRequest changes)
  const refreshUser = async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      setAccessToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    } catch (err) {
      // If the refresh fails here, session is likely dead — let the next
      // protected request/interceptor handle logout, don't force it here.
      console.warn("Failed to refresh user", err);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("user"); // UI cache only — not a credential
    setUser(null);
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
    } catch (err: any) {
      throw new Error(err.message);
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

      const userData = data.data.user;
      setAccessToken(data.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (err: any) {
      setAccessToken(null);
      clearAuthData();
      throw new Error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout failed on server");
    } finally {
      setAccessToken(null);
      clearAuthData();
      sessionStorage.setItem("justLoggedOut", "true");
      navigate("/auth/login", { replace: true });
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email: string): Promise<ApiResponse> => {
    setSubmitting(true);
    try {
      const { data } = await api.post<ApiResponse>("/auth/forgot-password", { email });
      if (data.status !== "success") throw new Error(data.message);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
    setSubmitting(true);
    try {
      const { data } = await api.patch<ApiResponse>(`/auth/reset-password/${token}`, {
        newPassword,
      });
      if (data.status !== "success") throw new Error(data.message);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // RESTORE SESSION — via the refresh cookie, not localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser(); // This will set user and accessToken if valid
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      } catch {
        setAccessToken(null);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, forgotPassword, resetPassword, refreshUser, submitting, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
