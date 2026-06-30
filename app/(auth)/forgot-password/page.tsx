import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Forgot Password',
  description: 'Reset your QRbanner account password.',
  path: '/forgot-password',
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
