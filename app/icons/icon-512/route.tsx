import { renderBrandIcon } from '@/lib/brand-icon';

export const runtime = 'edge';

export async function GET() {
  return renderBrandIcon(512);
}
