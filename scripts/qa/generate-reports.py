#!/usr/bin/env python3
"""Generate markdown QA reports from raw JSON artifacts."""
import json
import os
import sys
from datetime import datetime, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "qa-reports")
PAGES_RAW = os.path.join(OUT, "raw-pages.json")
APIS_RAW = os.path.join(OUT, "raw-apis.json")
FLOWS_RAW = os.path.join(OUT, "raw-flows.json")


def load(path):
    if not os.path.isfile(path):
        return None
    return json.load(open(path, encoding="utf-8"))


def write(name: str, body: str) -> None:
    os.makedirs(OUT, exist_ok=True)
    fp = os.path.join(OUT, name)
    with open(fp, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"  wrote {fp}")


def report_pages(data) -> str:
    lines = [
        "# QA Report — Public Pages",
        "",
        f"**Target:** `{data['base']}`  ",
        f"**Tested:** {data['testedAt']}  ",
        f"**Pages:** {len(data['pages'])}",
        "",
        "## Summary",
        "",
    ]
    issue_pages = []
    for p in data["pages"]:
        issues = p["consoleErrorCount"] + p["requestFailedCount"] + (1 if p.get("navError") else 0)
        if issues or (p.get("navStatus") or 0) >= 400:
            issue_pages.append(p)

    lines.append(f"| Metric | Count |")
    lines.append(f"|--------|-------|")
    lines.append(f"| Pages tested | {len(data['pages'])} |")
    lines.append(f"| Pages with issues | {len(issue_pages)} |")
    lines.append(f"| Total console errors | {sum(p['consoleErrorCount'] for p in data['pages'])} |")
    lines.append(f"| Total failed requests | {sum(p['requestFailedCount'] for p in data['pages'])} |")
    lines.append("")

    lines.append("## Per-page results")
    lines.append("")
    for p in data["pages"]:
        flag = "PASS" if p["path"] not in [x["path"] for x in issue_pages] else "ISSUES"
        lines.append(f"### `{p['path']}` — {flag}")
        lines.append("")
        lines.append(f"- **URL:** {p['url']}")
        lines.append(f"- **Navigation HTTP:** {p.get('navStatus')} ({p.get('durationMs')}ms)")
        if p.get("navError"):
            lines.append(f"- **Navigation error:** `{p['navError']}`")
        lines.append(f"- **Title:** {p.get('title', '')[:120]}")
        lines.append(f"- **Header visible:** {p.get('hasHeader')}")
        lines.append(f"- **Footer visible:** {p.get('hasFooter')}")
        lines.append(f"- **Network responses:** {p.get('totalResponses')}")
        lines.append("")

        if p["consoleErrors"]:
            lines.append("#### Console errors")
            for e in p["consoleErrors"]:
                lines.append(f"- `{e['type']}`: {e['text'][:300]}")
            lines.append("")

        if p["requestFailed"]:
            lines.append("#### Failed network requests")
            for r in p["requestFailed"]:
                lines.append(f"- `{r['method']}` {r['url']} — {r['failure']}")
            lines.append("")

        if p["responses4xx5xx"]:
            lines.append("#### HTTP 4xx/5xx responses")
            for r in p["responses4xx5xx"]:
                if r["url"].startswith(data["base"]):
                    lines.append(f"- **{r['status']}** `{r['method']}` {r['url']}")
            lines.append("")

    return "\n".join(lines)


def report_apis(data) -> str:
    lines = [
        "# QA Report — API Endpoints",
        "",
        f"**Target:** `{data['base']}`  ",
        f"**Tested:** {data['testedAt']}  ",
        f"**Requests:** {len(data['results'])}",
        "",
        "## Summary",
        "",
    ]
    by_verdict = {}
    for r in data["results"]:
        by_verdict.setdefault(r["verdict"], []).append(r)

    lines.append("| Verdict | Count |")
    lines.append("|---------|-------|")
    for v in sorted(by_verdict.keys()):
        lines.append(f"| {v} | {len(by_verdict[v])} |")
    lines.append("")

    fails = [r for r in data["results"] if r["verdict"].startswith("FAIL")]
    if fails:
        lines.append("## Critical failures (5xx / network)")
        lines.append("")
        for r in fails:
            lines.append(f"### `{r['method']} {r['path']}`")
            lines.append(f"- Status: **{r['status']}**")
            if r.get("error"):
                lines.append(f"- Error: `{r['error']}`")
            if r.get("bodySnippet"):
                lines.append(f"- Body: `{r['bodySnippet'][:200]}`")
            lines.append("")

    lines.append("## All endpoints")
    lines.append("")
    lines.append("| Method | Path | Status | Verdict | ms |")
    lines.append("|--------|------|--------|---------|-----|")
    for r in data["results"]:
        lines.append(
            f"| {r['method']} | `{r['path']}` | {r['status']} | {r['verdict']} | {r['durationMs']} |"
        )
    lines.append("")
    return "\n".join(lines)


def report_flows(data) -> str:
    lines = [
        "# QA Report — User Flows",
        "",
        f"**Target:** `{data['base']}`  ",
        f"**Tested:** {data['testedAt']}",
        "",
    ]
    for flow in data.get("flows", []):
        lines.append(f"## {flow['name']} — {flow['verdict']}")
        lines.append("")
        for step in flow.get("steps", []):
            lines.append(f"- {step}")
        if flow.get("consoleErrors"):
            lines.append("")
            lines.append("### Console errors")
            for e in flow["consoleErrors"]:
                lines.append(f"- {e}")
        if flow.get("networkFailures"):
            lines.append("")
            lines.append("### Network failures")
            for n in flow["networkFailures"]:
                lines.append(f"- {n}")
        lines.append("")
    return "\n".join(lines)


def report_executive(pages, apis, flows) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Senior QA — Executive Summary",
        "",
        f"**Project:** QRbanner (`https://qrbanner.com`)  ",
        f"**Report generated:** {now}  ",
        f"**Methodology:** Sequential live probes — no code assumptions.",
        "",
        "## Scope",
        "",
        "- Public page navigation with console + network capture",
        "- All discovered API routes probed without authenticated session",
        "- Interactive user flows (forms, auth UI)",
        "",
        "## Results at a glance",
        "",
    ]

    page_issues = 0
    console_total = 0
    net_fail = 0
    if pages:
        for p in pages["pages"]:
            c = p["consoleErrorCount"] + p["requestFailedCount"] + (1 if p.get("navError") else 0)
            if c or (p.get("navStatus") or 0) >= 400:
                page_issues += 1
            console_total += p["consoleErrorCount"]
            net_fail += p["requestFailedCount"]
        lines.append(f"| Pages tested | {len(pages['pages'])} |")
        lines.append(f"| Pages with issues | {page_issues} |")
        lines.append(f"| Console errors (total) | {console_total} |")
        lines.append(f"| Failed network requests | {net_fail} |")
        lines.append("")

    if apis:
        fails = sum(1 for r in apis["results"] if r["verdict"].startswith("FAIL"))
        warn = sum(1 for r in apis["results"] if r["verdict"] == "WARN_RATE_LIMIT")
        lines.append(f"| API probes | {len(apis['results'])} |")
        lines.append(f"| API critical failures | {fails} |")
        lines.append(f"| API rate limits | {warn} |")
        lines.append("")

    if flows:
        flow_fail = sum(1 for f in flows["flows"] if f["verdict"] != "PASS")
        lines.append(f"| User flows | {len(flows['flows'])} |")
        lines.append(f"| Flow failures | {flow_fail} |")
        lines.append("")

    lines.append("## Report index")
    lines.append("")
    lines.append("1. [Public Pages](./01-public-pages.md)")
    lines.append("2. [API Endpoints](./02-api-endpoints.md)")
    lines.append("3. [User Flows](./03-user-flows.md)")
    lines.append("4. [Console Errors](./04-console-errors.md)")
    lines.append("5. [Network Failures](./05-network-failures.md)")
    lines.append("")
    return "\n".join(lines)


def report_console_aggregate(pages, flows) -> str:
    lines = ["# QA Report — Console Errors (aggregate)", ""]
    if pages:
        for p in pages["pages"]:
            if not p["consoleErrors"]:
                continue
            lines.append(f"## `{p['path']}`")
            for e in p["consoleErrors"]:
                lines.append(f"- **{e['type']}**: {e['text']}")
            lines.append("")
    if flows:
        for f in flows.get("flows", []):
            if not f.get("consoleErrors"):
                continue
            lines.append(f"## Flow: {f['name']}")
            for e in f["consoleErrors"]:
                lines.append(f"- {e}")
            lines.append("")
    if len(lines) <= 2:
        lines.append("_No console errors captured._")
    return "\n".join(lines)


def report_network_aggregate(pages, flows) -> str:
    lines = ["# QA Report — Network Failures (aggregate)", ""]
    if pages:
        for p in pages["pages"]:
            if not p["requestFailed"]:
                continue
            lines.append(f"## `{p['path']}`")
            for r in p["requestFailed"]:
                lines.append(f"- `{r['method']}` **{r['url']}**")
                lines.append(f"  - Reason: {r['failure']}")
            lines.append("")
    if flows:
        for f in flows.get("flows", []):
            if not f.get("networkFailures"):
                continue
            lines.append(f"## Flow: {f['name']}")
            for n in f["networkFailures"]:
                lines.append(f"- {n}")
            lines.append("")
    if len(lines) <= 2:
        lines.append("_No failed network requests captured._")
    return "\n".join(lines)


def main() -> int:
    pages = load(PAGES_RAW)
    apis = load(APIS_RAW)
    flows = load(FLOWS_RAW)

    print("Generating markdown reports...")
    write("00-executive-summary.md", report_executive(pages, apis, flows))
    if pages:
        write("01-public-pages.md", report_pages(pages))
    if apis:
        write("02-api-endpoints.md", report_apis(apis))
    if flows:
        write("03-user-flows.md", report_flows(flows))
    write("04-console-errors.md", report_console_aggregate(pages, flows))
    write("05-network-failures.md", report_network_aggregate(pages, flows))
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
