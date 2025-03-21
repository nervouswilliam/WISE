import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../models/User";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  setUserData: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  setUserData: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem("token"));

  useEffect(() => {
    // Load user data from localStorage on first render
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Axios Interceptor to handle unauthorized responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.error_code === "E006") {
          sessionStorage.removeItem("token"); // Clear invalid token
          localStorage.removeItem("user"); // Clear stored user
          setUser(null);
          setIsAuthenticated(false);
          navigate("/login"); // Redirect to login page
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const setUserData = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
