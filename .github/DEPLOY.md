# Production deploy (GitHub Actions)

Manual deploy workflow: **Actions → Deploy → Run workflow**.

## Required repository secrets

Configure under **Settings → Secrets and variables → Actions** (environment: `production` if used):

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS IP or hostname (e.g. `31.97.113.170`) |
| `DEPLOY_USER` | SSH user (usually `root`) |
| `DEPLOY_SSH_KEY` | Private key (PEM), full contents including `BEGIN`/`END` lines |

## Optional repository variables (QA)

| Variable | Description |
|----------|-------------|
| `PLAYWRIGHT_BASE_URL` | Staging URL for E2E on push (e.g. `https://staging.qrbanner.com`) |
| `E2E_AGAINST_PROD` | Set to `true` to run E2E against production on push |

## Local deploy (alternative)

Copy `scripts/.env.deploy.example` → `scripts/.env.deploy` and set:

- `DEPLOY_HOST`, `DEPLOY_USER`
- `DEPLOY_SSH_KEY_PATH` (preferred) or legacy `DEPLOY_PASSWORD`

```powershell
$env:DEPLOY_HOST="your.vps.ip"
$env:DEPLOY_SSH_KEY_PATH="$HOME\.ssh\qrbanner_deploy"
python scripts/deploy.py --manifest scripts/manifests/your-manifest.json
```

## Manifest examples

- `tech-debt-security-migrations.json` — email, health, migrations, unit tests
- `remove-stripe-schema-cleanup.json` — Paddle-only schema (no Stripe columns)

## VPS app secrets (not GitHub)

Set on server `/var/www/qrbanner/.env`:

- `HEALTH_DETAIL_SECRET` — `python scripts/set-vps-env.py --generate-health-secret`
- Paddle keys — `python scripts/configure-paddle.py PADDLE_API_KEY=...`
- Remove legacy Stripe keys — `python scripts/strip-vps-stripe-env.py`
