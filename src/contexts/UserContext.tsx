"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences } from '@/lib/types';
import { userStorage, generateId } from '@/lib/storage';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  defaultSearchScope: [],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = userStorage.get();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: generateId('user'),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'vergunningverlener',
      organization: userData.organization || '',
      avatar: userData.avatar,
      preferences: userData.preferences || defaultPreferences,
      specializations: userData.specializations || [],
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
    };

    setUser(newUser);
    userStorage.set(newUser);
  };

  const logout = () => {
    setUser(null);
    userStorage.remove();
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    userStorage.set(updatedUser);
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
    };
    setUser(updatedUser);
    userStorage.set(updatedUser);
  };

  const completeOnboarding = () => {
    if (!user) return;

    const updatedUser = { ...user, onboardingComplete: true };
    setUser(updatedUser);
    userStorage.set(updatedUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        updatePreferences,
        completeOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
