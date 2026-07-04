#!/usr/bin/env python3
"""
DMARC upgrade helper — prints recommended DNS TXT for p=quarantine.
Apply manually in Hostinger DNS (or your registrar) for _dmarc.qrbanner.com
"""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DOMAIN = os.environ.get("MAIL_DOMAIN", "qrbanner.com")
REPORT_EMAIL = os.environ.get("DMARC_RUA", f"dmarc@{DOMAIN}")
POLICY = os.environ.get("DMARC_POLICY", "quarantine")  # quarantine | reject


def dns_txt(name: str) -> str:
    r = subprocess.run(
        ["nslookup", "-type=TXT", name],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return ((r.stdout or "") + (r.stderr or "")).lower()


def main() -> int:
    print(f"=== DMARC upgrade guide ({DOMAIN}) ===\n")

    current = dns_txt(f"_dmarc.{DOMAIN}")
    print("Current record snippet:")
    for line in current.splitlines():
        if "dmarc" in line or "v=" in line:
            print(f"  {line.strip()}")

    recommended = (
        f"v=DMARC1; p={POLICY}; rua=mailto:{REPORT_EMAIL}; "
        f"pct=100; adkim=r; aspf=r; fo=1"
    )

    print(f"\nRecommended TXT for _dmarc.{DOMAIN}:")
    print(f"  {recommended}")

    print("\nSteps (Hostinger DNS):")
    print("  1. hPanel → Domains → qrbanner.com → DNS / DNS Zone")
    print("  2. Edit TXT record: Host = _dmarc")
    print("  3. Paste the recommended value above")
    print("  4. TTL 3600, save")
    print("  5. Wait 15–60 min, then run: npm run verify:dmarc")

    print("\nSteps (Hostinger mailbox for rua reports):")
    print(f"  1. hPanel → Emails → Create email: dmarc@{DOMAIN}")
    print("  2. Set a strong password; forward to support@ if preferred")
    print("  3. DMARC aggregate XML reports arrive at this inbox weekly")

    print("\nTimeline after quarantine:")
    print("  Week 0–2: monitor rua reports for failures")
    print("  Week 2–4: if clean, upgrade to p=reject")

    if f"p={POLICY}" in current:
        print(f"\n=== Result: PASS — already p={POLICY} ===")
        return 0

    if "p=none" in current:
        print("\n=== Result: ACTION REQUIRED — update DNS to p=quarantine ===")
        print("  (Cannot auto-apply without DNS API credentials)")
        return 0

    print("\n=== Result: REVIEW — policy state unclear ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
