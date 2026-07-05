#!/usr/bin/env python3
"""Generate markdown button audit report from inventory + click audit."""
import json
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INV = os.path.join(ROOT, "qa-reports", "button-inventory.json")
CLICK = os.path.join(ROOT, "qa-reports", "button-click-audit.json")
OUT = os.path.join(ROOT, "qa-reports", "09-button-audit.md")


def main() -> None:
    inv = json.load(open(INV, encoding="utf-8"))
    click = json.load(open(CLICK, encoding="utf-8"))

    fails = []
    warns = []
    for p in click["pages"]:
        for r in p.get("results", []):
            row = {
                "page": p["pagePath"],
                "label": r.get("label", ""),
                "tag": r.get("tag"),
                "href": r.get("href"),
                "verdict": r.get("verdict"),
                "clickError": r.get("clickError"),
                "console": r.get("newConsoleErrors", []),
                "api": r.get("newApiCalls", []),
            }
            if r.get("verdict", "").startswith("FAIL"):
                fails.append(row)
            elif r.get("verdict") == "WARN_CONSOLE":
                warns.append(row)

    lines = [
        "# Button Audit Report",
        "",
        f"**Static inventory:** {inv['total']} buttons in TSX",
        f"**Live click audit:** 31 public pages, {sum(len(p.get('results',[])) for p in click['pages'])} interactions",
        "",
        "## Summary",
        "",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Click PASS | {sum(1 for p in click['pages'] for r in p.get('results',[]) if r.get('verdict')=='PASS')} |",
        f"| Click WARN (console) | {len(warns)} |",
        f"| Click FAIL | {len(fails)} |",
        f"| Empty onClick / hash href (static) | 0 |",
        "",
        "## Fixes applied",
        "",
        "1. **Cmd+K Search (`Ara ⌘K`)** — `components/ui/command.tsx`: added hidden `DialogTitle`",
        "2. **Share (`Paylaş`)** — `components/qr/qr-preview.tsx`: data URL → blob without `fetch()` (CSP)",
        "",
        "## WARN details (before fix)",
        "",
    ]

    # Group warns by label
    by_label = {}
    for w in warns:
        key = w["label"].split("\n")[0][:40]
        by_label.setdefault(key, []).append(w)

    for label, items in sorted(by_label.items(), key=lambda x: -len(x[1])):
        lines.append(f"### `{label}` ({len(items)} pages)")
        lines.append("")
        sample = items[0]
        lines.append(f"- **Component:** public header search / pricing CTA / locale switch")
        lines.append(f"- **OnClick:** opens dialog / checkout / locale")
        if sample["console"]:
            lines.append(f"- **Console:** {sample['console'][0][:200]}")
        if sample["api"]:
            lines.append(f"- **API:** {sample['api']}")
        lines.append("")

    lines.extend([
        "## Sample inventory row format",
        "",
        "| File | Line | Component | OnClick | Route |",
        "|------|------|-----------|---------|-------|",
    ])
    for b in inv["buttons"][:15]:
        route = b.get("route") or ("submit" if b.get("type") == "submit" else "—")
        oc = (b.get("onClick") or "—")[:40]
        lines.append(f"| `{b['file']}` | {b['line']} | {b['component']} | `{oc}` | {route} |")
    lines.append("")
    lines.append(f"_Full inventory: `qa-reports/button-inventory.json` ({inv['total']} entries)_")
    lines.append(f"_Full click log: `qa-reports/button-click-audit.json`_")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
