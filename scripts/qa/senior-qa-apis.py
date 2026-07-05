#!/usr/bin/env python3
"""
Senior QA — sequential API probe. One request at a time.
Does not assume auth; records status, body snippet, timing.
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.environ.get("QA_BASE_URL", "https://qrbanner.com").rstrip("/")
OUT_DIR = os.path.join(ROOT, "qa-reports")
INVENTORY = os.path.join(os.path.dirname(__file__), "api-inventory.json")
RAW = os.path.join(OUT_DIR, "raw-apis.json")

PLACEHOLDER = {
    "__id__": "000000000000000000000000",
    "__token__": "invalid-token-qa",
    "id": "000000000000000000000000",
    "token": "invalid-token-qa",
}


def substitute(path: str) -> str:
    out = path
    for k, v in PLACEHOLDER.items():
        out = out.replace(k, v)
    return out


def probe(method: str, url: str, body: bytes | None = None) -> dict:
    headers = {
        "User-Agent": "QRbanner-SeniorQA/1.0",
        "Accept": "application/json",
    }
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read(2000)
            return {
                "status": resp.status,
                "ok": True,
                "durationMs": int((time.perf_counter() - started) * 1000),
                "bodySnippet": raw.decode("utf-8", errors="replace")[:500],
                "error": None,
            }
    except urllib.error.HTTPError as e:
        raw = e.read(2000)
        return {
            "status": e.code,
            "ok": False,
            "durationMs": int((time.perf_counter() - started) * 1000),
            "bodySnippet": raw.decode("utf-8", errors="replace")[:500],
            "error": None,
        }
    except Exception as e:
        return {
            "status": 0,
            "ok": False,
            "durationMs": int((time.perf_counter() - started) * 1000),
            "bodySnippet": "",
            "error": str(e),
        }


def default_body(method: str, path: str) -> bytes | None:
    if method not in ("POST", "PUT", "PATCH"):
        return None
    if "webhook" in path:
        return b'{"event_type":"qa.test"}'
    if path.endswith("/signup"):
        return b'{"name":"QA","email":"qa-break@example.com","password":""}'
    if "contact" in path:
        return b'{"type":"general","name":"QA","email":"bad","message":"test"}'
    if "forgot-password" in path:
        return b'{"email":"qa-break@example.com"}'
    if "reset-password" in path:
        return b'{"token":"invalid","password":"short"}'
    if "verify" in path:
        return b'{"token":"invalid"}'
    return b"{}"


def classify(status: int, path: str, error: str | None) -> str:
    if error:
        return "FAIL_NETWORK"
    if status >= 500:
        return "FAIL_5XX"
    if status == 429:
        return "WARN_RATE_LIMIT"
    if status in (401, 403):
        return "OK_PROTECTED"
    if status in (400, 404, 405, 422):
        return "OK_REJECTION"
    if status in (200, 201, 204):
        return "OK_SUCCESS"
    if status == 302 or status == 307:
        return "OK_REDIRECT"
    return "REVIEW"


def main() -> int:
    os.makedirs(OUT_DIR, exist_ok=True)
    if not os.path.isfile(INVENTORY):
        print("Run discover-apis.py first")
        return 1

    routes = json.load(open(INVENTORY, encoding="utf-8"))
    results = []
    counts = {"FAIL_5XX": 0, "FAIL_NETWORK": 0, "WARN_RATE_LIMIT": 0}

    print(f"Senior QA APIs: {len(routes)} routes on {BASE}\n")
    for i, route in enumerate(routes):
        path = substitute(route["path"])
        url = BASE + path
        for method in route["methods"]:
            label = f"[{i + 1}/{len(routes)}] {method} {path}"
            print(label, end=" ... ", flush=True)
            body = default_body(method, path)
            r = probe(method, url, body)
            verdict = classify(r["status"], path, r["error"])
            if verdict in counts:
                counts[verdict] += 1
            entry = {
                "path": route["path"],
                "resolvedPath": path,
                "method": method,
                "url": url,
                **r,
                "verdict": verdict,
            }
            results.append(entry)
            print(f"{r['status']} {verdict}")

    payload = {
        "base": BASE,
        "testedAt": datetime.now(timezone.utc).isoformat(),
        "results": results,
        "summary": counts,
    }
    with open(RAW, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"\nWrote {RAW}")
    return 1 if counts["FAIL_5XX"] or counts["FAIL_NETWORK"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
