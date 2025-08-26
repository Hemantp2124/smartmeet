import { NextResponse } from 'next/server';

export async function GET() {
  // Return the list of supported OAuth providers
  return NextResponse.json({
    providers: {
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: 'openid email profile',
          },
        },
      },
      github: {
        id: 'github',
        name: 'GitHub',
        type: 'oauth',
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        authorization: {
          url: 'https://github.com/login/oauth/authorize',
          params: { scope: 'read:user user:email' },
        },
        token: 'https://github.com/login/oauth/access_token',
        userinfo: {
          url: 'https://api.github.com/user',
          async request({ tokens, provider }: { tokens: { access_token: string }, provider: any }) {
            const profile = await fetch(provider.userinfo?.url as string, {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'User-Agent': 'authjs',
              },
            }).then(async (res) => await res.json());

            if (profile.email === null) {
              // If the user does not have a public email, get their primary email from the GitHub API
              const res = await fetch('https://api.github.com/user/emails', {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                  'User-Agent': 'authjs',
                },
              });
              
              if (res.ok) {
                const emails = await res.json();
                const primaryEmail = emails.find((email: any) => email.primary) ?? emails[0];
                profile.email = primaryEmail.email;
              }
            }

            return profile;
          },
        },
        profile(profile: any) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
          };
        },
      },
    },
  });
}
