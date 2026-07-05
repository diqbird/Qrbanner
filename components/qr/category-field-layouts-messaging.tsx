'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryUrlField, CategoryUsernameField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function WhatsappLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.whatsappNumber')}</Label>
        <Input
          placeholder={t('fields.phonePlaceholder')}
          value={data?.phone ?? ''}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.whatsappNumberHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.whatsappMessage')}</Label>
        <Textarea
          value={data?.message ?? ''}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder={t('fields.whatsappMessagePlaceholder')}
        />
      </div>
    </div>
  );
}

export function TelegramLayout(props: CategoryFieldPrimitiveProps) {
  const { t } = props;
  return (
    <CategoryUsernameField
      data={props.data}
      updateField={props.updateField}
      label={t('fields.telegramUsername')}
      placeholder={t('fields.usernameExample')}
      hint={t('fields.telegramHint')}
    />
  );
}

export function DiscordLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.discordInvite')}</Label>
      <Input
        placeholder={t('fields.discordInvitePlaceholder')}
        value={data?.inviteCode ?? ''}
        onChange={(e) => updateField('inviteCode', e.target.value)}
      />
      <p className="text-xs text-muted-foreground">{t('fields.discordHint')}</p>
    </div>
  );
}

export function EmailLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.yourEmail')}</Label>
        <Input value={data?.email ?? ''} onChange={(e) => updateField('email', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.subjectLine')}</Label>
        <Input
          value={data?.subject ?? ''}
          onChange={(e) => updateField('subject', e.target.value)}
          placeholder={t('fields.subjectPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.messageBody')}</Label>
        <Textarea value={data?.body ?? ''} onChange={(e) => updateField('body', e.target.value)} />
      </div>
    </div>
  );
}

export function SmsLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.phoneNumber')}</Label>
        <Input
          value={data?.phone ?? ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder={t('fields.phonePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.prewrittenMessage')}</Label>
        <Textarea value={data?.message ?? ''} onChange={(e) => updateField('message', e.target.value)} />
      </div>
    </div>
  );
}

export function PhoneLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.phoneNumber')}</Label>
      <Input
        value={data?.phone ?? ''}
        onChange={(e) => updateField('phone', e.target.value)}
        placeholder={t('fields.phonePlaceholder')}
      />
    </div>
  );
}

export function SignalLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.signalPhone')}</Label>
        <Input
          placeholder={t('fields.phonePlaceholder')}
          value={data?.phone ?? ''}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.signalPhoneHint')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.signalUrlPlaceholder')}
        label={t('fields.urlLabel.signal')}
      />
    </div>
  );
}
