import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type CookieOptions = {
  name: string;
  value: string;
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// Create a cookie string that can be used in Set-Cookie header
export const createCookieString = (name: string, value: string, options: Omit<CookieOptions, 'name' | 'value'> = {}) => {
  const defaults = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  const opts = { ...defaults, ...options };
  
  let cookie = `${name}=${value}`;
  
  if (opts.path) cookie += `; Path=${opts.path}`;
  if (opts.maxAge !== undefined) cookie += `; Max-Age=${opts.maxAge}`;
  if (opts.httpOnly) cookie += '; HttpOnly';
  if (opts.secure) cookie += '; Secure';
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
  
  return cookie;
};

export const createAuthCookies = (response: NextResponse, tokens: { accessToken: string; refreshToken: string }) => {
  // Set access token cookie
  const accessTokenCookie = createCookieString('sb-access-token', tokens.accessToken, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  
  // Set refresh token cookie
  const refreshTokenCookie = createCookieString('sb-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Set the cookies in the response headers
  response.headers.append('Set-Cookie', accessTokenCookie);
  response.headers.append('Set-Cookie', refreshTokenCookie);

  return response;
};

export const clearAuthCookies = (response: NextResponse) => {
  // Clear auth cookies by setting maxAge to 0
  const clearAccessToken = createCookieString('sb-access-token', '', { maxAge: 0 });
  const clearRefreshToken = createCookieString('sb-refresh-token', '', { maxAge: 0 });
  
  // Set the cookies in the response headers
  response.headers.append('Set-Cookie', clearAccessToken);
  response.headers.append('Set-Cookie', clearRefreshToken);

  return response;
};

// Note: In Next.js 14, cookies() is async in Server Components and Route Handlers
export const getCookie = async (name: string): Promise<string | undefined> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return undefined;
  }
};
