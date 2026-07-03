'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { TurnstileField, isTurnstileEnabledClient } from '@/components/security/turnstile-field';

export function SalesInquiryForm({
  type = 'general',
  compact = false,
}: {
  type?: 'enterprise' | 'demo' | 'general';
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = isTurnstileEnabledClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (turnstileRequired && !turnstileToken) {
      toast.error(t('auth.captchaRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, email, company, phone, message, turnstileToken }),
      });
      let data: { error?: string; ok?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        const code = data?.error ?? 'server_error';
        const key = `salesForm.errors.${code}`;
        const translated = t(key);
        toast.error(translated !== key ? translated : t('salesForm.error'));
        return;
      }
      toast.success(t('salesForm.success'));
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setMessage('');
    } catch {
      toast.error(t('salesForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
      <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="space-y-2">
          <Label htmlFor="inq-name">{t('common.name')}</Label>
          <Input id="inq-name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-email">{t('common.email')}</Label>
          <Input
            id="inq-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-company">{t('salesForm.company')}</Label>
          <Input id="inq-company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-phone">{t('salesForm.phone')}</Label>
          <Input id="inq-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inq-message">{t('salesForm.message')}</Label>
        <Textarea
          id="inq-message"
          required
          rows={compact ? 4 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t(`salesForm.placeholder.${type}`)}
        />
      </div>
      <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        {t(`salesForm.submit.${type}`)}
      </Button>
    </form>
  );
}
