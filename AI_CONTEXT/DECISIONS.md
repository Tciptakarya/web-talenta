# Decisions

Keputusan teknis & business logic yang **sudah dibuat**. Semua bisa
ditelusuri ke source code / konfigurasi / history git. Keputusan baru harus
ditambahkan di sini.

---

## Decision: Platform deploy

### Decision

Deploy di **Vercel (free tier)** dengan domain `talentaciptakarya.com`.

### Reason

Rencana awal memakai Hostinger Web Apps, tetapi butuh upgrade paket berbayar.
Vercel free tier sudah cukup untuk site ini dan mendukung auto-deploy dari
GitHub.

### Alternatives Considered

- Hostinger Business (butuh upgrade berbayar — ditolak).
- GitHub Pages (static only, tidak bisa jalanin Next.js server-side).

### Current Implementation

Repo GitHub `Tciptakarya/web-talenta` branch `main` → auto-deploy Vercel.
Nameserver domain dipindah ke `ns1/ns2.vercel-dns.com`.

### Important

**Pertahankan Vercel** kecuali user meminta pindah hosting. Jika pindah,
perhatikan: filesystem Vercel bersifat ephemeral (lihat keputusan database).

---

## Decision: Database PostgreSQL (Neon), bukan SQLite

### Decision

Provider Prisma = `postgresql` (Neon remote), bukan SQLite lokal.

### Reason

Filesystem Vercel bersifat ephemeral — file SQLite akan hilang tiap
deploy/restart. Commit `8e9393f` mengganti provider setelah error `P1012`
saat build di Vercel.

### Alternatives Considered

- SQLite `prisma/dev.db` (cukup untuk lokal, tidak cocok untuk Vercel).
- Supabase (sejenis Neon, tidak dipilih).

### Current Implementation

`prisma/schema.prisma` → `datasource db { provider = "postgresql" }`.
`.env` lokal juga menunjuk ke Neon yang sama, sehingga data lokal = data
produksi. `prisma/dev.db` masih ada sebagai sisa lama dan **tidak dipakai**.

### Important

Jangan kembali ke SQLite. Jangan commit connection string (berisi kredensial).

---

## Decision: Prisma `db push` tanpa file migrasi

### Decision

Sinkronisasi skema pakai `prisma db push`, buwat `prisma migrate`.

### Reason

Project tidak punya folder `prisma/migrations` dan build command sudah
memanggil `prisma db push` — pola ini sudah terbukti jalan di Vercel.

### Alternatives Considered

- `prisma migrate dev/deploy` (lebih rapi untuk skema produksi besar, tapi
  menambah langkah & berisiko gagal di CI bila history migrasi tidak lengkap).

### Current Implementation

`package.json` → `build`: `prisma generate && prisma db push && tsx prisma/seed.ts && next build`.

### Important

Saat mengubah skema, jalankan `npm run db:push` lalu verifikasi build.
**Jangan menambahkan folder migrasi** tanpa keputusan eksplisit (akan
bertabrakan dengan `db push`).

---

## Decision: Versi Next.js & Prisma di-pin

### Decision

`next@15.5.25` dan `prisma@6.19.3` — **tanpa `^`**, versi persis.

### Reason

`node_modules` pernah ter-drift ke Next 16.3.6 (akibat instalasi tidak
terkontrol) dan harus diperbaiki dengan `npm ci`. Next 16 mengubah perilaku
build (termasuk me-rewrite `tsconfig.json`).

### Alternatives Considered

- `npm audit fix --force` → menaikkan Next ke 16 / Prisma ke versi lama →
  breaking change (ditolak; lihat TODO bagian Bugs).

### Current Implementation

Versi eksak di `package.json`. `allowScripts` hanya mengizinkan postinstall
Prisma/esbuild.

### Important

**Gunakan `npm ci`, bukan `npm install`.** Jangan menaikkan Next/Prisma tanpa
instruksi eksplisit dan re-verifikasi penuh.

---

## Decision: Semua mutasi lewat Server Actions + `requireAdmin()`

### Decision

Satu file `app/admin/actions.ts` berisi semua mutasi admin; setiap aksi wajib
`await requireAdmin()` → validasi Zod → Prisma → `revalidatePath`. Tidak ada
lapisan API CRUD baru.

### Reason

Konsisten dengan arsitektur PRD (backend ringan di codebase yang sama),
mengurangi permukaan endpoint yang harus dijaga, dan menjaga satu pola yang
mudah diaudit.

### Alternatives Considered

- REST API route per resource (lebih banyak file & penjagaan auth duplikat).

### Current Implementation

Pola `ActionState { ok, error, ... }` dikembalikan ke client form. `refresh()`
memanggil `revalidatePath("/", "layout")` agar perubahan langsung terlihat di
situs publik.

### Important

**Pertahankan pola ini.** Endpoint API yang ada hanya untuk kebutuhan publik
(`contact`, `pendaftaran`), `upload`, dan NextAuth.

---

## Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)

### Decision

Simpan data ke database **dulu**, kirim email **kemudian**; kegagalan email
dicatat di kolom `statusEmail` (`sent` | `failed` | `skipped`), tidak pernah
membatalkan proses.

### Reason

Lead pendaftaran & pesan kontak adalah aset bisnis; email hanyalah notifikasi.

### Alternatives Considered

- Kirim email lebih dulu (ditolak: gagal email = data hilang).

### Current Implementation

`app/api/contact/route.ts` dan `app/api/pendaftaran/route.ts` menulis row
sebelum memanggil `lib/resend.ts`. `RESEND_API_KEY` kosong → `skipped`.

### Important

**Pertahankan.** Fitur baru yang mengirim email harus mengikuti pola ini.

---

## Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai

### Decision

Kategori kelas disimpan di tabel `Category` (bukan teks hardcode), slug
dihasilkan otomatis dan dijamin unik, dan kategori yang masih diprogram tidak
boleh dihapus (PRD §10).

### Reason

Admin bisa mengelola kategori tanpa deploy; URL tetap stabil; data tidak rusak
karena relasi.

### Alternatives Considered

- Kategori hardcode di `lib/content.ts` (versi v1, hanya jadi fallback).
- Menghapus kategori beserta programnya (ditolak: merusak data).

### Current Implementation

- `lib/slug.ts` → `slugify` + `uniqueSlug` (suffix `-2`, `-3`, …).
- `Category.slug @unique`, `description` dipakai sebagai konten SEO halaman
  `/kelas/[slug]`.
- `deleteCategory` di `app/admin/actions.ts` menolak bila masih ada
  `Program`/`GalleryImage` yang menunjuknya.
- `Program.categoryId` nullable + `onDelete: SetNull` (data lama aman).

### Important

Pertahankan aturan hapus bila terpakai, dan jangan mengubah strategi slug
(URL memakai slug, bukan id).

---

## Decision: Galeri dikaitkan lewat relasi, bukan string kategori

### Decision

`GalleryImage` punya `categoryId` dan `programId` (nullable) dan filter
galeri di-query lewat relasi.

### Reason

Nama kategori tidak akan rusak bila diubah; filter tetap akurat.

### Alternatives Considered

- Kolom teks `kategori` (versi v1, rapuh).

### Current Implementation

`components/site/GalleryGrid.tsx` memfilter lewat relasi; `getGalleryByCategory`
di `lib/data.ts`. Kedua relasi memakai `onDelete: SetNull`.

### Important

Jangan kembali ke string kategori.

---

## Decision: Modal pendaftaran di-portal ke `document.body`

### Decision

`FormPendaftaran` dirender via `createPortal(..., document.body)` + state
`mounted`.

### Reason

Ancestor modal (`Reveal`) punya `transform: translateY(26px)` di
`app/globals.css` → `position: fixed` ter-parenting ke elemen tersebut sehingga
modal menimpa tabel jadwal (commit `fd32dae`).

### Alternatives Considered

- Memindahkan `transform` dari `.reveal` (berisiko merusak animasi seluruh
  halaman).
- Mengganti animasi reveal (perubahan visual luas).

### Current Implementation

`components/site/FormPendaftaran.tsx`. Diverifikasi pada `/`,
`/program/pelatihan-barista`, `/kelas/barista`.

### Important

**Pertahankan portal.** Jika elemen fixed lain (mis. lightbox) mengalami
gejala sama, penyebabnya `transform`/`filter`/`will-change` di ancestor.

---

## Decision: Seed idempoten, tidak pernah menimpa password admin

### Decision

`prisma/seed.ts` dijalankan di setiap build, tetapi hanya `upsert` create-only
dan tidak menyentuh password akun admin yang sudah ada.

### Reason

Build di Vercel selalu menyiapkan data awal, sementara editan admin & password
yang sudah diganti harus bertahan.

### Alternatives Considered

- Seed overwrite penuh (ditolak: menghapus kerja admin).

### Current Implementation

`prisma/seed.ts`: kategori/program di-upsert create-only, testimoni & galeri
hanya saat kosong, akun admin hanya dibuat bila belum ada.

### Important

Jangan ubah seed menjadi overwrite.

---

## Decision: Tidak ada payment gateway

### Decision

Situs tidak memproses pembayaran; pendaftaran = pemesanan kursi yang
dikonfirmasi admin via WhatsApp.

### Reason

Tidak ada kebutuhan pembayaran di PRD; kuota batch ditangani lewat kolom
`kuota` dan status pendaftaran.

### Alternatives Considered

- Midtrans/Stripe (tidak pernah dipakai untuk project ini).

### Current Implementation

Alur: form publik → cek kuota → row `Pendaftaran` → notifikasi email → admin
proses di `/admin/pendaftaran`.

### Important

**Jangan menambahkan payment provider** kecuali diminta eksplisit.

---

## Decision: GitHub Pages dinonaktifkan untuk repo

### Decision

GitHub Pages pada repo `Tciptakarya/web-talenta` dimatikan lewat API.

### Reason

Sebelumnya melayani 404 dan menimpa/mengganggu domain yang diarahkan ke Vercel.

### Current Implementation

Setting Pages repo = disabled.

### Important

Jangan mengaktifkan kembali GitHub Pages tanpa memastikan DNS tidak bentrok
dengan Vercel.

---

## Decision: Rate limit in-memory diterima

### Decision

`lib/rateLimit.ts` memakai `Map` in-memory per instance, bukan store eksternal.

### Reason

Cukup sebagai jaring pengaman spam ringan; batas sebenarnya ada di validasi
Zod + kuota DB. Catatan di kode: cold start me-reset bucket.

### Current Implementation

Pendaftaran: 10 request / 10 menit / IP + honeypot. Reset password juga
memakai rate limit.

### Important

Ini memang disengaja — jangan dianggap bug. Jika butuh proteksi kuat lintas
instance, pertimbangkan store bersama (Redis/KV) sebagai peningkatan sadar.

---

## Decision: Materi pelatihan disembunyikan dari publik

### Decision

Materi pelatihan hanya bisa diakses/dikelola lewat `/admin/materi`; tidak ada
halaman publik yang menampilkan materi.

### Reason

Materi adalah aset kelas untuk peserta terdaftar.

### Current Implementation

Tidak ada rute publik untuk `MateriPelatihan` (hanya admin + relasi Program).

### Important

Jangan mengekspos materi ke publik tanpa keputusan eksplisit.

---

## Decision: `tsconfig.json` `jsx: "preserve"` di-commit

### Decision

Nilai `jsx: "preserve"` di-commit meski Next menulis ulang file tsconfig saat
build.

### Reason

Next 15 menulis ulang `tsconfig.json` saat `next build`; nilai hasil tulis
Next dipertahankan agar tidak ada diff/noise tak terduga (commit `08f8123`).

### Important

Jangan "memperbaiki" nilai ini kembali — akan ditulis ulang Next lagi.

---

## Decision: Tidak ada lapisan auth/role selain Admin

### Decision

Hanya `AdminUser` (1 akun) dan pengunjung publik.

### Reason

Sesuai PRD (1 akun admin). Tidak ada kebutuhan multi-user.

### Important

Jangan menambahkan role/permission system kecuali diminta.

---

## Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`

### Decision

Setiap task signifikan wajib diikuti pembaruan dokumentasi di `AI_CONTEXT/`
(`CURRENT_STATE`, `TODO`, `CHANGELOG`, `DECISIONS`, `ARCHITECTURE` hanya bila
arsitektur berubah, dan `HANDOFF`) — aturan lengkap §1–§8 ada di `AGENTS.md`
→ *Aturan Setelah Menyelesaikan Task*.

### Reason

`AI_CONTEXT/` adalah memori portable project; dokumentasi harus selalu
menggambarkan kondisi **sesudah** task dikerjakan, bukan sebelumnya, agar
agent lain bisa melanjutkan tanpa riwayat percakapan.

### Alternatives Considered

- Mengandalkan riwayat percakapan / pesan commit saja (tidak portable dan
  mudah hilang).

### Current Implementation

- `AGENTS.md` → *Aturan Setelah Menyelesaikan Task* (§1–§8 + Prinsip Utama).
- Verifikasi context sebelum menyatakan selesai, lalu `git status` +
  tampilkan perubahan (tanpa `git reset`/`git checkout` tanpa izin).

### Important

**Pertahankan aturan ini.** Jangan menghapus atau menyederhanakannya tanpa
instruksi eksplisit dari user.

---

## Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)

### Decision

Sidebar admin "fixed" terhadap viewport diimplementasikan dengan wrapper
`h-dvh` + `overflow-hidden` dan area konten sebagai container
`overflow-y-auto` — **bukan** `position: fixed` + `margin/padding-left`.
Semua class scroll behavior di-scope dengan prefiks `md:` agar **mobile
tidak berubah** (sidebar disembunyikan, nav horizontal, body scroll).

### Reason

- Tidak perlu menghitung offset `pl-64` → content tidak mungkin tertutup
  sidebar, tidak ada risiko overlap.
- Tidak ada `position: fixed` di dalam layout yang bisa berinteraksi dengan
  masalah `transform` seperti di halaman publik (§ modal pendaftaran).
- Tanpa layout shift; `h-dvh` mengikuti viewport nyata (address bar mobile).
- `mt-auto` pada account section baru benar-benar bekerja karena wrapper
  punya tinggi tetap — inilah yang membuat email/avatar/Keluar selalu di
  bawah sidebar.

### Alternatives Considered

- `position: fixed` + `md:pl-64` pada konten (lebih klasik, tapi rapuh:
  offset harus ditulis manual dan rawan membuat content tertutup sidebar).
- `sticky top-0` (hanya bekerja selama wrapper masih punya tinggi penuh;
  gagal saat wrapper `min-h-screen` grows).
- Ekstrak `AdminSidebar` ke `components/admin/` (ditoffer ke user, **ditolak**
  untuk versi ini — diff minimal, `AdminLayout` sudah global).

### Current Implementation

`app/admin/(dashboard)/layout.tsx` — wrapper, `aside`, `nav`, kolom konten,
dan area scroll internal (lihat `ARCHITECTURE.md` → Pages & Layout).

### Important

**Pertahankan pola ini.** Jangan mengembalikan scroll ke `body` pada
desktop/tablet. Jika menambah halaman admin di luar route group
`(dashboard)`, pastikan tetap memakai layout tersebut agar sidebar global
tidak terduplikasi.

---

## Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)

### Decision

Project punya knowledge graph di `graphify-out/`; agent **wajib** memakainya
sebagai peta untuk pertanyaan codebase, menjalankan `graphify update .` setelah
mengubah kode, **dan** memakai resep low-token (`--budget`, `--context`,
`explain`) supaya tidak membaca puluhan file secara membabi belahi.

### Reason

Mengurangi eksplorasi mentah, menjaga graph tetap sinkron, dan menghemat
token. Bukti pengukuran:

- `graphify query "alur pendaftaran pelatihan dan perhitungan kuota" --budget
  600 --context call` → **7 baris** yang langsung menunjuk
  `lib/data.ts:280` (`KuotaAware`), `components/site/KuotaBadge.tsx`,
  `app/api/pendaftaran/route.ts` — menggantikan pembacaan 4 file penuh.
- `graphify explain "FormPendaftaran"` → **16 baris** yang langsung
  menampilkan 3 file pemanggil tanpa perlu `grep`.
- `graphify god-nodes --top 8` → **9 baris** peta hub project
  (`requireAdmin()`, `refresh()`, `prisma`, dst).

### Current Implementation

- `AGENTS.md` → bagian graphify: *Workflow low-token (WAJIB)* (8 langkah +
  cheatsheet flag).
- Hook `PreToolUse` (`graphify hook-check`) di `.codex/hooks.json`; git hooks
  `post-commit` + `post-checkout` terpasang.
- Graph: 713 node / 1187 edge / 42 community (per 2026-09-26, setelah fix
  `&` → `&amp;`; sebelumnya 709/1180/50).

### Important

Ikuti *Workflow low-token* di `AGENTS.md`. Jangan membaca banyak file untuk
pertanyaan arsitektur yang bisa dijawab `query`/`explain`/`path`/`affected`.
Parser graphify **tidak** bisa menangani `&` mentah di teks JSX (invalid XML) —
tulis `&amp;`. Warning parsial 2 file tersebut sudah diperbaiki 2026-09-26.
