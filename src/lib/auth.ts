import { cookies } from 'next/headers';
import { verifyToken, createToken } from './paseto';
import { getProvider } from './providers';
import { redirect } from 'next/navigation';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

// Define custom session type - maintaining the same structure as NextAuth
export type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    stripeCustomerId?: string;
    isActive?: boolean;
  };
};

// Auth cookie name
const AUTH_COOKIE = 'paseto-token';

// Auth function - replacement for NextAuth's auth()
export async function auth(): Promise<Session | null> {
  try {
    // Get the cookie store - handle as asynchronous in Next.js 15
    const cookieList = await cookies();
    // Use optional chaining for type safety
    const token = cookieList.get?.(AUTH_COOKIE)?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    // Check if user exists in database
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub as string));
    const user = existingUsers[0];

    if (!user) {
      return null;
    }

    return {
      user: {
        id: payload.sub as string,
        name: payload.name as string | null,
        email: payload.email as string | null,
        image: payload.picture as string | null,
        // Include additional properties if they exist in the user object
        stripeCustomerId:
          'stripeCustomerId' in user ? (user.stripeCustomerId as string | undefined) : undefined,
        isActive: 'isActive' in user ? (user.isActive as boolean | undefined) : undefined,
      },
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// SignIn function - replacement for NextAuth's signIn()
export async function signIn(
  provider: string,
  options: Record<string, unknown> = {},
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const authProvider = getProvider(provider);
    return await authProvider.signIn(options);
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// SignOut function - replacement for NextAuth's signOut()
export async function signOut(
  options: { redirectTo?: string } = {},
): Promise<{ success: boolean }> {
  // Use a try-catch to handle potential cookie API issues
  try {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, '', { maxAge: 0 });
  } catch (error) {
    console.error('Error clearing cookie:', error);
  }

  if (options.redirectTo) {
    redirect(options.redirectTo);
  }

  return { success: true };
}

// Auth middleware - replacement for NextAuth's middleware
export function authMiddleware(request: NextRequest) {
  return async (handler: (request: NextRequest) => Response | Promise<Response>) => {
    try {
      const cookieHeader = request.headers.get('cookie') || '';
      const token = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${AUTH_COOKIE}=`))
        ?.slice(AUTH_COOKIE.length + 1);

      let session = null;

      if (token) {
        const payload = await verifyToken(token);

        if (payload) {
          const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.sub as string));
          const user = existingUsers[0];

          if (user) {
            session = {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                // Include additional properties if they exist in the user object
                stripeCustomerId:
                  'stripeCustomerId' in user
                    ? (user.stripeCustomerId as string | undefined)
                    : undefined,
                isActive: 'isActive' in user ? (user.isActive as boolean | undefined) : undefined,
              },
            };
          }
        }
      }

      // Attach session to request object
      const req = new NextRequest(request.url, {
        headers: request.headers,
      });
      // Type assertion for auth property
      (req as NextRequest & { auth?: Session | null }).auth = session;

      return handler(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return handler(request);
    }
  };
}

// Handler for API routes - replacement for NextAuth's handlers
export const handlers = {
  GET: async function handleGet(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle provider callbacks
    if (path.startsWith('/api/auth/callback/')) {
      const provider = path.split('/').pop();

      if (!provider) {
        return new Response('Invalid provider', { status: 400 });
      }

      try {
        const authProvider = getProvider(provider);
        const params = Object.fromEntries(url.searchParams);
        const result = await authProvider.callback(params);

        if (!result) {
          return new Response('Authentication failed', { status: 401 });
        }

        const { token } = result;

        // Set auth cookie
        const headers = new Headers();
        headers.append(
          'Set-Cookie',
          `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
        ); // 30 days

        // Redirect to callback URL or default
        const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';
        headers.append('Location', callbackUrl);

        return new Response(null, {
          status: 302,
          headers,
        });
      } catch (error) {
        console.error('Auth callback error:', error);
        return new Response('Authentication failed', { status: 500 });
      }
    }

    // Handle session endpoint
    if (path === '/api/auth/session') {
      const cookieHeader = request.headers.get('cookie') || '';
      const token = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${AUTH_COOKIE}=`))
        ?.slice(AUTH_COOKIE.length + 1);

      if (!token) {
        return new Response(JSON.stringify({ user: null }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      try {
        const payload = await verifyToken(token);

        if (!payload) {
          return new Response(JSON.stringify({ user: null }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(
          JSON.stringify({
            user: {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
              image: payload.picture,
            },
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
      } catch (error) {
        console.error('Session error:', error);
        return new Response(JSON.stringify({ user: null }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },

  POST: async function handlePost(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle sign-in requests
    if (path === '/api/auth/signin') {
      try {
        const body = (await request.json()) as Record<string, unknown>;

        if (!body || typeof body !== 'object') {
          return new Response('Invalid request body', { status: 400 });
        }

        const provider = body.provider as string;
        const options = { ...body };
        delete options.provider;

        if (!provider) {
          return new Response('Provider is required', { status: 400 });
        }

        const authProvider = getProvider(provider);
        const result = await authProvider.signIn(options);

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Sign-in error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Authentication failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle sign-out requests
    if (path === '/api/auth/signout') {
      const headers = new Headers();
      headers.append('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

// Exports to maintain the same API as NextAuth
export const GET = handlers.GET;
export const POST = handlers.POST;
