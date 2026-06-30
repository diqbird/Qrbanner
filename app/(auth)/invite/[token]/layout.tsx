import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Team Invite',
  description: 'Accept a QRbanner team workspace invitation.',
  path: '/invite',
  noIndex: true,
});

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
