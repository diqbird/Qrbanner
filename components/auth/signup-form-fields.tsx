'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthMeter } from './password-strength-meter';
import { TurnstileField } from '@/components/security/turnstile-field';
import type { SignupFormState } from '@/hooks/use-signup-form';

export function SignupFormFields({ form }: { form: SignupFormState }) {
  const {
    t,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    termsAccepted,
    setTermsAccepted,
    loading,
    setTurnstileToken,
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-2">
        <Label htmlFor="password">{t('common.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrengthMeter password={password} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>
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
    </form>
  );
}
