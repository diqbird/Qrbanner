# QRbanner — Google Ads setup (EN)

**Goal:** Signups + first QR created (free → Pro trial).  
**Site:** https://qrbanner.com  
**Start budget:** $5–10/day for 2–4 weeks test.  
**Do NOT bid on:** broad `qr code` alone (expensive, low intent).

---

## 1. Create Google Ads account

1. Go to [https://ads.google.com](https://ads.google.com) → **Start now**.
2. Sign in with the same Google account as **GA4** and **Search Console** (easier linking).
3. When asked for your goal, choose **Leads** or **Website traffic** (you can skip “expert mode” setup).
4. Switch to **Expert mode** (bottom link) if Google pushes Smart Campaign — you want **Search** campaigns with manual keywords.
5. **Billing:** Add payment method (card). Set a **daily budget cap** (e.g. $10/day) and **account spending limit** (e.g. $300/month) under Tools → Billing → Settings.

### Link GA4 (required for optimization)

1. Google Ads → **Tools & settings** → **Linked accounts** → **Google Analytics (GA4)**.
2. Link property with measurement ID **G-3LY6YZDDD2**.
3. GA4 → **Admin** → **Google Ads links** → confirm link.
4. Enable **Auto-tagging** in Google Ads (Settings → Account settings → Auto-tagging: ON).

### Conversions (set up before scaling spend)

**Option A — GA4 import (recommended):**  
Site events already fire after cookie consent:
- `sign_up` — email or OAuth registration
- `first_qr_created` — first QR saved in the account
- `generate_lead` — sales / enterprise / procurement form success (`lead_type` param)

1. Confirm GA4 measurement ID matches VPS `NEXT_PUBLIC_GA_MEASUREMENT_ID` (see `scripts/print-ga4-conversion-steps.py`).
2. Google Ads → **Goals** → **Conversions** → **New** → **Import** → **Google Analytics 4**.
3. Select `sign_up` and `first_qr_created` → import as primary conversions.
4. In GA4 → **Admin** → **Events**, mark both as conversions if not already.
5. Wait for Realtime test: accept cookies → sign up → create one QR.

**Option B — URL goal (quick start only):**  
- **Category:** Sign-up  
- **URL contains:** `/dashboard`  
- Count: **One** per click  

Prefer Option A once GA4 is linked; switch bidding to Maximize conversions after ~15+/month.

---

## 2. Campaign structure (3 Search campaigns)

| Campaign | Daily budget | Landing URL |
|----------|--------------|-------------|
| **QRB \| Search \| Create** | $4–6 | `https://qrbanner.com/qr/create` |
| **QRB \| Search \| Competitor** | $2–4 | `https://qrbanner.com/vs/qr-tiger` (rotate slugs) |
| **QRB \| Search \| Use cases** | $2–4 | `https://qrbanner.com/qr-types/url` or `/solutions/restaurants` |

**Settings (all campaigns):**
- Network: **Search only** (uncheck Display, Search partners optional off for cleaner test).
- Locations: **United States, United Kingdom, Canada, Australia** (or US only to start).
- Language: **English**.
- Bidding: Start with **Maximize clicks** + max CPC cap **$1.50**, or **Manual CPC** $0.80–1.20.
- After 15+ conversions/month: switch to **Maximize conversions**.

---

## 3. Ad groups & keywords

Use **Phrase match** `"keyword"` and **Exact match** `[keyword]` first. Avoid broad match until you have conversion data.

### Campaign A — Create / generator

**Ad group: Dynamic QR generator**

```
[dynamic qr code generator]
[dynamic qr code maker]
[editable qr code]
[qr code you can change after printing]
"dynamic qr code generator"
"dynamic qr code with analytics"
"free dynamic qr code"
"qr code generator with analytics"
"qr code tracking software"
"create dynamic qr code"
```

**Ad group: Free / signup**

```
[free qr code generator no signup]
"free qr code generator"
"free qr code maker online"
"qr code generator free"
"make qr code without account"
```

*Note: “without account” users may bounce — monitor conversion rate.*

**Final URL:** `https://qrbanner.com/qr/create?quick=1`

---

### Campaign B — Competitor alternatives

**Ad group: QR TIGER / Scanova / Bitly**

```
[qr tiger alternative]
[qr tiger vs]
[scanova alternative]
[bitly qr alternative]
"qr code tiger alternative"
"cheaper than qr tiger"
"qr tiger free alternative"
```

**Final URLs (rotate or separate ad groups):**
- `https://qrbanner.com/vs/qr-tiger`
- `https://qrbanner.com/vs/scanova`
- `https://qrbanner.com/vs/bitly`

---

### Campaign C — Use cases

**Ad group: Restaurant**

```
[restaurant menu qr code]
[qr code for restaurant menu]
[digital menu qr code]
"restaurant qr code generator"
"menu qr code with analytics"
```

**Final URL:** `https://qrbanner.com/templates/restaurant-menu` or `/qr/create?template=restaurant-menu`

**Ad group: Business / WiFi / Google review**

```
[business card qr code]
[wifi qr code generator]
[google review qr code]
"qr code for google reviews"
"wifi qr code for guests"
```

---

## 4. Negative keywords (account or campaign level)

Add early to reduce wasted spend:

```
free download
template only
png
svg only
static qr
qr code reader
scan qr
barcode
inventory
minecraft
fortnite
game
apk
crack
nintendo
playstation
job
jobs
salary
course free
what is qr code
history of qr
wikipedia
```

---

## 5. Responsive Search Ads (RSA) — copy-paste

Google mixes headlines (max 30 chars) and descriptions (max 90 chars). Provide 10–15 headlines and 4 descriptions per ad group.

### Campaign A — Create wizard

**Headlines (pick 10–12):**
```
Dynamic QR Code Generator
Free Dynamic QR — Try Now
Edit Links After You Print
Scan Analytics Included
1 Free Dynamic QR Code
35+ Industry Templates
Restaurant, WiFi, Menu QR
No Credit Card to Start
Pro Trial — 14 Days Free
API on Free Plan
Track Scans by Country
Print-Ready QR Export
QRbanner — Smart QR Platform
Create QR in 2 Minutes
Landing Pages + Lead Capture
```

**Descriptions:**
```
Create dynamic QR codes for menus, WiFi & cards. Edit anytime, track scans. 1 free QR — start in minutes.
Dynamic QR with analytics, geofence routing & API. Free plan + 14-day Pro trial. No card required.
Change the link without reprinting. Templates for restaurants, events & retail. Try QRbanner free.
Scan tracking, webhooks, GA4 on landing pages. Upgrade from $9.99/mo when you need more codes.
```

**Display path:** `qrbanner.com` / `Create-Free`

---

### Campaign B — Competitor

**Headlines:**
```
QR TIGER Alternative
More Free Features
API Included on Free Plan
Codes Stay Active After Cancel
From $9.99/mo Pro Plan
Compare QRbanner vs QR TIGER
Dynamic QR + Analytics
Geofence & Schedule Routing
Try QRbanner Free
Better Value QR Platform
```

**Descriptions:**
```
Compare QRbanner vs QR TIGER: free tier, API access, codes active after cancel. See side-by-side features.
Looking for a QR TIGER alternative? Dynamic codes, scan analytics, custom domains. Start free today.
Pro from $9.99/mo with 200 dynamic QRs. REST API, webhooks, A/B routing. 14-day Pro trial available.
```

**Display path:** `qrbanner.com` / `Compare`

---

### Campaign C — Restaurant / use case

**Headlines:**
```
Restaurant Menu QR Code
Update Menu Without Reprint
Menu QR + Scan Analytics
Digital Menu QR Generator
Table Tent QR Template
Track Menu Scans
Free Menu QR — Try Now
QRbanner for Restaurants
```

**Descriptions:**
```
Replace paper menus with dynamic QR codes. Update dishes anytime from your dashboard. Free to start.
Restaurant menu QR with scan analytics & branded landing page. Template ready — create in minutes.
See which tables get scans. Geofence & schedule routing included. 1 free dynamic QR on signup.
```

**Display path:** `qrbanner.com` / `Menu-QR`

---

## 6. Ad extensions (assets)

**Sitelinks:**
- Pricing → `https://qrbanner.com/pricing`
- Features → `https://qrbanner.com/features`
- Templates → `https://qrbanner.com/templates`
- Compare vs QR TIGER → `https://qrbanner.com/vs/qr-tiger`

**Callouts (25 chars max each):**
```
Free Dynamic QR Code
14-Day Pro Trial
Scan Analytics
REST API on Free Plan
Codes Stay After Cancel
35+ Templates
No Credit Card Required
```

**Structured snippet:** Types → `Restaurant, WiFi, Business Card, Events, PDF, Menu`

---

## 7. Policy & landing page checklist

- Privacy policy: `https://qrbanner.com/privacy`
- Terms: `https://qrbanner.com/terms`
- Cookie banner works (GA4 loads after consent — OK for EU if consent mode considered later)
- Landing page loads fast mobile; primary CTA visible above fold
- Do not promise “unlimited free QR” — free plan is **1 dynamic QR**

---

## 8. First 2 weeks — what to watch

| Metric | Target (test phase) |
|--------|---------------------|
| CTR | > 3% on brand/competitor, > 2% on generic |
| CPC | < $1.50 avg |
| Cost per signup | < $15 (if higher, pause broad keywords) |
| Impression share | Low is OK in test |

Pause keywords with **50+ clicks, 0 signups**.

---

## 9. Etsy 5-pack — separate decision

**Do not** use the same Search campaign for Etsy digital product. Use **Etsy Ads** inside Etsy for the $8.99 pack. Google Ads → site signup/Pro is the better fit.

---

*Last updated: July 2026 — aligns with free plan = 1 dynamic QR, Pro $9.99/mo, 14-day Pro trial.*
