'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SalesInquiryFormState } from '@/hooks/use-sales-inquiry-form';

export function SalesInquiryContactFields({
  form,
  compact,
}: {
  form: SalesInquiryFormState;
  compact?: boolean;
}) {
  const {
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
  } = form;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inq-name">{t('common.name')}</Label>
          <Input
            id="inq-name"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-email">{t('common.email')}</Label>
          <Input
            id="inq-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-company">{t('salesForm.company')}</Label>
          <Input
            id="inq-company"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-phone">{t('salesForm.phone')}</Label>
          <Input
            id="inq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inq-message">{t('salesForm.message')}</Label>
        <Textarea
          id="inq-message"
          name="message"
          required
          aria-required="true"
          rows={compact ? 4 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t(`salesForm.placeholder.${type}`)}
        />
      </div>
      {type === 'enterprise' ? (
        <fieldset className="space-y-2 rounded-lg border border-border/50 p-3">
          <legend className="px-1 text-sm font-medium">{t('salesForm.enterpriseNeedsTitle')}</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="needsSla"
              checked={needsSla}
              onChange={(e) => setNeedsSla(e.target.checked)}
              className="rounded border-border"
            />
            {t('salesForm.needsSla')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="needsCsm"
              checked={needsCsm}
              onChange={(e) => setNeedsCsm(e.target.checked)}
              className="rounded border-border"
            />
            {t('salesForm.needsCsm')}
          </label>
        </fieldset>
      ) : null}
    </>
  );
}
