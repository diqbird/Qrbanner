#!/usr/bin/env python3
"""Discover API routes and HTTP methods from app/api/**/route.ts."""
import os
import re
import json
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API_ROOT = os.path.join(ROOT, "app", "api")

METHOD_RE = re.compile(r"export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\b")


def route_path(file_path: str) -> str:
    rel = os.path.relpath(file_path, API_ROOT).replace("\\", "/")
    rel = rel.replace("/route.ts", "").replace("route.ts", "")
    parts = rel.split("/")
    out = []
    for p in parts:
        if p.startswith("[") and p.endswith("]"):
            name = p[1:-1]
            if name == "...nextauth":
                out.append("[...nextauth]")
            else:
                out.append(f"__{name}__")
        else:
            out.append(p)
    return "/api/" + "/".join(out).strip("/")


def main() -> None:
    routes: list[dict] = []
    for dirpath, _, files in os.walk(API_ROOT):
        if "route.ts" not in files:
            continue
        fp = os.path.join(dirpath, "route.ts")
        text = open(fp, encoding="utf-8").read()
        methods = sorted(set(METHOD_RE.findall(text)))
        if not methods:
            continue
        routes.append({"path": route_path(fp), "methods": methods, "file": fp})
    routes.sort(key=lambda r: r["path"])
    out = os.path.join(os.path.dirname(__file__), "api-inventory.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(routes, f, indent=2)
    print(f"Wrote {len(routes)} routes to {out}")


if __name__ == "__main__":
    main()
