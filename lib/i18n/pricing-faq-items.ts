import type { Locale } from './types';
import type { FaqItem } from './faq-items';
import { formatLocaleNumber } from './format-locale';
import { formatFreePlanDynamicQrLabel } from './dynamic-qr-label';
import { PRO_TRIAL_DAYS } from '@/lib/pro-trial';
import { REFUND_WINDOW_DAYS } from '@/lib/refund-policy';

/** Pricing-page specific FAQ — billing, trial, refund, cancellation. */
export function getPricingFaqItems(locale: Locale): FaqItem[] {
  const freeQr = formatFreePlanDynamicQrLabel(locale);
  const trial = formatLocaleNumber(PRO_TRIAL_DAYS, locale);
  const refund = formatLocaleNumber(REFUND_WINDOW_DAYS, locale);

  if (locale === 'tr') {
    return [
      {
        question: 'Ücretsiz plan gerçekten ücretsiz mi?',
        answer: `Evet. Ücretsiz plan kalıcıdır ve ${freeQr} içerir — kredi kartı gerekmez, süre sınırı yoktur.`,
      },
      {
        question: 'Pro deneme süresi nasıl işliyor?',
        answer: `Yeni hesaplar ${trial} günlük ücretsiz Pro denemesi alır. Deneme sırasında veya sonrasında istediğiniz zaman ücretli Pro'ya geçebilir ya da hiçbir şey yapmadan ücretsiz planda kalabilirsiniz.`,
      },
      {
        question: 'İptal edersem QR kodlarım çalışmaya devam eder mi?',
        answer: 'Evet. İptal veya düşürme sonrası dinamik kodlarınız plan limitleri dahilinde Ücretsiz planda çalışmaya devam eder — basılı kodlarınız devre dışı kalmaz.',
      },
      {
        question: 'Para iade garantisi var mı?',
        answer: `İlk satın alma veya yenileme tarihinden itibaren ${refund} gün içinde tam iade talep edebilirsiniz. Her talebi iyi niyetle değerlendiriyoruz.`,
      },
      {
        question: 'Ödemeler nasıl işleniyor? Güvenli mi?',
        answer: 'Ödemeler, yetkili satıcımız Paddle.com üzerinden güvenle işlenir. Kart bilgileriniz sunucularımızda saklanmaz. Kredi/banka kartı ve yerel ödeme yöntemleri desteklenir.',
      },
      {
        question: 'Yıllık faturalamada indirim var mı?',
        answer: 'Evet. Aylık yerine yıllık faturalamayı seçerek ücretli planlarda indirim kazanırsınız. Fiyat kartlarının üstündeki geçişten yıllık/aylık arasında geçiş yapabilirsiniz.',
      },
      {
        question: 'Planlar arasında geçiş yapabilir miyim?',
        answer: 'Evet. İstediğiniz zaman panelden yükseltme veya düşürme yapabilirsiniz. Yükseltmeler anında geçerli olur; düşürmelerde kodlarınız Ücretsiz plan limitleri dahilinde aktif kalır.',
      },
      {
        question: 'Fatura KDV içeriyor mu?',
        answer: 'Paddle, Kayıtlı Satıcı olarak bulunduğunuz ülkeye göre geçerli KDV/vergileri hesaplar ve faturalandırır. Kurumsal alımlar için vergi numaranızı ödeme ekranında girebilirsiniz.',
      },
    ];
  }

  return [
    {
      question: 'Is the free plan really free?',
      answer: `Yes. The free plan is permanent and includes ${freeQr} — no credit card required and no time limit.`,
    },
    {
      question: 'How does the Pro trial work?',
      answer: `New accounts get a ${trial}-day free Pro trial. Upgrade to paid Pro anytime during or after the trial, or do nothing and stay on the free plan.`,
    },
    {
      question: 'Do my QR codes keep working if I cancel?',
      answer: 'Yes. After cancelling or downgrading, your dynamic codes keep working on the Free plan within plan limits — your printed codes are never disabled.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: `You can request a full refund within ${refund} days of your initial purchase or renewal. We review every request in good faith.`,
    },
    {
      question: 'How are payments processed? Is it secure?',
      answer: 'Payments are securely processed by our authorized reseller Paddle.com. Your card details are never stored on our servers. Credit/debit cards and local payment methods are supported.',
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes. Choosing annual instead of monthly billing gives a discount on paid plans. Toggle between annual and monthly above the plan cards.',
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes. Upgrade or downgrade anytime from the dashboard. Upgrades apply immediately; on downgrade your codes stay active within Free plan limits.',
    },
    {
      question: 'Does the invoice include VAT?',
      answer: 'As Merchant of Record, Paddle calculates and charges applicable VAT/taxes based on your country. For business purchases you can enter your tax ID at checkout.',
    },
  ];
}
