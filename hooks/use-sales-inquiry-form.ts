'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { isTurnstileEnabledClient } from '@/components/security/turnstile-field';
import { trackGenerateLead } from '@/lib/site-analytics';

export function useSalesInquiryForm(type: 'enterprise' | 'demo' | 'general' = 'general') {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [needsSla, setNeedsSla] = useState(false);
  const [needsCsm, setNeedsCsm] = useState(false);
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
          type,
          name,
          email,
          company,
          phone,
          message,
          needsSla: type === 'enterprise' ? needsSla : false,
          needsCsm: type === 'enterprise' ? needsCsm : false,
          turnstileToken,
        }),
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
      trackGenerateLead(type);
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setMessage('');
      setNeedsSla(false);
      setNeedsCsm(false);
    } catch {
      toast.error(t('salesForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    type,
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    phone,
    setPhone,
    message,
    setMessage,
    needsSla,
    setNeedsSla,
    needsCsm,
    setNeedsCsm,
    loading,
    setTurnstileToken,
    handleSubmit,
  };
}

export type SalesInquiryFormState = ReturnType<typeof useSalesInquiryForm>;
