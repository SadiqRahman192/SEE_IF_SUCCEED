import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { login, register, logout, User, fetchAuthenticatedUser } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const fetchedUser = await fetchAuthenticatedUser();
        setUser(fetchedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = async (email, password) => {
    try {
      const { user } = await login(email, password);
      console.log("User data:", user); // Debug
      setUser(user);
      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      checkAuthStatus(); // Re-check auth status after login attempt
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const { user } = await register(email, password, name);
      setUser(user);
      setIsAuthenticated(true);
      toast.success("Registered successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(errorMessage);
    } finally {
      checkAuthStatus(); // Re-check auth status after register attempt
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(errorMessage);
    } finally {
      checkAuthStatus(); // Re-check auth status after logout attempt
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
