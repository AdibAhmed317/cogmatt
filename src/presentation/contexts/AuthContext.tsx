// Auth Context Provider
// Manages authentication state using /api/auth/me endpoint and cookies
// Implements automatic token refresh to keep user logged in

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Helper function to decode JWT and check expiry
function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refresh the access token using the refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Sends refresh token cookie
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        // Schedule next refresh
        scheduleTokenRefresh(data.accessToken);
        return true;
      } else {
        // Refresh token expired or invalid, log out
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed');
      setUser(null);
      return false;
    }
  };

  // Schedule automatic token refresh before expiry
  const scheduleTokenRefresh = (accessToken: string) => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const expiry = getTokenExpiry(accessToken);
    if (!expiry) return;

    const now = Date.now();
    const timeUntilExpiry = expiry - now;

    // Refresh 2 minutes before expiry (or immediately if already expired)
    const refreshTime = Math.max(0, timeUntilExpiry - 2 * 60 * 1000);

    refreshTimerRef.current = setTimeout(async () => {
      const success = await refreshToken();
      if (success) {
        await checkAuth();
      }
    }, refreshTime);
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);

        // Schedule token refresh if we have an access token
        if (data.accessToken) {
          scheduleTokenRefresh(data.accessToken);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    const data = await res.json();

    // Schedule token refresh
    if (data.accessToken) {
      scheduleTokenRefresh(data.accessToken);
    }

    await checkAuth();
  };

  const logout = async () => {
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
