# Project Context

## Project Name

`tciptakarya-next` (package.json) — **Website Talenta Cipta Karya v2.1**

Repo remote: `https://github.com/Tciptakarya/web-talenta.git` (branch `main`)
Live: `https://talentaciptakarya.com/`

## Project Purpose

Situs profil perusahaan sekaligus sistem pemesanan kelas pelatihan untuk
**Talenta Cipta Karya** — penyelenggara kursus/pelatihan (barista, komputer,
K3, BOSIET, dst). Berisi halaman publik (profil, kelas, program, galeri,
testimoni, kontak) plus dashboard admin terproteksi untuk mengelola semua
konten dan pendaftar.

Implementasi dari **PRD-Talenta-Cipta-Karya.md v2.1** (referensi di README;
**file PRD itu sendiri TIDAK ada di repo** — hanya kutipan §-nya yang tersebar
di komentar kode).

## Business Goal

1. Menghadirkan kredibilitas perusahaan (program, testimoni, galeri).
2. Menangkap lead: **form pendaftaran jadwal pelatihan** + form kontak,
   keduanya wajib tersimpan di database meski email notifikasi gagal (PRD §8).
3. Memberi admin kontrol penuh tanpa menyentuh kode (CRUD dari dashboard).

## Current Project Status

Produksi dan live di Vercel (free tier), DNS domain di nameserver Vercel.
Fitur inti PRD selesai dan terverifikasi. Sedang tertahan pada konfigurasi
email (lihat `CURRENT_STATE.md` → Current Problems).

Status git:

- Commit terakhir yang di-push: `fd32dae` (2026-09-26).
- Perubahan terbaru (**belum di-commit**): fix `&` → `&amp;` di 2 teks JSX
  (`app/admin/(dashboard)/kategori/page.tsx`, `components/admin/JadwalManager.tsx`)
  + dokumentasi (`AGENTS.md` termasuk aturan *Setelah Menyelesaikan Task* dan
  *Workflow low-token*, dan folder `AI_CONTEXT/`).
- `npx tsc --noEmit` 0 error; `npm run build` hijau (22 routes) — dijalankan
  setelah fix terakhir.

## Technology Stack

| Lapisan | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | **15.5.25 (pinned, jangan `^16`)** |
| UI | React | 19.3.0 |
| Bahasa | TypeScript | 5.9.3 |
| Styling | Tailwind CSS (v4, via PostCSS) | 4.3.3 |
| ORM | Prisma | **6.19.3 (pinned)** |
| Database | PostgreSQL (Neon, remote) | provider `postgresql` |
| Auth | NextAuth v5 beta (JWT + Credentials) | 5.0.0-beta.32 |
| Validasi | Zod | 4.6.5 |
| Password hash | bcryptjs | 3.0.3 |
| Email | Resend | ^6.28.1 |
| File storage | Vercel Blob (`@vercel/blob`) | 2.8.0 |
| Kompresi gambar | sharp | 0.35.4 |
| Runner skrip | tsx | 4.23.15 |

## Frameworks

- **Next.js App Router** dengan route groups: `app/(public)` (situs publik)
  dan `app/admin/(dashboard)` (area admin).
- Tidak ada Express/ backend terpisah — semuanya di codebase yang sama
  (API Routes + Server Actions).

## Libraries

- `next/auth` v5 beta — sesi JWT, halaman login `/admin/login`.
- `zod` — semua input (form publik, server action, upload) divalidasi Zod
  lewat `lib/schemas.ts`.
- `sharp` — resize maks 1600px → WebP kualitas 82 saat upload.
- `resend` — notifikasi email (pesan kontak, pendaftaran, reset password).
- `@vercel/blob` — penyimpanan foto di produksi (fallback lokal `public/uploads`).
- Tidak ada UI library pihak ketiga (Tailwind murni) dan **tidak ada state
  management library** (React state + server actions saja).

## Database

PostgreSQL (Neon) via Prisma. **Bukan SQLite** — `prisma/dev.db` yang ada di
disk adalah sisa lama (terakhir ditulis 2026-09-23) dan sudah tidak dipakai.

Schema: `prisma/schema.prisma` (10 model, tanpa Prisma `enum`).

- Sinkronisasi skema: **`prisma db push`** — tidak ada folder `prisma/migrations`.
- Seed idempoten: `prisma/seed.ts` (berjalan di setiap build).

Detail relasi: `AI_CONTEXT/ARCHITECTURE.md` → Database Architecture.

## Authentication

NextAuth v5, **1 akun admin**, provider Credentials, sesi JWT.

- `lib/auth.config.ts` — konfigurasi edge-safe (tanpa Prisma) dipakai `middleware.ts`.
- `lib/auth.ts` — provider Credentials + `authorize()` (bcrypt.compare).
- `middleware.ts` — menjaga `/admin/*`, kecuali `/admin/login`,
  `/admin/forgot-password`, `/admin/reset-password`.
- Semua mutasi di `app/admin/actions.ts` dipanggil setelah `requireAdmin()`.
- Lupa password: token SHA256 sekali pakai 30 menit (PRD §6–§8).

Kredensial login **hanya** ada di `.env` lokal & database (tidak pernah di
file yang di-commit). Jangan menulis password ke source code.

## Payment

**Tidak ada sistem pembayaran.** Pendaftaran bersifat *booking kursi*
(kuota per batch), diselesaikan admin via WhatsApp. Jangan menambahkan
payment gateway kecuali diminta eksplisit.

## External Services

| Layanan | Fungsi | Status |
|---|---|---|
| Vercel | Hosting + build + DNS | Aktif, live |
| Neon (PostgreSQL) | Database produksi & lokal | Aktif |
| Resend | Email notifikasi | **Terdampak (API key tidak valid)** |
| Vercel Blob | Penyimpanan foto | Belum dikonfigurasi (token kosong) |
| GitHub (`Tciptakarya/web-talenta`) | Sumber + auto-deploy | Aktif |
| Titan Mail (`titan.email`) | Menerima email `info@` | **Perlu re-add MX di Vercel DNS** |
| WhatsApp | Kanal kontak alternatif (tetap dipertahankan) | Aktif |

## Deployment

- **Vercel free tier** (keputusan menggantikan rencana Hostinger — lihat
  `DECISIONS.md`).
- Build command bawaan package.json:
  `prisma generate && prisma db push && tsx prisma/seed.ts && next build`
- Auto-deploy setiap push ke `main` di GitHub.
- Catatan: push kadang butuh fallback HTTP/1.1
  (`git -c http.version=HTTP/1.1 push origin main`) karena HTTP/2 timeout.

## Development Environment

```
npm ci            # WAJIB dipakai, bukan npm install (riwayat drift versi)
npm run dev       # http://localhost:3000
npm run build     # prisma generate + db push + seed + next build
npm run start     # production server lokal
npm run db:studio # Prisma Studio
```

- Windows + PowerShell (pwsh).
- Pastikan versi Next = 15.5.25 dan Prisma = 6.19.3 setelah instalasi.

## Important Dependencies

- `next@15.5.25` dan `prisma@6.19.3` — **pinned**; jangan dinaikkan sembarangan.
- `next-auth@5.0.0-beta.32` — API v5 beta (`auth()`, `handlers`, `signIn`).
- `sharp` — dipakai di `app/api/upload/route.ts` (runtime `nodejs`).
- `allowScripts` di package.json hanya mengizinkan postinstall Prisma/esbuild.

## Important Environment Variables

Semua ada di `.env` (gitignored) dan harus sama di Vercel Project Settings.
**Jangan pernah menulis nilai secret ke file mana pun.**

```
DATABASE_URL=<required>            # connection string PostgreSQL (berisi kredensial)
AUTH_SECRET=<required>             # generate: npx auth secret
AUTH_TRUST_HOST=<required>         # "true"
ADMIN_EMAIL=<required>             # dipakai seed saat pembuatan akun pertama
ADMIN_PASSWORD=<required>          # dipakai seed saat pembuatan akun pertama
RESEND_API_KEY=<optional>          # kosong = email dilewati, data tetap tersimpan
CONTACT_EMAIL_TO=<optional>        # tujuan notifikasi
CONTACT_EMAIL_FROM=<optional>      # format "Nama <email>", harus domain terverifikasi
BLOB_READ_WRITE_TOKEN=<optional>   # kosong = upload ke public/uploads (mode lokal)
NEXT_PUBLIC_SITE_URL=<optional>    # dipakai untuk link reset password
```

Aturan: `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN` boleh kosong — semua fitur
punya fallback aman. `DATABASE_URL` dan `AUTH_SECRET` wajib ada.

## Main Features

**Situs publik**

- Beranda (`app/(public)/page.tsx`): Hero/About/VisiMisi → Layanan (program +
  kategori) → Jadwal Terdekat + tombol **Daftar** → Galeri → Lokasi →
  Testimoni → Kontak (form + WhatsApp).
- `/kelas` — daftar kategori (chip filter) — **DB-driven, bukan teks hardcode**.
- `/kelas/[slug]` — detail kategori + daftar program, SEO per kategori
  (judul/deskripsi dari `category.description`).
- `/program/[slug]` — detail program + jadwal mendatang + pendaftaran.
- Galeri: filter chip per program/kategori + lightbox dengan navigasi
  panah kiri/kanan.
- Form pendaftaran jadwal (modal), termasuk badge kuota kursi.
- Form kontak (**tanpa** honeypot/rate limit — hanya divalidasi Zod).
- Dark/light mode (toggle, preferensi tersimpan), animasi reveal on-scroll,
  aksesibilitas (aria, keyboard, reduced-motion).

**Dashboard admin (`/admin`)**

- Dashboard statistik + ganti password.
- Kategori Kelas (CRUD, slug unik otomatis, blokir hapus bila masih dipakai —
  PRD §10).
- Program (CRUD, deskripsi 11 program).
- Galeri (upload multi-file, edit inline, urutan foto, hapus).
- Jadwal Pelatihan (input tanggal, hari diturunkan otomatis, kuota, optgroup
  per kategori).
- Materi Pelatihan (upload file atau link eksternal; **tidak tampil di publik**).
- Pendaftaran (inbox lead, ubah status, hapus dengan konfirmasi).
- Pesan Masuk (inbox form kontak).
- Testimoni (CRUD).
- Lupa password & reset password.

## User Roles

| Role | Jumlah | Akses |
|---|---|---|
| **Public** (tanpa login) | — | Halaman publik + `POST /api/contact` + `POST /api/pendaftaran` |
| **Admin** | 1 akun (`AdminUser`) | Semua `/admin/*`, `POST /api/upload`, semua Server Action di `app/admin/actions.ts` |

Tidak ada role lain. Jangan membuat sistem multi-role/permission kecuali
diminta eksplisit. Proteksi dilakukan 2 lapis: `middleware.ts` (route) dan
`requireAdmin()` (tiap mutasi).
