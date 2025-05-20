import { createClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '../hooks/use-toast';

// Initialize Supabase client
const supabaseUrl = 'https://spifocdejillzfsksudg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaWZvY2RlamlsbHpmc2tzdWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjk2NTUsImV4cCI6MjA2MzIwNTY1NX0.F3e1E_7b4MJNoC9aOxn3GTZMpvYb24OSb-911udhFps';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth context types
type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

// Create Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with Google
  const signIn = async () => {
    try {
      setLoading(true);
      
      // Store the current page in localStorage to redirect back after auth
      const currentPath = window.location.pathname;
      localStorage.setItem("auth_redirect", currentPath);
      
      // Use the custom domain for production or origin for development
      const customDomain = import.meta.env.VITE_SITE_URL || "https://drop.linkplaylist.xyz";
      const redirectTo = `${customDomain}/callback`;
      
      console.log("Using redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: (error as Error)?.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Sign out error",
        description: (error as Error)?.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Playlist API functions
export async function fetchPlaylistInfo(playlistUrl: string) {
  const { data, error } = await supabase.functions.invoke('fetch-playlist-info', {
    body: { playlist_url: playlistUrl },
  });

  if (error) throw error;
  return data;
}

export async function deletePlaylist(playlistId: string) {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId);

  if (error) throw error;
  return true;
}