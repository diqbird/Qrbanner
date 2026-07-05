'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail } from 'lucide-react';
import type { SignupFormState } from '@/hooks/use-signup-form';

export function SignupFormIdentityFields({ form }: { form: SignupFormState }) {
  const { t, name, setName, email, setEmail } = form;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t('auth.fullName')}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            placeholder={t('common.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('common.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('common.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>
    </>
  );
}
