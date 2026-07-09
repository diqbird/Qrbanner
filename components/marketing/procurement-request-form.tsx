'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TurnstileField,
  isTurnstileEnabledClient,
} from '@/components/security/turnstile-field';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  PROCUREMENT_INQUIRY_TYPES,
  type ProcurementInquiryType,
} from '@/lib/inquiry-types';

export function ProcurementRequestForm() {
  const { t } = useLanguage();
  const [requestType, setRequestType] = useState<ProcurementInquiryType>('security_questionnaire');
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
        body: JSON.stringify({
          type: requestType,
          name,
          email,
          company,
          phone,
          message,
          turnstileToken,
        }),
      });
      let data: { error?: string } = {};
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
      toast.success(t('procurementRequest.success'));
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setMessage('');
      setRequestType('security_questionnaire');
    } catch {
      toast.error(t('salesForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="proc-type">{t('procurementRequest.requestType')}</Label>
        <Select
          value={requestType}
          onValueChange={(v) => setRequestType(v as ProcurementInquiryType)}
        >
          <SelectTrigger id="proc-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROCUREMENT_INQUIRY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`procurementRequest.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t(`procurementRequest.typeHints.${requestType}`)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="proc-name">{t('common.name')}</Label>
          <Input id="proc-name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proc-email">{t('common.email')}</Label>
          <Input
            id="proc-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proc-company">{t('salesForm.company')}</Label>
          <Input id="proc-company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proc-phone">{t('salesForm.phone')}</Label>
          <Input id="proc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proc-message">{t('salesForm.message')}</Label>
        <Textarea
          id="proc-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('procurementRequest.messagePlaceholder')}
        />
      </div>

      <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        {t('procurementRequest.submit')}
      </Button>
    </form>
  );
}
