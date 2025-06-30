import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

interface User {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  isEmailVerified: boolean;
  isAccountApproved?: boolean;
  token?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (code: string, password: string) => Promise<void>;
  updateUserState: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
  }, []);

  const handleAuthSuccess = (data: User) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const updateUserState = (updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to login");
    handleAuthSuccess(data);
  };

  const register = async (userData: any) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "documents" && userData[key]) {
        for (let i = 0; i < userData[key].length; i++) {
          formData.append("documents", userData[key][i]);
        }
      } else if (key === "profileImage" && userData[key]) {
        formData.append("profileImage", userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    handleAuthSuccess(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const verifyEmail = async (code: string) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser?.token) throw new Error("Authentication token not found.");

    const response = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser.token}`,
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Verification failed");
    updateUserState({ isEmailVerified: true });
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to send reset email");
  };

  const resetPassword = async (code: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password }),
    });
    if (!response.ok) throw new Error("Failed to reset password");
  };

  const value = {
    user,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateUserState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
