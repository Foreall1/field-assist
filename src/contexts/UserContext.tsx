"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/infrastructure/supabase/client';
import { User, UserPreferences, UserRole } from '@/lib/types';

interface UserContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  defaultSearchScope: [],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the modern browser client with proper cookie handling
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  // Load user profile from Supabase
  const loadUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return null;
      }

      if (profile) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = profile as any;
        const userData: User = {
          id: p.id,
          name: p.name || '',
          email: p.email || userEmail || '',
          role: (p.role as UserRole) || 'vergunningverlener',
          organization: p.organization || '',
          avatar: p.avatar_url || undefined,
          preferences: defaultPreferences,
          specializations: p.specializations || [],
          createdAt: p.created_at,
          onboardingComplete: p.onboarding_complete || false,
        };
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error('Error in loadUserProfile:', err);
    }
    return null;
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    // STAP 1: Eerst listener registreren VOOR getSession
    // Dit voorkomt race conditions waar auth events gemist worden
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        // Debug log
        console.log('Auth event:', event, 'Session:', !!currentSession);

        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await loadUserProfile(currentSession.user.id, currentSession.user.email || '');
        } else if (event === 'SIGNED_OUT') {
          // Alleen user wissen bij expliciete uitlog, niet bij null session tijdens navigatie
          setUser(null);
        }

        // Zet loading op false na ELKE auth state change
        setIsLoading(false);
      }
    );

    // STAP 2: Dan pas user ophalen met getUser() (niet getSession!)
    // getUser() valideert en refresht de sessie, getSession() leest alleen uit cookies
    const initAuth = async () => {
      try {
        // First get user (validates/refreshes token)
        const { data: { user: initialUser } } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (initialUser) {
          // Then get session for the session object
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          setSession(initialSession);
          setSupabaseUser(initialUser);
          await loadUserProfile(initialUser.id, initialUser.email || '');
        }
      } catch (err) {
        // Negeer AbortError volledig - dit is normaal gedrag bij unmount
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Auth error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create profile if user was created
      if (data.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: profileError } = await (supabase.from('profiles') as any)
          .upsert({
            id: data.user.id,
            name: userData.name,
            role: userData.role || 'vergunningverlener',
            organization: userData.organization,
            specializations: userData.specializations || [],
            onboarding_complete: false,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any)
        .update({
          name: updates.name,
          role: updates.role,
          organization: updates.organization,
          avatar_url: updates.avatar,
          specializations: updates.specializations,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setUser({ ...user, ...updates });
    } catch (err) {
      console.error('Error in updateUser:', err);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;

    // For now, store preferences locally
    // Could be stored in Supabase in a preferences column
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
    };
    setUser(updatedUser);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any)
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        return;
      }

      setUser({ ...user, onboardingComplete: true });
    } catch (err) {
      console.error('Error in completeOnboarding:', err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
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
