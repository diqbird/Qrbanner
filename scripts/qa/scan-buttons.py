#!/usr/bin/env python3
"""Static inventory of all buttons in TSX/JSX files."""
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
OUT = os.path.join(ROOT, "qa-reports", "button-inventory.json")

SKIP_DIRS = {"node_modules", ".next", "qa-reports", ".git"}

# Rough patterns
BTN_RE = re.compile(r"<Button\b([^>]*)>(.*?)</Button>", re.DOTALL)
RAW_BTN_RE = re.compile(r"<button\b([^>]*)>", re.IGNORECASE)
AS_CHILD_LINK_RE = re.compile(r"asChild[\s\S]{0,80}?<Link\b[^>]*href=[\"']([^\"']+)")
ONCLICK_RE = re.compile(r"onClick=\{([^}]+)\}")
TYPE_RE = re.compile(r"type=[\"'](\w+)[\"']")
HREF_IN_PROPS = re.compile(r"href=[\"']([^\"']+)[\"']")
SUSPICIOUS = [
    (re.compile(r"onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}"), "empty_onClick"),
    (re.compile(r"onClick=\{undefined\}"), "undefined_onClick"),
    (re.compile(r"href=[\"']#[\"']"), "hash_href"),
    (re.compile(r"href=[\"']javascript:"), "javascript_href"),
]


def component_name(path: str, content: str) -> str:
    m = re.search(r"export\s+(?:default\s+)?function\s+(\w+)", content)
    if m:
        return m.group(1)
    m = re.search(r"export\s+const\s+(\w+)\s*=", content)
    if m:
        return m.group(1)
    return os.path.basename(path).replace(".tsx", "")


def line_of(content: str, pos: int) -> int:
    return content.count("\n", 0, pos) + 1


def analyze_file(path: str) -> list[dict]:
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    text = open(path, encoding="utf-8", errors="replace").read()
    comp = component_name(path, text)
    items = []

    for m in BTN_RE.finditer(text):
        props = m.group(1)
        line = line_of(text, m.start())
        onclick = ONCLICK_RE.search(props)
        typ = TYPE_RE.search(props)
        as_child = "asChild" in props
        entry = {
            "file": rel,
            "line": line,
            "component": comp,
            "kind": "Button",
            "type": typ.group(1) if typ else "button",
            "asChild": as_child,
            "onClick": onclick.group(1).strip() if onclick else None,
            "labelHint": re.sub(r"\s+", " ", m.group(2))[:80],
            "issues": [],
        }
        if as_child:
            link = AS_CHILD_LINK_RE.search(text[m.start() : m.start() + 400])
            if link:
                entry["route"] = link.group(1)
        if not as_child and not onclick and entry["type"] != "submit":
            entry["issues"].append("no_onClick_non_submit")
        for rx, code in SUSPICIOUS:
            if rx.search(props) or rx.search(m.group(0)):
                entry["issues"].append(code)
        items.append(entry)

    for m in RAW_BTN_RE.finditer(text):
        props = m.group(1)
        line = line_of(text, m.start())
        onclick = ONCLICK_RE.search(props)
        typ = TYPE_RE.search(props)
        entry = {
            "file": rel,
            "line": line,
            "component": comp,
            "kind": "button",
            "type": typ.group(1) if typ else "button",
            "asChild": False,
            "onClick": onclick.group(1).strip() if onclick else None,
            "labelHint": "",
            "issues": [],
        }
        if not onclick and entry["type"] != "submit":
            entry["issues"].append("no_onClick_non_submit")
        for rx, code in SUSPICIOUS:
            if rx.search(props):
                entry["issues"].append(code)
        items.append(entry)

    return items


def main() -> None:
    all_items: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.endswith((".tsx", ".jsx")):
                continue
            path = os.path.join(dirpath, fn)
            if "qa-reports" in path.replace("\\", "/"):
                continue
            all_items.extend(analyze_file(path))

    issues = [i for i in all_items if i["issues"]]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(
            {
                "total": len(all_items),
                "withIssues": len(issues),
                "buttons": all_items,
                "issueSummary": issues,
            },
            f,
            indent=2,
        )
    print(f"Scanned {len(all_items)} buttons, {len(issues)} with static issues")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
