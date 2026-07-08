#!/usr/bin/env python3
"""Update Business plan to $29.99 in plans.ts + Stripe price on VPS."""
import os
import re
import json
import base64
import urllib.parse
import urllib.request
import paramiko

HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
BUSINESS_CENTS = 2999


def stripe_get(secret: str, path: str):
    url = f"https://api.stripe.com/v1/{path}"
    token = base64.b64encode(f"{secret}:".encode()).decode()
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", f"Basic {token}")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def stripe_post(secret: str, path: str, data: dict):
    url = f"https://api.stripe.com/v1/{path}"
    token = base64.b64encode(f"{secret}:".encode()).decode()
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Authorization", f"Basic {token}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def find_or_create_business_price(secret: str) -> str:
    products = stripe_get(secret, "products?limit=100&active=true")
    product_id = None
    for p in products.get("data", []):
        if p.get("name") == "QRbanner Business":
            product_id = p["id"]
            break
    if not product_id:
        p = stripe_post(secret, "products", {
            "name": "QRbanner Business",
            "metadata[plan]": "business",
        })
        product_id = p["id"]

    prices = stripe_get(secret, f"prices?product={product_id}&active=true&limit=20")
    for pr in prices.get("data", []):
        if (
            pr.get("recurring", {}).get("interval") == "month"
            and pr.get("unit_amount") == BUSINESS_CENTS
        ):
            return pr["id"]

    pr = stripe_post(secret, "prices", {
        "product": product_id,
        "unit_amount": str(BUSINESS_CENTS),
        "currency": "usd",
        "recurring[interval]": "month",
        "metadata[plan]": "business",
    })
    return pr["id"]


def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"


def read_env_key(content: str, key: str) -> str | None:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else None


c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()

# Upload plans.ts
local_plans = os.path.join(LOCAL, "lib", "plans.ts")
remote_plans = f"{REMOTE}/lib/plans.ts"
sftp.put(local_plans, remote_plans)
print("ok lib/plans.ts")

with sftp.open(f"{REMOTE}/.env", "r") as f:
    env_content = f.read().decode("utf-8", errors="replace")

secret = read_env_key(env_content, "STRIPE_SECRET_KEY")
if secret and secret.startswith("sk_"):
    price_id = find_or_create_business_price(secret)
    env_content = set_env_var(env_content, "STRIPE_PRICE_BUSINESS", price_id)
    print("STRIPE_PRICE_BUSINESS:", price_id)
    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
else:
    print("WARN: STRIPE_SECRET_KEY not found — plans.ts only, no Stripe price update")

sftp.close()

out = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -8", timeout=900)[1].read().decode("ascii", errors="replace")
print(out.encode("ascii", errors="replace").decode("ascii"))
if "Failed to compile" in out:
    raise SystemExit(1)

c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE — Business plan $29.99")
