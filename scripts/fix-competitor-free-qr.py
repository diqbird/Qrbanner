#!/usr/bin/env python3
path = r"C:\Users\ACRO Technology\qrbanner\lib\competitor-pages.ts"
text = open(path, encoding="utf-8").read()
if "import { PLANS }" not in text:
    text = text.replace(
        "export interface CompetitorPage {",
        "import { PLANS } from './plans';\n\nconst FREE_QR = PLANS.free.maxQrCodes;\n\nexport interface CompetitorPage {",
    )
replacements = [
    ("'25 free dynamic QR codes'", "`${FREE_QR} free dynamic QR codes`"),
    ("'25 free dynamic codes with API'", "`${FREE_QR} free dynamic codes with API`"),
    ("'25 free dynamic codes + API'", "`${FREE_QR} free dynamic codes + API`"),
    ("'25 free dynamic codes'", "`${FREE_QR} free dynamic codes`"),
    ("25 free dynamic QR codes vs", "${FREE_QR} free dynamic QR codes vs"),
]
for old, new in replacements:
    text = text.replace(old, new)
open(path, "w", encoding="utf-8").write(text)
print("remaining 25 free:", text.count("25 free"))
