import type { BlogPost } from '../types';

export const totpTwoFactorGuide: BlogPost = {
  slug: 'qr-account-two-factor-authentication',
  title: 'Secure Your QRbanner Account with Two-Factor Authentication',
  description:
    'Enable TOTP authenticator apps on QRbanner to protect dashboards, API keys and billing — a practical setup guide for teams.',
  keywords: ['two-factor authentication', 'TOTP QR code', 'QRbanner security', 'authenticator app'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Security',
  sections: [
    {
      type: 'p',
      content:
        'QR codes often gate menus, payments and internal documents. The account that manages those codes should be at least as protected as your email. QRbanner supports TOTP two-factor authentication on every plan.',
    },
    {
      type: 'h2',
      content: 'Why enable 2FA for QR management?',
    },
    {
      type: 'ul',
      items: [
        'Prevents takeover if a password is reused or phished.',
        'Protects API keys, webhooks and billing settings.',
        'Pairs with Business workspace SSO/SAML for larger teams.',
      ],
    },
    {
      type: 'h2',
      content: 'Setup in under two minutes',
    },
    {
      type: 'ul',
      items: [
        'Open Dashboard → Settings → Two-factor authentication.',
        'Scan the QR code with Google Authenticator, 1Password or Authy.',
        'Enter the 6-digit code to confirm and store backup codes safely.',
      ],
    },
    {
      type: 'h2',
      content: 'Team rollout tips',
    },
    {
      type: 'p',
      content:
        'Require admins and workspace owners to enable 2FA first. Combine with SAML on Business plans so employees sign in through Okta or Azure AD while still using authenticator apps for sensitive actions.',
    },
  ],
};
