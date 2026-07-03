'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/i18n/language-provider';

function urlLabelKey(category: string): string {
  if (['menu', 'pdf', 'file', 'app', 'social'].includes(category)) {
    return `fields.urlLabel.${category}`;
  }
  return 'fields.urlLabel.default';
}

export function CategoryFields({
  category,
  data,
  onChange,
}: {
  category: string;
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const { t } = useLanguage();

  const updateField = (key: string, value: string) => {
    onChange({ ...(data ?? {}), [key]: value });
  };

  const urlField = (placeholder?: string, label?: string) => (
    <div className="space-y-2">
      <Label>{label ?? t(urlLabelKey(category))}</Label>
      <Input
        placeholder={placeholder ?? t('fields.urlPlaceholder')}
        value={data?.url ?? ''}
        onChange={(e) => updateField('url', e.target.value)}
      />
    </div>
  );

  const usernameField = (label: string, placeholder: string, hint?: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input placeholder={placeholder} value={data?.username ?? ''} onChange={(e) => updateField('username', e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  switch (category) {
    case 'url':
    case 'menu':
    case 'social':
    case 'app':
    case 'pdf':
    case 'file':
      return urlField();
    case 'text':
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
    case 'whatsapp':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.whatsappNumber')}</Label>
            <Input placeholder={t('fields.phonePlaceholder')} value={data?.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} />
            <p className="text-xs text-muted-foreground">{t('fields.whatsappNumberHint')}</p>
          </div>
          <div className="space-y-2">
            <Label>{t('fields.whatsappMessage')}</Label>
            <Textarea value={data?.message ?? ''} onChange={(e) => updateField('message', e.target.value)} placeholder={t('fields.whatsappMessagePlaceholder')} />
          </div>
        </div>
      );
    case 'telegram':
      return usernameField(t('fields.telegramUsername'), t('fields.usernameExample'), t('fields.telegramHint'));
    case 'discord':
      return (
        <div className="space-y-2">
          <Label>{t('fields.discordInvite')}</Label>
          <Input placeholder={t('fields.discordInvitePlaceholder')} value={data?.inviteCode ?? ''} onChange={(e) => updateField('inviteCode', e.target.value)} />
          <p className="text-xs text-muted-foreground">{t('fields.discordHint')}</p>
        </div>
      );
    case 'instagram':
    case 'facebook':
    case 'tiktok':
    case 'linkedin':
      return (
        <div className="space-y-3">
          {usernameField(t('fields.username'), t('fields.usernameExample'), t('fields.usernameHint'))}
          <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
          {urlField(t('fields.urlPlaceholder'), t('fields.urlLabel.profileUrl'))}
        </div>
      );
    case 'youtube':
      return (
        <div className="space-y-3">
          {usernameField(t('fields.channelName'), t('fields.channelExample'), t('fields.usernameHint'))}
          <p className="text-xs text-muted-foreground">{t('fields.orYoutubeUrl')}</p>
          {urlField(t('fields.youtubeUrlPlaceholder'), t('fields.urlLabel.youtubeUrl'))}
        </div>
      );
    case 'spotify':
      return (
        <div className="space-y-3">
          {urlField(t('fields.spotifyUrlPlaceholder'), t('fields.urlLabel.spotifyLink'))}
          <div className="space-y-2">
            <Label>{t('fields.spotifyAdvanced')}</Label>
            <Input placeholder={t('fields.spotifyUriPlaceholder')} value={data?.uri ?? ''} onChange={(e) => updateField('uri', e.target.value)} />
            <p className="text-xs text-muted-foreground">{t('fields.spotifyUriHint')}</p>
          </div>
        </div>
      );
    case 'zoom':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.meetingId')}</Label>
            <Input placeholder={t('fields.meetingIdPlaceholder')} value={data?.meetingId ?? ''} onChange={(e) => updateField('meetingId', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.meetingPassword')}</Label>
            <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
          </div>
        </div>
      );
    case 'google_meet':
      return (
        <div className="space-y-2">
          <Label>{t('fields.meetingCode')}</Label>
          <Input placeholder={t('fields.meetingCodePlaceholder')} value={data?.meetingCode ?? ''} onChange={(e) => updateField('meetingCode', e.target.value)} />
          <p className="text-xs text-muted-foreground">{t('fields.googleMeetHint')}</p>
        </div>
      );
    case 'location':
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('fields.latitude')}</Label>
              <Input type="number" step="any" placeholder={t('fields.latPlaceholder')} value={data?.latitude ?? ''} onChange={(e) => updateField('latitude', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('fields.longitude')}</Label>
              <Input type="number" step="any" placeholder={t('fields.lngPlaceholder')} value={data?.longitude ?? ''} onChange={(e) => updateField('longitude', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('fields.placeName')}</Label>
            <Input placeholder={t('fields.placeNamePlaceholder')} value={data?.label ?? ''} onChange={(e) => updateField('label', e.target.value)} />
          </div>
        </div>
      );
    case 'crypto':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.cryptocurrency')}</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data?.coin ?? 'btc'} onChange={(e) => updateField('coin', e.target.value)}>
              <option value="btc">{t('fields.coinBtc')}</option>
              <option value="eth">{t('fields.coinEth')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t('fields.walletAddress')}</Label>
            <Input value={data?.address ?? ''} onChange={(e) => updateField('address', e.target.value)} placeholder={t('fields.walletPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.suggestedAmount')}</Label>
            <Input placeholder={t('fields.amountPlaceholder')} value={data?.amount ?? ''} onChange={(e) => updateField('amount', e.target.value)} />
          </div>
        </div>
      );
    case 'vcard':
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
            <Input value={data?.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder={t('fields.jobTitlePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.companyName')}</Label>
            <Input value={data?.org ?? ''} onChange={(e) => updateField('org', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.phone')}</Label>
            <Input value={data?.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder={t('fields.phonePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.yourEmail')}</Label>
            <Input value={data?.email ?? ''} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.website')}</Label>
            <Input value={data?.website ?? ''} onChange={(e) => updateField('website', e.target.value)} placeholder={t('fields.websitePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.addressOptional')}</Label>
            <Textarea value={data?.address ?? ''} onChange={(e) => updateField('address', e.target.value)} rows={2} placeholder={t('fields.addressPlaceholder')} />
          </div>
        </div>
      );
    case 'wifi':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.wifiName')}</Label>
            <Input value={data?.ssid ?? ''} onChange={(e) => updateField('ssid', e.target.value)} placeholder={t('fields.wifiSsidPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.wifiPassword')}</Label>
            <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.securityType')}</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data?.encryption ?? 'WPA'} onChange={(e) => updateField('encryption', e.target.value)}>
              <option value="WPA">{t('fields.wifiWpa')}</option>
              <option value="WEP">{t('fields.wifiWep')}</option>
              <option value="nopass">{t('fields.wifiOpen')}</option>
            </select>
          </div>
        </div>
      );
    case 'email':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.yourEmail')}</Label>
            <Input value={data?.email ?? ''} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.subjectLine')}</Label>
            <Input value={data?.subject ?? ''} onChange={(e) => updateField('subject', e.target.value)} placeholder={t('fields.subjectPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.messageBody')}</Label>
            <Textarea value={data?.body ?? ''} onChange={(e) => updateField('body', e.target.value)} />
          </div>
        </div>
      );
    case 'sms':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.phoneNumber')}</Label>
            <Input value={data?.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder={t('fields.phonePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.prewrittenMessage')}</Label>
            <Textarea value={data?.message ?? ''} onChange={(e) => updateField('message', e.target.value)} />
          </div>
        </div>
      );
    case 'phone':
      return (
        <div className="space-y-2">
          <Label>{t('fields.phoneNumber')}</Label>
          <Input value={data?.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder={t('fields.phonePlaceholder')} />
        </div>
      );
    case 'event':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.eventName')}</Label>
            <Input value={data?.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder={t('fields.eventNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.eventLocation')}</Label>
            <Input value={data?.location ?? ''} onChange={(e) => updateField('location', e.target.value)} placeholder={t('fields.eventLocationPlaceholder')} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('fields.starts')}</Label>
              <Input type="datetime-local" value={data?.startDate ?? ''} onChange={(e) => updateField('startDate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('fields.ends')}</Label>
              <Input type="datetime-local" value={data?.endDate ?? ''} onChange={(e) => updateField('endDate', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('fields.descriptionOptional')}</Label>
            <Textarea value={data?.description ?? ''} onChange={(e) => updateField('description', e.target.value)} />
          </div>
        </div>
      );
    case 'google_review':
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
          {urlField(t('fields.googleReviewUrlPlaceholder'), t('fields.urlLabel.googleReview'))}
        </div>
      );
    case 'paypal':
      return (
        <div className="space-y-3">
          {usernameField(t('fields.paypalUsername'), t('fields.paypalUsernamePlaceholder'), t('fields.paypalHint'))}
          <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
          {urlField(t('fields.paypalUrlPlaceholder'), t('fields.urlLabel.paypal'))}
        </div>
      );
    case 'upi':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.upiId')}</Label>
            <Input placeholder={t('fields.upiIdPlaceholder')} value={data?.vpa ?? ''} onChange={(e) => updateField('vpa', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.upiPayeeName')}</Label>
            <Input value={data?.payeeName ?? ''} onChange={(e) => updateField('payeeName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('fields.upiAmount')}</Label>
            <Input placeholder={t('fields.upiAmountPlaceholder')} value={data?.amount ?? ''} onChange={(e) => updateField('amount', e.target.value)} />
          </div>
        </div>
      );
    case 'signal':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('fields.signalPhone')}</Label>
            <Input placeholder={t('fields.phonePlaceholder')} value={data?.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} />
            <p className="text-xs text-muted-foreground">{t('fields.signalPhoneHint')}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
          {urlField(t('fields.signalUrlPlaceholder'), t('fields.urlLabel.signal'))}
        </div>
      );
    case 'apple_music':
      return urlField(t('fields.appleMusicUrlPlaceholder'), t('fields.urlLabel.appleMusic'));
    case 'google_drive':
      return urlField(t('fields.driveUrlPlaceholder'), t('fields.urlLabel.googleDrive'));
    case 'dropbox':
      return urlField(t('fields.dropboxUrlPlaceholder'), t('fields.urlLabel.dropbox'));
    default:
      return urlField();
  }
}
