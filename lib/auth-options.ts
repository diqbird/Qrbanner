import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { ensurePersonalWorkspace } from '@/lib/workspace';
import { resolveReferrerByCode, recordReferralSignup } from '@/lib/referral';
import { maybeStartProTrial } from '@/lib/pro-trial';
import { assertOAuthSignInAllowed, assertPasswordLoginAllowed, isEmailDomainAllowed, parseAllowedDomains } from '@/lib/workspace-sso';
import { verifySamlSignInToken } from '@/lib/saml-auth';
import { decryptTotpSecret, verifyTotpCode } from '@/lib/totp';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { verifyMfaProofToken } from '@/lib/mfa-step-up';
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit-store';
import { AUTH_LOGIN_EMAIL, AUTH_LOGIN_IP } from '@/lib/rate-limit-policies';

import { SESSION_DEFAULT_MAX_AGE_SEC, SESSION_REMEMBER_MAX_AGE_SEC } from '@/lib/session-policy';

function parseRememberMe(value: string | undefined): boolean {
  return value !== 'false' && value !== '0';
}

async function assertLoginNotRateLimited(email: string): Promise<void> {
  let ip = 'unknown';
  try {
    ip = await clientIpFromHeaders();
  } catch (err) {
    console.error('[auth] clientIpFromHeaders failed', err);
  }
  const ipResult = await checkRateLimit(
    AUTH_LOGIN_IP.key(ip),
    AUTH_LOGIN_IP.limit,
    AUTH_LOGIN_IP.windowMs
  );
  if (!ipResult.ok) throw new Error('rate_limited');

  const emailResult = await checkRateLimit(
    AUTH_LOGIN_EMAIL.key(email),
    AUTH_LOGIN_EMAIL.limit,
    AUTH_LOGIN_EMAIL.windowMs
  );
  if (!emailResult.ok) throw new Error('rate_limited');
}

/** Incomplete MFA step-up window — OAuth users must verify within this TTL. */
const MFA_PENDING_MAX_AGE = 15 * 60;

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      turnstileToken: { label: 'Turnstile', type: 'text' },
      rememberMe: { label: 'Remember me', type: 'text' },
      verifyToken: { label: 'Verify Token', type: 'text' },
      totpCode: { label: 'TOTP Code', type: 'text' },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        throw new Error('email_required');
      }

      const email = credentials.email.toLowerCase();
      console.log('[auth] credentials authorize', email);

      if (credentials.verifyToken) {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) throw new Error('server_misconfiguration');

        let payload: {
          email?: string;
          purpose?: string;
          userId?: string;
          workspaceId?: string;
        };
        try {
          payload = jwt.verify(credentials.verifyToken, secret) as {
            email?: string;
            purpose?: string;
            userId?: string;
            workspaceId?: string;
          };
        } catch {
          throw new Error('invalid_verify_session');
        }

        if (payload.purpose === 'saml-sso') {
          const samlPayload = verifySamlSignInToken(credentials.verifyToken);
          const samlUser = await prisma.user.findUnique({
            where: { id: samlPayload.userId },
          });
          if (!samlUser || samlUser.email.toLowerCase() !== email) {
            throw new Error('invalid_verify_session');
          }

          const workspace = await prisma.workspace.findUnique({
            where: { id: samlPayload.workspaceId },
            select: { ssoEnabled: true, ssoProvider: true, allowedDomains: true },
          });
          if (!workspace?.ssoEnabled || workspace.ssoProvider !== 'saml') {
            throw new Error('sso_required');
          }

          const domains = parseAllowedDomains(workspace.allowedDomains);
          if (domains.length && !isEmailDomainAllowed(samlUser.email, domains)) {
            throw new Error('domain_not_allowed');
          }

          await ensurePersonalWorkspace(samlUser.id);

          return {
            id: samlUser.id,
            email: samlUser.email,
            name: samlUser.name,
            role: samlUser.role,
            image: samlUser.image,
            mfaVerified: true,
          };
        }

        if (payload.purpose !== 'email-verified' || payload.email?.toLowerCase() !== email) {
          throw new Error('invalid_verify_session');
        }

        const verifiedUser = await prisma.user.findUnique({ where: { email } });
        if (!verifiedUser?.emailVerified) {
          throw new Error('email_not_verified');
        }

        return {
          id: verifiedUser.id,
          email: verifiedUser.email,
          name: verifiedUser.name,
          role: verifiedUser.role,
          image: verifiedUser.image,
          mfaVerified: true,
        };
      }

      if (!credentials.password) {
        throw new Error('missing_fields');
      }

      await assertLoginNotRateLimited(email);

      const turnstileOk = await verifyTurnstileToken(credentials.turnstileToken);
      if (!turnstileOk) {
        throw new Error('captcha_failed');
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          password: true,
          emailVerified: true,
          totpEnabled: true,
          totpSecret: true,
        },
      });

      if (!user) {
        throw new Error('invalid_credentials');
      }

      const ssoCheck = await assertPasswordLoginAllowed(email);
      if (!ssoCheck.ok) {
        throw new Error(ssoCheck.code);
      }

      if (!user.password) {
        throw new Error('sso_required');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new Error('invalid_credentials');
      }

      if (!user.emailVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      if (user.totpEnabled) {
        const totpCode = credentials.totpCode?.replace(/\s/g, '') ?? '';
        if (!totpCode) {
          throw new Error('mfa_required');
        }
        const secret = decryptTotpSecret(user.totpSecret);
        if (!secret || !verifyTotpCode(secret, totpCode)) {
          throw new Error('invalid_mfa_code');
        }
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        mfaVerified: true,
        rememberMe: parseRememberMe(credentials.rememberMe),
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID) {
  providers.push(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
    // Explicit session lifetime: sessions expire after 30 days of inactivity
    // and the JWT is refreshed at most once per day.
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider && account.provider !== 'credentials') {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const oauthCheck = await assertOAuthSignInAllowed(email, account.provider);
        if (!oauthCheck.ok) {
          return `/login?error=${oauthCheck.code}`;
        }

        await prisma.user.updateMany({
          where: { email, emailVerified: null },
          data: { emailVerified: new Date() },
        });

        if (user.id) {
          try {
            await maybeStartProTrial(user.id);
          } catch (err) {
            console.error('[auth] pro trial start failed', err);
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session && typeof session === 'object') {
        const proof = (session as { mfaProofToken?: string }).mfaProofToken;
        const userId = token.id as string | undefined;
        if (proof && userId && verifyMfaProofToken(proof, userId)) {
          token.mfaVerified = true;
          const rememberMe = token.rememberMe !== false;
          const maxAge = rememberMe ? SESSION_REMEMBER_MAX_AGE_SEC : SESSION_DEFAULT_MAX_AGE_SEC;
          token.exp = Math.floor(Date.now() / 1000) + maxAge;
        }
      }

      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string })?.role ?? 'user';
        const rememberMe = (user as { rememberMe?: boolean }).rememberMe !== false;
        const maxAge = rememberMe ? SESSION_REMEMBER_MAX_AGE_SEC : SESSION_DEFAULT_MAX_AGE_SEC;
        token.rememberMe = rememberMe;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
        const explicitMfa = (user as { mfaVerified?: boolean }).mfaVerified;
        if (explicitMfa === true) {
          token.mfaVerified = true;
        } else if (account?.provider && account.provider !== 'credentials') {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { totpEnabled: true, sessionVersion: true },
          });
          if (dbUser?.totpEnabled) {
            token.mfaVerified = false;
            token.exp = Math.floor(Date.now() / 1000) + MFA_PENDING_MAX_AGE;
          } else {
            token.mfaVerified = true;
          }
          token.sessionVersion = dbUser?.sessionVersion ?? 0;
          try {
            await ensurePersonalWorkspace(user.id);
          } catch (err) {
            console.error('[auth] ensurePersonalWorkspace failed', err);
          }
        } else {
          token.mfaVerified = explicitMfa ?? true;
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { sessionVersion: true },
          });
          token.sessionVersion = dbUser?.sessionVersion ?? 0;
          try {
            await ensurePersonalWorkspace(user.id);
          } catch (err) {
            console.error('[auth] ensurePersonalWorkspace failed', err);
          }
        }
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, sessionVersion: true },
        });
        if (!dbUser || (token.sessionVersion ?? 0) !== dbUser.sessionVersion) {
          token.sessionInvalid = true;
        } else {
          token.role = dbUser.role;
          token.sessionVersion = dbUser.sessionVersion;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sessionInvalid) {
        return { ...session, user: undefined, expires: '0' };
      }
      if (session?.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session as { mfaVerified?: boolean }).mfaVerified = token.mfaVerified !== false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      try {
        const cookieStore = await cookies();
        const raw = cookieStore.get('qrb_ref')?.value;
        if (!raw) return;
        const referrerId = await resolveReferrerByCode(decodeURIComponent(raw));
        if (referrerId && referrerId !== user.id) {
          await recordReferralSignup(referrerId, user.id);
        }
        cookieStore.delete('qrb_ref');
        try {
          await maybeStartProTrial(user.id);
        } catch (err) {
          console.error('[auth] pro trial createUser', err);
        }
      } catch (err) {
        console.error('[auth] referral createUser', err);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
