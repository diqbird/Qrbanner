#!/usr/bin/env python3
"""Generate Google Ads Editor-friendly CSVs from the EN paste pack."""
from __future__ import annotations

import csv
import os
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "marketing" / "google-ads" / "editor-csv"

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


def write_campaigns(path: Path) -> None:
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
        for c in CAMPAIGNS:
            w.writerow(
                {
                    "Campaign": c["campaign"],
                    "Campaign Type": "Search",
                    "Campaign Status": "Paused",
                    "Budget": c["budget"],
                    "Budget type": "Daily",
                    "Bid Strategy Type": "Maximize clicks",
                    "Networks": "Google search",
                    "Languages": "en",
                    "Locations": "United States;United Kingdom;Canada;Australia",
                }
            )


def write_ad_groups(path: Path) -> None:
    cols = ["Campaign", "Ad Group", "Ad Group Status", "Max CPC"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in CAMPAIGNS:
            for g in c["groups"]:
                w.writerow(
                    {
                        "Campaign": c["campaign"],
                        "Ad Group": g["ad_group"],
                        "Ad Group Status": "Enabled",
                        "Max CPC": "1.50",
                    }
                )


def write_keywords(path: Path) -> None:
    cols = ["Campaign", "Ad Group", "Keyword", "Criterion Type", "Final URL", "Keyword Status"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in CAMPAIGNS:
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


def write_rsa(path: Path) -> None:
    cols = (
        ["Campaign", "Ad Group", "Ad type", "Final URL", "Path 1", "Path 2"]
        + [f"Headline {i}" for i in range(1, 16)]
        + [f"Description {i}" for i in range(1, 5)]
    )
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in CAMPAIGNS:
            for g in c["groups"]:
                row = {
                    "Campaign": c["campaign"],
                    "Ad Group": g["ad_group"],
                    "Ad type": "Responsive search ad",
                    "Final URL": g["final_url"],
                    "Path 1": g["path1"],
                    "Path 2": g["path2"],
                }
                for i, h in enumerate(g["headlines"][:15], start=1):
                    assert len(h) <= 30, f"Headline too long ({len(h)}): {h}"
                    row[f"Headline {i}"] = h
                for i, d in enumerate(g["descriptions"][:4], start=1):
                    assert len(d) <= 90, f"Description too long ({len(d)}): {d}"
                    row[f"Description {i}"] = d
                w.writerow(row)


def write_negatives(path: Path) -> None:
    cols = ["Campaign", "Keyword", "Criterion Type", "Keyword Status"]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for c in CAMPAIGNS:
            for term in NEGATIVES:
                w.writerow(
                    {
                        "Campaign": c["campaign"],
                        "Keyword": term,
                        "Criterion Type": "Negative broad",
                        "Keyword Status": "Enabled",
                    }
                )


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    write_campaigns(OUT / "01-campaigns.csv")
    write_ad_groups(OUT / "02-ad-groups.csv")
    write_keywords(OUT / "03-keywords.csv")
    write_rsa(OUT / "04-rsa.csv")
    write_negatives(OUT / "05-negatives.csv")
    readme = OUT / "README.md"
    readme.write_text(
        """# Google Ads Editor CSV (EN Search test)

Import order in [Google Ads Editor](https://ads.google.com/home/tools/ads-editor/):

1. `01-campaigns.csv` — 3 Search campaigns (Paused, Maximize clicks)
2. `02-ad-groups.csv`
3. `03-keywords.csv`
4. `04-rsa.csv`
5. `05-negatives.csv`

Then: **Post** → review → enable Create campaign first after GA4 conversions (§A–C).

Budgets: Create $5/day · Competitor $3/day · Use cases $3/day.
""",
        encoding="utf-8",
    )
    print(f"Wrote CSVs to {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
