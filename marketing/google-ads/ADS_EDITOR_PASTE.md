# Google Ads — paste pack (Search test)

Use after GA4 conversions are imported (`GOOGLE_ADS_SETUP_TR.md` §A–C).  
All campaigns: **Search only** · EN · US/UK/CA/AU (or US only) · Maximize clicks + max CPC **$1.50**.

**SoT:** Free = **5** dynamic QRs · Pro = **$9.99/mo** / 200 QR (`lib/plans.ts`). Do not claim unlimited free QR.

---

## Shared: negative keywords (account)

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

## Shared: sitelinks

| Link text | Final URL |
|-----------|-----------|
| Pricing | https://qrbanner.com/pricing |
| Features | https://qrbanner.com/features |
| Templates | https://qrbanner.com/templates |
| vs QR TIGER | https://qrbanner.com/vs/qr-tiger |

## Shared: callouts

```
Free Dynamic QR Code
14-Day Pro Trial
Scan Analytics
REST API on Free Plan
Codes Stay After Cancel
37+ Templates
No Credit Card Required
```

## Shared: structured snippet

Header: **Types**  
Values: `Restaurant, WiFi, Business Card, Events, PDF, Menu`

---

## Campaign 1 — QRB | Search | Create

- Daily: **$5**
- Final URL: `https://qrbanner.com/qr/create?quick=1`
- Path: `Create-Free`

### Ad group: Dynamic QR generator

**Keywords**
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

**RSA headlines**
```
Dynamic QR Code Generator
Free Dynamic QR — Try Now
Edit Links After You Print
Scan Analytics Included
5 Free Dynamic QR Codes
37+ Industry Templates
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

**RSA descriptions**
```
Create dynamic QR codes for menus, WiFi & cards. Edit anytime, track scans. 5 free QRs — start in minutes.
Dynamic QR with analytics, geofence routing & API. Free plan + 14-day Pro trial. No card required.
Change the link without reprinting. Templates for restaurants, events & retail. Try QRbanner free.
Scan tracking, webhooks, GA4 on landing pages. Upgrade from $9.99/mo when you need more codes.
```

### Ad group: Free / signup

**Keywords**
```
[free qr code generator no signup]
"free qr code generator"
"free qr code maker online"
"qr code generator free"
"make qr code without account"
```

Same RSA as above (or trim to free-focused headlines). Watch bounce on “without account”.

---

## Campaign 2 — QRB | Search | Competitor

- Daily: **$3**
- Path: `Compare`

### Ad group: QR TIGER

- Final URL: `https://qrbanner.com/vs/qr-tiger`

**Keywords**
```
[qr tiger alternative]
[qr tiger vs]
"qr code tiger alternative"
"cheaper than qr tiger"
"qr tiger free alternative"
```

### Ad group: Scanova

- Final URL: `https://qrbanner.com/vs/scanova`

**Keywords**
```
[scanova alternative]
"scanova alternative"
```

**RSA headlines**
```
Scanova Alternative
More Free Features
API Included on Free Plan
Codes Stay Active After Cancel
From $9.99/mo Pro Plan
Dynamic QR + Analytics
Try QRbanner Free
Better Value QR Platform
Geofence & Schedule Routing
5 Free Dynamic QR Codes
No Credit Card to Start
Print-Ready QR Export
Scan Analytics Included
Edit Links After You Print
QRbanner — Smart QR Platform
```

**RSA descriptions**
```
QRbanner vs Scanova: free tier, API, codes active after cancel. See the full comparison.
Need a Scanova alternative? Dynamic codes, analytics, domains. Start free today.
Pro from $9.99/mo with dynamic QRs, REST API, webhooks & A/B. 14-day Pro trial.
Free dynamic QR with analytics and API. Codes stay active after cancel. Try free.
```

### Ad group: Bitly

- Final URL: `https://qrbanner.com/vs/bitly`

**Keywords**
```
[bitly qr alternative]
"bitly qr code alternative"
```

**RSA headlines**
```
Bitly QR Alternative
More Free Features
API Included on Free Plan
Codes Stay Active After Cancel
From $9.99/mo Pro Plan
Dynamic QR + Analytics
Try QRbanner Free
Better Value QR Platform
Geofence & Schedule Routing
5 Free Dynamic QR Codes
No Credit Card to Start
Print-Ready QR Export
Scan Analytics Included
Edit Links After You Print
QRbanner — Smart QR Platform
```

**RSA descriptions**
```
QRbanner vs Bitly QR: free tier, API, codes active after cancel. See the full comparison.
Need a Bitly QR alternative? Dynamic codes, analytics, domains. Start free today.
Pro from $9.99/mo with dynamic QRs, REST API, webhooks & A/B. 14-day Pro trial.
Free dynamic QR with analytics and API. Codes stay active after cancel. Try free.
```

---

## Campaign 3 — QRB | Search | Use cases

- Daily: **$3**
- Path: `Menu-QR`

### Ad group: Restaurant menu

- Final URL: `https://qrbanner.com/templates/restaurant-menu`

**Keywords**
```
[restaurant menu qr code]
[qr code for restaurant menu]
[digital menu qr code]
"restaurant qr code generator"
"menu qr code with analytics"
```

**RSA headlines**
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

**RSA descriptions**
```
Replace paper menus with dynamic QR codes. Update dishes anytime from your dashboard. Free to start.
Restaurant menu QR with scan analytics & branded landing page. Template ready — create in minutes.
See which tables get scans. Geofence & schedule routing included. 5 free dynamic QRs on signup.
```

### Ad group: Business / WiFi / reviews

- Final URL: `https://qrbanner.com/qr/create?quick=1`

**Keywords**
```
[business card qr code]
[wifi qr code generator]
[google review qr code]
"qr code for google reviews"
"wifi qr code for guests"
```

Reuse Create campaign RSA or restaurant RSA mixed with WiFi/review headlines.

---

## Order of setup in Ads UI

1. Account negatives + sitelinks + callouts + snippet  
2. Campaign 1 (Create) — highest intent  
3. Campaign 2 (Competitor)  
4. Campaign 3 (Use cases)  
5. After ~15 conversions/month → Maximize conversions
