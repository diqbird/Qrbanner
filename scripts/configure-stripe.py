#!/usr/bin/env python3
"""Configure Stripe env on VPS. Creates test products/prices if missing."""
import os
import re
import sys
import json
import urllib.request
import urllib.parse
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://qrbanner.com").rstrip("/")

PRICES = [
    ("QRbanner Pro", 999, "pro", "STRIPE_PRICE_PRO"),
    ("QRbanner Business", 2999, "business", "STRIPE_PRICE_BUSINESS"),
    ("QRbanner Agency", 7999, "agency", "STRIPE_PRICE_AGENCY"),
]

def parse_args():
    out = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            out[k.strip()] = v.strip()
    return out

def stripe_request(secret: str, method: str, path: str, data: dict | None = None):
    url = f"https://api.stripe.com/v1/{path}"
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    auth = urllib.request.HTTPBasicAuthHandler()
    # Basic auth: secret key as username, empty password
    import base64
    token = base64.b64encode(f"{secret}:".encode()).decode()
    req.add_header("Authorization", f"Basic {token}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

def stripe_post(secret: str, path: str, data: dict):
    return stripe_request(secret, "POST", path, data)

def stripe_get(secret: str, path: str):
    url = f"https://api.stripe.com/v1/{path}"
    import base64
    token = base64.b64encode(f"{secret}:".encode()).decode()
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", f"Basic {token}")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

def find_or_create_price(secret: str, product_name: str, amount_cents: int, metadata_plan: str):
    products = stripe_get(secret, "products?limit=100&active=true")
    product_id = None
    for p in products.get("data", []):
        if p.get("name") == product_name:
            product_id = p["id"]
            break
    if not product_id:
        p = stripe_post(secret, "products", {
            "name": product_name,
            "metadata[plan]": metadata_plan,
        })
        product_id = p["id"]
        print("created product", product_name, product_id)

    prices = stripe_get(secret, f"prices?product={product_id}&active=true&limit=10")
    for pr in prices.get("data", []):
        if pr.get("recurring", {}).get("interval") == "month" and pr.get("unit_amount") == amount_cents:
            print("found price", product_name, pr["id"])
            return pr["id"]

    pr = stripe_post(secret, "prices", {
        "product": product_id,
        "unit_amount": str(amount_cents),
        "currency": "usd",
        "recurring[interval]": "month",
        "metadata[plan]": metadata_plan,
    })
    print("created price", product_name, pr["id"])
    return pr["id"]

def find_or_create_webhook(secret: str):
    endpoint_url = f"{SITE_URL}/api/billing/webhook"
    hooks = stripe_get(secret, "webhook_endpoints?limit=20")
    for h in hooks.get("data", []):
        if h.get("url") == endpoint_url:
            print("found webhook", h["id"])
            return h.get("secret") or ""

    import base64
    payload = [
        ("url", endpoint_url),
        ("enabled_events[]", "checkout.session.completed"),
        ("enabled_events[]", "customer.subscription.updated"),
        ("enabled_events[]", "customer.subscription.deleted"),
    ]
    url = "https://api.stripe.com/v1/webhook_endpoints"
    token = base64.b64encode(f"{secret}:".encode()).decode()
    req = urllib.request.Request(url, data=urllib.parse.urlencode(payload).encode(), method="POST")
    req.add_header("Authorization", f"Basic {token}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=60) as resp:
        wh = json.loads(resp.read().decode())
    print("created webhook", wh["id"])
    return wh.get("secret", "")

def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"

def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""

def main():
    if not PW:
        print("Set DEPLOY_PASSWORD (or scripts/.env.deploy) before running.")
        raise SystemExit(1)

    args = parse_args()
    secret = args.get("STRIPE_SECRET_KEY")

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()
    with sftp.open(f"{REMOTE}/.env", "r") as f:
        env_content = f.read().decode("utf-8", errors="replace")

    if not secret:
        secret = read_env_key(env_content, "STRIPE_SECRET_KEY")

    if not secret or not secret.startswith("sk_"):
        print("Usage: DEPLOY_PASSWORD=... python configure-stripe.py STRIPE_SECRET_KEY=sk_test_...")
        print("Or add STRIPE_SECRET_KEY to VPS .env first, then re-run without args.")
        sftp.close()
        c.close()
        raise SystemExit(1)

    price_map: dict[str, str] = {}
    for product_name, cents, meta_plan, env_key in PRICES:
        existing = args.get(env_key) or read_env_key(env_content, env_key)
        if existing and existing.startswith("price_"):
            print("keep price", product_name, existing)
            price_map[env_key] = existing
        else:
            price_map[env_key] = find_or_create_price(secret, product_name, cents, meta_plan)

    webhook_secret = args.get("STRIPE_WEBHOOK_SECRET") or read_env_key(env_content, "STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        webhook_secret = find_or_create_webhook(secret)

    updates = {
        "STRIPE_SECRET_KEY": secret,
        "STRIPE_PRICE_PRO": price_map["STRIPE_PRICE_PRO"],
        "STRIPE_PRICE_BUSINESS": price_map["STRIPE_PRICE_BUSINESS"],
        "STRIPE_PRICE_AGENCY": price_map["STRIPE_PRICE_AGENCY"],
        "STRIPE_WEBHOOK_SECRET": webhook_secret,
    }

    for key, val in updates.items():
        if val:
            env_content = set_env_var(env_content, key, val)

    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
    sftp.close()
    c.exec_command("pm2 restart qrbanner", timeout=60)
    c.close()
    print("Stripe configured on VPS.")
    for key in ("STRIPE_PRICE_PRO", "STRIPE_PRICE_BUSINESS", "STRIPE_PRICE_AGENCY"):
        print(f"{key}: {price_map[key]}")
    if webhook_secret:
        print("STRIPE_WEBHOOK_SECRET: set")

if __name__ == "__main__":
    main()
