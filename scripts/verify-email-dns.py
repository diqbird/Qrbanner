#!/usr/bin/env python3
"""DNS deliverability check: SPF, DKIM, DMARC for qrbanner.com mail."""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DOMAIN = os.environ.get("MAIL_DOMAIN", "qrbanner.com")
FAILURES: list[str] = []


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"  [FAIL] {msg}")


def ok(msg: str) -> None:
    print(f"  [OK] {msg}")


def dns_txt(name: str) -> list[str]:
    r = subprocess.run(
        ["nslookup", "-type=TXT", name],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    lines = (r.stdout or "") + (r.stderr or "")
    records = []
    for line in lines.splitlines():
        line = line.strip()
        if line.startswith('"') or "text =" in line.lower() or "strings" in line.lower():
            records.append(line)
        elif "v=spf1" in line.lower() or "v=dmarc1" in line.lower() or "v=dkim1" in line.lower():
            records.append(line)
    # flatten quoted TXT
    blob = " ".join(records).lower()
    return blob


def main() -> int:
    print(f"=== Email DNS ({DOMAIN}) ===\n")

    spf = dns_txt(DOMAIN)
    if "v=spf1" in spf:
        ok(f"SPF record present for {DOMAIN}")
        if "include:" not in spf and "a " not in spf and "mx " not in spf:
            fail("SPF record looks minimal — verify sending hosts")
    else:
        fail(f"No SPF (v=spf1) TXT for {DOMAIN}")

    dmarc = dns_txt(f"_dmarc.{DOMAIN}")
    if "v=dmarc1" in dmarc:
        ok(f"DMARC record present (_dmarc.{DOMAIN})")
        if "p=none" in dmarc:
            ok("DMARC policy p=none (monitoring — acceptable for launch)")
        elif "p=quarantine" in dmarc or "p=reject" in dmarc:
            ok("DMARC enforcement policy set")
    else:
        fail(f"No DMARC (v=DMARC1) for _dmarc.{DOMAIN}")

    dkim_selectors = [
        "default._domainkey",
        "hostingermail-a._domainkey",
        "hostingermail-b._domainkey",
        "google._domainkey",
        "k1._domainkey",
        "mail._domainkey",
    ]
    dkim_found = False
    for sel in dkim_selectors:
        txt = dns_txt(f"{sel}.{DOMAIN}")
        if "v=dkim1" in txt or "p=" in txt and "domainkey" in sel:
            ok(f"DKIM selector found: {sel}.{DOMAIN}")
            dkim_found = True
            break
    if not dkim_found:
        # Hostinger often uses hostingermail-a
        fail(f"No common DKIM selector found for {DOMAIN} — check Hostinger panel")

    mx = subprocess.run(
        ["nslookup", "-type=MX", DOMAIN],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    mx_out = (mx.stdout or "").lower()
    if "mail exchanger" in mx_out or "mx preference" in mx_out:
        ok(f"MX records present for {DOMAIN}")
    else:
        fail(f"No MX records for {DOMAIN}")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
