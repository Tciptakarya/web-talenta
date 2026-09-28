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

## Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe

### Decision

1. `lib/storage.ts` mengekspor `StorageUnavailableError` + taksonomi
   `StorageFailCode` (`blob-not-configured`, `readonly-fs`, `no-permission`,
   `disk-full`, `unknown`), `isEphemeralFs()`, `assertStorageReady()`, dan
   `describeStorageFailure()`.
2. Route `/api/upload` memanggil `assertStorageReady()` **sebelum** memproses
   gambar; `catch` memetakan storage→503, Prisma→500, sharp/lain→422, dan
   selalu `console.error` detail lengkap di server.
3. Pesan ke user tidak boleh memuat path internal, stack trace, atau kredensial.

### Reason

Kejadian 2026-09-26: di production semua upload gagal dengan satu pesan
generik, padahal penyebabnya konfigurasi storage. `catch` lama menelan
semua exception (EPERM/EROFS, error sharp, error Prisma) jadi satu kalimat.
Kode yang bisa gagal diam-diam harus gagal dengan jujur dan bisa ditindaklanjuti.

### Alternatives Considered

- Hanya perbaiki pesan error tanpa mengubah arsitektur (ditolak — pesan tanpa
  kode penyebab tidak bisa ditindaklanjuti).
- Hapus fallback `public/uploads` sepenuhnya (ditolak — fallback ini yang
  membuat development lokal tetap jalan tanpa setup apa pun).
- Tulis file ke `/tmp` di Vercel (ditolak — ephemeral, hilang tiap instance;
  bukan penyimpanan).

### Current Implementation

- `lib/storage.ts`, `app/api/upload/route.ts`, `components/admin/UploadForm.tsx`
  (`pesanFromStatus()` untuk balasan non-JSON/platform).
- Pattern yang sama otomatis berlaku untuk materi pelatihan karena
  `materiFileFromFormData()` memakai `storeImage` yang sama.
- **`blobEnabled()` menerima dua jalur kredensial**: `BLOB_READ_WRITE_TOKEN`
  (statis, untuk lokal / di luar Vercel) **atau** `BLOB_STORE_ID` +
  `VERCEL_OIDC_TOKEN` (OIDC). Alasannya: sejak 2026 UI Vercel tidak lagi
  menampilkan read-write token — hanya "Rotate Credentials" — dan store yang
  terhubung ke project memakai OIDC (token berumur pendek, berputar otomatis).
  SDK mengabaikan read-write token bila OIDC tersedia, jadi token lama yang
  tidak berlaku tidak lagi menggagalkan upload.

### Important

**Jangan kembali ke generic catch-all.** Storage baru dianggap "aman"
bila `BLOB_READ_WRITE_TOKEN` terisi di hosting production. Jaga `isEphemeralFs()`
agar environment baru (mis. Cloud Run) ikut terdeteksi.

---

## Decision: Galeri publik memakai container & grid sendiri

### Decision

1. Section galeri memakai modifier container **`.wrap-gallery` (1360px)**, bukan
   `.wrap` global (1180px) — `.wrap` global **tidak diubah** supaya halaman
   lain tidak ikut melebar.
2. `.gallery-grid` jadi 4 kolom (≥1181px) / 3 kolom (861–1180px) / 2 kolom
   (≤860px) dengan gap 14px, aspect-ratio 4/3, radius 14px.
3. Section galeri memakai class `.gallery-section` (padding 64px/44px,
   header margin 28px) agar lebih rapat dari section biasa (104px/56px).
4. `/kelas/[slug]` dipecah menjadi tiga blok `.wrap` supaya section Galeri
   berada di container lebar sendiri.

### Reason

Galeri adalah konten utama situs; dengan 3 kolom di 1116px pada layar 1920px
ada ~740px whitespace terbuang. Container khusus + 4 kolom mengisi ruang dan
menambah jumlah foto per viewport (20 foto dalam 1080px vs 12 sebelumnya)
tanpa mengorbankan halaman lain. CSS Grid + aspect ratio konsisten dipilih
( bukan masonry) agar sejajar, responsif, dan mudah dipindai.

### Alternatives Considered

- Menaikkan `.wrap` global ke 1360px (ditolak: mengubah semua halaman publik).
- Masonry (ditolak: alignment kurang rapi & sulit rawat).
- Ubah batas 1180px tapi perkecil foto saja (ditolak: tidak menambah area).

### Current Implementation

`app/globals.css` (`.wrap-gallery`, `.gallery-section`, `.gallery-grid`,
`.gallery-item`, `.gallery-caption`), `app/(public)/page.tsx`,
`app/(public)/kelas/[slug]/page.tsx`, `components/site/GalleryGrid.tsx`
(atribut `sizes` saja).

### Important

**Jangan** mengubah `.wrap` global. Section galeri baru WAJIB memakai
`wrap wrap-gallery`. Filter program + lightbox adalah existing functionality —
 jangan dihapus saat menata tampilan.

---

## Decision: Grouping galeri di klien + urutan scoped per subgroup

### Decision

1. Grouping KATEGORI → PROGRAM untuk halaman `/admin/galeri` dihitung **di
   sisi klien** (`buildGroups(items)` di `GaleriList.tsx`) dari `items` yang
   sudah diambil halaman lewat satu query (sudah `include` category & program).
2. Section kategori & sub-section program berupa accordion (state React
   `ciut`, `aria-expanded`), default terbuka bila ≤4 kategori; ada tombol
   "Buka semua" / "Ciutkan semua".
3. `moveGalleryImage` menerima `targetId` dan hanya **menukar `urutan` dua
   foto** (tetangga dalam subgroup), bukan membalik urutan daftar global.
4. Grup kosong tidak pernah dirender; foto tanpa kategori/program tetap tampil
   di grup "Tanpa Kategori"/"Tanpa Program" (di urutan akhir).

### Reason

- Halaman sudah mengambil relasi dalam satu query — grouping di klien
  menghilangkan risiko N+1 dan tidak menambah beban database.
- Mengganti "urutan global" dengan "tukar dua foto" membuat tombol ↑/↓
  masuk akal di tampilan bergroup: foto tidak melompat ke kategori lain,
  sementara urutan foto lain (dan tampilan publik) tetap utuh.
- Kategori/program kosong di-render hanya akan membingungkan admin; data
  aslinya tidak ikut terhapus dari database.

### Alternatives Considered

- Query terpisah per kategori/program (N+1 — ditolak).
- Menambah kolom `groupOrder` sendiri di DB (tidak perlu — `urutan` global
  masih jadi acuan tampilan publik).
- `<details>`/`<summary>` native (ditolak: memakai state agar styling & chevron
  konsisten dengan tema admin).

### Current Implementation

`components/admin/GaleriList.tsx`, `app/admin/actions.ts`
(`moveGalleryImage`), `app/admin/(dashboard)/galeri/page.tsx` (teks pengantar).

### Important

**Jangan** mengubah `moveGalleryImage` kembali ke pembalikan daftar global —
itu membuat ↑/↓ terasa melompat antar kategori. Sorting **hanya** boleh
mengikuti `urutan` (publik), bukan nama file/tanggal upload.

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
Parser graphify **tidak** bisa menangani `&` mentah di teks JSX (invalid XML) -
tulis `&amp;`. Warning parsial 2 file tersebut sudah diperbaiki 2026-09-26.

---

## Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO

### Decision

1. `GalleryImage` mendapat kolom **`year Int?`** (nullable), di-`db push`
   tanpa migrasi. Validasi ada di Zod (`gallerySchema.year`): coerce → int →
   `min(TAHUN_MIN=1990)` → `max(TAHUN_MAKS = tahun berjalan + 1)` — jadi 0,
   99999, string kosong, dan `undefined` semuanya **ditolak 400**. `year`
   **wajib** di Zod (upload & edit) meski kolom DB nullable.
2. **Tahun lama tidak boleh dikarang.** Backfill idempoten
   `prisma/backfill-gallery-year.ts` hanya membaca sinyal tahun yang
   tertulis di caption (`"YYYY: "` di awal, atau `Tahun YYYY`), dengan
   range-check. `uploadedAt` **tidak dipakai** — terbukti salah (semua foto
   diunggah 2026, kegiatannya 2022–2026). 22 dari 30 foto terisi; 8 sisanya
   tetap `NULL` → grup publik **"Tanpa Tahun"** (keputusan user).
3. Level grouping utama publik: **program** → fallback `category.name` →
   `"Lainnya"`; sub-level **tahun** (`year` desc, "Tanpa Tahun" di bawah);
   foto = level ketiga. Grup/tahun kosong tidak dirender, jumlah dihitung
   dari data, **tanpa hardcode** program/tahun apa pun — data baru muncul
   otomatis tanpa ubah frontend.
4. Tahun terbaru per program **default terbuka**, sisanya ciut; accordion
   ciut tidak merender DOM/gambar. Filter chips tetap per program.
5. Homepage: N section galeri per kategori digabung jadi **satu** section
   `id="galeri-utama"` dalam `<div id="galeri">`; link Header
   `/#galeri-lainnya` → `/#galeri`. `getGalleryGroups()` dihapus (dead code).
6. **Tidak menambah index** `year` — hanya satu `findMany` + grouping klien
   (30 baris). Tidak ada filter tahun/tahun di admin (data terlalu kecil);
   cukup info "Tahun" per kartu + ringkasan "N belum punya tahun".

### Reason

Permintaan user: struktur galeri harus PROGRAM → TAHUN → FOTO, tanpa
mengarang data lama dan tanpa merusak fungsi yang sudah jalan. `year` Integer
(bukan String) agar urutan tahun benar dan bisa divalidasi rentang; nullable
agar migrasi aman (tidak ada baris yang diubah/dihapus, URL foto tidak
berubah).

### Alternatives Considered

- Tahun dari `uploadedAt` (ditolak — terbukti salah datanya).
- Menebak tahun dari nama file/program (ditolak — itu mengarang).
- `year String` (ditolak — urutan leksikografis & validasi rentang sulit).
- Filter tahun di admin (ditolak — 30 foto, grouping + ringkasan cukup;
  aturan PRD §23 melarang filter yang tidak perlu).
- Membuka semua tahun semua program (ditolak — meledaknya render gambar).

### Current Implementation

- `prisma/schema.prisma` (`year Int?`), `prisma/backfill-gallery-year.ts`.
- `lib/schemas.ts`: `TAHUN_MIN`, `TAHUN_MAKS`, `gallerySchema.year`
  (`z.coerce.number({ error: "Tahun wajib dipilih." })`).
- `app/api/upload/route.ts` + `app/admin/actions.ts`
  (`updateGalleryImage`): persist `year`.
- `app/admin/(dashboard)/galeri/page.tsx`: `tahunTersedia` (data ∪ sekarang
  ∪ +1, desc) → `UploadForm` & `GaleriList`.
- `components/site/GalleryGrid.tsx`: grouping klien + accordion tahun +
  chips + lightbox (caption `Program · Tahun · caption (n/total)`).
- `lib/data.ts`: `GalleryRow.year` (fallback `year: null`).

### Important

- **Jangan** pernah mengisi `year` dengan tebakan; foto tanpa sinyal tahun
  biarkan `NULL`.
- **Jangan** menjadikan `year` required di Prisma sebelum 8 foto lama diisi
  admin lewat Edit.
- Kolom `year` tidak boleh dipakai sebagai filter wajib di query — grouping
  tetap dilakukan setelah `findMany`.

---

## Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe

### Decision

1. Elemen galeri yang menyentuh tipografi/warna — chip `.gal-chip`,
   kop program `.gallery-program` / `.gallery-program-title` /
   `.gallery-program-kategori`, baris tahun `.year-*`, judul
   `.gallery-title` — didefinisikan sebagai **class CSS tak-ber-layer di
   `app/globals.css`**, bukan utility Tailwind.
2. **Alasan pertama (tipografi)**: `globals.css` memuat rule global
   tak-ber-layer (`h1..h4{font-size:…}`, `h1,h2,h3,h4{font-weight:700;
   letter-spacing:-0.01em}`) sedangkan Tailwind v4 menaruh utility di
   cascade layer → utility **kalah selalu** berapa pun spesifikasinya.
   Terbukti: `<h3 class="text-[21px] font-semibold">` terukur
   18,72px/700. Lewat `.gallery-program-title` (tak-ber-layer): 25,6px /
   600 / uppercase ✓.
3. **Alasan kedua (warna)**: blok `:root.dark` hanya me-reset token
   tertentu. Fakta terukur: `var(--navy)` **tidak adaptif** (tetap
   `#16214A` → tak terlihat di bg `#0E1322`), sedangkan `var(--blue)`,
   `var(--line)`, `var(--mist)`, dan `var(--color-navy)` **adaptif**.
   Konvensi wajib untuk CSS/JSX baru:
   - teks heading/label → utility **`text-navy`** (terang: navy; gelap:
     `:root.dark .text-navy` → putih);
   - garis/aksen state aktif → **`var(--color-navy)`** (terang navy /
     gelap biru) atau **`var(--blue)`** (terang #2C4A9E / gelap #4E7FF0);
   - teks redup → **`var(--mist)`**;
   - **jangan** menulis `color: var(--navy)` di CSS komponen baru.
4. Chip sengaja **tidak** memakai `bg-white`/`text-navy/70`:
   `:root.dark .bg-white` (spesifisitas 0,3,0) memblokir `hover:bg-*` /
   `hover:border-*` apa pun, dan `text-navy/70` hanya ≈1,6:1 di gelap.
5. Thumbnail tahun memakai **foto pertama grup tahun yang sudah ada**
   (`t.items[0].url`, `loading="lazy"`, object-fit cover) — keputusan
   user: boleh asal **tanpa perubahan schema/DB**.
6. State aktif accordion: garis **2px** `var(--color-navy)` +
   `padding-bottom` dikompensasi (13+2 = 14+1 = 15px) agar tidak ada
   layout jump; panah `↑` + `aria-expanded` + foto tampil = pengubah
   status utama; fokus keyboard = outline `--gold`.

### Reason

Spesifikasi visual user menuntut gaya editorial/premium dengan palet
brand yang sama **dan** tampil benar di mode terang + gelap. Pendekatan
"utility Tailwind saja" terbukti gagal dua kali (ukuran h3 & warna dark)
— keduanya akar masalahnya sama: asumsi bahwa utility Tailwind dan token
`--*` selalu berlaku.

### Alternatives Considered

- Utility Tailwind untuk h3 (ditolak — mustahil menang dari rule
  tak-ber-layer tanpa mengubah rule global yang diandalkan halaman lain).
- `!important` pada utility (ditolak — memulai perang spesifisitas
  permanen).
- Meng-override `--navy` di `:root.dark` (ditolak — `--navy` dipakai
  banyak komponen yang justru sengaja ingin navy asli di mode gelap;
  mengubahnya merusak halaman lain).
- Memindahkan seluruh `globals.css` ke `@layer` (ditolak — akan
  membalik perilaku puluhan halaman yang mengandalkan rule tak-ber-layer).
- Caption dipindah ke bawah foto (ditolak — tinggi kartu berubah saat
  gambar load → layout shift; caption overlay dilemaskan saja).

### Current Implementation

- `app/globals.css`: `.gal-chip`, `.gallery-program`,
  `.gallery-program-title`, `.gallery-program-kategori`, `.year-*`,
  `.gallery-title` (tanpa `color`), kartu radius 12px, hover 1.02/0.2s,
  `prefers-reduced-motion`.
- `components/site/GalleryGrid.tsx`: JSX memakai class di atas + `text-navy`
  pada h3/label tahun; struktur, grouping, a11y (`aria-pressed`,
  `aria-expanded`, `aria-controls`), lightbox, filter tidak berubah.
- `app/(public)/kelas/[slug]/page.tsx`: `<h2 class="gallery-title text-navy">`.

### Important

- **Jangan** kembalikan chip ke `bg-white` + `text-navy/70` — rusak di
  mode gelap (dan hover mati).
- **Jangan** tulis `color: var(--navy)` pada CSS baru — pakai `text-navy`,
  `var(--color-navy)`, `var(--blue)`, atau `var(--mist)`.
- **Jangan** memindahkan rule global `h1..h4` ke `@layer` tanpa
  memeriksa seluruh halaman yang mengandalkan perilaku tak-ber-layer itu.
- Elemen baru yang butuh tipografi khusus mengalahkan rule `h3` → tulis
  sebagai class CSS di `globals.css`, bukan utility Tailwind.

---

## Decision: Kop program galeri memakai `<div>`, bukan `<header>`

### Decision

Elemen kop program di `components/site/GalleryGrid.tsx` memakai
**`<div className="gallery-program">`**, bukan `<header>`. Rule global
tak-ber-layer

```css
header{position:fixed; top:0; left:0; right:0; z-index:100; padding:20px 0;}
```

di `app/globals.css` (± baris 131) disengaja **untuk navbar**
(`components/site/Header.tsx`) dan berlaku ke semua elemen `<header>`
mentah. **`components/site/Header.tsx` adalah satu-satunya pemakai elemen
`<header>` yang sah** — komponen lain (publik maupun admin) memakai
`<div>`.

### Reason

Kejadian 2026-09-28: kop program yang ditulis `<header
className="gallery-program">` saat redesign ikut terkena rule navbar →
`position:fixed` → kedua kop program (Pelatihan Barista + Kursus
Komputer) menempel & saling menumpuk di tepi kiri atas viewport, dan
garis `border-bottom`-nya tampak seperti coretan melintasi teks navbar —
persis yang dilaporkan user di screenshot review.

### Alternatives Considered

- Menambah override `position:static` + reset padding pada
  `.gallery-program` (ditolak — selamanya harus mengingat property apa
  saja yang diborong rule global; rentan lupa).
- Mengganti selector navbar jadi `#siteHeader` (ditolak — menyentuh
  banyak rule turunan `header .wrap`, `header.is-scrolled`,
  `:root.dark header.is-scrolled`, dsb.; perubahan luas di luar
  kebutuhan).
- Tetap `<header>` demi semantics (ditolak — di dalam `<section
  aria-label>` elemen `<header>` tidak menambah landmark/benefit
  aksesibilitas).

### Current Implementation

`components/site/GalleryGrid.tsx` — kop program = `<div
className="gallery-program">` berisi `<h3>` + metadata kategori.

### Important

**Jangan** memakai elemen `<header>`/`<footer>` mentah di komponen selain
navbar. Bila suatu saat memang butuh `<header>` di konten, scope rule
navbar lebih dulu (`#siteHeader`) setelah memeriksa SEMUA selector
`header…` di `globals.css`.

---

## Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)

### Decision

`npm run dev` dan `npm run start` **tidak boleh berjalan bersamaan** di
folder project yang sama. Sebelum build: `taskkill /F /IM node.exe`
(matikan SEMUA proses node), lalu jalankan **salah satu** server —
`npm run start` untuk verifikasi produksi, `npm run dev` bila memang butuh
hot reload (matikan yang lain dulu).

### Reason

Kejadian 2026-09-28: `npm run start` (port 3000) sedang berjalan, lalu
`npm run dev` ikut dijalankan (gagal bind 3000 → mendapat port 3001) dan
**menimpa folder `.next/` yang sama** — dalam ±10 detik
`.next/static/chunks` tersisa 1 file `polyfills.js` (penamaan dev), seluruh
chunk produksi (webpack, main-app, halaman admin) terhapus. Akibatnya
server produksi membalas **400** untuk semua request `/_next/static/*` →
`ChunkLoadError: Loading chunk 631 failed` → halaman admin crash dengan
"Application error: a client-side exception has occurred while loading".
**Bukan bug kode** — gejalanya identik dengan kode rusak, jadi wajib
disederhanakan dulu sebelum menyalahi kode.

### Alternatives Considered

- Folder `.next` terpisah untuk dev (ditolak — Next tidak mendukung itu;
  setup ekstra tanpa kebutuhan nyata).
- Membiarkan dua server berjalan (ditolak — bukti insiden di atas).

### Current Implementation

Operasi harian: **satu server**. Bukti pemulihan insiden: `npm run build`
ulang → 40 file chunk pulih; 8/8 script di HTML `/admin/pendaftaran` →
HTTP 200; navigasi klien `/admin` → `/admin/pendaftaran` normal.

### Important

Bila gejala "**semua** `/_next/static/*` membalas 400 + file chunk di
disk tinggal sedikit" muncul lagi → periksa `Get-Process node` (kemungkinan
dua server) dan `Get-ChildItem .next\static\chunks -Recurse -File` —
bukan menyalahi kode.

---

## Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)

### Decision

Address bar harus tetap bersih (`https://talentaciptakarya.com`) saat
pengguna menekan link section di beranda (`#visimisi`, `#galeri`, dst).
Caranya **bukan** mengganti anchor jadi tombol, melainkan:

1. Link tetap `<a href="#id">` (native) — smooth scroll,
   `scroll-margin-top`, deep-link, Ctrl+click, dan keyboard tetap utuh.
2. `components/site/AnchorHashCleaner.tsx` (client component, render
   `null`) memasang **satu** listener `click` di `document`. Bila target
   adalah `<a href>` ber-fragment **dan** `pathname`-nya sama dengan
   halaman sekarang, 150 ms setelah navigasi fragment selesai jalankan
   `history.replaceState(null, "", pathname + search)`.
3. Dilewati: klik dengan modifier (Ctrl/Cmd/Shift/Alt, klik tengah —
   membuka tab baru), link ke section **halaman lain**
   (`/kelas/foo#jadwal`), dan hash yang diketik manual atau dibuka dari
   luar (deep-link sengaja dipertahankan).

### Reason

Permintaan user (2026-09-28): bagian URL tidak perlu terlihat di address
bar. Tiga opsi dibahas — hilangkan hash total / bersihkan setelah klik /
section jadi halaman `/path` — dan user memilih **Opsi B** karena
deep-link masih bisa dibagikan dan tombol Back tetap memulihkan posisi.

### Alternatives Considered

- **Opsi A** (link jadi tombol + `scrollIntoView`, hash tidak pernah
  dipakai): ditolak — kehilangan deep-link dan posisi tombol Back.
- **Opsi C** (tiap section jadi route seperti `/visi-misi`): ditolak —
  pekerjaan jauh lebih besar (routing + konten + layout) dan URL justru
  lebih panjang, bukan lebih bersih.
- `pushState` alih-alih `replaceState`: ditolak — menambah entri riwayat
  berisi URL yang tidak pernah berarti apa-apa.

### Current Implementation

`components/site/AnchorHashCleaner.tsx`, dimount di
`app/(public)/layout.tsx`. Otomatis berlaku untuk semua link anchor
publik: nav header, nav footer, tombol hero, CTA "Hubungi Kami", dan logo
(`/#top`).

### Important

- **Jangan** memakai `preventDefault()` di listener ini — itu mematikan
  navigasi native anchor.
- `ToTop` tidak terpengaruh (memakai `scrollTo`, tidak pernah menulis
  fragment).
- Kalau nanti ada halaman dengan section yang URL-nya **memang perlu**
  bertanda, guard `pathname` sudah melewatinya; verifikasi ulang bahwa
  `replaceState` tidak ikut terpakai di sana.
