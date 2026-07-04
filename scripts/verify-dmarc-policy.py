#!/usr/bin/env python3
"""Check DMARC policy maturity — recommends p=quarantine/reject when ready."""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DOMAIN = os.environ.get("MAIL_DOMAIN", "qrbanner.com")
SUPPORT = os.environ.get("MAIL_SUPPORT", f"support@{DOMAIN}")


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
    print(f"=== DMARC policy check ({DOMAIN}) ===\n")
    dmarc = dns_txt(f"_dmarc.{DOMAIN}")

    if "v=dmarc1" not in dmarc:
        print("  [FAIL] No DMARC record")
        return 1

    if "p=reject" in dmarc:
        print("  [OK] DMARC p=reject (enforcement)")
    elif "p=quarantine" in dmarc:
        print("  [OK] DMARC p=quarantine (enforcement)")
    elif "p=none" in dmarc:
        print("  [OK] DMARC p=none (monitoring — acceptable for launch)")
        print("  [INFO] Upgrade to p=quarantine then p=reject after 2–4 weeks of clean reports")
        print(f"  [INFO] Recommended rua: mailto:{SUPPORT}")
    else:
        print("  [WARN] DMARC policy tag unclear")

    if "rua=mailto:" in dmarc:
        print("  [OK] Aggregate reports (rua) configured")
    else:
        print(f"  [INFO] Add rua=mailto:{SUPPORT} to receive DMARC reports")

    print("\n=== Result: PASS (informational) ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
