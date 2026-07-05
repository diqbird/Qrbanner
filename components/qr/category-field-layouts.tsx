'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryUrlField, CategoryUsernameField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function UrlLayout({ category, data, updateField, t }: CategoryFieldPrimitiveProps) {
  return <CategoryUrlField category={category} data={data} updateField={updateField} t={t} />;
}

export function UrlLabeledLayout({ category, config, data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <CategoryUrlField
      category={category}
      data={data}
      updateField={updateField}
      t={t}
      placeholder={config.urlPlaceholderKey ? t(`fields.${config.urlPlaceholderKey}`) : undefined}
      label={config.urlLabelKey ? t(`fields.urlLabel.${config.urlLabelKey}`) : undefined}
    />
  );
}

export function TextLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.textMessage')}</Label>
      <Textarea
        rows={4}
        value={data?.text ?? ''}
        onChange={(e) => updateField('text', e.target.value)}
        placeholder={t('fields.textPlaceholder')}
      />
    </div>
  );
}

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

export function SocialProfileLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.username')}
        placeholder={t('fields.usernameExample')}
        hint={t('fields.usernameHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.urlPlaceholder')}
        label={t('fields.urlLabel.profileUrl')}
      />
    </div>
  );
}

export function YoutubeLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.channelName')}
        placeholder={t('fields.channelExample')}
        hint={t('fields.usernameHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orYoutubeUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.youtubeUrlPlaceholder')}
        label={t('fields.urlLabel.youtubeUrl')}
      />
    </div>
  );
}

export function SpotifyLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.spotifyUrlPlaceholder')}
        label={t('fields.urlLabel.spotifyLink')}
      />
      <div className="space-y-2">
        <Label>{t('fields.spotifyAdvanced')}</Label>
        <Input
          placeholder={t('fields.spotifyUriPlaceholder')}
          value={data?.uri ?? ''}
          onChange={(e) => updateField('uri', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.spotifyUriHint')}</p>
      </div>
    </div>
  );
}

export function ZoomLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.meetingId')}</Label>
        <Input
          placeholder={t('fields.meetingIdPlaceholder')}
          value={data?.meetingId ?? ''}
          onChange={(e) => updateField('meetingId', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.meetingPassword')}</Label>
        <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
      </div>
    </div>
  );
}

export function GoogleMeetLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.meetingCode')}</Label>
      <Input
        placeholder={t('fields.meetingCodePlaceholder')}
        value={data?.meetingCode ?? ''}
        onChange={(e) => updateField('meetingCode', e.target.value)}
      />
      <p className="text-xs text-muted-foreground">{t('fields.googleMeetHint')}</p>
    </div>
  );
}

export function LocationLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.latitude')}</Label>
          <Input
            type="number"
            step="any"
            placeholder={t('fields.latPlaceholder')}
            value={data?.latitude ?? ''}
            onChange={(e) => updateField('latitude', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.longitude')}</Label>
          <Input
            type="number"
            step="any"
            placeholder={t('fields.lngPlaceholder')}
            value={data?.longitude ?? ''}
            onChange={(e) => updateField('longitude', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.placeName')}</Label>
        <Input
          placeholder={t('fields.placeNamePlaceholder')}
          value={data?.label ?? ''}
          onChange={(e) => updateField('label', e.target.value)}
        />
      </div>
    </div>
  );
}

export function CryptoLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.cryptocurrency')}</Label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data?.coin ?? 'btc'}
          onChange={(e) => updateField('coin', e.target.value)}
        >
          <option value="btc">{t('fields.coinBtc')}</option>
          <option value="eth">{t('fields.coinEth')}</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.walletAddress')}</Label>
        <Input
          value={data?.address ?? ''}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder={t('fields.walletPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.suggestedAmount')}</Label>
        <Input
          placeholder={t('fields.amountPlaceholder')}
          value={data?.amount ?? ''}
          onChange={(e) => updateField('amount', e.target.value)}
        />
      </div>
    </div>
  );
}

export function VcardLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.firstName')}</Label>
          <Input value={data?.firstName ?? ''} onChange={(e) => updateField('firstName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.lastName')}</Label>
          <Input value={data?.lastName ?? ''} onChange={(e) => updateField('lastName', e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.jobTitle')}</Label>
        <Input
          value={data?.title ?? ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t('fields.jobTitlePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.companyName')}</Label>
        <Input value={data?.org ?? ''} onChange={(e) => updateField('org', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.phone')}</Label>
        <Input
          value={data?.phone ?? ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder={t('fields.phonePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.yourEmail')}</Label>
        <Input value={data?.email ?? ''} onChange={(e) => updateField('email', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.website')}</Label>
        <Input
          value={data?.website ?? ''}
          onChange={(e) => updateField('website', e.target.value)}
          placeholder={t('fields.websitePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.addressOptional')}</Label>
        <Textarea
          value={data?.address ?? ''}
          onChange={(e) => updateField('address', e.target.value)}
          rows={2}
          placeholder={t('fields.addressPlaceholder')}
        />
      </div>
    </div>
  );
}

export function WifiLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.wifiName')}</Label>
        <Input
          value={data?.ssid ?? ''}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder={t('fields.wifiSsidPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.wifiPassword')}</Label>
        <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.securityType')}</Label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data?.encryption ?? 'WPA'}
          onChange={(e) => updateField('encryption', e.target.value)}
        >
          <option value="WPA">{t('fields.wifiWpa')}</option>
          <option value="WEP">{t('fields.wifiWep')}</option>
          <option value="nopass">{t('fields.wifiOpen')}</option>
        </select>
      </div>
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

export function EventLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.eventName')}</Label>
        <Input
          value={data?.title ?? ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t('fields.eventNamePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.eventLocation')}</Label>
        <Input
          value={data?.location ?? ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder={t('fields.eventLocationPlaceholder')}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.starts')}</Label>
          <Input
            type="datetime-local"
            value={data?.startDate ?? ''}
            onChange={(e) => updateField('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.ends')}</Label>
          <Input
            type="datetime-local"
            value={data?.endDate ?? ''}
            onChange={(e) => updateField('endDate', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.descriptionOptional')}</Label>
        <Textarea value={data?.description ?? ''} onChange={(e) => updateField('description', e.target.value)} />
      </div>
    </div>
  );
}

export function GoogleReviewLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.googlePlaceId')}</Label>
        <Input
          placeholder={t('fields.googlePlaceIdPlaceholder')}
          value={data?.placeId ?? ''}
          onChange={(e) => updateField('placeId', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.googlePlaceIdHint')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.googleReviewUrlPlaceholder')}
        label={t('fields.urlLabel.googleReview')}
      />
    </div>
  );
}

export function PaypalLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.paypalUsername')}
        placeholder={t('fields.paypalUsernamePlaceholder')}
        hint={t('fields.paypalHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.paypalUrlPlaceholder')}
        label={t('fields.urlLabel.paypal')}
      />
    </div>
  );
}

export function UpiLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.upiId')}</Label>
        <Input
          placeholder={t('fields.upiIdPlaceholder')}
          value={data?.vpa ?? ''}
          onChange={(e) => updateField('vpa', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.upiPayeeName')}</Label>
        <Input value={data?.payeeName ?? ''} onChange={(e) => updateField('payeeName', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.upiAmount')}</Label>
        <Input
          placeholder={t('fields.upiAmountPlaceholder')}
          value={data?.amount ?? ''}
          onChange={(e) => updateField('amount', e.target.value)}
        />
      </div>
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

export function Gs1Layout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.gs1Gtin')}</Label>
        <Input
          placeholder={t('fields.gs1GtinPlaceholder')}
          inputMode="numeric"
          value={data?.gtin ?? ''}
          onChange={(e) => updateField('gtin', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.gs1GtinHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Domain')}</Label>
        <Input
          placeholder={t('fields.gs1DomainPlaceholder')}
          value={data?.domain ?? ''}
          onChange={(e) => updateField('domain', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.gs1DomainHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Lot')}</Label>
        <Input value={data?.lot ?? ''} onChange={(e) => updateField('lot', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Serial')}</Label>
        <Input value={data?.serial ?? ''} onChange={(e) => updateField('serial', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Expiry')}</Label>
        <Input type="date" value={data?.expiry ?? ''} onChange={(e) => updateField('expiry', e.target.value)} />
      </div>
    </div>
  );
}
