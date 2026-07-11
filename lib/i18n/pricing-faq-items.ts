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

  if (locale === 'de') {
    return [
      {
        question: 'Ist der kostenlose Tarif wirklich kostenlos?',
        answer: `Ja. Der Free-Tarif ist dauerhaft und enthält ${freeQr} — keine Kreditkarte, kein Zeitlimit.`,
      },
      {
        question: 'Wie funktioniert die Pro-Testphase?',
        answer: `Neue Konten erhalten ${trial} Tage Pro kostenlos. Upgrade jederzeit während oder nach der Testphase — oder bleiben Sie im Free-Tarif.`,
      },
      {
        question: 'Funktionieren meine QR-Codes nach Kündigung weiter?',
        answer: 'Ja. Nach Kündigung oder Downgrade bleiben dynamische Codes im Free-Tarif innerhalb der Limits aktiv — gedruckte Codes werden nicht deaktiviert.',
      },
      {
        question: 'Gibt es eine Geld-zurück-Garantie?',
        answer: `Volle Rückerstattung innerhalb von ${refund} Tagen nach Erstkauf oder Verlängerung. Wir prüfen jede Anfrage fair.`,
      },
      {
        question: 'Wie werden Zahlungen abgewickelt? Ist das sicher?',
        answer: 'Zahlungen laufen sicher über Paddle.com als Merchant of Record. Kartendaten werden nicht auf unseren Servern gespeichert.',
      },
      {
        question: 'Gibt es Rabatt bei jährlicher Abrechnung?',
        answer: 'Ja. Jährliche statt monatliche Abrechnung spart bei bezahlten Tarifen. Umschalten über den Schalter über den Preiskarten.',
      },
      {
        question: 'Kann ich später den Tarif wechseln?',
        answer: 'Ja. Upgrade oder Downgrade jederzeit im Dashboard. Upgrades gelten sofort; beim Downgrade bleiben Codes im Free-Limit aktiv.',
      },
      {
        question: 'Enthält die Rechnung MwSt.?',
        answer: 'Paddle berechnet als Merchant of Record die anwendbare MwSt./Steuer nach Land. USt-IdNr. kann beim Checkout eingegeben werden.',
      },
    ];
  }

  if (locale === 'es') {
    return [
      {
        question: '¿El plan gratuito es realmente gratis?',
        answer: `Sí. El plan gratuito es permanente e incluye ${freeQr} — sin tarjeta ni límite de tiempo.`,
      },
      {
        question: '¿Cómo funciona la prueba Pro?',
        answer: `Las cuentas nuevas reciben ${trial} días de Pro gratis. Actualice cuando quiera durante o después — o quédese en el plan gratuito.`,
      },
      {
        question: '¿Mis códigos QR siguen funcionando si cancelo?',
        answer: 'Sí. Tras cancelar o bajar de plan, los códigos dinámicos siguen en el plan gratuito dentro de los límites — los impresos no se desactivan.',
      },
      {
        question: '¿Hay garantía de devolución?',
        answer: `Puede solicitar reembolso completo en ${refund} días desde la compra o renovación. Revisamos cada solicitud de buena fe.`,
      },
      {
        question: '¿Cómo se procesan los pagos? ¿Es seguro?',
        answer: 'Los pagos se procesan de forma segura con Paddle.com. Los datos de tarjeta no se guardan en nuestros servidores.',
      },
      {
        question: '¿Hay descuento por facturación anual?',
        answer: 'Sí. La facturación anual ofrece descuento en planes de pago. Use el interruptor sobre las tarjetas de precio.',
      },
      {
        question: '¿Puedo cambiar de plan más tarde?',
        answer: 'Sí. Suba o baje de plan cuando quiera desde el panel. Las mejoras aplican al instante; al bajar, los códigos siguen activos en el límite gratuito.',
      },
      {
        question: '¿La factura incluye IVA?',
        answer: 'Paddle, como comerciante registrado, calcula el IVA/impuestos según su país. Puede introducir su NIF en el checkout.',
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
