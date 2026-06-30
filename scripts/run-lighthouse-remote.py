#!/usr/bin/env python3
"""Run Lighthouse audit on VPS using Playwright's Chromium."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")

URLS = [
    ("https://qrbanner.com", "/"),
    ("https://qrbanner.com/qr/create", "/qr/create"),
    ("https://qrbanner.com/pricing", "/pricing"),
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)

urls_shell = " ".join(f'"{u}"' for u, _ in URLS)

CMD = f"""
cd {REMOTE}
export PLAYWRIGHT_BASE_URL=https://qrbanner.com
npx playwright install chromium 2>&1 | tail -3
CHROME=$(find /root/.cache/ms-playwright -type f \\( -name chrome -o -name chrome-headless-shell \\) 2>/dev/null | head -1)
echo CHROME_PATH=$CHROME
if [ -z "$CHROME" ]; then echo "No Chromium found"; exit 1; fi
export CHROME_PATH="$CHROME"
i=0
for url in {urls_shell}; do
  out="/tmp/lh-$i.json"
  npx -y lighthouse@12 "$url" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$out" 2>&1 | tail -2
  i=$((i+1))
done
python3 - <<'PY'
import json, glob
paths = sorted(glob.glob("/tmp/lh-*.json"))
labels = ["/", "/qr/create", "/pricing"]
for path, label in zip(paths, labels):
    with open(path) as f:
        r = json.load(f)
    c = r.get("categories", {{}})
    skip_seo = "/qr/create" in label
    seo = round((c.get("seo",{{}}).get("score") or 0)*100)
    seo_note = f"seo {{seo}} (skipped gate)" if skip_seo else f"seo {{seo}}"
    print(label,
          "perf", round((c.get("performance",{{}}).get("score") or 0)*100),
          "a11y", round((c.get("accessibility",{{}}).get("score") or 0)*100),
          "bp", round((c.get("best-practices",{{}}).get("score") or 0)*100),
          seo_note)
PY
echo EXIT:0
"""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
print("Running Lighthouse on VPS (2-4 min)...")
_, stdout, stderr = c.exec_command(CMD, timeout=600)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
c.close()

log = os.path.join(LOCAL, "scripts", "lighthouse-run-last.log")
with open(log, "w", encoding="utf-8") as f:
    f.write(out)
    if err:
        f.write("\n--- stderr ---\n")
        f.write(err)

for line in out.splitlines():
    s = line.strip()
    if s and not s.startswith("EXIT") and "npm" not in s.lower():
        print(s)

print(f"\nFull log: {log}")
