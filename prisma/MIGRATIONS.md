# Database migrations

QRbanner uses **Prisma Migrate** (`prisma migrate deploy`) in production.

## First-time baseline (existing production DB)

If the database was created with `prisma db push` and has no `_prisma_migrations` table:

```bash
# On VPS after uploading prisma/migrations/
cd /var/www/qrbanner
yarn prisma migrate resolve --applied 0001_baseline
yarn prisma migrate deploy
```

This marks the baseline migration as applied without re-running DDL.

## Normal deploy

Manifest flag:

```json
{ "prisma_migrate": true }
```

Runs `yarn prisma migrate deploy` (no `--accept-data-loss`).

## Local development

```bash
yarn prisma migrate dev
```

Set `ALLOW_DEV_EMAIL_FALLBACK=true` locally when SMTP is not configured (never in production).

## Health detail endpoint

Set `HEALTH_DETAIL_SECRET` on the server. Request detailed checks with:

`Authorization: Bearer <HEALTH_DETAIL_SECRET>`

or header `x-health-secret: <HEALTH_DETAIL_SECRET>`.
