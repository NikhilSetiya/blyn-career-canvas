
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  signIn: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await refreshUserProfile();
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        setTimeout(() => {
          refreshUserProfile();
        }, 0);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error in refreshUserProfile:', error);
    }
  };

  const signIn = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Authentication error:', error);
        toast({
          title: 'Authentication error',
          description: error.message,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      toast({
        title: 'Signed out successfully'
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile, 
      isLoading, 
      signIn, 
      signOut,
      refreshUserProfile
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
