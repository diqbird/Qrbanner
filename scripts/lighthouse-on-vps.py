#!/usr/bin/env python3
"""Run Lighthouse on VPS (Chrome available, no local sandbox issues)."""
import json
import os
import sys
import tempfile

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    import paramiko
except ImportError:
    print("paramiko required: pip install paramiko")
    raise SystemExit(1)

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")

TARGETS = [
    ["home", ""],
    ["pricing", "/pricing"],
    ["qr-create", "/qr/create"],
]

REMOTE_JS = """\
const { spawnSync } = require('child_process');
const fs = require('fs');

const targets = JSON.parse(process.argv[2]);
const base = process.argv[3];
const outDir = '/tmp/lighthouse-audit';
fs.mkdirSync(outDir, { recursive: true });
const rows = [];

for (const [label, path] of targets) {
  const url = base + path;
  const out = outDir + '/' + label + '.json';
  const args = [
    url,
    '--quiet',
    '--preset=desktop',
    '--max-wait-for-load=120000',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--output=json',
    '--output-path=' + out,
  ];
  const r = spawnSync('npx', ['lighthouse', ...args], {
    cwd: '/var/www/qrbanner',
    encoding: 'utf8',
    timeout: 180000,
    maxBuffer: 20 * 1024 * 1024,
  });
  if (r.status !== 0) {
    rows.push({
      label,
      path: path || '/',
      error: (r.stderr || r.stdout || 'lighthouse failed').slice(0, 500),
    });
    continue;
  }
  try {
    const report = JSON.parse(fs.readFileSync(out, 'utf8'));
    const cats = report.categories || {};
    rows.push({
      label,
      path: path || '/',
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
    });
  } catch (e) {
    rows.push({ label, path: path || '/', error: String(e) });
  }
}
console.log(JSON.stringify(rows));
"""


def main() -> int:
    if not PW:
        print("Set DEPLOY_PASSWORD to run VPS Lighthouse audit.")
        return 1

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)

    remote_js = f"{REMOTE}/scripts/lighthouse-vps-run.js"
    sftp = c.open_sftp()
    with sftp.file(remote_js, "w") as f:
        f.write(REMOTE_JS)
    sftp.close()

    payload = json.dumps(TARGETS)
    cmd = f"node {remote_js} {json.dumps(payload)} {json.dumps(BASE)}"
    _, stdout, stderr = c.exec_command(cmd, timeout=600)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    c.close()

    if err:
        print(err[-2000:])

    line = out.split("\n")[-1] if out else ""
    try:
        rows = json.loads(line)
    except json.JSONDecodeError:
        print("Failed to parse Lighthouse output:")
        print(out[-3000:] or err)
        return 1

    print(f"=== VPS Lighthouse ({BASE}, desktop) ===\n")
    issue_count = 0
    for row in rows:
        if row.get("error"):
            print(f"  [ERROR] {row.get('path', '?')}: {row['error'][:200]}")
            issue_count += 1
            continue
        skip_seo = row.get("label") == "qr-create"
        fails = []
        if row["performance"] < 50:
            fails.append("performance")
        if row["accessibility"] < 80:
            fails.append("accessibility")
        if row["bestPractices"] < 80:
            fails.append("bestPractices")
        if not skip_seo and row["seo"] < 80:
            fails.append("seo")
        status = "OK" if not fails else f"FAIL [{', '.join(fails)}]"
        seo_note = f" seo={row['seo']}" + (" (noindex skip)" if skip_seo else "")
        print(
            f"  [{status}] {row['path']:12} perf={row['performance']} "
            f"a11y={row['accessibility']} bp={row['bestPractices']}{seo_note}"
        )
        issue_count += len(fails)

    local_out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        ".lighthouse",
        "vps-summary.json",
    )
    os.makedirs(os.path.dirname(local_out), exist_ok=True)
    with open(local_out, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)
    print(f"\nWrote {local_out}")

    if issue_count:
        print(f"\n=== Result: {issue_count} issue(s) ===")
        return 1
    print("\n=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
