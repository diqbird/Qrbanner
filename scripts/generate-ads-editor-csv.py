#!/usr/bin/env python3
"""Generate Google Ads Editor-friendly CSVs from the EN paste pack."""
from __future__ import annotations

import csv
import os
from pathlib import Path

NEGATIVES = [
    "free download",
    "template only",
    "png",
    "svg only",
    "static qr",
    "qr code reader",
    "scan qr",
    "barcode",
    "inventory",
    "minecraft",
    "fortnite",
    "game",
    "apk",
    "crack",
    "nintendo",
    "playstation",
    "job",
    "jobs",
    "salary",
    "course free",
    "what is qr code",
    "history of qr",
    "wikipedia",
]

CAMPAIGNS = [
    {
        "campaign": "QRB | Search | Create",
        "budget": "5.00",
        "groups": [
            {
                "ad_group": "Dynamic QR generator",
                "final_url": "https://qrbanner.com/qr/create?quick=1",
                "path1": "Create-Free",
                "path2": "",
                "keywords": [
                    ("[dynamic qr code generator]", "Exact"),
                    ("[dynamic qr code maker]", "Exact"),
                    ("[editable qr code]", "Exact"),
                    ("[qr code you can change after printing]", "Exact"),
                    ('"dynamic qr code generator"', "Phrase"),
                    ('"dynamic qr code with analytics"', "Phrase"),
                    ('"free dynamic qr code"', "Phrase"),
                    ('"qr code generator with analytics"', "Phrase"),
                    ('"qr code tracking software"', "Phrase"),
                    ('"create dynamic qr code"', "Phrase"),
                ],
                "headlines": [
                    "Dynamic QR Code Generator",
                    "Free Dynamic QR — Try Now",
                    "Edit Links After You Print",
                    "Scan Analytics Included",
                    "1 Free Dynamic QR Code",
                    "35+ Industry Templates",
                    "Restaurant, WiFi, Menu QR",
                    "No Credit Card to Start",
                    "Pro Trial — 14 Days Free",
                    "API on Free Plan",
                    "Track Scans by Country",
                    "Print-Ready QR Export",
                    "QRbanner — Smart QR Platform",
                    "Create QR in 2 Minutes",
                    "Landing Pages + Lead Capture",
                ],
                "descriptions": [
                    "Dynamic QR for menus, WiFi & cards. Edit anytime, track scans. 1 free QR — start now.",
                    "Analytics, geofence routing & API. Free plan + 14-day Pro trial. No card required.",
                    "Change the link without reprinting. Templates for restaurants & retail. Try free.",
                    "Scan tracking, webhooks, GA4 on landings. Upgrade from $9.99/mo when you need more.",
                ],
            },
            {
                "ad_group": "Free / signup",
                "final_url": "https://qrbanner.com/qr/create?quick=1",
                "path1": "Create-Free",
                "path2": "Free",
                "keywords": [
                    ("[free qr code generator no signup]", "Exact"),
                    ('"free qr code generator"', "Phrase"),
                    ('"free qr code maker online"', "Phrase"),
                    ('"qr code generator free"', "Phrase"),
                    ('"make qr code without account"', "Phrase"),
                ],
                "headlines": [
                    "Free Dynamic QR — Try Now",
                    "1 Free Dynamic QR Code",
                    "No Credit Card to Start",
                    "Dynamic QR Code Generator",
                    "Edit Links After You Print",
                    "Scan Analytics Included",
                    "API on Free Plan",
                    "Create QR in 2 Minutes",
                    "QRbanner — Smart QR Platform",
                    "Print-Ready QR Export",
                    "Pro Trial — 14 Days Free",
                    "35+ Industry Templates",
                    "Track Scans by Country",
                    "Landing Pages + Lead Capture",
                    "Restaurant, WiFi, Menu QR",
                ],
                "descriptions": [
                    "Dynamic QR for menus, WiFi & cards. Edit anytime, track scans. 1 free QR — start now.",
                    "Analytics, geofence routing & API. Free plan + 14-day Pro trial. No card required.",
                    "Change the link without reprinting. Templates for restaurants & retail. Try free.",
                    "Scan tracking, webhooks, GA4 on landings. Upgrade from $9.99/mo when you need more.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Competitor",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "QR TIGER",
                "final_url": "https://qrbanner.com/vs/qr-tiger",
                "path1": "Compare",
                "path2": "QR-TIGER",
                "keywords": [
                    ("[qr tiger alternative]", "Exact"),
                    ("[qr tiger vs]", "Exact"),
                    ('"qr code tiger alternative"', "Phrase"),
                    ('"cheaper than qr tiger"', "Phrase"),
                    ('"qr tiger free alternative"', "Phrase"),
                ],
                "headlines": [
                    "QR TIGER Alternative",
                    "More Free Features",
                    "API Included on Free Plan",
                    "Codes Stay Active After Cancel",
                    "From $9.99/mo Pro Plan",
                    "Compare QRbanner vs QR TIGER",
                    "Dynamic QR + Analytics",
                    "Geofence & Schedule Routing",
                    "Try QRbanner Free",
                    "Better Value QR Platform",
                    "1 Free Dynamic QR Code",
                    "No Credit Card to Start",
                    "Print-Ready QR Export",
                    "Scan Analytics Included",
                    "Edit Links After You Print",
                ],
                "descriptions": [
                    "QRbanner vs QR TIGER: free tier, API, codes active after cancel. See the full comparison.",
                    "Need a QR TIGER alternative? Dynamic codes, analytics, domains. Start free today.",
                    "Pro from $9.99/mo with dynamic QRs, REST API, webhooks & A/B. 14-day Pro trial.",
                    "Free dynamic QR with analytics and API. Codes stay active after cancel. Try free.",
                ],
            },
            {
                "ad_group": "Scanova / Bitly",
                "final_url": "https://qrbanner.com/vs/scanova",
                "path1": "Compare",
                "path2": "Alt",
                "keywords": [
                    ("[scanova alternative]", "Exact"),
                    ("[bitly qr alternative]", "Exact"),
                ],
                "headlines": [
                    "QR TIGER Alternative",
                    "More Free Features",
                    "API Included on Free Plan",
                    "Codes Stay Active After Cancel",
                    "From $9.99/mo Pro Plan",
                    "Dynamic QR + Analytics",
                    "Try QRbanner Free",
                    "Better Value QR Platform",
                    "Geofence & Schedule Routing",
                    "1 Free Dynamic QR Code",
                    "No Credit Card to Start",
                    "Print-Ready QR Export",
                    "Scan Analytics Included",
                    "Edit Links After You Print",
                    "QRbanner — Smart QR Platform",
                ],
                "descriptions": [
                    "QRbanner vs QR TIGER: free tier, API, codes active after cancel. See the full comparison.",
                    "Need a QR TIGER alternative? Dynamic codes, analytics, domains. Start free today.",
                    "Pro from $9.99/mo with dynamic QRs, REST API, webhooks & A/B. 14-day Pro trial.",
                    "Free dynamic QR with analytics and API. Codes stay active after cancel. Try free.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Use cases",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "Restaurant menu",
                "final_url": "https://qrbanner.com/templates/restaurant-menu",
                "path1": "Menu-QR",
                "path2": "",
                "keywords": [
                    ("[restaurant menu qr code]", "Exact"),
                    ("[qr code for restaurant menu]", "Exact"),
                    ("[digital menu qr code]", "Exact"),
                    ('"restaurant qr code generator"', "Phrase"),
                    ('"menu qr code with analytics"', "Phrase"),
                ],
                "headlines": [
                    "Restaurant Menu QR Code",
                    "Update Menu Without Reprint",
                    "Menu QR + Scan Analytics",
                    "Digital Menu QR Generator",
                    "Table Tent QR Template",
                    "Track Menu Scans",
                    "Free Menu QR — Try Now",
                    "QRbanner for Restaurants",
                    "1 Free Dynamic QR Code",
                    "Edit Links After You Print",
                    "No Credit Card to Start",
                    "Print-Ready QR Export",
                    "Scan Analytics Included",
                    "Create QR in 2 Minutes",
                    "API on Free Plan",
                ],
                "descriptions": [
                    "Replace paper menus with dynamic QR. Update dishes anytime. Free to start.",
                    "Menu QR with scan analytics & branded landing. Template ready — create in minutes.",
                    "See which tables get scans. Geofence & schedule routing. 1 free dynamic QR on signup.",
                    "Dynamic menu QR for restaurants. Change the link without reprinting. Try free today.",
                ],
            },
            {
                "ad_group": "Business / WiFi / reviews",
                "final_url": "https://qrbanner.com/qr/create?quick=1",
                "path1": "Create-Free",
                "path2": "Biz",
                "keywords": [
                    ("[business card qr code]", "Exact"),
                    ("[wifi qr code generator]", "Exact"),
                    ("[google review qr code]", "Exact"),
                    ('"qr code for google reviews"', "Phrase"),
                    ('"wifi qr code for guests"', "Phrase"),
                ],
                "headlines": [
                    "Dynamic QR Code Generator",
                    "Free Dynamic QR — Try Now",
                    "Edit Links After You Print",
                    "Scan Analytics Included",
                    "1 Free Dynamic QR Code",
                    "Business Card & WiFi QR",
                    "Google Review QR Codes",
                    "No Credit Card to Start",
                    "API on Free Plan",
                    "Print-Ready QR Export",
                    "Create QR in 2 Minutes",
                    "QRbanner — Smart QR Platform",
                    "35+ Industry Templates",
                    "Pro Trial — 14 Days Free",
                    "Track Scans by Country",
                ],
                "descriptions": [
                    "Dynamic QR for menus, WiFi & cards. Edit anytime, track scans. 1 free QR — start now.",
                    "Analytics, geofence routing & API. Free plan + 14-day Pro trial. No card required.",
                    "Change the link without reprinting. Templates for restaurants & retail. Try free.",
                    "Scan tracking, webhooks, GA4 on landings. Upgrade from $9.99/mo when you need more.",
                ],
            },
        ],
    },
]


def strip_match(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        return raw[1:-1]
    if raw.startswith('"') and raw.endswith('"'):
        return raw[1:-1]
    return raw


def pad_headlines(headlines: list[str], fillers: list[str]) -> list[str]:
    out = list(headlines)
    for f in fillers:
        if len(out) >= 15:
            break
        if f not in out and len(f) <= 30:
            out.append(f)
    while len(out) < 3:
        out.append("QRbanner")
    return out[:15]


def pad_descriptions(descriptions: list[str], fillers: list[str]) -> list[str]:
    out = list(descriptions)
    for f in fillers:
        if len(out) >= 4:
            break
        if f not in out and len(f) <= 90:
            out.append(f)
    while len(out) < 2:
        out.append("Dynamic QR codes with analytics. Start free on QRbanner.")
    return out[:4]


def write_campaigns(path: Path, campaigns: list, languages: str, locations: str) -> None:
    cols = [
        "Campaign",
        "Campaign Type",
        "Campaign Status",
        "Budget",
        "Budget type",
        "Bid Strategy Type",
        "Networks",
        "Languages",
        "Locations",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            w.writerow(
                {
                    "Campaign": c["campaign"],
                    "Campaign Type": "Search",
                    "Campaign Status": "Paused",
                    "Budget": c["budget"],
                    "Budget type": "Daily",
                    "Bid Strategy Type": "Maximize clicks",
                    "Networks": "Google search",
                    "Languages": languages,
                    "Locations": locations,
                }
            )


def write_ad_groups(path: Path, campaigns: list) -> None:
    cols = ["Campaign", "Ad Group", "Ad Group Status", "Max CPC"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for g in c["groups"]:
                w.writerow(
                    {
                        "Campaign": c["campaign"],
                        "Ad Group": g["ad_group"],
                        "Ad Group Status": "Enabled",
                        "Max CPC": "1.50",
                    }
                )


def write_keywords(path: Path, campaigns: list) -> None:
    cols = ["Campaign", "Ad Group", "Keyword", "Criterion Type", "Final URL", "Keyword Status"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for g in c["groups"]:
                for raw, match in g["keywords"]:
                    w.writerow(
                        {
                            "Campaign": c["campaign"],
                            "Ad Group": g["ad_group"],
                            "Keyword": strip_match(raw),
                            "Criterion Type": match,
                            "Final URL": g["final_url"],
                            "Keyword Status": "Enabled",
                        }
                    )


def write_rsa(path: Path, campaigns: list, headline_fillers: list[str], desc_fillers: list[str]) -> None:
    cols = (
        ["Campaign", "Ad Group", "Ad type", "Final URL", "Path 1", "Path 2"]
        + [f"Headline {i}" for i in range(1, 16)]
        + [f"Description {i}" for i in range(1, 5)]
    )
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for g in c["groups"]:
                row = {
                    "Campaign": c["campaign"],
                    "Ad Group": g["ad_group"],
                    "Ad type": "Responsive search ad",
                    "Final URL": g["final_url"],
                    "Path 1": g["path1"],
                    "Path 2": g.get("path2", ""),
                }
                headlines = pad_headlines(g["headlines"], headline_fillers)
                descriptions = pad_descriptions(g["descriptions"], desc_fillers)
                for i, h in enumerate(headlines, start=1):
                    assert len(h) <= 30, f"Headline too long ({len(h)}): {h}"
                    row[f"Headline {i}"] = h
                for i, d in enumerate(descriptions, start=1):
                    assert len(d) <= 90, f"Description too long ({len(d)}): {d}"
                    row[f"Description {i}"] = d
                w.writerow(row)


def write_negatives(path: Path, campaigns: list, negatives: list[str]) -> None:
    cols = ["Campaign", "Keyword", "Criterion Type", "Keyword Status"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for term in negatives:
                w.writerow(
                    {
                        "Campaign": c["campaign"],
                        "Keyword": term,
                        "Criterion Type": "Negative broad",
                        "Keyword Status": "Enabled",
                    }
                )


def write_sitelinks(path: Path, campaigns: list, sitelinks: list[dict]) -> None:
    cols = [
        "Campaign",
        "Link Text",
        "Final URL",
        "Description Line 1",
        "Description Line 2",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for s in sitelinks:
                w.writerow(
                    {
                        "Campaign": c["campaign"],
                        "Link Text": s["text"],
                        "Final URL": s["url"],
                        "Description Line 1": s.get("d1", ""),
                        "Description Line 2": s.get("d2", ""),
                    }
                )


def write_callouts(path: Path, campaigns: list, callouts: list[str]) -> None:
    cols = ["Campaign", "Callout Text"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            for text in callouts:
                assert len(text) <= 25, f"Callout too long ({len(text)}): {text}"
                w.writerow({"Campaign": c["campaign"], "Callout Text": text})


def write_structured_snippets(
    path: Path,
    campaigns: list,
    *,
    header: str,
    values: list[str],
) -> None:
    cols = ["Campaign", "Structured Snippet Header", "Structured Snippet Values"]
    joined = "; ".join(values)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in campaigns:
            w.writerow(
                {
                    "Campaign": c["campaign"],
                    "Structured Snippet Header": header,
                    "Structured Snippet Values": joined,
                }
            )


def emit_pack(
    out_dir: Path,
    *,
    title: str,
    campaigns: list,
    negatives: list[str],
    languages: str,
    locations: str,
    headline_fillers: list[str],
    desc_fillers: list[str],
    readme_extra: str,
    sitelinks: list[dict],
    callouts: list[str],
    snippet_header: str,
    snippet_values: list[str],
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    write_campaigns(out_dir / "01-campaigns.csv", campaigns, languages, locations)
    write_ad_groups(out_dir / "02-ad-groups.csv", campaigns)
    write_keywords(out_dir / "03-keywords.csv", campaigns)
    write_rsa(out_dir / "04-rsa.csv", campaigns, headline_fillers, desc_fillers)
    write_negatives(out_dir / "05-negatives.csv", campaigns, negatives)
    write_sitelinks(out_dir / "06-sitelinks.csv", campaigns, sitelinks)
    write_callouts(out_dir / "07-callouts.csv", campaigns, callouts)
    write_structured_snippets(
        out_dir / "08-structured-snippets.csv",
        campaigns,
        header=snippet_header,
        values=snippet_values,
    )
    (out_dir / "README.md").write_text(
        f"""# {title}

Import order in Google Ads Editor:

1. `01-campaigns.csv` (Paused)
2. `02-ad-groups.csv`
3. `03-keywords.csv`
4. `04-rsa.csv`
5. `05-negatives.csv`
6. `06-sitelinks.csv`
7. `07-callouts.csv`
8. `08-structured-snippets.csv`

{readme_extra}
""",
        encoding="utf-8",
    )
    print(f"Wrote CSVs to {out_dir}")


SITELINKS_EN = [
    {"text": "Pricing", "url": "https://qrbanner.com/pricing", "d1": "Plans from free", "d2": "Pro from $9.99/mo"},
    {"text": "Features", "url": "https://qrbanner.com/features", "d1": "Dynamic QR tools", "d2": "Analytics & routing"},
    {"text": "Templates", "url": "https://qrbanner.com/templates", "d1": "35+ industry templates", "d2": "Menus, WiFi, cards"},
    {"text": "vs QR TIGER", "url": "https://qrbanner.com/vs/qr-tiger", "d1": "Side-by-side compare", "d2": "Free tier & API"},
]

CALLOUTS_EN = [
    "Free Dynamic QR Code",
    "14-Day Pro Trial",
    "Scan Analytics",
    "REST API on Free Plan",
    "Codes Stay After Cancel",
    "35+ Templates",
    "No Credit Card Required",
]

SITELINKS_DE = [
    {"text": "Preise", "url": "https://qrbanner.com/de/pricing", "d1": "Ab Free-Plan", "d2": "Pro ab $9.99/mo"},
    {"text": "Funktionen", "url": "https://qrbanner.com/de/features", "d1": "Dynamische QR", "d2": "Analysen & Routing"},
    {"text": "Vorlagen", "url": "https://qrbanner.com/de/templates", "d1": "35+ Branchen", "d2": "Menü, WiFi, Karten"},
    {"text": "vs QR TIGER", "url": "https://qrbanner.com/de/vs/qr-tiger", "d1": "Vergleich", "d2": "Free & API"},
]

CALLOUTS_DE = [
    "1 Free Dynamic QR",
    "14 Tage Pro-Test",
    "Scan-Analysen",
    "API im Free-Plan",
    "Codes bleiben aktiv",
    "35+ Vorlagen",
    "Keine Kreditkarte",
]

SITELINKS_ES = [
    {"text": "Precios", "url": "https://qrbanner.com/es/pricing", "d1": "Desde plan gratis", "d2": "Pro desde $9.99/mes"},
    {"text": "Funciones", "url": "https://qrbanner.com/es/features", "d1": "QR dinámico", "d2": "Analítica y enrutado"},
    {"text": "Plantillas", "url": "https://qrbanner.com/es/templates", "d1": "35+ industrias", "d2": "Menú, WiFi, tarjetas"},
    {"text": "vs QR TIGER", "url": "https://qrbanner.com/es/vs/qr-tiger", "d1": "Comparativa", "d2": "Gratis y API"},
]

CALLOUTS_ES = [
    "1 QR dinámico gratis",
    "Prueba Pro 14 días",
    "Analítica de escaneos",
    "API en plan gratis",
    "Activos tras cancelar",
    "35+ plantillas",
    "Sin tarjeta",
]


CAMPAIGNS_DE = [
    {
        "campaign": "QRB | Search | Create DE",
        "budget": "5.00",
        "groups": [
            {
                "ad_group": "Dynamischer QR Generator",
                "final_url": "https://qrbanner.com/de/qr/create?quick=1",
                "path1": "Kostenlos",
                "path2": "",
                "keywords": [
                    ("[dynamischer qr code generator]", "Exact"),
                    ("[dynamischer qr code erstellen]", "Exact"),
                    ("[editierbarer qr code]", "Exact"),
                    ('"qr code generator mit tracking"', "Phrase"),
                    ('"kostenloser dynamischer qr code"', "Phrase"),
                    ('"qr code nach druck ändern"', "Phrase"),
                ],
                "headlines": [
                    "Dynamischer QR-Code Generator",
                    "Kostenlos starten — 1 QR",
                    "Links nach dem Druck ändern",
                    "Scan-Analysen inklusive",
                    "API im Free-Plan",
                    "Druckfertiger QR-Export",
                    "14 Tage Pro-Test",
                    "Keine Kreditkarte nötig",
                    "QRbanner — Smart QR",
                    "Menü-, WiFi- & Karten-QR",
                ],
                "descriptions": [
                    "Dynamische QR für Menüs, WiFi & Karten. Editieren, Scans tracken. Kostenlos starten.",
                    "Geo-/Zeit-Routing, API & Webhooks. Free-Plan + 14-Tage-Pro-Test — ohne Karte.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Competitor DE",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "QR TIGER DE",
                "final_url": "https://qrbanner.com/de/vs/qr-tiger",
                "path1": "Vergleich",
                "path2": "TIGER",
                "keywords": [
                    ("[qr tiger alternative]", "Exact"),
                    ("[qr tiger vergleich]", "Exact"),
                    ('"günstigere qr tiger alternative"', "Phrase"),
                ],
                "headlines": [
                    "QR TIGER Alternative",
                    "Mehr Free-Features",
                    "API im Free-Plan",
                    "Codes nach Kündigung aktiv",
                    "Ab $9.99/mo Pro",
                    "QRbanner vs QR TIGER",
                ],
                "descriptions": [
                    "QRbanner vs QR TIGER: Free-Limits, API, Codes nach Kündigung. Jetzt vergleichen.",
                    "QR-TIGER-Alternative mit dynamischen Codes & Analysen. Kostenlos starten.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Use cases DE",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "Restaurant Menü DE",
                "final_url": "https://qrbanner.com/de/templates/restaurant-menu",
                "path1": "Menu-QR",
                "path2": "",
                "keywords": [
                    ("[restaurant menü qr code]", "Exact"),
                    ("[digitale speisekarte qr]", "Exact"),
                    ('"menü qr code generator"', "Phrase"),
                ],
                "headlines": [
                    "Restaurant-Menü-QR-Code",
                    "Menü ohne Neudruck updaten",
                    "Scan-Analysen für Tische",
                    "Kostenloser Menü-QR",
                ],
                "descriptions": [
                    "Papier-Menüs durch dynamische QR ersetzen. Speisen jederzeit updaten. Kostenlos.",
                    "Menü-QR mit Scan-Analysen & Landingpage. Vorlage bereit — in Minuten erstellt.",
                ],
            },
        ],
    },
]

NEGATIVES_DE = [
    "kostenlos download",
    "nur vorlage",
    "png",
    "svg only",
    "statischer qr",
    "qr code reader",
    "qr scannen",
    "barcode",
    "minecraft",
    "fortnite",
    "spiel",
    "apk",
    "crack",
    "job",
    "gehalt",
    "was ist qr",
    "wikipedia",
]

CAMPAIGNS_ES = [
    {
        "campaign": "QRB | Search | Create ES",
        "budget": "5.00",
        "groups": [
            {
                "ad_group": "Generador QR dinámico",
                "final_url": "https://qrbanner.com/es/qr/create?quick=1",
                "path1": "Gratis",
                "path2": "",
                "keywords": [
                    ("[generador de codigo qr dinamico]", "Exact"),
                    ("[crear codigo qr editable]", "Exact"),
                    ('"generador qr con analitica"', "Phrase"),
                    ('"codigo qr dinamico gratis"', "Phrase"),
                    ('"cambiar enlace qr despues de imprimir"', "Phrase"),
                ],
                "headlines": [
                    "Generador de QR dinámico",
                    "Empiece gratis — 1 QR",
                    "Edite el enlace tras imprimir",
                    "Analítica de escaneos",
                    "API en plan gratuito",
                    "Exportación para imprimir",
                    "Prueba Pro 14 días",
                    "Sin tarjeta de crédito",
                    "QRbanner — QR inteligente",
                    "QR menú, WiFi y tarjetas",
                ],
                "descriptions": [
                    "QR dinámicos para menús, WiFi y tarjetas. Edite y rastree escaneos. Empiece gratis.",
                    "Geovalla, horarios, API y webhooks. Plan gratis + prueba Pro 14 días — sin tarjeta.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Competitor ES",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "QR TIGER ES",
                "final_url": "https://qrbanner.com/es/vs/qr-tiger",
                "path1": "Comparar",
                "path2": "TIGER",
                "keywords": [
                    ("[alternativa a qr tiger]", "Exact"),
                    ("[qr tiger vs]", "Exact"),
                    ('"alternativa barata a qr tiger"', "Phrase"),
                ],
                "headlines": [
                    "Alternativa a QR TIGER",
                    "Más funciones gratis",
                    "API en plan gratuito",
                    "Activos tras cancelar",
                    "Pro desde $9.99/mes",
                    "QRbanner vs QR TIGER",
                ],
                "descriptions": [
                    "QRbanner vs QR TIGER: límites gratis, API, códigos tras cancelar. Compáralos.",
                    "Alternativa a QR TIGER con QR dinámico y analítica. Empiece gratis hoy.",
                ],
            },
        ],
    },
    {
        "campaign": "QRB | Search | Use cases ES",
        "budget": "3.00",
        "groups": [
            {
                "ad_group": "Menú restaurante ES",
                "final_url": "https://qrbanner.com/es/templates/restaurant-menu",
                "path1": "Menu-QR",
                "path2": "",
                "keywords": [
                    ("[codigo qr menu restaurante]", "Exact"),
                    ("[menu digital qr]", "Exact"),
                    ('"generador qr de menu"', "Phrase"),
                ],
                "headlines": [
                    "QR de menú restaurante",
                    "Menú sin reimprimir",
                    "Analítica en mesa",
                    "Menú QR gratis",
                ],
                "descriptions": [
                    "Sustituya menús en papel por QR dinámico. Actualice platos cuando quiera. Gratis.",
                    "QR de menú con analítica y landing. Plantilla lista — créelo en minutos.",
                ],
            },
        ],
    },
]

NEGATIVES_ES = [
    "descarga gratis",
    "solo plantilla",
    "png",
    "svg only",
    "qr estático",
    "lector qr",
    "escanear qr",
    "código de barras",
    "minecraft",
    "fortnite",
    "juego",
    "apk",
    "crack",
    "empleo",
    "salario",
    "qué es un qr",
    "wikipedia",
]


def main() -> int:
    root = Path(__file__).resolve().parents[1] / "marketing" / "google-ads"

    emit_pack(
        root / "editor-csv",
        title="Google Ads Editor CSV (EN Search test)",
        campaigns=CAMPAIGNS,
        negatives=NEGATIVES,
        languages="en",
        locations="United States;United Kingdom;Canada;Australia",
        headline_fillers=[
            "Try QRbanner Free",
            "Scan Analytics Included",
            "Print-Ready QR Export",
            "No Credit Card to Start",
            "API on Free Plan",
        ],
        desc_fillers=[
            "Dynamic QR with analytics and API. Free plan available. Start on QRbanner today.",
            "Edit links after printing. Track scans. Upgrade when you need more codes.",
        ],
        readme_extra="Budgets: Create $5/day · Competitor $3/day · Use cases $3/day.\nEnable Create first after GA4 §A–C.",
        sitelinks=SITELINKS_EN,
        callouts=CALLOUTS_EN,
        snippet_header="Types",
        snippet_values=["Restaurant", "WiFi", "Business Card", "Events", "PDF", "Menu"],
    )

    emit_pack(
        root / "editor-csv-de",
        title="Google Ads Editor CSV (DE — DE/AT/CH)",
        campaigns=CAMPAIGNS_DE,
        negatives=NEGATIVES_DE,
        languages="de",
        locations="Germany;Austria;Switzerland",
        headline_fillers=[
            "Kostenlos starten",
            "Scan-Analysen inklusive",
            "API im Free-Plan",
            "Druckfertiger QR-Export",
            "Keine Kreditkarte nötig",
            "QRbanner Smart QR",
            "Dynamische QR-Codes",
            "14 Tage Pro-Test",
            "Links jederzeit ändern",
            "1 Free Dynamic QR",
            "Geo- und Zeit-Routing",
        ],
        desc_fillers=[
            "Dynamische QR-Codes mit Analysen und API. Free-Plan verfügbar. Jetzt starten.",
            "Links nach dem Druck ändern. Scans tracken. Bei Bedarf upgraden.",
        ],
        readme_extra="Budgets: Create €5/Tag · Competitor €3 · Use cases €3.\nSprache DE · DE/AT/CH.",
        sitelinks=SITELINKS_DE,
        callouts=CALLOUTS_DE,
        snippet_header="Typen",
        snippet_values=["Restaurant", "WiFi", "Visitenkarte", "Events", "PDF", "Menü"],
    )

    emit_pack(
        root / "editor-csv-es",
        title="Google Ads Editor CSV (ES — ES/MX)",
        campaigns=CAMPAIGNS_ES,
        negatives=NEGATIVES_ES,
        languages="es",
        locations="Spain;Mexico",
        headline_fillers=[
            "Empiece gratis",
            "Analítica de escaneos",
            "API en plan gratuito",
            "Sin tarjeta de crédito",
            "QRbanner QR inteligente",
            "QR dinámico gratis",
            "Edite tras imprimir",
            "Prueba Pro 14 días",
            "Exportación impresión",
            "1 QR dinámico gratis",
            "Geovalla y horarios",
        ],
        desc_fillers=[
            "Códigos QR dinámicos con analítica y API. Plan gratuito disponible. Empiece hoy.",
            "Edite el enlace tras imprimir. Rastree escaneos. Mejore de plan cuando lo necesite.",
        ],
        readme_extra="Presupuestos: Create €5/día · Competitor €3 · Use cases €3.\nIdioma ES · ES/MX.",
        sitelinks=SITELINKS_ES,
        callouts=CALLOUTS_ES,
        snippet_header="Tipos",
        snippet_values=["Restaurante", "WiFi", "Tarjeta de visita", "Eventos", "PDF", "Menú"],
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
