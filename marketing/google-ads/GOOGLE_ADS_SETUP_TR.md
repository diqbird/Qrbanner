# QRbanner — Google Ads / GA4 dönüşüm checklist (TR)

**Site:** https://qrbanner.com  
**Measurement ID:** `G-3LY6YZDDD2`  
**Kod hazır:** `sign_up`, `first_qr_created`, `generate_lead` (çerez onayı sonrası)

Bu adımlar konsolda yapılır; deploy gerekmez.

---

## A. GA4 ↔ Google Ads bağlantısı

1. [Google Ads](https://ads.google.com) → **Araçlar** → **Bağlı hesaplar** → **Google Analytics (GA4)**.
2. Property’yi `G-3LY6YZDDD2` ile bağla.
3. GA4 → **Yönetici** → **Google Ads bağlantıları** → bağlantıyı doğrula.
4. Ads → **Ayarlar** → **Otomatik etiketleme**: AÇIK.

## B. Dönüşüm import (önce bunu bitir)

1. Ads → **Hedefler** → **Dönüşümler** → **Yeni** → **İçe aktar** → **Google Analytics 4**.
2. Şunları seç:
   - `sign_up` — **birincil**
   - `first_qr_created` — **birincil**
   - `generate_lead` — isteğe bağlı (sales / procurement form)
3. GA4 → **Yönetici** → **Etkinlikler** → aynı olayları “dönüşüm olarak işaretle”.

## C. Realtime smoke test (~5 dk)

1. Gizli pencere → https://qrbanner.com → **çerezleri kabul et**.
2. Yeni hesap aç → GA4 **Realtime** → Events’te `sign_up`.
3. İlk QR’ı kaydet → `first_qr_created`.
4. (Opsiyonel) `/enterprise` veya `/trust/procurement-request` form gönder → `generate_lead`.

## D. Kampanya iskeleti (dönüşümler hazır olunca)

### Ads Editor CSV (önerilen)
- EN: [`editor-csv/`](./editor-csv/)
- DE: [`editor-csv-de/`](./editor-csv-de/)
- ES: [`editor-csv-es/`](./editor-csv-es/)

Üret: `python scripts/generate-ads-editor-csv.py`

Import sırası (kampanyalar **Paused** gelir):
1. `01-campaigns.csv`
2. `02-ad-groups.csv`
3. `03-keywords.csv`
4. `04-rsa.csv`
5. `05-negatives.csv`

Sonra Create kampanyasını aç; Competitor / Use cases sonra.

### Manuel yapıştırma
- EN: [`ADS_EDITOR_PASTE.md`](./ADS_EDITOR_PASTE.md)
- DE: [`ADS_EDITOR_PASTE_DE.md`](./ADS_EDITOR_PASTE_DE.md)
- ES: [`ADS_EDITOR_PASTE_ES.md`](./ADS_EDITOR_PASTE_ES.md)

URL smoke: `python scripts/verify-ads-paste-urls.py`

| Kampanya | Günlük | Landing |
|----------|--------|---------|
| QRB \| Search \| Create | ~$5 | `/qr/create?quick=1` |
| QRB \| Search \| Competitor | ~$3 | `/vs/qr-tiger` (+ scanova/bitly) |
| QRB \| Search \| Use cases | ~$3 | `/templates/restaurant-menu` |

Sıra: önce Create, sonra Competitor, sonra Use cases.  
Başlangıç teklifi: Maximize clicks + max CPC ~$1.50. Ayda 15+ dönüşümden sonra Maximize conversions.

**Bid etme:** tek başına geniş `qr code`.
