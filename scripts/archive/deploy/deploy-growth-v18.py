#!/usr/bin/env python3
"""Deploy Growth Pack v18: developers i18n, features shell, +2 content each, logos."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    # v18 core
    "app/(public)/developers/page.tsx",
    "app/(public)/features/page.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/solutions.ts",
    "lib/solution-icons.ts",
    "lib/case-studies.ts",
    "lib/competitor-pages.ts",
    "lib/blog/posts-service.ts",
    "lib/blog/posts/developers-api-getting-started.ts",
    "lib/blog/posts/property-management-tenant-qr.ts",
    "lib/customer-logos.ts",
    "public/logos/brewery.svg",
    "public/logos/insurance.svg",
    # blog deps (posts-service imports all)
    "lib/blog/posts/referral-program-guide.ts",
    "lib/blog/posts/dynamic-vs-static-qr.ts",
    "lib/blog/posts/university-wayfinding-qr.ts",
    "lib/blog/posts/logistics-warehouse-qr.ts",
    "lib/blog/posts/automotive-dealership-qr.ts",
    "lib/blog/posts/webhook-automation-guide.ts",
    "lib/blog/posts/fitness-gym-qr.ts",
    "lib/blog/posts/print-shop-banner-qr.ts",
    "lib/blog/posts/custom-scan-domain-guide.ts",
    "lib/blog/posts/nonprofit-gala-qr.ts",
    "lib/blog/posts/brewery-taproom-qr.ts",
    "lib/blog/posts/insurance-agency-qr.ts",
    "lib/blog/posts/dynamic-qr-codes-guide.ts",
    "lib/blog/posts/restaurant-menu-qr.ts",
    "lib/blog/posts/wifi-qr-guide.ts",
    "lib/blog/posts/qr-analytics-guide.ts",
    "lib/blog/posts/qr-security-guide.ts",
    "lib/blog/posts/bulk-qr-guide.ts",
    "lib/blog/posts/retail-qr-codes.ts",
    "lib/blog/posts/hotel-qr-codes.ts",
    "lib/blog/posts/healthcare-qr-codes.ts",
    "lib/blog/posts/agency-qr-codes.ts",
    "lib/blog/posts/government-qr-codes.ts",
    "lib/blog/posts/museum-qr-codes.ts",
    "lib/blog/posts/university-qr-codes.ts",
    "lib/blog/posts/stadium-qr-codes.ts",
    "lib/blog/posts/cinema-qr-codes.ts",
    "lib/blog/posts/pharmacy-qr-codes.ts",
    "lib/blog/posts/civic-engagement-qr.ts",
    "lib/blog/posts/supermarket-loyalty-qr.ts",
    "lib/blog/posts/logistics-qr-codes.ts",
    "lib/blog/posts/real-estate-open-house-qr.ts",
    "lib/blog/posts/manufacturing-qr-codes.ts",
    "lib/blog/posts/nonprofit-fundraising-qr.ts",
    "lib/blog/posts/salon-spa-qr-codes.ts",
    "lib/blog/posts/affiliate-qr-marketing.ts",
    "app/sitemap.ts",
    "components/landing/customer-logos.tsx",
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)


def ensure_remote_dir(sftp, remote_dir: str) -> None:
    parts = remote_dir.replace("\\", "/").strip("/").split("/")
    path = ""
    for part in parts:
        path += "/" + part
        try:
            sftp.stat(path)
        except OSError:
            sftp.mkdir(path)


c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local_path = os.path.join(LOCAL, rel)
    remote_path = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    ensure_remote_dir(sftp, os.path.dirname(remote_path).replace("\\", "/"))
    sftp.put(local_path, remote_path)
    print("ok", rel)
sftp.close()

_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-growth18.log 2>&1; echo EXIT:$?; tail -40 /tmp/qrb-growth18.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_growth18.txt"), "w", encoding="utf-8") as f:
    f.write(out)
_, o, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null; echo done", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out.encode("ascii", errors="replace").decode("ascii"))
    sys.exit(1)
print("deploy ok")
