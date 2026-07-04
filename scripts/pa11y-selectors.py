#!/usr/bin/env python3
import json
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

r = subprocess.run(
    ["npx", "--yes", "pa11y", "https://qrbanner.com", "--standard", "WCAG2AA", "--reporter", "json"],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
    shell=True,
    cwd=r"C:\Users\ACRO Technology\qrbanner",
)
raw = r.stdout or r.stderr
# JSON may be last line or whole stdout
for line in raw.splitlines():
    line = line.strip()
    if line.startswith("{"):
        data = json.loads(line)
        break
else:
    data = json.loads(raw)

if isinstance(data, list):
    issues = [i for i in data if i.get("type") == "error"]
else:
    issues = [i for i in data.get("issues", []) if i.get("type") == "error"]
print(f"Found {len(issues)} errors\n")
for i in issues[:12]:
    print(i.get("selector", "?"))
    print(" ", i.get("message", ""))
    for k in ("foregroundColor", "backgroundColor", "contrastRatio"):
        if k in i:
            print(f"  {k}: {i[k]}")
    ctx = i.get("context", "")
    if ctx:
        print("  context:", ctx[:120])
    print()
