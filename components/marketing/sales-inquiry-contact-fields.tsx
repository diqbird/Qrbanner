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
  const { t, type, name, setName, email, setEmail, company, setCompany, phone, setPhone, message, setMessage } = form;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
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
    </>
  );
}
