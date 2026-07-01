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
import { assertOAuthSignInAllowed, assertPasswordLoginAllowed, isEmailDomainAllowed, parseAllowedDomains } from '@/lib/workspace-sso';
import { verifySamlSignInToken } from '@/lib/saml-auth';
import { decryptTotpSecret, verifyTotpCode } from '@/lib/totp';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      verifyToken: { label: 'Verify Token', type: 'text' },
      totpCode: { label: 'TOTP Code', type: 'text' },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        throw new Error('email_required');
      }

      const email = credentials.email.toLowerCase();

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
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session && typeof session === 'object' && 'mfaVerified' in session) {
        token.mfaVerified = Boolean((session as { mfaVerified?: boolean }).mfaVerified);
      }

      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string })?.role ?? 'user';
        const explicitMfa = (user as { mfaVerified?: boolean }).mfaVerified;
        if (explicitMfa === true) {
          token.mfaVerified = true;
        } else if (account?.provider && account.provider !== 'credentials') {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { totpEnabled: true },
          });
          token.mfaVerified = !dbUser?.totpEnabled;
          await ensurePersonalWorkspace(user.id);
        } else {
          token.mfaVerified = explicitMfa ?? true;
        }
      }
      return token;
    },
    async session({ session, token }) {
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
      } catch (err) {
        console.error('[auth] referral createUser', err);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
