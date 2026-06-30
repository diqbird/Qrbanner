import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { NotFoundContent } from '@/components/not-found-content';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background">
      <PublicHeader />
      <main id="main-content">
        <NotFoundContent />
      </main>
      <PublicFooter />
    </div>
  );
}
