# Deploy Admin Panel ke cPanel

Deploy otomatis berjalan setelah PR di-merge ke branch `main` repository organisasi.

## Endpoint

- Admin panel: `http://admin.tuneboss-landing.dasrams.biz.id`
- API dan database: `http://api-marketplace.tuneboss-landing.dasrams.biz.id/api`
- Health API: `http://api-marketplace.tuneboss-landing.dasrams.biz.id/api/health`

Admin Panel memakai API Marketplace; tidak ada backend atau database kedua dari
folder `backend/` repo ini.

## GitHub Actions secrets

Secrets hanya disimpan di `Tuneboss-Indonesia/tuneboss-admin-panel`:

- `CPANEL_SSH_HOST`
- `CPANEL_SSH_PORT`
- `CPANEL_SSH_USER`
- `CPANEL_SSH_KEY`

## Target server

- Node app: `/home/tunm2447/apps/tuneboss-admin-panel/frontend`
- Document root: `/home/tunm2447/public_html/apps/tuneboss-admin-panel/frontend`
- Runtime: CloudLinux Node.js 22

## Alur deployment

1. Push perubahan ke fork.
2. Buat PR ke organisasi.
3. Merge ke `main`.
4. GitHub Actions membangun Next.js standalone, mengunggah release, dan
   me-restart Node app cPanel.

HTTPS diaktifkan setelah DNS dan AutoSSL sehat.
