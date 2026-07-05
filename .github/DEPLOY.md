# Production deploy (GitHub Actions)

Manual deploy workflow: **Actions → Deploy → Run workflow**.

Uses GitHub environment **`Production`** (case-sensitive).

## Required secrets (environment: `Production`)

Configure under **Settings → Environments → Production → Environment secrets**:

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS IP or hostname |
| `DEPLOY_USER` | SSH user (usually `root`) |
| `DEPLOY_SSH_KEY` | Private key (PEM), full contents including `BEGIN`/`END` lines |

Automated setup (local, one-time):

```powershell
$env:DEPLOY_HOST="your.vps.ip"
$env:DEPLOY_PASSWORD="..."   # only to install pubkey on VPS
python scripts/setup-github-deploy-secrets.py
```

This generates `~/.ssh/qrbanner_github_deploy`, adds the public key to the VPS, and runs `gh secret set` for the `Production` environment.

## Repository variables (QA / E2E)

| Variable | Description |
|----------|-------------|
| `PLAYWRIGHT_BASE_URL` | Base URL for Playwright E2E on push (e.g. `https://qrbanner.com`) |
| `E2E_AGAINST_PROD` | Set to `true` to run E2E against production when `PLAYWRIGHT_BASE_URL` is empty |

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
