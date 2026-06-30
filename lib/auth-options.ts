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

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      verifyToken: { label: 'Verify Token', type: 'text' },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        throw new Error('email_required');
      }

      const email = credentials.email.toLowerCase();

      if (credentials.verifyToken) {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) throw new Error('server_misconfiguration');

        let payload: { email?: string; purpose?: string };
        try {
          payload = jwt.verify(credentials.verifyToken, secret) as {
            email?: string;
            purpose?: string;
          };
        } catch {
          throw new Error('invalid_verify_session');
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
        };
      }

      if (!credentials.password) {
        throw new Error('missing_fields');
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('invalid_credentials');
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

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
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
        await prisma.user.updateMany({
          where: { email, emailVerified: null },
          data: { emailVerified: new Date() },
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string })?.role ?? 'user';
        if (account?.provider && account.provider !== 'credentials') {
          await ensurePersonalWorkspace(user.id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
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
