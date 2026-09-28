import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEMO_USER } from '../data/demoData';
import { apiRequest, LocalDB } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginDemoFarmer: () => void;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('agrisense_token');
    const savedUser = localStorage.getItem('agrisense_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user session', e);
      }
    } else {
      // Default to demo farmer for seamless out-of-the-box exploration
      setUser(DEMO_USER);
      setToken('demo-farmer-token');
      localStorage.setItem('agrisense_token', 'demo-farmer-token');
      localStorage.setItem('agrisense_user', JSON.stringify(DEMO_USER));
    }
    setIsLoading(false);
  }, []);

  const loginDemoFarmer = () => {
    setUser(DEMO_USER);
    setToken('demo-farmer-token');
    localStorage.setItem('agrisense_token', 'demo-farmer-token');
    localStorage.setItem('agrisense_user', JSON.stringify(DEMO_USER));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiRequest<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('agrisense_token', res.data.token);
        localStorage.setItem('agrisense_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      // Offline fallback login
      loginDemoFarmer();
      return { success: true };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiRequest<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('agrisense_token', res.data.token);
        localStorage.setItem('agrisense_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      // Offline fallback: create local user
      const newUser: User = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location || 'Tamil Nadu',
        language: userData.language || 'en',
        main_crop: userData.main_crop || 'Tomato',
        created_at: new Date().toISOString()
      };
      setUser(newUser);
      setToken('local-user-token');
      localStorage.setItem('agrisense_token', 'local-user-token');
      localStorage.setItem('agrisense_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrisense_token');
    localStorage.removeItem('agrisense_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...data };
    setUser(updated);
    LocalDB.saveUser(updated);
    localStorage.setItem('agrisense_user', JSON.stringify(updated));

    try {
      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (e) {
      // offline fallback handled above
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemoFarmer,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
