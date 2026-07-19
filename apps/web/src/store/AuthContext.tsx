import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Room } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  room: Room | null;
  token: string | null;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, role: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  notifications: any[];
  markNotificationRead: (id: string) => void;
  triggerSOSAlert: (location: string, notes: string) => Promise<void>;
  addNotification: (title: string, body: string, type: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Check local storage for session
    const savedToken = localStorage.getItem('hh_token');
    const savedUser = localStorage.getItem('hh_user');
    const savedRoom = localStorage.getItem('hh_room');
    const savedTheme = localStorage.getItem('hh_theme') as 'light' | 'dark';

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark'); // Default to dark mode
    }

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedRoom) setRoom(JSON.parse(savedRoom));
      api.setToken(savedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      // Sync notifications periodically or initially
      api.getNotifications().then(res => {
        if (res.success) setNotifications(res.data);
      });
    }
  }, [user]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('hh_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const login = async (email: string, role: string): Promise<boolean> => {
    setLoading(true);
    const res = await api.login(email, role);
    if (res.success && res.data) {
      const { token: jwtToken, user: userData, room: roomData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      setRoom(roomData || null);
      localStorage.setItem('hh_token', jwtToken);
      localStorage.setItem('hh_user', JSON.stringify(userData));
      if (roomData) localStorage.setItem('hh_room', JSON.stringify(roomData));
      api.setToken(jwtToken);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRoom(null);
    setNotifications([]);
    localStorage.removeItem('hh_token');
    localStorage.removeItem('hh_user');
    localStorage.removeItem('hh_room');
    api.setToken(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem('hh_user', JSON.stringify(updated));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const addNotification = (title: string, body: string, type: string) => {
    setNotifications(prev => [
      {
        id: `notif-client-${Date.now()}`,
        title,
        body,
        type,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const triggerSOSAlert = async (location: string, notes: string) => {
    await api.triggerSOS({ location, notes });
    addNotification('🚨 Emergency SOS Triggered', 'Your emergency alert has been broadcast to all warden and security channels.', 'SOS');
  };

  return (
    <AuthContext.Provider value={{
      user,
      room,
      token,
      loading,
      theme,
      toggleTheme,
      login,
      logout,
      updateUser,
      notifications,
      markNotificationRead,
      triggerSOSAlert,
      addNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
