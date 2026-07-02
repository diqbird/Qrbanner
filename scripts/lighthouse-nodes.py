#!/usr/bin/env python3
"""Print failing element nodes for specific audits from VPS lh JSON."""
import os, sys, paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
if not PW:
    print("Set DEPLOY_PASSWORD", file=sys.stderr); sys.exit(1)

CMD = r"""
python3 - <<'PY'
import json, glob
labels = ["/", "/qr/create", "/pricing", "/use-cases", "/qr-types"]
want = {"target-size", "color-contrast", "heading-order", "link-in-text-block", "aria-dialog-name"}
paths = sorted(glob.glob("/tmp/lh-*.json"))
for path, label in zip(paths, labels):
    if label not in ("/", "/qr/create"):
        continue
    with open(path) as f:
        r = json.load(f)
    audits = r.get("audits", {})
    print("\n===== %s =====" % label)
    for aid in want:
        a = audits.get(aid, {})
        if a.get("score") in (None, 1):
            continue
        print("\n-- %s --" % aid)
        items = (a.get("details", {}) or {}).get("items", [])
        for it in items[:8]:
            node = it.get("node", {}) or {}
            snippet = node.get("snippet", "")
            sel = node.get("selector", "")
            path = node.get("path", "")
            expl = node.get("explanation", "") or it.get("subItems", "")
            print("   sel:", sel)
            print("   snip:", snippet)
            print("   path:", path)
            if expl:
                print("   why:", str(expl)[:220])
PY
echo EXIT:0
"""
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
_, so, se = c.exec_command(CMD, timeout=120)
out = so.read().decode("utf-8", "replace"); err = se.read().decode("utf-8", "replace")
c.close()
with open(os.path.join(LOCAL, "scripts", "lighthouse-nodes-last.log"), "w", encoding="utf-8") as f:
    f.write(out + ("\n--stderr--\n"+err if err else ""))
for line in out.splitlines():
    if line.strip() and not line.startswith("EXIT"):
        try: print(line)
        except Exception: print(line.encode("ascii","replace").decode("ascii"))
