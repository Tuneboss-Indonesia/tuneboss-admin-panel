# Deploy ke cPanel via SSH/rsync

Panduan ini untuk repo `tuneboss-admin-panel`.

## Struktur Repo

- `frontend/` = Next.js admin panel
- `backend/` = Express API

## Target Deploy

- frontend hasil build Next.js ke domain utama
- backend hasil build Express ke subdomain backend

## Prasyarat

- cPanel support SSH
- `rsync` tersedia
- user SSH punya akses tulis ke folder target

## Secret GitHub

Tambahkan secret ini:

- `CPANEL_SSH_HOST`
- `CPANEL_SSH_USER`
- `CPANEL_SSH_KEY`
- `CPANEL_SSH_PORT` optional
- `CPANEL_FRONTEND_DIR`
- `CPANEL_BACKEND_DIR`

## Contoh Path

```text
CPANEL_FRONTEND_DIR=/home/cpaneluser/public_html
CPANEL_BACKEND_DIR=/home/cpaneluser/backend.domain.com
```

## Alur Workflow

Saat push ke `main`, workflow akan:

1. install dependency frontend dan backend
2. jalankan typecheck
3. build frontend dan backend
4. sync hasil build ke server via SSH/rsync

Frontend yang dikirim adalah hasil build Next.js. Backend yang dikirim adalah hasil build TypeScript Express.

## Catatan Penting

- `.env` tidak ikut dikirim
- backend tetap perlu `.env` produksi di server
- subdomain backend sebaiknya diarahkan ke folder yang benar sesuai konfigurasi cPanel
- pastikan server cPanel mendukung Node.js untuk menjalankan Next.js dan Express

## Setelah Deploy

Pastikan:

- frontend bisa dibuka di domain utama
- backend bisa dibuka di subdomain
- permission folder server aman untuk aplikasi Node
