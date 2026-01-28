import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

interface LoginResponse {
  token: string;
  expires_in: number;
  username: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------------------
   Initialize Auth State
  ---------------------------------------- */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("token_expiry");
        const user = localStorage.getItem("user");

        if (!token || !expiry || !user) {
          return;
        }

        const isExpired = Date.now() > Number(expiry);

        if (isExpired) {
          clearAuth();
          return;
        }

        setToken(token);
        setUser(JSON.parse(user));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ----------------------------------------
   Helpers
  ---------------------------------------- */
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (!token || !expiry) return false;
    return Date.now() < Number(expiry);
  };

  /* ----------------------------------------
   Login Handler
  ---------------------------------------- */
  const login = (data: LoginResponse) => {
    const expiryTime = Date.now() + data.expires_in * 1000;

    const userData: User = {
      username: data.username,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("token_expiry", expiryTime.toString());
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    navigate("/clusters");
  };

  /* ----------------------------------------
   Logout
  ---------------------------------------- */
  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
