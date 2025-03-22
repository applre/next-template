'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  stripeCustomerId?: string;
  isActive?: boolean;
}

export interface Session {
  user?: User;
}

interface SignInOptions {
  email?: string;
  redirectTo?: string;
  redirect?: boolean;
  callbackUrl?: string;
}

interface SignOutOptions {
  redirectTo?: string;
}

interface AuthResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface AuthContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (provider: string, options?: SignInOptions) => Promise<AuthResult>;
  signOut: (options?: SignOutOptions) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  status: 'loading',
  signIn: async () => ({ success: false }),
  signOut: async () => ({ success: false }),
});

export const useSession = () => useContext(AuthContext);

export function AuthProvider({
  children,
  initialSession,
}: { children: ReactNode; initialSession?: Session }) {
  const [session, setSession] = useState<Session | null>(initialSession || null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    initialSession ? 'authenticated' : 'loading',
  );
  const router = useRouter();

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
      setStatus('authenticated');
    } else {
      // Check session status
      fetch('/api/auth/session')
        .then((res) => res.json())
        .then((data: unknown) => {
          const sessionData = data as { user?: User };
          if (sessionData?.user) {
            setSession({ user: sessionData.user });
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        })
        .catch(() => {
          setSession(null);
          setStatus('unauthenticated');
        });
    }
  }, [initialSession]);

  const signIn = async (provider: string, options: SignInOptions = {}): Promise<AuthResult> => {
    try {
      // Server action will be called here
      const result = (await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...options }),
      }).then((res) => res.json())) as AuthResult;

      if (result.url) {
        router.push(result.url);
      }

      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: String(error) };
    }
  };

  const signOut = async (options: SignOutOptions = {}): Promise<AuthResult> => {
    try {
      // Server action will be called here
      await fetch('/api/auth/signout', {
        method: 'POST',
      });

      setSession(null);
      setStatus('unauthenticated');

      if (options.redirectTo) {
        router.push(options.redirectTo);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: String(error) };
    }
  };

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
