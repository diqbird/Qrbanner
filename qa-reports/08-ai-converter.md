# QA Report — AI Converter (Campaign Wizard)

**Modül:** `/qr/campaign` → `POST /api/campaign/generate`  
**Tested:** 2026-07-05 (live `https://qrbanner.com`)  
**Kapsam:** Yalnızca bu modül — başka modül test edilmedi.

> **Not:** Repoda "AI Converter" adlı ayrı bir dosya yok. Ürün karşılığı: **AI Campaign** — "Tek cümle → tam QR pazarlama kiti".

---

## Modül haritası

| Katman | Dosya |
|--------|--------|
| UI | `components/qr/campaign-wizard.tsx` |
| Sayfa | `app/(public)/qr/campaign/page.tsx` |
| API | `app/api/campaign/generate/route.ts` |
| LLM | `lib/campaign-ai.ts` |

---

## Test sonuçları

| Test | Sonuç | Kanıt |
|------|--------|--------|
| UI açılıyor mu | **PASS** | HTTP 200, H1: "Tek cümle → tam QR pazarlama kiti" |
| Button çalışıyor mu | **PASS** | Guest → `/signup?callbackUrl=/qr/campaign`, API çağrısı yok |
| API çağrısı gidiyor mu | **PASS** (auth) | Oturumsuz POST → 401 + `{"error":"unauthorized"}` |
| Loading çalışıyor mu | **PASS** | `loading` state + `Loader2` + button `disabled` |
| Timeout | **INFO** | OpenAI `AbortSignal.timeout(35_000)` — client timeout yok |
| Console Error | **PASS** | Playwright: 0 error |
| Network Error | **PASS** | 0 failed request (RSC hariç) |
| **401** | **PASS** | Oturumsuz istek |
| **403** | **N/A** | Route kullanmıyor |
| **404** | **PASS** | Yanlış path |
| **429** | **Kod OK** | `checkRateLimit` 20/saat — canlı test auth gerektirir |
| **500** | **Tasarım** | LLM hata → template fallback, API **200** döner (500 yüzeye çıkmaz) |
| **400** | **İyileştirildi** | `prompt_too_short`, `invalid_json`, `empty_body`, `prompt_too_long` |
| **415** | **İyileştirildi** | `multipart/form-data` → 415 |
| JSON Parse Error (client) | **İyileştirildi** | `res.json()` try/catch eklendi |
| Invalid Response | **PASS** | 401 yanıtı geçerli JSON |
| Streaming | **N/A** | SSE/stream yok — tek JSON response |
| Token limiti | **PASS** | Prompt max 500 char, LLM `max_tokens: 1800` |
| Büyük dosya | **400** | 6000 char prompt → `prompt_too_long` (fix sonrası) |
| Boş dosya | **400** | Empty body → `empty_body` (auth sonrası) |
| Desteklenmeyen dosya | **415** | multipart → `unsupported_content_type` |
| Çok hızlı tıklama | **İyileştirildi** | `if (loading) return` guard |
| 10 eşzamanlı istek | **PASS** | 10×401 (oturumsuz) — rate limit auth ile test edilmeli |

---

## Bulunan problemler ve çözümler

### 1. Client — JSON parse crash

**Problem:** `await res.json()` HTML/hata gövdesinde exception fırlatır.

```120:120:components/qr/campaign-wizard.tsx
// önce: const data = await res.json();
```

**Çözüm:** try/catch + toast.

---

### 2. Client — çift tıklama race

**Problem:** `setLoading(true)` async; iki hızlı tıklama iki istek açabilir.

**Çözüm:**

```typescript
if (loading) return;
```

`handleGenerate` ve `handleCreate` başında.

---

### 3. API — geçersiz JSON sessiz `{}` oluyordu

**Problem:**

```typescript
const body = await req.json().catch(() => ({}));
// prompt "" → prompt_too_short (yanıltıcı)
```

**Çözüm:** `req.text()` + explicit `invalid_json` / `empty_body` 400.

---

### 4. API — büyük prompt sessiz kesiliyordu

**Problem:** `.slice(0, 500)` kullanıcıya bildirim yok.

**Çözüm:** `prompt.length > MAX` → 400 `prompt_too_long`.

---

### 5. API — multipart / dosya upload yok ama kabul ediliyordu

**Problem:** JSON olmayan body parse edilip boş prompt ile devam.

**Çözüm:** `Content-Type` kontrolü → 415.

---

### 6. 500 asla görünmez (bilinçli tasarım)

**Kod:**

```164:166:lib/campaign-ai.ts
    if (!res.ok) {
      console.error('[campaign-ai] OpenAI error', res.status);
      return fallback();
```

OpenAI 5xx/timeout → template plan, API **200**. Kullanıcı `source: template` görür.

**Öneri (opsiyonel):** `degraded: true` flag eklenebilir.

---

### 7. Streaming yok

Modül streaming desteklemiyor. Tek seferde JSON — beklenen davranış.

---

### 8. Dosya yükleme yok

AI Converter **metin prompt** alır; PDF/resim upload endpoint'i yok. Dosya testleri prompt/body analoğu olarak uygulandı.

---

## Doğrulama komutları

```bash
python scripts/qa/test-ai-converter.py
```

Playwright UI: `/qr/campaign` guest generate → signup redirect.

---

## Uygulanan fix dosyaları

- `app/api/campaign/generate/route.ts`
- `components/qr/campaign-wizard.tsx`
- `lib/i18n/en.ts`, `lib/i18n/tr.ts` (`promptTooLong`)
- `scripts/qa/test-ai-converter.py`
