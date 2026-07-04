#!/usr/bin/env python3
"""Configure Paddle Billing on VPS .env (production). Disables Stripe keys when Paddle is active."""
import os
import re
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

PADDLE_KEYS = [
    "PADDLE_API_KEY",
    "PADDLE_CLIENT_TOKEN",
    "PADDLE_WEBHOOK_SECRET",
    "PADDLE_ENVIRONMENT",
    "PADDLE_PRICE_PRO",
    "PADDLE_PRICE_BUSINESS",
    "PADDLE_PRICE_AGENCY",
    "PADDLE_PRICE_PRO_ANNUAL",
    "PADDLE_PRICE_BUSINESS_ANNUAL",
    "PADDLE_PRICE_AGENCY_ANNUAL",
]

STRIPE_KEYS = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_PRO",
    "STRIPE_PRICE_BUSINESS",
    "STRIPE_PRICE_AGENCY",
    "STRIPE_PRICE_PRO_ANNUAL",
    "STRIPE_PRICE_BUSINESS_ANNUAL",
    "STRIPE_PRICE_AGENCY_ANNUAL",
    "STRIPE_AUTOMATIC_TAX",
]


def parse_args():
    out = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            out[k.strip()] = v.strip()
    return out


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


def disable_stripe_keys(content: str) -> str:
    lines = []
    for line in content.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            lines.append(line)
            continue
        key = stripped.split("=", 1)[0]
        if key in STRIPE_KEYS:
            lines.append(f"# {line}  # disabled — Paddle is primary billing")
        else:
            lines.append(line)
    return "\n".join(lines)


def main():
    if not PW:
        print("Set DEPLOY_PASSWORD before running.")
        raise SystemExit(1)

    args = parse_args()
    api_key = args.get("PADDLE_API_KEY")
    webhook_secret = args.get("PADDLE_WEBHOOK_SECRET")
    price_pro = args.get("PADDLE_PRICE_PRO")
    price_business = args.get("PADDLE_PRICE_BUSINESS")

    if not api_key or not api_key.startswith("pdl_"):
        print(
            "Usage: DEPLOY_PASSWORD=... python configure-paddle.py "
            "PADDLE_API_KEY=pdl_live_apikey_... "
            "PADDLE_WEBHOOK_SECRET=pdl_ntfset_... "
            "PADDLE_PRICE_PRO=pri_... "
            "PADDLE_PRICE_BUSINESS=pri_... "
            "[PADDLE_PRICE_AGENCY=pri_...]"
        )
        raise SystemExit(1)

    if not price_pro or not price_business:
        print("Required: PADDLE_PRICE_PRO, PADDLE_PRICE_BUSINESS")
        raise SystemExit(1)

    # Fall back to any existing webhook secret already on the VPS.
    if not webhook_secret:
        webhook_secret = None  # resolved after reading .env below

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()
    with sftp.open(f"{REMOTE}/.env", "r") as f:
        env_content = f.read().decode("utf-8", errors="replace")

    if not webhook_secret:
        webhook_secret = read_env_key(env_content, "PADDLE_WEBHOOK_SECRET")

    client_token = args.get("PADDLE_CLIENT_TOKEN") or read_env_key(env_content, "PADDLE_CLIENT_TOKEN")

    updates = {
        "PADDLE_API_KEY": api_key,
        "PADDLE_ENVIRONMENT": args.get("PADDLE_ENVIRONMENT", "production"),
        "PADDLE_PRICE_PRO": price_pro,
        "PADDLE_PRICE_BUSINESS": price_business,
    }
    if client_token:
        updates["PADDLE_CLIENT_TOKEN"] = client_token
    if webhook_secret:
        updates["PADDLE_WEBHOOK_SECRET"] = webhook_secret
    for optional in (
        "PADDLE_PRICE_AGENCY",
        "PADDLE_PRICE_PRO_ANNUAL",
        "PADDLE_PRICE_BUSINESS_ANNUAL",
        "PADDLE_PRICE_AGENCY_ANNUAL",
    ):
        val = args.get(optional) or read_env_key(env_content, optional)
        if val:
            updates[optional] = val

    for key, val in updates.items():
        env_content = set_env_var(env_content, key, val)

    env_content = disable_stripe_keys(env_content)

    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
    sftp.close()

    _, stdout, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=60)
    stdout.read()
    c.close()

    print("Paddle configured on VPS (Stripe keys commented out).")
    if not client_token:
        print("WARNING: PADDLE_CLIENT_TOKEN not set — checkout overlay will not open.")
        print("         Paddle -> Developer tools -> Authentication -> Client-side tokens")
    if not webhook_secret:
        print("WARNING: PADDLE_WEBHOOK_SECRET not set — checkout works but plan will")
        print("         NOT auto-upgrade after payment until the webhook secret is added.")
    print(f"PADDLE_ENVIRONMENT={updates['PADDLE_ENVIRONMENT']}")
    print(f"PADDLE_PRICE_PRO={price_pro}")
    print(f"PADDLE_PRICE_BUSINESS={price_business}")
    if updates.get("PADDLE_PRICE_AGENCY"):
        print(f"PADDLE_PRICE_AGENCY={updates['PADDLE_PRICE_AGENCY']}")
    print("\nWebhook URL (Paddle -> Developer tools -> Notifications):")
    print("  https://qrbanner.com/api/billing/webhook")
    print("Events: subscription.created, subscription.updated, subscription.canceled")


if __name__ == "__main__":
    main()
