import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  mobile?: string;
  role: 'GUEST' | 'USER' | 'CREATOR' | 'ADMIN';
  status: string;
  profile?: {
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    bannerUrl?: string;
    isVerified?: boolean;
  };
  creatorProfile?: {
    id: string;
    handle: string;
    displayName: string;
    category: string;
    avatarUrl?: string;
    subscriberCount: number;
    grossEarningsCents: number;
    monetizationActive: boolean;
  };
  counts?: {
    followers: number;
    following: number;
    videos: number;
    likes: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickLoginAs: (role: 'ADMIN' | 'CREATOR' | 'USER') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('funflick_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const activeToken = localStorage.getItem('funflick_token');
      if (!activeToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('funflick_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('funflick_token');
    setToken(null);
    setUser(null);
  };

  const quickLoginAs = async (role: 'ADMIN' | 'CREATOR' | 'USER') => {
    setLoading(true);
    try {
      let identifier = 'alex@funflick.com';
      let password = 'password123';

      if (role === 'ADMIN') {
        identifier = 'admin@funflick.com';
        password = 'admin123';
      } else if (role === 'CREATOR') {
        identifier = 'laughlab@funflick.com';
        password = 'password123';
      }

      const res = await api.post('/auth/login', { identifier, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      console.error('Quick login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, quickLoginAs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
