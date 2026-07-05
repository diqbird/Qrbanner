'use client';

import { Button } from '@/components/ui/button';
import { TurnstileField } from '@/components/security/turnstile-field';
import { useSalesInquiryForm } from '@/hooks/use-sales-inquiry-form';
import { SalesInquiryContactFields } from './sales-inquiry-contact-fields';

export function SalesInquiryForm({
  type = 'general',
  compact = false,
}: {
  type?: 'enterprise' | 'demo' | 'general';
  compact?: boolean;
}) {
  const form = useSalesInquiryForm(type);

  return (
    <form onSubmit={form.handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
      <SalesInquiryContactFields form={form} compact={compact} />
      <TurnstileField onToken={form.setTurnstileToken} className="flex justify-center py-1" />
      <Button type="submit" loading={form.loading} className="w-full sm:w-auto">
        {form.t(`salesForm.submit.${type}`)}
      </Button>
    </form>
  );
}
