# Changelog

Semua entri di bawah berasal dari **history git yang terverifikasi**
(`git log`, 26 commit, 2026-09-23 → 2026-09-26). Riwayat sebelum
2026-09-23 tidak ada di repo ini, jadi tidak dicatat agar tidak mengarang.

Format: tanggal · isi · hash commit.

---

## [2026-09-27]

### Added

- **Kolom `year Int?` di `GalleryImage`** (`prisma/schema.prisma` +
  `npm run db:push`) — tahun kegiatan foto, dipakai sebagai sub-grup TAHUN
  di galeri publik. Nullable (migrasi aman: tidak ada baris/file diubah).
- **Backfill idempoten `prisma/backfill-gallery-year.ts`** — membaca sinyal
  tahun yang tertulis di caption saja (`"YYYY: "` / `Tahun YYYY`, range-check
  1990…tahun+1). Hasil: **22 foto terisi** (2022–2026), **8 foto dibiarkan
  `NULL`** (tidak ada tebakan; `uploadedAt` sengaja tidak dipakai karena
  terbukti salah). Run ulang mengisi 0.
- **Validasi `year` di Zod** (`lib/schemas.ts`): `TAHUN_MIN=1990`,
  `TAHUN_MAKS=tahun berjalan+1`, pesan ramah — 0 / 99999 / kosong /
  tidak terkirim / string non-angka → **400** (teruji langsung ke
  `POST /api/upload`).
- **Input Tahun di admin `/admin/galeri`**: select `sm:grid-cols-3`
  (Kategori · Program · **Tahun**) di UploadForm (default = tahun berjalan)
  dan di form Edit (wajib); opsi `tahunTersedia` dihitung di server dari
  data ∪ tahun berjalan ∪ +1 (urut turun) — dinamis, tanpa hardcode.
- **Info tahun per kartu admin**: "Tahun : 2026" atau peringatan amber
  "belum diatur — klik Edit", plus baris ringkasan "N belum punya tahun".
- **Chips filter program** di galeri publik dihitung dari data
  (`Semua (30)`, `Pelatihan Barista (24)`, `Kelas Komputer (6)`).

### Changed

- **Galeri publik disusun ulang PROGRAM → TAHUN → FOTO**
  (`components/site/GalleryGrid.tsx` ditulis ulang): grup program
  (fallback `category.name` → "Lainnya") → sub-grup tahun (desc,
  "Tanpa Tahun" di bawah) → foto. Tahun terbaru tiap program default
  terbuka, sisanya ciut (accordion ciut tidak merender DOM/gambar);
  grup/tahun kosong tidak dirender; jumlah dari data ("2026 · 5 Foto").
- **Homepage**: N section galeri per kategori digabung jadi satu section
  `id="galeri-utama"` di dalam `<div id="galeri">`; `getGalleryGroups()`
  dihapus dari `lib/data.ts` (dead code); `Header` nav Galeri
  `/#galeri-lainnya` → `/#galeri`.
- **Edit admin (`updateGalleryImage`)** kini ikut menyimpan `year`;
  `/api/upload` menyimpan `year` saat create.
- Lightbox caption jadi `Program · Tahun · caption (n/total)`; daftar
  lightbox mengikuti foto yang sedang tampil (terfilter).

### Technical Notes

- Verifikasi: `npx tsc --noEmit` **0 error**; `npm run build` **hijau**
  (22 routes, dijalankan 2×: sebelum & sesudah perubahan terakhir);
  browser E2E upload batch (2 foto → grup/tahun baru muncul tanpa ubah
  kode), edit tahun (foto pindah grup), edit program (foto pindah grup),
  hapus (DB + file kembali bersih, total 30), keyboard (Tab antar tombol
  tahun, Enter toggle `aria-expanded`, lightbox Enter/panah/Escape +
  fokus kembali), filter chips, validasi API (6 kasus), regresi 10 rute
  publik + 9 halaman admin → **0 console error**.
- 8 breakpoint (1920/1440/1366/1024/768/430/390/360): 4/4/4/3/2/2/2/2
  kolom, rasio 4:3 (1.33) di semua lebar, **tanpa horizontal overflow**.
- Hierarki SEO H1→H2→H3 tanpa lompatan; alt lengkap; `sizes` + lazy.
- Data uji dibersihkan: DB kembali `{"2022":1,"2023":5,"2024":7,"2025":4,"2026":5,"NULL":8}`
  = 30 foto asli; 0 foto uji, 0 file yatim.
- `graphify update .` hijau: **766 node / 1303 edge / 45 community**.
- Bug pre-existing (bukan dari task ini, sudah dibuktikan identik di
  production): React error #418 (hydration text) di `/admin/kategori` &
  `/admin/program`.
- Belum di-commit.

---

## [2026-09-26]

### Added

- **Dokumentasi handoff portable** folder `AI_CONTEXT/` (7 file: PROJECT_CONTEXT,
  ARCHITECTURE, CURRENT_STATE, DECISIONS, TODO, CHANGELOG, HANDOFF) +
  pembaruan `AGENTS.md` — belum di-commit
- **Aturan "Setelah Menyelesaikan Task"** di `AGENTS.md` (wajib memperbarui
  `AI_CONTEXT/` setiap task signifikan; verifikasi context; `git status`)
  — belum di-commit
- **Workflow low-token graphify** di `AGENTS.md` (8 langkah: `check-update` →
  `god-nodes` → `query --budget --context` → `explain` → `affected` → `path` →
  baru baca file; + cheatsheet flag) — belum di-commit
- Blok `GRAPHIFY LOW-TOKEN` di `AI_CONTEXT/HANDOFF.md` — belum di-commit

### Fixed

- **Upload Galeri di production sekarang BEKERJA** (Vercel Blob aktif) —
  terverifikasi: PNG/JPG/WebP/AVIF (1,5 KB–2832 KB) → HTTP 200 ke
  `aeiuzxqqxeye5usv.public.blob.vercel-storage.com`, file publik 200
  (`image/webp`, 728.992 byte), foto tampil di beranda, data uji dibersihkan
  (kembali 12 foto, 0 yatim). `blobEnabled()` juga menerima OIDC
  (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`) karena UI Vercel 2026 tidak lagi
  menampilkan read-write token — `ac6a0e7`
- **Upload Galeri gagal di production dengan pesan generik** — root cause:
  `BLOB_READ_WRITE_TOKEN` kosong di Vercel → fallback `public/uploads`
  (filesystem hanya-baca) → `writeFile` gagal → `catch` lama hide semua
  penyebab. Perbaikan:
  - `lib/storage.ts`: `StorageUnavailableError` + taksonomi kode
    (`blob-not-configured`/`readonly-fs`/`no-permission`/`disk-full`/
    `unknown`), `isEphemeralFs()`, `describeStorageFailure()` (pesan aman),
    `assertStorageReady()` (gagal cepat sebelum kompres),
    `classifyStorageError()`.
  - `app/api/upload/route.ts`: pre-flight 503 + penyebab; `catch` →
    storage 503 / Prisma 500 / sharp 422, detail lengkap tetap di log.
  - `components/admin/UploadForm.tsx`: `pesanFromStatus()` untuk balasan
    non-JSON (413 batas ±4,5 MB Vercel, 401/403, 503, 5xx).
  Diverifikasi: matriks 7 file lokal (PNG/JPG/WebP/AVIF 200; >8MB & non-image
  400), simulasi `VERCEL=1` → 503 pesan jelas, folder dikunci → 503
  "tidak bisa ditulis", UI menampilkan pesan per file — belum di-commit
- **Ikon theme toggle tak terlihat di sidebar admin** — `.theme-toggle`
  memakai `color: var(--navy)` + ikon SVG `stroke="currentColor"`, jadi di
  sidebar navy ikon jadi navy-di-atas-navy. Ditambah override
  `.admin-sidebar .theme-toggle` (warna terang + border putih transparan)
  di `app/globals.css` + class `admin-sidebar` pada `<aside>`. Situs publik
  tidak berubah — belum di-commit
- **Email admin terpotong 2 baris** di sidebar (`break-all` + `text-xs` →
  `…co` / `m`) — kini `text-[11px] break-words min-w-0` + `title`, muat satu
  baris (148px dari 160px tersedia) — belum di-commit
- Modal pendaftaran dirender via `createPortal(..., document.body)` + state
  `mounted` — `transform` pada ancestor `.reveal` membuat `position: fixed`
  ter-parenting sehingga modal menimpa tabel jadwal — `fd32dae`
- **`&` mentah di teks JSX diganti `&amp;`** di
  `app/admin/(dashboard)/kategori/page.tsx:19` dan
  `components/admin/JadwalManager.tsx:504` — `&` tidak valid XML sehingga
  parser graphify berhenti dan 14 simbol tidak masuk graph. Warning 2 file
  hilang, graph 709 → 713 node, tampilan teks tidak berubah — belum di-commit

### Changed

- **Redesign UI/UX galeri publik** — container galeri lebih lebar
  (`.wrap-gallery` 1360px vs `.wrap` global 1180px yang tidak diubah), grid
  4 kolom di desktop besar / 3 di desktop / 2 di tablet & mobile, gap 14px,
  card lebih compact (radius 14px, hover scale 1.03, transisi 250ms),
  caption dipadatkan (13px, line-clamp 2), spacing section 64px, dan
  atribut `sizes` pada `next/image` diselaraskan. Filter program & lightbox
  tetap utuh. Terverifikasi di 8 breakpoint (tanpa horizontal overflow),
  20 foto terlihat pada 1920×1080, 0 console error — belum di-commit
- **Admin Galeri dikelompokkan KATEGORI → PROGRAM** — `GaleriList.tsx`
  membangun group di klien dari satu query yang sudah men-`include` relasi
  (tanpa query tambahan/N+1); tiap kategori & program bisa di-expand/collapse
  (`aria-expanded`, default terbuka bila ≤4 kategori, tombol Buka/Ciutkan
  semua), jumlah foto per kategori & program dihitung dari data aktual, grup
  "Tanpa Kategori"/"Tanpa Program" untuk foto tanpa relasi, dan subgroup/
  kategori kosong tidak pernah dirender. Badge kategori/program per kartu
  dihapus karena sudah tercermin di judul section. Terverifikasi: 4 kategori,
  3 program dalam 1 kategori, foto tanpa program & tanpa kategori, ↑/↓ scoped
  subgroup, Edit memindahkan foto antar grup, Delete meng-update jumlah,
  Upload masuk grup sesuai pilihan, sidebar tetap fixed, 0 console error,
  halaman publik tidak berubah — belum di-commit
- `moveGalleryImage` menerima `targetId` dan menukar `urutan` dua foto dalam
  subgroup yang sama (bukan membalik daftar global) — belum di-commit
- **Sidebar admin fixed terhadap viewport + area akun global** —
  `app/admin/(dashboard)/layout.tsx`: wrapper `md:h-dvh` + `md:overflow-hidden`,
  area konten jadi container `md:overflow-y-auto` (hanya konten yang scroll),
  `nav` bisa scroll internal, account section (email + ThemeToggle + Keluar)
  selalu menempel di bawah sidebar. Semua class scroll di-scope `md:` sehingga
  **perilaku mobile tidak berubah**. Terverifikasi di 9 halaman admin
  (`top = [0,0]` sebelum/sesudah scroll, tanpa horizontal scrollbar, 0 error
  console, tombol Keluar berfungsi) — belum di-commit
- `tsconfig.json` → `jsx: "preserve"` (disesuaikan dengan tulisan ulang Next
  15 saat build) — `08f8123`
- Contoh `CONTACT_EMAIL_FROM` di `.env.example` memakai
  `info@talentaciptakarya.com` (sesuai spec §8) — `c1bd70b`
- `AGENTS.md`: bagian *Context Maintenance* diganti aturan lengkap
  **"Aturan Setelah Menyelesaikan Task"** (§1–§8 + Prinsip Utama:
  `SOURCE CODE + AI_CONTEXT` harus sinkron) sesuai instruksi user —
  belum di-commit
- `AI_CONTEXT/CHANGELOG.md`: judul bagian `### Maintenance` diseragamkan
  menjadi `### Technical Notes` agar cocok dengan format aturan baru —
  belum di-commit

### Technical Notes

- Refresh `graphify-out/` setelah verifikasi build — `7973d8a`
- Belum ada source code yang berubah untuk task dokumentasi ini; `npx tsc
  --noEmit` tetap 0 error.
- Graphify dipakai secara hemat-token mulai task ini: `query --budget 600
  --context call` (7 baris) menggantikan pembacaan 4 file penuh;
  `explain "FormPendaftaran"` (16 baris) menggantikan `grep` pemanggil;
  `god-nodes --top 8` (9 baris) untuk peta hub.
- Fix `&` → `&amp;` diverifikasi: `npx tsc --noEmit` 0 error, `npm run build`
  hijau 22 routes, `graphify update .` tanpa warning, dan teks di
  `.next/server` ter-decode sebagai `&` (tanpa `amp;amp`).
- Verifikasi responsive admin dilakukan lewat **iframe same-origin 375px &
  820px** (harness mengunci viewport 878px, `window.resizeTo` tidak
  berefek), sehingga media query benar-benar dievaluasi: mobile → sidebar
  `display:none` + body scroll (identik dengan sebelumnya); tablet → sidebar
  fixed + konten scroll independen.
- `EPERM` saat `npm run build` karena DLL Prisma terkunci `next start`:
  workaround permanen didokumentasikan di `AGENTS.md` → *Testing Rules*
  langkah 0 (`taskkill /F /IM node.exe` sebelum build).

---

## [2026-09-25]

### Added

- **Galeri publik**: filter chip per program + navigasi lightbox panah
  kiri/kanan — `256c2dc`
- **Admin galeri**: edit inline, multi upload, dan pengaturan urutan foto —
  `9b82ae2`
- **Halaman detail program** `/program/[slug]` — memperbaiki link
  "Selengkapnya" yang 404 — `2ee5844`
- **Fitur pendaftaran jadwal pelatihan**: form publik, hitung kuota kursi,
  inbox admin di `/admin/pendaftaran` — `87f0e9b`
- Wireframe HTML fitur pendaftaran (dokumen desain) — `af975b7`
- **Input tanggal jadwal sekali jalan**; label hari diturunkan otomatis dari
  tanggal (zona Asia/Jakarta) — `054d5dc`
- Dropdown Program pada form jadwal dikelompokkan per kategori (`optgroup`) —
  `e861792`

### Fixed

- Judul `/kelas` di-center, teks chip aktif putih, jarak heading ke konten —
  `f0e8cd6`
- Form tambah jadwal memakai input tanggal, bukan dropdown hari — `5778886`

### Changed

- **Layout publik** (navbar + footer), CRUD jadwal & materi, materi
  disembunyikan dari publik, audit visual — `cce1a08`

### Technical Notes

- Refresh `graphify-out/` — `3902062`, `1a3dd33`, `c4195fe`, `a7208e0`,
  `00ce248`, `29cab50`

---

## [2026-09-24]

### Changed

- Graphify di-upgrade 0.9.36 → 0.9.67, graph dibangun ulang, git hooks +
  merge driver `graph.json` ditambahkan — `8d0e33f`

---

## [2026-09-23]

### Added

- **Lupa password admin**: token aman SHA256, berlaku 30 menit, sekali
  pakai, rate limit, email via Resend — `c5f9298`
- **v2.1**: kategori kelas dinamis (DB-driven), dark mode, ganti password
  admin, panduan deploy — `b975fd7`
- Panduan deploy + pembaruan graphify setelah fitur ganti password — `12a1b6f`

### Changed

- Login admin menjadi `info@talentaciptakarya.com`; seed hanya membuat akun
  admin bila belum ada — `5f69ea4`
- Provider Prisma diganti ke **`postgresql`** untuk deploy Vercel (memperbaiki
  error `P1012`) — `8e9393f`

---

## Important Decisions

Keputusan teknis yang terjadi di rentang changelog ini (detail lengkap di
`DECISIONS.md`):

- **Vercel (free tier)** sebagai hosting menggantikan rencana Hostinger.
- **PostgreSQL (Neon)** menggantikan SQLite karena filesystem Vercel ephemeral.
- **Prisma `db push`** tanpa folder migrasi; seed idempoten tiap build.
- **Email tidak boleh memblokir penyimpanan data** (PRD §8) — pola
  simpan-dulu → email-kemudian → catat `statusEmail`.
- **Semua mutasi admin lewat Server Actions** di `app/admin/actions.ts` dengan
  `requireAdmin()`, tanpa lapisan API CRUD baru.
- **Galeri & kategori lewat relasi**, URL memakai slug (bukan id), slug unik
  otomatis, kategori terpakai tidak boleh dihapus (PRD §10).
- **Modal pendaftaran di-portal ke body** karena `transform` di ancestor.
- **GitHub Pages repo dinonaktifkan** agar tidak bentrok dengan Vercel.
- **Versi di-pin**: `next@15.5.25`, `prisma@6.19.3`.
