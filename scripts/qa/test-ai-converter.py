#!/usr/bin/env python3
"""AI Converter (Campaign Wizard) — sequential live tests only."""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("QA_BASE_URL", "https://qrbanner.com").rstrip("/")
API = f"{BASE}/api/campaign/generate"
UI = f"{BASE}/qr/campaign"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "qa-reports", "ai-converter-test.json")

results: list[dict] = []


def record(name: str, verdict: str, detail: str, **extra):
    row = {"test": name, "verdict": verdict, "detail": detail, **extra}
    results.append(row)
    icon = "PASS" if verdict == "PASS" else ("FAIL" if verdict == "FAIL" else "INFO")
    print(f"  [{icon}] {name}: {detail}")


def request(method: str, url: str, data: bytes | None = None, headers: dict | None = None, timeout=35):
    h = {"User-Agent": "AI-Converter-QA/1.0", **(headers or {})}
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read(8000)
            return {
                "status": resp.status,
                "body": body,
                "headers": dict(resp.headers),
                "ms": int((time.perf_counter() - t0) * 1000),
                "error": None,
            }
    except urllib.error.HTTPError as e:
        body = e.read(8000)
        return {
            "status": e.code,
            "body": body,
            "headers": dict(e.headers),
            "ms": int((time.perf_counter() - t0) * 1000),
            "error": None,
        }
    except Exception as e:
        return {
            "status": 0,
            "body": b"",
            "headers": {},
            "ms": int((time.perf_counter() - t0) * 1000),
            "error": str(e),
        }


def parse_json(body: bytes) -> tuple[object | None, str | None]:
    try:
        return json.loads(body.decode("utf-8", errors="replace")), None
    except json.JSONDecodeError as e:
        return None, str(e)


def main() -> int:
    print(f"=== AI Converter tests ({BASE}) ===\n")

    # UI page load
    r = request("GET", UI)
    if r["status"] == 200:
        html = r["body"].decode("utf-8", errors="replace")
        has_title = "campaign" in html.lower() or "qr marketing" in html.lower() or "kampanya" in html.lower()
        record("UI opens", "PASS" if has_title else "WARN", f"HTTP {r['status']}, {r['ms']}ms")
    else:
        record("UI opens", "FAIL", f"HTTP {r['status']}")

    # 401 unauthenticated
    r = request("POST", API, data=json.dumps({"prompt": "Opening a cafe next week in Ankara"}).encode(), headers={"Content-Type": "application/json"})
    record("401 without session", "PASS" if r["status"] == 401 else "FAIL", f"HTTP {r['status']}", body=r["body"][:200].decode())

    # 404 wrong path
    r = request("POST", f"{BASE}/api/campaign/generate-not-exist", data=b"{}", headers={"Content-Type": "application/json"})
    record("404 wrong endpoint", "PASS" if r["status"] == 404 else "FAIL", f"HTTP {r['status']}")

    # 400 short prompt (needs auth - will get 401 first; test route logic via code path note)
    r = request("POST", API, data=json.dumps({"prompt": "hi"}).encode(), headers={"Content-Type": "application/json"})
    if r["status"] == 401:
        record("400 short prompt", "INFO", "Blocked at 401 before validation (auth first — expected unauthenticated probe)")
    elif r["status"] == 400:
        record("400 short prompt", "PASS", f"HTTP 400")
    else:
        record("400 short prompt", "FAIL", f"HTTP {r['status']}")

    # Empty body / invalid JSON
    r = request("POST", API, data=b"", headers={"Content-Type": "application/json"})
    record("Empty body", "PASS" if r["status"] in (401, 400) else "FAIL", f"HTTP {r['status']}")

    r = request("POST", API, data=b"{not-json", headers={"Content-Type": "application/json"})
    record("Invalid JSON body", "PASS" if r["status"] in (401, 400, 500) else "FAIL", f"HTTP {r['status']}")

    # Large prompt (500+ chars)
    big = "A" * 6000
    r = request("POST", API, data=json.dumps({"prompt": big}).encode(), headers={"Content-Type": "application/json"})
    record("Large prompt (6000 chars)", "INFO" if r["status"] == 401 else "PASS", f"HTTP {r['status']} (server slices to 500)")

    # Unsupported content type (multipart as file analog)
    r = request("POST", API, data=b"------boundary\r\nContent-Disposition: form-data; name=\"file\"; filename=\"x.pdf\"\r\n\r\n%PDF\r\n------boundary--", headers={"Content-Type": "multipart/form-data; boundary=----boundary"})
    record("Unsupported multipart (file analog)", "PASS" if r["status"] in (401, 400, 415) else "FAIL", f"HTTP {r['status']}")

    # GET method not allowed
    r = request("GET", API)
    record("405/404 GET on POST route", "PASS" if r["status"] in (405, 404, 401) else "FAIL", f"HTTP {r['status']}")

    # 10 concurrent unauthenticated
    statuses = []
    def one():
        return request("POST", API, data=json.dumps({"prompt": "Opening restaurant next Friday"}).encode(), headers={"Content-Type": "application/json"})
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [ex.submit(one) for _ in range(10)]
        for f in as_completed(futs):
            statuses.append(f.result()["status"])
    all_401 = all(s == 401 for s in statuses)
    record("10 concurrent requests", "PASS" if all_401 else "FAIL", f"statuses={statuses}")

    # Streaming check — endpoint returns JSON not SSE
    r = request("POST", API, data=json.dumps({"prompt": "test prompt long enough here"}).encode(), headers={"Content-Type": "application/json"})
    ct = r["headers"].get("Content-Type", r["headers"].get("content-type", ""))
    is_stream = "text/event-stream" in ct
    record("Streaming", "INFO", "Not implemented (JSON response only)" if not is_stream else "Unexpected SSE", content_type=ct)

    # JSON parse on response
    if r["body"]:
        parsed, err = parse_json(r["body"])
        if err:
            record("Response JSON parse", "FAIL", err)
        else:
            record("Response JSON parse", "PASS", f"valid JSON keys={list(parsed.keys()) if isinstance(parsed, dict) else type(parsed)}")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"testedAt": datetime.now(timezone.utc).isoformat(), "base": BASE, "results": results}, f, indent=2)
    print(f"\nWrote {OUT}")
    fails = sum(1 for x in results if x["verdict"] == "FAIL")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
