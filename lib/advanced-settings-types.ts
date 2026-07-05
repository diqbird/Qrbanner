export interface AdvancedValues {
  password: string;
  expiresAt: string;
  scanLimit: string;
  iosUrl: string;
  androidUrl: string;
  utmEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export const emptyAdvanced: AdvancedValues = {
  password: '',
  expiresAt: '',
  scanLimit: '',
  iosUrl: '',
  androidUrl: '',
  utmEnabled: false,
  utmSource: 'qrbanner',
  utmMedium: 'qr',
  utmCampaign: '',
};
