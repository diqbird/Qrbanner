#!/usr/bin/env python3
"""PageSpeed Insights audit for key marketing pages (mobile + desktop)."""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
PATHS = [
    ("home", ""),
    ("pricing", "/pricing"),
    ("qr-create", "/qr/create"),
]
STRATEGIES = ("mobile", "desktop")
THRESHOLDS = {
    "performance": 50,
    "accessibility": 80,
    "best-practices": 80,
    "seo": 80,
}
FAILURES: list[str] = []


def fetch(url: str, strategy: str, retries: int | None = None) -> dict:
    if retries is None:
        retries = 3 if os.environ.get("PAGESPEED_API_KEY") else 1
    params = {
        "url": url,
        "strategy": strategy,
        "category": ["performance", "accessibility", "best-practices", "seo"],
    }
    api_key = os.environ.get("PAGESPEED_API_KEY", "").strip()
    if api_key:
        params["key"] = api_key
    qs = urllib.parse.urlencode(params, doseq=True)
    api = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?{qs}"
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(api, headers={"User-Agent": "qrbanner-pagespeed-audit/1.0"})
            with urllib.request.urlopen(req, timeout=180) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 429 and attempt < retries - 1:
                wait = 60 * (attempt + 1)
                print(f"    (429 rate limit — waiting {wait}s, retry {attempt + 2}/{retries})", flush=True)
                time.sleep(wait)
                continue
            raise
        except Exception as e:
            last_err = e
            raise
    raise last_err or RuntimeError("fetch failed")


def main() -> int:
    print(f"=== PageSpeed audit ({BASE}) ===\n", flush=True)
    rows = []
    quota_exhausted = False

    for strategy in STRATEGIES:
        print(f"--- {strategy.upper()} ---")
        for label, path in PATHS:
            if quota_exhausted:
                print(f"  [SKIP] {path or '/'} (API quota exhausted)")
                FAILURES.append(f"{strategy} {label}: HTTP Error 429: Too Many Requests")
                continue
            url = f"{BASE}{path}"
            try:
                time.sleep(12)  # avoid PageSpeed API 429
                data = fetch(url, strategy)
                lr = data["lighthouseResult"]
                cats = lr["categories"]
                audits = lr["audits"]
                row = {
                    "label": label,
                    "path": path or "/",
                    "strategy": strategy,
                    "performance": int(cats["performance"]["score"] * 100),
                    "accessibility": int(cats["accessibility"]["score"] * 100),
                    "bestPractices": int(cats["best-practices"]["score"] * 100),
                    "seo": int(cats["seo"]["score"] * 100),
                    "lcp": audits.get("largest-contentful-paint", {}).get("displayValue", "?"),
                    "tbt": audits.get("total-blocking-time", {}).get("displayValue", "?"),
                    "cls": audits.get("cumulative-layout-shift", {}).get("displayValue", "?"),
                }
                rows.append(row)
                skip_seo = label == "qr-create"
                fails = []
                if row["performance"] < THRESHOLDS["performance"]:
                    fails.append("performance")
                if row["accessibility"] < THRESHOLDS["accessibility"]:
                    fails.append("accessibility")
                if row["bestPractices"] < THRESHOLDS["best-practices"]:
                    fails.append("bestPractices")
                if not skip_seo and row["seo"] < THRESHOLDS["seo"]:
                    fails.append("seo")
                status = "OK" if not fails else f"FAIL [{', '.join(fails)}]"
                seo_note = f" seo={row['seo']}" + (" (noindex skip)" if skip_seo else "")
                print(
                    f"  [{status}] {row['path']:12} perf={row['performance']} "
                    f"a11y={row['accessibility']} bp={row['bestPractices']}{seo_note} "
                    f"LCP={row['lcp']} TBT={row['tbt']} CLS={row['cls']}"
                )
                if fails and not (skip_seo and fails == ["seo"]):
                    for f in fails:
                        if f == "seo" and skip_seo:
                            continue
                        FAILURES.append(f"{strategy} {label}: {f}")
            except Exception as e:
                print(f"  [ERROR] {path or '/'}: {e}", flush=True)
                FAILURES.append(f"{strategy} {label}: {e}")
                if "429" in str(e) and not os.environ.get("PAGESPEED_API_KEY"):
                    quota_exhausted = True
        print()

    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".lighthouse")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "pagespeed-summary.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)
    print(f"Wrote {out_path}\n")

    if FAILURES:
        all_429 = all("429" in str(f) for f in FAILURES)
        if all_429 and not os.environ.get("PAGESPEED_API_KEY"):
            print("=== Result: SKIP (API quota — set PAGESPEED_API_KEY or use npm run test:lighthouse:remote) ===")
            return 0
        print(f"=== Result: FAIL ({len(FAILURES)} threshold miss(es)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
