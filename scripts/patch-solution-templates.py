#!/usr/bin/env python3
"""Add templateId to solutions missing Faz D archetype links."""
import re
from pathlib import Path

MAP = {
    "university-campus": "campus-institution",
    "government-public-sector": "campus-institution",
    "supermarket-grocery": "retail-grocery",
    "cinema-theaters": "entertainment-venue",
    "logistics-warehouses": "property-facilities",
    "automotive-dealerships": "automotive-marine",
    "brewery-beverage": "entertainment-venue",
    "insurance-agencies": "professional-services",
    "property-management": "property-facilities",
    "veterinary-clinics": "specialty-healthcare",
    "law-firms": "professional-services",
    "accounting-firms": "professional-services",
    "optometry-eye-care": "specialty-healthcare",
    "childcare-centers": "family-community",
    "senior-living": "family-community",
    "pet-grooming": "local-services-hub",
    "coworking-spaces": "property-facilities",
    "music-venues": "entertainment-venue",
    "farmers-markets": "retail-grocery",
    "wine-tasting": "entertainment-venue",
    "marina-boating": "automotive-marine",
    "florists-gift-shops": "retail-grocery",
    "bakery-pastry": "retail-grocery",
    "car-wash-detailing": "automotive-marine",
    "food-trucks": "mobile-vendor",
    "landscaping-lawn-care": "local-services-hub",
    "dry-cleaning-laundry": "local-services-hub",
    "churches-faith": "family-community",
    "printing-copy-shops": "local-services-hub",
}

path = Path(__file__).resolve().parents[1] / "lib" / "solutions.ts"
text = path.read_text(encoding="utf-8")

for slug, tid in MAP.items():
    if f"slug: '{slug}'" not in text:
        print("missing slug", slug)
        continue
    # Only inspect header fields (slug → icon → categoryId), not later solutions
    header = re.search(
        rf"slug: '{slug}',[\s\S]*?icon: '[^']+',\n    categoryId:",
        text,
    )
    if not header:
        print("no header", slug)
        continue
    if "templateId:" in header.group(0):
        print("already", slug)
        continue
    pattern = rf"(slug: '{slug}',[\s\S]*?icon: '[^']+',\n)(    categoryId:)"
    repl = rf"\1    templateId: '{tid}',\n\2"
    new, n = re.subn(pattern, repl, text, count=1)
    if n != 1:
        print("FAIL", slug, n)
    else:
        text = new
        print("ok", slug, tid)

path.write_text(text, encoding="utf-8")
print("written")
