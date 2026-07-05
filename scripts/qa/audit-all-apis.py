#!/usr/bin/env python3
"""
Full API audit — discover, static analysis (auth/rate/validation), live probe.
Sequential: one request at a time.
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
API_ROOT = os.path.join(ROOT, "app", "api")
OUT_DIR = os.path.join(ROOT, "qa-reports")
BASE = os.environ.get("QA_BASE_URL", "https://qrbanner.com").rstrip("/")
TIMEOUT_SEC = int(os.environ.get("API_PROBE_TIMEOUT", "30"))

METHOD_RE = re.compile(r"export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\b")

# Endpoints intentionally public (no session auth expected)
PUBLIC_OK = {
    ("GET", "/api/health"),
    ("GET", "/api/billing/status"),
    ("GET", "/api/public/stats"),
    ("GET", "/api/site-settings"),
    ("GET", "/api/openapi.json"),
    ("GET", "/api/marketplace/listings"),
    ("GET", "/api/referral/lookup"),
    ("GET", "/api/scim/v2/Schemas"),
    ("GET", "/api/scim/v2/ServiceProviderConfig"),
    ("POST", "/api/billing/webhook"),
    ("POST", "/api/auth/forgot-password"),
    ("POST", "/api/auth/reset-password"),
    ("POST", "/api/signup"),
    ("POST", "/api/contact/inquiry"),
    ("POST", "/api/leads"),
    ("POST", "/api/landing-cta"),
    ("POST", "/api/scan/geo"),
    ("POST", "/api/verify"),
    ("POST", "/api/verify/resend"),
    ("GET", "/api/auth/saml/login"),
    ("GET", "/api/auth/saml/metadata"),
    ("GET", "/api/auth/saml/info"),
    ("GET", "/api/auth/sso-policy"),
    ("POST", "/api/auth/saml/acs"),
}

# Public abuse-sensitive routes (authenticated routes excluded via hasSessionAuth)
SHOULD_RATE_LIMIT = re.compile(
    r"signup|forgot-password|contact|inquiry|leads|landing-cta|verify|"
    r"generate|llm|ai-restyle|scan/geo|referral/lookup",
    re.I,
)

# Intentionally unrate-limited (signature auth, etc.)
RATE_LIMIT_EXEMPT = {
    ("POST", "/api/billing/webhook"),
}

PLACEHOLDER_MAP = [
    ("__...nextauth__", "session"),
    ("__id__", "000000000000000000000000"),
    ("__token__", "invalid-token-qa"),
]


def route_path(file_path: str) -> str:
    rel = os.path.relpath(file_path, API_ROOT).replace("\\", "/")
    rel = rel.replace("/route.ts", "").replace("route.ts", "")
    parts = rel.split("/")
    out = []
    for p in parts:
        if p.startswith("[") and p.endswith("]"):
            name = p[1:-1]
            if name == "...nextauth":
                out.append("__...nextauth__")
            else:
                out.append(f"__{name}__")
        else:
            out.append(p)
    return "/api/" + "/".join(out).strip("/")


def substitute(path: str) -> str:
    out = path
    for k, v in PLACEHOLDER_MAP:
        out = out.replace(k, v)
    return out


def analyze_source(text: str, path: str) -> dict:
    has_session = bool(
        re.search(r"getServerSession|getToken\s*\(", text)
        or re.search(
            r"requireApiKey|verifyApiKey|authenticateScim|authenticateApiRequest|isAuthError",
            text,
        )
        or ("admin" in path and re.search(r"role.*admin|isAdmin|403", text))
    )
    has_rate = bool(
        re.search(r"checkRateLimit|rateLimitRequest|enforceRateLimit|enforceApiRateLimit", text)
    )
    has_validation = bool(
        re.search(
            r"status:\s*400|\.parse\(|zod|safeParse|parseApiBody|apiError\s*\(|scimError\s*\("
            r"|prompt_too_short|invalid_json|empty_body|unsupported_content_type|"
            r"normalizeFolderName|\.trim\(\)\.length|"
            r"NextResponse\.json\(\{[^}]*error",
            text,
        )
    )
    returns_401 = "401" in text or "unauthorized" in text.lower()
    returns_403 = "403" in text or "forbidden" in text.lower()
    return {
        "hasSessionAuth": has_session,
        "hasRateLimit": has_rate,
        "hasValidation": has_validation,
        "returns401": returns_401,
        "returns403": returns_403,
    }


def default_body(method: str, path: str) -> bytes | None:
    if method not in ("POST", "PUT", "PATCH"):
        return None
    if "webhook" in path:
        return b'{"event_type":"qa.test"}'
    if path.endswith("/signup"):
        return b'{"name":"QA","email":"qa-break@example.com","password":""}'
    if "contact" in path or "inquiry" in path:
        return b'{"type":"general","name":"QA","email":"bad","message":"test"}'
    if "forgot-password" in path:
        return b'{"email":"qa-break@example.com"}'
    if "reset-password" in path:
        return b'{"token":"invalid","password":"short"}'
    if "verify" in path:
        return b'{"token":"invalid"}'
    if "campaign/generate" in path:
        return b'{"prompt":"Opening a restaurant next Friday in Istanbul"}'
    if "generate-copy" in path:
        return b'{"category":"url","locale":"en"}'
    return b"{}"


def probe(method: str, url: str, body: bytes | None = None) -> dict:
    headers = {"User-Agent": "API-Audit/1.0", "Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SEC) as resp:
            raw = resp.read(3000)
            ms = int((time.perf_counter() - started) * 1000)
            return {
                "status": resp.status,
                "durationMs": ms,
                "bodySnippet": raw.decode("utf-8", errors="replace")[:400],
                "error": None,
                "timedOut": False,
            }
    except urllib.error.HTTPError as e:
        raw = e.read(3000)
        ms = int((time.perf_counter() - started) * 1000)
        return {
            "status": e.code,
            "durationMs": ms,
            "bodySnippet": raw.decode("utf-8", errors="replace")[:400],
            "error": None,
            "timedOut": False,
        }
    except TimeoutError:
        ms = int((time.perf_counter() - started) * 1000)
        return {"status": 0, "durationMs": ms, "bodySnippet": "", "error": "timeout", "timedOut": True}
    except Exception as e:
        ms = int((time.perf_counter() - started) * 1000)
        err = str(e)
        return {
            "status": 0,
            "durationMs": ms,
            "bodySnippet": "",
            "error": err,
            "timedOut": "timed out" in err.lower() or "timeout" in err.lower(),
        }


def discover() -> list[dict]:
    routes = []
    for dirpath, _, files in os.walk(API_ROOT):
        if "route.ts" not in files:
            continue
        fp = os.path.join(dirpath, "route.ts")
        text = open(fp, encoding="utf-8").read()
        methods = sorted(set(METHOD_RE.findall(text)))
        if not methods:
            continue
        rel = os.path.relpath(fp, ROOT).replace("\\", "/")
        routes.append(
            {
                "path": route_path(fp),
                "methods": methods,
                "file": rel,
                "static": analyze_source(text, route_path(fp)),
            }
        )
    routes.sort(key=lambda r: r["path"])
    return routes


def write_markdown(routes: list, results: list, analysis: dict) -> None:
    md = os.path.join(OUT_DIR, "10-api-audit.md")
    lines = [
        "# API Endpoint Audit",
        "",
        f"**Target:** `{BASE}`  ",
        f"**Tested:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}  ",
        f"**Endpoints:** {len(routes)} route files, {len(results)} HTTP probes",
        "",
        "## Summary",
        "",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Live failures (5xx/network) | {len(analysis['failures'])} |",
        f"| Timeouts | {len(analysis['timeouts'])} |",
        f"| Slow (>2000ms) | {len(analysis['slow'])} |",
        f"| Missing auth (heuristic) | {len(analysis['missing_auth'])} |",
        f"| Missing rate limit | {len(analysis['missing_rate'])} |",
        f"| Missing validation (POST/PUT/PATCH) | {len(analysis['missing_validation'])} |",
        "",
    ]

    if analysis["failures"]:
        lines += ["## Failures", ""]
        for f in analysis["failures"]:
            lines.append(f"### `{f['method']} {f['path']}`")
            lines.append(f"- Status: **{f['status']}** | {f['durationMs']}ms")
            if f.get("error"):
                lines.append(f"- Error: `{f['error']}`")
            if f.get("bodySnippet"):
                lines.append(f"- Body: `{f['bodySnippet'][:200]}`")
            lines.append(f"- File: `{f['file']}`")
            lines.append("")

    if analysis["timeouts"]:
        lines += ["## Timeouts", ""]
        for t in analysis["timeouts"]:
            lines.append(f"- `{t['method']} {t['path']}` — {t['durationMs']}ms")
        lines.append("")

    if analysis["slow"]:
        lines += ["## Slow responses (>2000ms)", ""]
        lines += ["| Method | Path | ms | Status |", "|--------|------|-----|--------|"]
        for s in sorted(analysis["slow"], key=lambda x: -x["durationMs"])[:30]:
            lines.append(f"| {s['method']} | `{s['path']}` | {s['durationMs']} | {s['status']} |")
        lines.append("")

    for title, key in [
        ("Missing authentication (mutations without session check)", "missing_auth"),
        ("Missing rate limit (abuse-sensitive routes)", "missing_rate"),
        ("Missing validation (write methods)", "missing_validation"),
    ]:
        if analysis[key]:
            lines += [f"## {title}", ""]
            for item in analysis[key]:
                lines.append(f"- `{item['method']} {item['path']}` — `{item['file']}`")
            lines.append("")

    lines += [
        "## All endpoints (live probe)",
        "",
        "| Method | Path | Status | ms | Verdict |",
        "|--------|------|--------|-----|---------|",
    ]
    for r in results:
        lines.append(
            f"| {r['method']} | `{r['path']}` | {r['status']} | {r['durationMs']} | {r['verdict']} |"
        )

    with open(md, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {md}")


def main() -> int:
    os.makedirs(OUT_DIR, exist_ok=True)
    routes = discover()
    results = []
    failures = []
    timeouts = []
    slow = []
    missing_auth = []
    missing_rate = []
    missing_validation = []

    print(f"API audit: {len(routes)} routes on {BASE}\n")

    for i, route in enumerate(routes):
        path = route["path"]
        resolved = substitute(path)
        url = BASE + resolved
        st = route["static"]

        for method in route["methods"]:
            key = (method, path)
            label = f"[{i+1}/{len(routes)}] {method} {path}"
            print(label, end=" ... ", flush=True)

            body = default_body(method, path)
            live = probe(method, url, body)

            # Verdict
            if live["timedOut"] or live["error"] == "timeout":
                verdict = "TIMEOUT"
                timeouts.append({**live, "method": method, "path": path, "file": route["file"]})
            elif live["status"] >= 500:
                verdict = "FAIL_5XX"
                failures.append({**live, "method": method, "path": path, "file": route["file"]})
            elif live["status"] == 0:
                verdict = "FAIL_NETWORK"
                failures.append({**live, "method": method, "path": path, "file": route["file"]})
            elif live["status"] in (401, 403):
                verdict = "OK_AUTH"
            elif live["status"] in (400, 404, 405, 422, 415, 501):
                verdict = "OK_REJECT"
            elif live["status"] in (200, 201, 204):
                verdict = "OK"
            elif live["status"] in (302, 307):
                verdict = "REDIRECT"
            else:
                verdict = "REVIEW"

            if live["durationMs"] > 2000 and verdict not in ("TIMEOUT",):
                slow.append({**live, "method": method, "path": path})

            # Static gaps
            is_public = key in PUBLIC_OK or path.startswith("/api/auth/")
            is_mutation = method in ("POST", "PUT", "PATCH", "DELETE")
            if is_mutation and not is_public and not st["hasSessionAuth"] and not st["returns401"]:
                missing_auth.append({"method": method, "path": path, "file": route["file"]})
            if (
                SHOULD_RATE_LIMIT.search(path)
                and not st["hasRateLimit"]
                and not st["hasSessionAuth"]
                and key not in RATE_LIMIT_EXEMPT
            ):
                missing_rate.append({"method": method, "path": path, "file": route["file"]})
            if is_mutation and not is_public and not st["hasValidation"]:
                missing_validation.append({"method": method, "path": path, "file": route["file"]})

            entry = {
                "path": path,
                "resolvedPath": resolved,
                "method": method,
                "file": route["file"],
                "verdict": verdict,
                **live,
                "static": st,
            }
            results.append(entry)
            print(f"{live['status']} {live['durationMs']}ms {verdict}")

    analysis = {
        "failures": failures,
        "timeouts": timeouts,
        "slow": slow,
        "missing_auth": missing_auth,
        "missing_rate": missing_rate,
        "missing_validation": missing_validation,
    }

    payload = {
        "base": BASE,
        "testedAt": datetime.now(timezone.utc).isoformat(),
        "routeCount": len(routes),
        "probeCount": len(results),
        "analysis": analysis,
        "results": results,
    }
    raw = os.path.join(OUT_DIR, "raw-api-audit.json")
    with open(raw, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"\nWrote {raw}")

    write_markdown(routes, results, analysis)
    return 1 if failures or timeouts else 0


if __name__ == "__main__":
    raise SystemExit(main())
