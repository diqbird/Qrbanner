#!/usr/bin/env python3
"""Read existing /tmp/lh-*.json on VPS and print failing audits per page."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)

CMD = r"""
python3 - <<'PY'
import json, glob
labels = ["/", "/qr/create", "/pricing", "/use-cases", "/qr-types"]
paths = sorted(glob.glob("/tmp/lh-*.json"))
for path, label in zip(paths, labels):
    with open(path) as f:
        r = json.load(f)
    audits = r.get("audits", {})
    cats = r.get("categories", {})
    print("\n=== %s ===" % label)
    for cat_id in ("performance", "accessibility", "best-practices"):
        cat = cats.get(cat_id, {})
        score = round((cat.get("score") or 0) * 100)
        print("  [%s] %d" % (cat_id, score))
        refs = cat.get("auditRefs", [])
        for ref in refs:
            aid = ref.get("id")
            a = audits.get(aid, {})
            s = a.get("score")
            mode = a.get("scoreDisplayMode")
            if mode in ("notApplicable", "manual", "informative"):
                continue
            if s is None or s >= 0.9:
                continue
            title = a.get("title", aid)
            disp = a.get("displayValue", "")
            print("     - %s | %.2f | %s %s" % (aid, s, title, ("("+disp+")") if disp else ""))
PY
echo EXIT:0
"""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
_, stdout, stderr = c.exec_command(CMD, timeout=120)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
c.close()

log = os.path.join(LOCAL, "scripts", "lighthouse-diagnose-last.log")
with open(log, "w", encoding="utf-8") as f:
    f.write(out)
    if err:
        f.write("\n--- stderr ---\n" + err)

for line in out.splitlines():
    if line.strip() and not line.startswith("EXIT"):
        try:
            print(line)
        except Exception:
            print(line.encode("ascii", errors="replace").decode("ascii"))
print("\nFull log:", log)
