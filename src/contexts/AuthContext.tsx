import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database
const USERS_KEY = 'virtual_consultation_users';
const CURRENT_USER_KEY = 'virtual_consultation_current_user';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    
    const userSession: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      avatar: foundUser.avatar
    };
    
    setUser(userSession);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      setIsLoading(false);
      throw new Error('Email này đã được sử dụng');
    }
    
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const userSession: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar
    };
    
    setUser(userSession);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('Không tìm thấy tài khoản với email này');
    }
    
    // In a real app, this would send an email
    // For demo purposes, we'll just show a success message
    console.log(`Password reset email sent to ${email}`);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}