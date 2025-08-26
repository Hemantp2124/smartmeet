import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../lib/db';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

// Token expiration times (in seconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

// Interface for refresh token response
interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

// Extend the JWT type to include our custom fields
type JWT = {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  [key: string]: any; // Allow other properties
};

// Hash password with scrypt
const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return `${salt}.${hash.toString('hex')}`;
};

// Compare password with hash
const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  if (!hashedPassword) return false;
  
  const [salt, storedHash] = hashedPassword.split('.');
  if (!salt || !storedHash) return false;
  
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return hash.toString('hex') === storedHash;
};

// Token expiration times (in seconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',  // Use JWT for session management
    maxAge: ACCESS_TOKEN_EXPIRY, // Session expires when access token expires
  },
  pages: {
    signIn: '/auth/login',  // Custom sign-in page
    error: '/auth/error',   // Error page
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        // Use type assertion to include password field
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        }) as { id: string; email: string; name: string | null; image: string | null; password: string | null } | null;

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValid = await comparePasswords(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Return user data without the password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        if (token.accessToken) {
          // @ts-ignore - We're extending the session type
          session.accessToken = token.accessToken as string;
        }
        if (token.error) {
          // @ts-ignore - We're extending the session type
          session.error = token.error as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Get the refresh token from the account (only available on sign in)
        const refreshToken = account.refresh_token;
        const accessTokenExpires = account.expires_at 
          ? account.expires_at * 1000 
          : Date.now() + ACCESS_TOKEN_EXPIRY * 1000;
        
        // Store refresh token in the database if it's a credentials provider
        if (account.provider === 'credentials' && refreshToken) {
          await prisma.account.updateMany({
            where: { userId: user.id, provider: 'credentials' },
            data: {
              refresh_token: refreshToken,
              expires_at: Math.floor(accessTokenExpires / 1000),
            },
          });
        }

        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires,
          refreshToken,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
  },
  events: {
    async signOut({ token }) {
      // Remove refresh token on sign out
      if (token.sub) {
        await prisma.account.updateMany({
          where: { userId: token.sub },
          data: { refresh_token: null },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    // Get the refresh token from the database
    const account = await prisma.account.findFirst({
      where: { userId: token.sub },
    });

    if (!account?.refresh_token) {
      throw new Error('No refresh token available');
    }

    // Refresh the access token using the refresh token
    // This is a simplified example - you'll need to implement the actual token refresh
    // logic based on your authentication provider
    const refreshedTokens = await refreshToken(account.refresh_token);

    if (!refreshedTokens) {
      throw new Error('Failed to refresh token');
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

// This is a placeholder - implement based on your auth provider
async function refreshToken(refreshToken: string) {
  // Implement token refresh logic here
  // This will depend on your authentication provider
  // Return an object with: { access_token, expires_in, refresh_token? }
  throw new Error('refreshToken function not implemented');
}
