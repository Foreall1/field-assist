'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/infrastructure/supabase/client';
import type { Profile, ProfileUpdate } from '@/infrastructure/supabase/types';

/**
 * User preferences stored locally
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: 'nl' | 'en';
}

/**
 * Auth state
 */
interface AuthState {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  preferences: UserPreferences;
}

/**
 * Auth context value
 */
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    profileData: { name: string; role?: string; organization?: string }
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<{ error: Error | null }>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  refreshSession: () => Promise<void>;
  completeOnboarding: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  notifications: true,
  language: 'nl',
};

const PREFERENCES_KEY = 'field-assist-preferences';

/**
 * Load preferences from localStorage
 */
function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save preferences to localStorage
 */
function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Auth Provider component
 *
 * Provides authentication state and methods to the entire application.
 * Handles session management, profile loading, and auth state changes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    preferences: DEFAULT_PREFERENCES,
  });

  // Create supabase client once
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  /**
   * Load user profile from database
   */
  const loadProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Failed to load profile:', error.message);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error loading profile:', error);
        return null;
      }
    },
    [supabase]
  );

  /**
   * Update state with user data
   */
  const setAuthenticatedState = useCallback(
    async (session: Session) => {
      const profile = await loadProfile(session.user.id);

      setState((prev) => ({
        ...prev,
        user: session.user,
        profile,
        session,
        isLoading: false,
        isAuthenticated: true,
      }));
    },
    [loadProfile]
  );

  /**
   * Clear auth state
   */
  const clearAuthState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    }));
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    let mounted = true;

    // Load preferences immediately
    const prefs = loadPreferences();
    setState((prev) => ({ ...prev, preferences: prefs }));

    // Subscribe to auth state changes FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session) {
            await setAuthenticatedState(session);
          }
          break;

        case 'SIGNED_OUT':
          clearAuthState();
          break;

        case 'USER_UPDATED':
          if (session) {
            // Reload profile on user update
            const profile = await loadProfile(session.user.id);
            setState((prev) => ({
              ...prev,
              user: session.user,
              profile,
              session,
            }));
          }
          break;

        case 'INITIAL_SESSION':
          // Initial session is handled by getSession below
          break;

        default:
          // For other events, just update session
          if (session) {
            setState((prev) => ({
              ...prev,
              session,
              user: session.user,
            }));
          }
      }
    });

    // THEN get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error.message);
          clearAuthState();
          return;
        }

        if (session) {
          await setAuthenticatedState(session);
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        if (!mounted) return;

        // Ignore AbortError (happens on fast unmount)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Error initializing auth:', error);
        clearAuthState();
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile, setAuthenticatedState, clearAuthState]);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase]
  );

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      profileData: { name: string; role?: string; organization?: string }
    ) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              name: profileData.name,
            },
          },
        });

        if (error) {
          return { error };
        }

        // Create profile if user was created
        // Note: In production, this should be handled by a database trigger
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            name: profileData.name,
            role: profileData.role || 'vergunningverlener',
            organization: profileData.organization || null,
            onboarding_complete: false,
          });

          if (profileError) {
            console.error('Error creating profile:', profileError.message);
            // Don't return error - user is created, profile creation can be retried
          }
        }

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase]
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearAuthState();
  }, [supabase, clearAuthState]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!state.user) {
        return { error: new Error('Niet ingelogd') };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', state.user.id);

        if (error) {
          return { error };
        }

        // Update local state
        setState((prev) => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, ...updates } : null,
        }));

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase, state.user]
  );

  /**
   * Update local preferences
   */
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setState((prev) => {
      const newPreferences = { ...prev.preferences, ...updates };
      savePreferences(newPreferences);
      return { ...prev, preferences: newPreferences };
    });
  }, []);

  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    if (session) {
      setState((prev) => ({
        ...prev,
        session,
        user: session.user,
      }));
    }
  }, [supabase]);

  /**
   * Complete onboarding
   */
  const completeOnboarding = useCallback(async () => {
    if (!state.user) {
      return { error: new Error('Niet ingelogd') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', state.user.id);

      if (error) {
        return { error };
      }

      setState((prev) => ({
        ...prev,
        profile: prev.profile
          ? { ...prev.profile, onboarding_complete: true }
          : null,
      }));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [supabase, state.user]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updatePreferences,
      refreshSession,
      completeOnboarding,
    }),
    [
      state,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updatePreferences,
      refreshSession,
      completeOnboarding,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 *
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to check if user is authenticated
 * Returns early without throwing if not in AuthProvider
 */
export function useIsAuthenticated(): boolean {
  const context = useContext(AuthContext);
  return context?.isAuthenticated ?? false;
}

/**
 * Hook to get current user profile
 */
export function useProfile(): Profile | null {
  const { profile } = useAuth();
  return profile;
}

/**
 * Hook to get user preferences
 */
export function usePreferences(): UserPreferences {
  const { preferences } = useAuth();
  return preferences;
}
