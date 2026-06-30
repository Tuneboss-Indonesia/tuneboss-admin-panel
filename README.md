# TuneBoss Admin Panel

Aplikasi **Admin Panel** untuk mengelola TuneBoss Marketplace.

## Arsitektur

Project ini dibagi menjadi 2 environment terpisah dalam satu repository:

- **`/frontend`**: Aplikasi Next.js 16 (React, TailwindCSS 4, TanStack Query) untuk UI admin.
- **`/backend`**: Express.js + Drizzle ORM backend API untuk melayani frontend admin. Terhubung langsung ke database PostgreSQL (sama dengan database marketplace utama).

## Menjalankan Project

Jalankan perintah ini di masing-masing folder:

**Backend (Port 8001)**
```bash
cd backend
npm install
npm run dev
```

**Frontend (Port 3000)**
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- Frontend: Next.js 16, React, TailwindCSS 4, shadcn/ui, Radix UI, Base UI, TanStack Query
- Backend: Express.js, Drizzle ORM, PostgreSQL