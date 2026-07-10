import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    mfaVerified?: boolean;
    pendingSignUp?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    mfaVerified?: boolean;
    id?: string;
    role?: string;
    pendingSignUp?: string;
  }
}
