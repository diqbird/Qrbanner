# Konsol sırası A→D (agent kodu bitti)

Measurement ID: **G-3LY6YZDDD2**  
Checklist kaynağı: [GOOGLE_ADS_SETUP_TR.md](./GOOGLE_ADS_SETUP_TR.md)

## A — GA4 bağla
- [ ] Ads → Araçlar → Bağlı hesaplar → Google Analytics (GA4) → `G-3LY6YZDDD2`
- [ ] GA4 → Yönetici → Google Ads bağlantıları → doğrula
- [ ] Ads → Ayarlar → Otomatik etiketleme: AÇIK

## B — Dönüşüm import
- [ ] Ads → Hedefler → Dönüşümler → Yeni → İçe aktar → GA4
- [ ] `sign_up` (birincil)
- [ ] `first_qr_created` (birincil)
- [ ] `generate_lead` (opsiyonel)
- [ ] GA4 → Etkinlikler → aynı olayları dönüşüm işaretle

## C — Realtime test
- [ ] Gizli pencere → qrbanner.com → çerez kabul
- [ ] Kayıt → Realtime’ta `sign_up`
- [ ] İlk QR → `first_qr_created`
- [ ] (Ops.) form → `generate_lead`

## D — Kampanya import
Editor CSV klasörleri (Paused):
- EN: [editor-csv/](./editor-csv/)
- DE: [editor-csv-de/](./editor-csv-de/)
- ES: [editor-csv-es/](./editor-csv-es/)

Import: `01` → `08`, sonra **Create** kampanyasını Enable.

Üret (gerekirse): `python scripts/generate-ads-editor-csv.py`  
URL smoke: `python scripts/verify-ads-paste-urls.py`
