# Architecture

## High Level Architecture

```
Browser (publik / admin)
   │
   ▼
Next.js Frontend — App Router, Server Components + Client Components
   │
   ├── middleware.ts ── proteksi route /admin/* (NextAuth edge-safe)
   │
   ▼
Application Layer
   ├── Server Actions   app/admin/actions.ts   ← SEMUA mutasi admin
   │                     (requireAdmin() → Zod → prisma → revalidatePath)
   └── API Routes       app/api/*              ← endpoint publik/terproteksi
   │
   ▼
┌───────────────────────────┬──────────────────────────────┐
│  Prisma → PostgreSQL      │  External services           │
│  (Neon, remote)           │  · Resend (email)            │
│                           │  · Vercel Blob (file)        │
│                           │  · sharp (kompresi gambar)   │
└───────────────────────────┴──────────────────────────────┘
```

Karakteristik: **server-side rendering, data selalu segar dari database**
(tidak ada ISR/`revalidate` periodik):

- `/` dan `/kelas` → `export const dynamic = "force-dynamic"`.
- `/kelas/[slug]` dan `/program/[slug]` → dinamis on-demand karena segmen
  `[slug]` **tanpa** `generateStaticParams` (juga tidak ada `revalidate`).

## Frontend Architecture

### Routing

```
app/
├── layout.tsx                 # root layout (font Google, metadata global, skrip anti-FOUC tema)
├── (public)/                  # route group: situs publik (navbar + footer)
│   ├── layout.tsx             #   Header + anchor #top + Footer + ToTop
│   ├── page.tsx               #   Beranda
│   ├── kelas/page.tsx         #   Daftar kategori (chip filter)
│   ├── kelas/[slug]/page.tsx  #   Detail kategori + program
│   └── program/[slug]/page.tsx#   Detail program + jadwal + daftar
├── admin/
│   ├── login/                 #   (publik, dibuka middleware)
│   ├── forgot-password/       #   (publik)
│   ├── reset-password/        #   (publik, butuh token)
│   └── (dashboard)/           #   (terproteksi) layout + sidebar
│       ├── page.tsx           #   Dashboard statistik
│       ├── kategori/ program/ galeri/ jadwal/ materi/
│       └── pendaftaran/ pesan/ testimoni/
└── api/
    ├── auth/[...nextauth]/    # NextAuth handlers
    ├── contact/               # POST (publik)
    ├── pendaftaran/           # POST (publik)
    └── upload/                # POST (butuh session)
```

### Pages & Layout

- `(public)/layout.tsx` → `Header`, anchor `<div id="top" />`, konten halaman,
  `Footer`, `ToTop`. (Animasi `Reveal` dipakai **di dalam tiap halaman /
  komponen**, bukan di layout — mis. `JadwalTerdekat.tsx`.)
- `admin/(dashboard)/layout.tsx` → **satu-satunya** sumber sidebar untuk
  seluruh 9 halaman admin (`Dashboard`, `Galeri`, `Testimoni`, `Program`,
  `Jadwal`, `Pendaftaran`, `Materi`, `Kategori`, `Pesan`). Tidak ada duplikat
  `<aside>` di file lain. Isinya:
  - **Sidebar navy** (`w-64`, `hidden md:flex flex-col`, `p-6`): brand →
    `nav` (dengan badge jumlah pesan/foto/pendaftaran) → **account section**
    (`mt-auto shrink-0`: email admin + `ThemeToggle` + `SignOutButton`).
  - **Scroll behavior (≥768px / `md:`)**: wrapper
    `min-h-screen md:min-h-0 md:h-dvh flex md:overflow-hidden` → tinggi =
    viewport dan window tidak ikut scroll. Kolom konten
    `flex-1 min-w-0 md:h-full md:flex md:flex-col`, area dalam
    `md:flex-1 md:min-h-0 md:overflow-y-auto` → **hanya konten yang scroll**,
    sidebar & nav mobile tetap diam. `nav` `md:overflow-y-auto` agar menu
    panjang bisa scroll internal tanpa menutupi account section.
  - **Mobile (<768px)**: sidebar disembunyikan; nav horizontal yang sudah ada
    (`md:hidden shrink-0`) tetap dipakai dan **body scroll seperti
    sebelumnya** (semua class scroll Behavior di-scope `md:`).
  - **Kontras di sidebar navy**: `.admin-sidebar .theme-toggle` di
    `app/globals.css` memaksa warna terang + border putih transparan, karena
    `.theme-toggle` default memakai `color: var(--navy)` dan ikon SVG-nya
    `stroke="currentColor"` → navy-di-atas-navy = tak terlihat. Situs publik
    tidak di-scope, jadi tidak berubah.
  - `md:h-dvh` (bukan `h-screen`) supaya tidak ada celah saat address bar
    mobile berubah tinggi.
  - Footer di dalam area scroll: info mode penyimpanan foto & status email.
- SEO: metadata per halaman, terutama `/kelas/[slug]` (judul/deskripsi dari
  `category.description`).

### Components

```
components/
├── site/     # dipakai halaman publik (Client Components bila ada interaksi)
│   ├── Header.tsx, Footer.tsx, HeroAbout.tsx, Layanan.tsx, Kontak.tsx,
│   │   Lokasi.tsx, Testimoni.tsx, Reveal.tsx, ThemeToggle.tsx, ToTop.tsx
│   ├── JadwalTerdekat.tsx   # tabel jadwal → memuat FormPendaftaran
│   ├── FormPendaftaran.tsx  # modal pendaftaran (createPortal ke body)
│   ├── GalleryGrid.tsx      # filter chip + lightbox navigable
│   ├── KuotaBadge.tsx       # badge Tersedia / Sisa N / Penuh
│   └── ProgramIcon.tsx
└──admin/   # 1 manager per resource, dipakai halaman /admin/*
    ├── KategoriManager, ProgramManager, GaleriList, JadwalManager,
    │   MateriManager, PendaftaranList, PesanList, TestimoniManager
    ├── LoginForm, ForgotPasswordForm, ResetPasswordForm,
    │   GantiPasswordForm, SignOutButton, UploadForm
```

### Hooks & State Management

- **Tidak ada** library state global (tanpa Redux/Zustand/Context khusus).
- State lokal via `useState`/`useEffect`; data server via Server Components.
- Theme: preferensi disimpan di `localStorage` + kelas di `<html>`.

### Form Handling & Validation

- **Admin (Server Action)**: `<form action={action}>` → `FormData` →
  `zod.safeParse` di `app/admin/actions.ts` → return `ActionState`
  (`{ ok, error, ... }`) → client render pesan. Setelah sukses dipanggil
  `revalidatePath("/", "layout")` (fungsi lokal `refresh()`).
- **Publik (API Route)**: fetch JSON ke `/api/contact` atau
  `/api/pendaftaran` → validasi Zod server-side → balasan `{ ok, error }`.
  Skema di `lib/schemas.ts` dipakai oleh **keduanya** (satu sumber kebenaran).
- Pertahanan spam (**hanya di `/api/pendaftaran`**): field honeypot `website`
  (balasan sukses palsu agar bot tidak mengulang) + rate limit in-memory
  10 req/10 menit per IP. `lib/schemas.ts` → `contactSchema` **tidak**
  punya honeypot dan `/api/contact` **tidak** ada rate limit-nya.
- Lupa/password reset (`requestPasswordReset`) punya rate limit ganda:
  5/IP/15 menit + 3/email/jam.

## Backend Architecture

### API Routes (4)

| Route | Method | Auth | Fungsi |
|---|---|---|---|
| `app/api/auth/[...nextauth]/route.ts` | GET/POST | — | NextAuth handlers |
| `app/api/contact/route.ts` | POST | publik | Simpan `ContactMessage` → email Resend (boleh gagal) |
| `app/api/pendaftaran/route.ts` | POST | publik | Zod → cek jadwal+kuota → simpan `Pendaftaran` → email |
| `app/api/upload/route.ts` | POST | session | Upload foto: sharp → Blob/`public/uploads` → `GalleryImage` |

### Server Actions — `app/admin/actions.ts`

Semua mutasi admin ada di **satu file** ini (keputusan: tidak membuat lapisan
API baru). Setiap aksi mengikuti pola sama:

```
export async function xxx(formData: FormData): Promise<ActionState> {
  await requireAdmin();                              // 1. cek session
  const parsed = xxxSchema.safeParse(...);           // 2. validasi Zod
  if (!parsed.success) return { ok: false, error: ... };
  await prisma.xxx.create|update|delete({ ... });     // 3. aksi DB
  refresh();                                          // 4. revalidatePath
  return { ok: true };
}
```

Pembagian: Testimoni (3), Kategori (3 + `deleteCategoryAction`), Program
(3 + `deleteProgramAction`), Galeri (3), Ganti password (1), Reset password
(2), Jadwal (3), Materi (3), Pendaftaran (2), Pesan (1).

`requireAdmin()` adalah helper privat: melempar error bila `auth()` kosong.

### Services / Utilities — `lib/`

| File | Fungsi |
|---|---|
| `lib/prisma.ts` | Singleton `PrismaClient` (via `globalThis`, hindari hot-reload ganda) |
| `lib/auth.ts` | NextAuth utama + provider Credentials + `authorize()` bcrypt |
| `lib/auth.config.ts` | Konfigurasi edge-safe (tanpa Prisma) untuk middleware |
| `lib/data.ts` | Semua query publik bertipe + logika kuota (`sisaKursi`, tanggal WIB) |
| `lib/schemas.ts` | Seluruh skema Zod (satu sumber kebenaran validasi) |
| `lib/slug.ts` | `slugify` + `uniqueSlug` (slug unik auto: `-2`, `-3`, …) |
| `lib/storage.ts` | `storeImage`/`removeImage` — Blob bila token ada, fallback `public/uploads` |
| `lib/resend.ts` | 3 fungsi email: kontak, reset password, pendaftaran → status `sent\|failed\|skipped` |
| `lib/passwordReset.ts` | `generateResetToken`, `hashToken` (SHA256), `isExpired` |
| `lib/rateLimit.ts` | Rate limiter in-memory sliding window |
| `lib/content.ts` | Konten statis v1 (PROGRAMS, TESTIMONIALS, CATEGORIES, GALLERY_IMAGES) sebagai fallback/data awal |

### Middleware & Authorization

`middleware.ts` (matcher `/admin/:path*`):

- Belum login + bukan halaman login/forgot/reset → redirect `/admin/login`.
- Sudah login + bukan `/admin/login` → redirect `/admin`.

Lapisan kedua: `requireAdmin()` di setiap Server Action + `auth()` di
`app/api/upload/route.ts`. **Auth dan otorisasi selalu di server.**

## Database Architecture

**Engine:** PostgreSQL (Neon) · **ORM:** Prisma 6 · **Skema:**
`prisma/schema.prisma` · **Sinkronisasi:** `prisma db push` (tanpa migrasi
file) · **Enum Prisma: tidak ada** — status memakai `String` yang divalidasi
Zod (lihat `lib/schemas.ts`).

### Models & Hubungan (bahasa manusia)

```
Category ──1:N── Program ──1:N── JadwalPelatihan ──1:N── Pendaftaran
    │               │                                      (Cascade hapus)
    │               ├──1:N── MateriPelatihan
    │               └──1:N── GalleryImage
    └──1:N── GalleryImage

Testimonial        (berdiri sendiri, urut via `urutan`)
ContactMessage     (berdiri sendiri — inbox kontak)
AdminUser ──1:N── PasswordResetToken   (Cascade hapus)
```

Dijelaskan per relasi:

- **Category → Program**: satu kelas (mis. "Kelas Komputer") punya banyak
  program. `categoryId` **nullable** + `onDelete: SetNull` → data lama tetap
  aman bila kategori dihapus.
- **Category → GalleryImage**: foto juga bisa dikaitkan ke kategori
  (`categoryId`, SetNull) sehingga filter galeri pakai **relasi, bukan string
  hardcode**.
- **Program → GalleryImage / JadwalPelatihan / MateriPelatihan**:
  semua `onDelete: Cascade` → hapus program = hapus jadwal/materi/foto turunannya.
- **JadwalPelatihan → Pendaftaran** (`Cascade`): satu batch jadwal punya
  banyak pendaftar. Ini inti fitur pemesanan.
- **AdminUser → PasswordResetToken** (`Cascade`): token dihapus bila akun dihapus.

### Field penting

| Model | Field | Arti |
|---|---|---|
| `Category` | `slug @unique`, `description` | slug dipakai di URL `/kelas/[slug]`; `description` = konten SEO halaman |
| `Program` | `slug @unique`, `judul`, `deskripsi`, `urutan`, `isActive` | urutan tampil, `isActive` menyembunyikan program |
| `JadwalPelatihan` | `tanggal DateTime?`, `hari String`, `jamMulai/jamAkhir` | `hari` **diturunkan** dari `tanggal` (Asia/Jakarta); `tanggal` kosong = jadwal mingguan lama |
| | `kuota Int?` | `null` = tanpa batas (badge tidak tampil) |
| `Pendaftaran` | `status` = `baru\|dikonfirmasi\|selesai\|ditolak` | **Kuota dihitung dari yang bukan `ditolak`** |
| | `statusEmail` = `sent\|failed\|skipped` | bukti email dicek setelah penyimpanan |
| `ContactMessage` | `statusEmail` | pola sama: pesan tetap tersimpan walau email gagal (PRD §8) |
| `MateriPelatihan` | `tipe` (`VIDEO\|MODUL CETAK\|PDF\|SLIDE`), `fileUrl?`, `linkUrl?` | wajib salah satu (upload **atau** link) |
| `PasswordResetToken` | `tokenHash @unique`, `expiresAt`, `usedAt?` | hanya hash tersimpan; 30 menit; sekali pakai |
| `AdminUser` | `email @unique`, `passwordHash` | bcrypt |

### Index

`PasswordResetToken(adminUserId, expiresAt)` ·
`JadwalPelatihan(programId, tanggal)` ·
`Pendaftaran(jadwalId, status)` ·
`MateriPelatihan(programId)`

## Payment Architecture

**Tidak ada.** Tidak ada provider pembayaran, order, webhook, atau status
pembayaran. Alur pendaftaran berhenti di "kursi dipesan" → admin konfirmasi
via WhatsApp → ubah status di `/admin/pendaftaran`.

## Email Architecture

Penyedia: **Resend** (`lib/resend.ts`). Semua mengembalikan
`"sent" | "failed" | "skipped"` dan **tidak pernah membatalkan penyimpanan data**.

| Jenis | Fungsi | Trigger | Pemicu |
|---|---|---|---|
| Notifikasi pesan kontak | `sendContactNotification` | `POST /api/contact` | Email baru masuk → admin |
| Notifikasi pendaftaran | `sendPendaftaranNotification` | `POST /api/pendaftaran` | Pendaftar baru → admin |
| Reset password | `sendPasswordResetEmail` | Server action `requestPasswordReset` | Link sekali pakai 30 menit → admin |

- `RESEND_API_KEY` kosong → status `skipped` + warning di log.
- Gagal kirim → status `failed`, disimpan ke kolom `statusEmail`.
- Reset password memakai tampilan generik (**tanpa enumerasi akun**).
- Email verifikasi/invoice/pembayaran: **tidak ada**.

## File Structure

```
├── app/                    # App Router (lihat Routing di atas)
├── components/
│   ├── admin/
│   └── site/
├── lib/                    # util & service (lihat tabel di atas)
├── prisma/
│   ├── schema.prisma       # 10 model, provider postgresql
│   ├── seed.ts             # idempoten, jalan tiap build
│   ├── migrate-categories.ts   # skrip migrasi manual (sekali jalan)
│   └── dev.db              # SISA SQLite lama — sudah tidak dipakai
├── middleware.ts           # proteksi /admin/*
├── public/                 # aset statis (+ uploads/ bila blob mati)
├── assets/                 # gambar sumber
├── legacy/                 # situs statis v1 (CNAME, index.html) — arsip
├── mockups/                # wireframe HTML (mis. pendaftaran-wireframe.html)
├── graphify-out/           # knowledge graph (lihat AGENTS.md)
├── .codex/hooks.json       # hook PreToolUse → graphify hook-check
├── AI_CONTEXT/             # dokumentasi handoff ini
├── README.md               # status vs PRD + cara pakai
├── DEPLOY.md               # PANDUAN LAMA (Hostinger) — lihat catatan di TODO
└── AGENTS.md               # instruksi permanen untuk AI agent
```

Folder yang **di-gitignore**: `node_modules/`, `.next/`, `prisma/*.db`,
`.env*`, `public/uploads/`, `deploy.zip`.

## Important Files

| File | Purpose | Important? |
|------|---------|------------|
| `prisma/schema.prisma` | Sumber kebenaran skema DB (10 model) | ✅✅ |
| `app/admin/actions.ts` | Semua mutasi admin + `requireAdmin()` | ✅✅ |
| `lib/schemas.ts` | Semua validasi Zod (admin & publik) | ✅✅ |
| `lib/data.ts` | Query publik + logika kuota & tanggal | ✅✅ |
| `lib/auth.ts` / `lib/auth.config.ts` | Autentikasi NextAuth | ✅✅ |
| `middleware.ts` | Proteksi route `/admin/*` | ✅ |
| `lib/resend.ts` | 3 alur email + status `sent/failed/skipped` | ✅ |
| `lib/storage.ts` | Upload Blob / fallback lokal | ✅ |
| `lib/slug.ts` | Slug unik otomatis | ✅ |
| `prisma/seed.ts` | Seed idempoten (jalan tiap build) | ✅ |
| `app/api/pendaftaran/route.ts` | Alur pendaftaran: kuota → simpan → email | ✅ |
| `app/api/contact/route.ts` | Alur kontak: simpan → email | ✅ |
| `app/api/upload/route.ts` | Upload foto + kompresi sharp | ✅ |
| `components/site/FormPendaftaran.tsx` | Modal pendaftaran (portal — jangan diubah sembarangan) | ✅ |
| `app/globals.css` | CSS v1 (tema, `.reveal` transform, dark mode) | ✅ |
| `package.json` | Script build + versi pinned | ✅ |
| `middleware.ts`, `next.config.ts`, `tsconfig.json` | Konfigurasi Next | ✅ |
| `.env.example` | Kunci env (tanpa nilai) | ⚠️ sebagian usang |
| `DEPLOY.md` | Panduan deploy Hostinger | ⚠️ sudah tidak relevan |
| `README.md` | Status fitur vs PRD | ⚠️ sebagian usang |
| `legacy/` | Situs statis v1 | ❌ arsip saja |
| `graphify-out/` | Knowledge graph (dijaga agar sinkron) | ⚠️ tooling |
