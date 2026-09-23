# Website Talenta Cipta Karya — v2.1 (Next.js)

Implementasi sesuai **PRD-Talenta-Cipta-Karya.md v2.1**: frontend Next.js (App
Router, TypeScript, Tailwind) + backend ringan di codebase yang sama (API Routes
& Server Actions) — tanpa server terpisah.

| PRD | Status |
|---|---|
| Frontend Next.js, desain & konten v1 dipertahankan | ✅ `app/(public)/page.tsx` + CSS v1 di `app/globals.css` |
| Backend terintegrasi (API Routes / Server Actions) | ✅ `app/api/*`, `app/admin/actions.ts` |
| Login admin (NextAuth credentials, 1 akun) | ✅ `/admin/login` + `middleware.ts` |
| Upload foto galeri dari dashboard | ✅ `/admin/galeri` → `POST /api/upload` (kompres `sharp`) |
| Kelola testimoni (tambah/edit/hapus) | ✅ `/admin/testimoni` |
| Kelola deskripsi 11 program | ✅ `/admin/program` |
| Form kontak fungsional → DB + email | ✅ `POST /api/contact` → `ContactMessage` + Resend |
| Notifikasi email tiap pesan masuk | ✅ `lib/resend.ts` → info@talentaciptakarya.com |
| WhatsApp tetap sebagai opsi di samping form | ✅ tombol di section Kontak tidak dihapus |
| Inbox pesan cadangan | ✅ `/admin/pesan` |
| Upload dikompres otomatis (`sharp`) | ✅ resize max 1600px → WebP q82 |
| Gambar via `next/image` | ✅ |
| Aksesibilitas v1 (aria, keyboard, reduced-motion) | ✅ |

Dilengkapi dua fase pengembangan lanjutan:

- **Fase 2 — Kategori kelas dinamis**: model `Category` di DB (bukan teks
  hardcode), CRUD di Admin → *Kategori Kelas*, halaman publik `/kelas` (chip
  filter `[Semua][Kelas Komputer]…`) dan `/kelas/[slug]` (SEO per kategori,
  konten dari `category.description`), program & galeri berelasi ke kategori,
  validasi §10 — kategori yang masih dipakai tidak bisa dihapus.
- **Fase 3 — Dark/light mode**: tombol toggle (moon/sun) di header publik &
  sidebar/mobile bar admin, preferensi disimpan di `localStorage("theme")`,
  anti-flash via script inline di `app/layout.tsx`; mode terang tidak berubah.

## Menjalankan lokal

```bash
npm install
npm run db:setup     # buat SQLite + migrasi + seed (11 program, galeri, testimoni, admin)
npm run dev          # http://localhost:3000
```

`npm run build` otomatis menjalankan `prisma generate` + `db push` + seed
(idempoten, create-only) sebelum `next build` — sama persis dengan pipeline
deploy di Hostinger.

**Login admin:** `info@talentaciptakarya.com` — password = nilai
`ADMIN_PASSWORD` di `.env` (akun dibuat saat `db:setup` pertama; ubah kapan saja
lewat kartu **"Keamanan Akun"** di dashboard).
Ganti password dari dashboard: `/admin` → kartu **"Keamanan Akun"**
(`ADMIN_EMAIL`/`ADMIN_PASSWORD` hanya dipakai saat akun pertama dibuat di DB baru).

## Konfigurasi (.env)

Salin `.env.example` → `.env`. Semua key punya fallback aman:

| Variabel | Tanpa nilai (mode lokal) | Dengan nilai (produksi) |
|---|---|---|
| `DATABASE_URL` | SQLite `prisma/dev.db` | PostgreSQL Neon/Supabase |
| `RESEND_API_KEY` | pesan tetap tersimpan, email dilewati (`statusEmail: skipped`) | notifikasi email aktif ke `CONTACT_EMAIL_TO` |
| `BLOB_READ_WRITE_TOKEN` | foto disimpan ke `public/uploads/` | foto disimpan ke Vercel Blob |
| `AUTH_SECRET` | sudah terisi default dev | **wajib** ganti di produksi |

Reliabilitas email (PRD §8): pengiriman Resend gagal → pesan **tetap** tersimpan
di `ContactMessage` dan tampil di `/admin/pesan` (`statusEmail: failed`).

## Deploy ke produksi

Panduan lengkap → **[DEPLOY.md](./DEPLOY.md)** (Hostinger Web Apps + Resend):
langkah hPanel, daftar environment variables, DNS/SSL, verifikasi pasca-deploy,
backup database, dan opsi foto (Vercel Blob).

Ringkas: push ke GitHub (atau upload ZIP) → buat *Node.js web app* di hPanel →
isi env (`AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`,
`DATABASE_URL=file:../../site.db`, `ADMIN_PASSWORD`, dll.) → build di-hosting
menjalankan db push + seed otomatis → login `/admin` → **ganti password**.

> Alternatif Vercel: butuh pindah ke PostgreSQL (ganti `provider = "sqlite"` →
> `"postgresql"` di `schema.prisma`) + Vercel Blob — lihat catatan `.env.example`.

## Struktur

```
app/
├── (public)/page.tsx        → halaman utama (section v1, data dari DB)
├── (public)/kelas/          → /kelas (filter kategori) + /kelas/[slug]
├── admin/
│   ├── login/               → login admin
│   └── (dashboard)/         → /admin, /galeri, /testimoni, /program, /kategori, /pesan
├── api/
│   ├── auth/[...nextauth]/  → NextAuth
│   ├── contact/             → validasi Zod → DB → Resend
│   └── upload/              → sharp → Blob/local → DB
├── globals.css              → desain v1 + token Tailwind (visual tidak berubah)
components/
├── site/                    → port komponen v1 (Header, Hero, Layanan, Galeri, …) + ThemeToggle
└── admin/                   → komponen dashboard (termasuk GantiPasswordForm)
lib/
├── auth.ts / auth.config.ts → NextAuth v5 (credentials + JWT)
├── data.ts                  → query DB dengan fallback konten v1
├── resend.ts                → notifikasi email
├── storage.ts               → Vercel Blob / fallback public/uploads
├── schemas.ts               → validasi Zod
├── slug.ts                  → auto-slug unik (kategori/program)
└── content.ts               → data statis v1 (seed + fallback)
prisma/
├── schema.prisma            → Category, Program, GalleryImage, Testimonial, ContactMessage, AdminUser
└── seed.ts
middleware.ts                → proteksi /admin/*
legacy/                      → website statis v1 (index.html, styles.css, script.js, CNAME)
```

## Catatan

- `legacy/` hanya arsip referensi — site v1 sudah tidak dipakai. Setelah domain
  pindah ke Vercel, GitHub Pages bisa dimatikan.
- Foto upload di mode lokal (`public/uploads/`) tidak akan bertahan di Vercel
  (filesystem read-only) — di produksi wajib `BLOB_READ_WRITE_TOKEN`.
- Perintah berguna: `npm run db:studio` (browse DB), `npm run db:seed` (ulang
  seed aman/idempoten).
