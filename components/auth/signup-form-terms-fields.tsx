'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TurnstileField } from '@/components/security/turnstile-field';
import type { SignupFormState } from '@/hooks/use-signup-form';

export function SignupFormTermsFields({ form }: { form: SignupFormState }) {
  const { t, termsAccepted, setTermsAccepted, loading, setTurnstileToken, handleSubmit } = form;

  return (
    <>
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(v) => setTermsAccepted(v === true)}
        />
        <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
          {t('auth.termsAgree')}{' '}
          <Link href="/terms" className="text-primary hover:underline" target="_blank">
            {t('footer.terms')}
          </Link>{' '}
          {t('auth.termsAnd')}{' '}
          <Link href="/privacy" className="text-primary hover:underline" target="_blank">
            {t('footer.privacy')}
          </Link>
        </Label>
      </div>
      <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
      <Button type="submit" className="w-full" loading={loading}>
        {t('auth.createAccountBtn')}
      </Button>
    </>
  );
}
