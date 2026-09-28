# Current State

> Dokumen ini mencerminkan kondisi **source code & infrastruktur per
> 2026-09-28** (HEAD `19a2d3c` **sudah ter-push & live** di
> `talentaciptakarya.com`; working tree **bersih**).
> Diperbarui setelah pekerjaan signifikan.

## Current Development Status

Task **Admin Email Center** (`/admin/email`, spesifikasi 23 bagian user,
2026-09-28) **sudah diimplementasikan & diverifikasi lokal penuh, BELUM
di-commit**: Hostinger IMAP = inbound, Resend = outbound, cache di database,
sanitasi HTML server, route lampiran terproteksi auth, webhook status.
**Inbound sudah terbukti jalan nyata** (user mengisi `MAIL_IMAP_*`):
22 email masuk dari mailbox Hostinger, 0 duplikat setelah 3× sync, flag
`\Seen` bolak-balik dengan mailbox, lampiran terunduh (200, isi identik),
balas memakai `In-Reply-To`/`References` asli. Outgoing terbukti 3× kirim
nyata.

Task **active state menu sidebar admin** (2026-09-28) selesai &
terverifikasi, **juga BELUM di-commit** (akan ikut commit yang sama):
`components/admin/AdminNav.tsx` (baru, client, `usePathname`),
`app/admin/(dashboard)/layout.tsx` (menu + `Link` dihapus),
`app/globals.css` (`.admin-nav-link` / `.is-active`). `tsc` 0, build hijau;
logika active state 17/17 kasus; **9/9 route admin** tepat 1 menu aktif yang
benar + `aria-current="page"`; child route `/admin/galeri/edit/[id]` terbukti;
nav mobile 390px benar; sidebar tetap fixed; 0 console error.

Sisa pekerjaan non-kode (email & DNS):

1. Menyalin `PANEL_RESEND_API_KEY` **dan** `MAIL_IMAP_*` ke Vercel (produksi
   butuh keduanya; lokal sudah diisi user).
2. Mendaftarkan webhook Resend + isi `RESEND_WEBHOOK_SECRET` agar status
   `delivered`/`bounced` tercatat nyata.

## Last Completed Work

**Task terbaru: Admin Email Center** (2026-09-28, source BELUM di-commit) —
fitur `/admin/email` sesuai spesifikasi user: Inbox (Hostinger IMAP),
balas/teruskan/tulis, tab Terkirim, cari, filter, read/unread, lampiran,
dan status. Keputusan arsitektur di `DECISIONS.md` → *Email Center —
Hostinger (inbound IMAP) + Resend (outbound), cache di database*.

- **Baru**: `lib/mail/{imap,sync,sanitize,outbound}.ts`,
  `lib/adminCounts.ts`, `components/admin/EmailCenter.tsx`,
  `app/admin/(dashboard)/email/page.tsx`,
  `app/api/admin/email/attachment/[id]/route.ts`,
  `app/api/resend/webhook/route.ts`; `lib/resend.ts` + `sendPanelEmail()`;
  `lib/schemas.ts` + `emailSendSchema`; 3 Server Action baru; 2 model
  (`EmailMessage`, `EmailAttachment`; `prisma db push` additive, data aman).
- **Dependensi** (disetujui user): `imapflow@2.1.0`, `mailparser@3.9.29`,
  `sanitize-html@2.17.7`, + `@types/mailparser`, `@types/sanitize-html`.
  `npm audit` tetap 5 vulnerability (tidak bertambah).
- **Bug nyata ditemukan saat E2E & sudah diperbaiki**:
  1. `?tab=compose` tidak menampilkan form (navigasi client-side tidak
     remount → `useState` awal tak berlaku) → mode form sekarang di-derive
     dari prop.
  2. Parameter `email=1` ikut terhapus (aturan "reset `page=1`" memakai
     nilai `1` untuk semua key) → email **pertama** di daftar tidak bisa
     dibuka.
- **Verifikasi lokal** (`npm run start` + sesi admin): `tsc` 0; build hijau
  (24 routes); nav "Email" aktif + `aria-current`; `?tab=compose` berisi
  form; kirim nyata → tab Terkirim, `Status: Terkirim · Ref
  01a0e6be-8515-7e3e-b028-9a0ebb20067c`; lampiran `catatan-uji.txt`
  terkirim (indikator 📎 muncul); `virus.exe` **ditolak** ("tipe berkas
  berisiko", tidak terkirim); pencarian "lampiran" → 1 hasil, "zzz" → 0 +
  pesan kosong; `/api/admin/email/attachment/1` → **401** tanpa sesi;
  `/api/resend/webhook` → **503** tanpa secret; tidak ada pola
  `re_*`/`PANEL_RESEND_API_KEY`/`MAIL_IMAP_PASSWORD` di chunk browser;
  mobile 390px: tanpa horizontal overflow, nav mobile tampil, sidebar
  tersembunyi; 0 console error.
- **Verifikasi INBOUND setelah user mengisi `MAIL_IMAP_*`** (semua PASS):
  - Sync menarik **22 email nyata** dari mailbox Hostinger (pengirim
    `notifications@vercel.com`, `info@`, dst.), `messageId` unik semua
    (**0 duplikat setelah 3× refresh**), 0 email tanpa Message-ID.
  - **Lamparan inbound terunduh** dari IMAP: HTTP **200**,
    `Content-Disposition: attachment; filename="catatan-uji.txt"`,
    `text/plain`, isi identik dengan berkas yang diunggah.
  - **Balas** otomatis terisi (To terkunci, subjek otomatis) dan terkirim
    dengan header asli: `inReplyTo`, `referencesText`, `threadId` = Message-ID
    email asal; subjek menjadi `Re: ...`; email compose punya
    `inReplyTo = null` (tidak ada threading palsu).
  - **Read/unread** tersimpan di DB **dan** flag `\Seen` di mailbox:
    menandai "belum dibaca" → badge sidebar 7 → 8, dan setelah refresh
    state tetap (artinya flag benar-benar tersinkron dua arah).
  - **Round trip terproof**: 3 email yang saya kirim via Resend ke `info@`
    **masuk kembali ke Inbox** (satu jadi inbound "Re: Tes Email Center
    dengan lampiran") → outbound Resend → mailbox Hostinger benar-benar
    diterima, kekhawatiran MX (Issue 2) tidak jadi blocker.
  - **Sanitasi HTML email dunia nyata** (email Vercel, 8.186 karakter):
    0 `<script>`, 0 `<iframe>`, 0 `<form>`, 0 handler `on*`, tanpa
    `javascript:`, 0 `<style>`; 6 link dipaksa
    `rel="noopener noreferrer nofollow" target="_blank"`.
  - `↻ Refresh` → "Inbox diperbarui (20 email diproses)", 0 console error.
- **Perubahan kecepatan (2026-09-28, setelah user menyetujui)**: 4 halaman
  publik (`/`, `/kelas`, `/kelas/[slug]`, `/program/[slug]`) memakai
  `revalidate = 60`; 2 rute `[slug]` juga `force-static`. `AGENTS.md`,
  `DECISIONS.md` (→ *Halaman publik di-cache 60 detik*), dan
  `ARCHITECTURE.md` sudah diperbarui. Admin tetap `force-dynamic`. Header
  produksi **belum** menunjukkan ini sampai Vercel redeploy.
- **Catatan verifikasi**: seluruh perubahan (termasuk draft/hapus/pencarian
  & perbaikan tag `<header>`/`<footer>`) sudah melewati `npx tsc --noEmit`
  = 0 dan `npm run build` **hijau (24 routes)** — build dijalankan setelah
  `next dev` dihentikan. Server produksi lokal (`npm run start`, port 3000)
  yang dipakai untuk E2E.
- **Tambahan setelah itu (permintaan user)**: **draft** (tab Draft, tombol
  "Simpan Draft" tanpa autosave, draft terhapus setelah terkirim, lampiran
  tidak ikut disimpan), **hapus email** (keluar & draft permanen; masuk
  disembunyikan lewat `deletedAt` + `sync.ts` melewatinya), **pencarian
  akurat** (`lib/mail/search.ts`: AND per kata, To/Cc/Bcc + nama lampiran,
  operator `from:`/`to:`/`subjek:`/`dengan:lampiran`, sorotan `<mark>`).
  Semua terverifikasi di browser (lihat `CHANGELOG.md` → *Verified*).

**Task sebelumnya (source code, BELUM di-commit): fix 2 bug hasil review
user** (2026-09-28) —

1. **Kop program galeri tumpang-tindih di tepi kiri atas** — kop
   `<header className="gallery-program">` kena rule global tak-ber-layer
   `header{position:fixed; top:0; left:0; right:0; z-index:100;
   padding:20px 0}` (khusus navbar `components/site/Header.tsx`) →
   kedua kop (Pelatihan Barista + Kursus Komputer) menumpuk di kiri atas,
   garis pembatas jadi coretan melintasi navbar. Fix: elemen diganti
   **`<div>`** (`components/site/GalleryGrid.tsx`) + komentar penjelas.
   Teruji: 2 kop `position: static`, docTop 3428 & 4406 (flow, tidak
   tumpang-tindih), `left:32px`, gap chip→kop 32px, garis→label tahun
   27px; terang h3 `rgb(22,33,74)` @30px + h2 `47.36px`, gelap h3
   `rgb(236,239,249)`; 0 console error.
2. **Crash `/admin` "Application error: a client-side exception"** —
   **bukan bug kode**: `npm run dev` (port 3001) dijalankan bersamaan
   dengan `npm run start` (port 3000) → `next dev` menimpa folder
   `.next/` yang sama (±10 detik: `.next/static/chunks` tersisa 1 file
   `polyfills.js`) → server produksi membalas **400** untuk semua
   `/_next/static/*` → `ChunkLoadError: Loading chunk 631 failed`
   (`app/admin/(dashboard)/pendaftaran/page-1b3be6771a0b55c3.js`).
   Fix: `taskkill /F /IM node.exe` (kedua server) → `npm run build` ulang
   (40 file chunk pulih) → jalankan **hanya satu** server. Teruji: 8/8
   script HTML `/admin/pendaftaran` → 200 (sebelumnya 400 semua),
   navigasi klien `/admin` → Pendaftaran normal, direct load ✓, sapuan
   `/admin`, `/admin/galeri`, `/admin/program`, `/admin/pesan` 0 crash
   (React #418 pre-existing hanya di `/admin/program`), regresi
   `/kelas/barista` 0 kop/0 chip/hierarki H1→H2→H3→H2/0 error.

Verifikasi: tsc 0 error; `npm run build` hijau (22 routes);
keputusan baru di `DECISIONS.md` (*Kop program galeri memakai `<div>`…*
dan *Hanya SATU server Next pada satu waktu…*).

**Task sebelumnya (source code, BELUM di-commit): visual galeri
editorial/premium minimal** (2026-09-28, spesifikasi 21 bagian user) —
penghiasan galeri publik `components/site/GalleryGrid.tsx` +
`app/globals.css` + `app/(public)/kelas/[slug]/page.tsx`:

- **Chips filter** → class `.gal-chip` (CSS murni, token adaptif dark
  mode, tinggi 27px; aktif `--color-navy` + putih, idle `--paper-alt` +
  border `--line` + `--ink`, `:focus-visible` emas).
- **Kop program editorial** `.gallery-program{,-title,-kategori}` —
  Fraunces uppercase clamp 22–30px. **Wajib class CSS**: rule global
  `h3{font-size:1.17em}` tak-ber-layer selalu mengalahkan utility
  Tailwind (sebelumnya judul program cuma 18,72px).
- **Baris tahun editorial**: thumbnail foto pertama tahun
  (64×48 / 52×39, `loading="lazy"`) **tanpa perubahan DB**; label
  18–20px; garis aktif **2px `var(--color-navy)`** dengan padding
  dikompensasi (13+2 = 14+1 = 15px → tanpa layout jump); panah `→`/`↑`;
  `:focus-visible` emas.
- **Judul galeri** `.gallery-title` clamp 30–48px; warna heading
  diserahkan ke utility `text-navy` (aturan `color` dihapus dari CSS).
- Kartu radius 12px, hover scale 1.02/0.2s, caption dilemaskan,
  aturan `prefers-reduced-motion`.
- **Perbaikan mode gelap**: `var(--navy)` ternyata **tidak adaptif**
  (tetap #16214A di atas bg #0E1322 = tak terlihat) → label/garis/aksen
  kini memakai `text-navy` (`:root.dark` → putih), `var(--color-navy)`,
  `var(--blue)` yang memang di-reset blok `:root.dark`; chip idle lama
  (`bg-white` + `text-navy/70`) ≈1,6:1 di gelap → diganti `.gal-chip`.

Verifikasi: tsc 0, build hijau, E2E **gelap & terang** per elemen,
akordeon (klik 2025 → panel + foto, `scrollYDelta = 0`), filter chips
(kembali "Semua" → 2 section), lightbox (buka → fokus pindah → Escape
tutup → body unlock → **fokus kembali ke foto**), 8 breakpoint
1920…360 **tanpa horizontal overflow**, regresi `/kelas/barista`
(single group: tanpa chip & kop program, hierarki H1→H2→H3→H2, 0 alt
kosong) + `/admin/galeri` (30 kartu), **0 console error**;
`graphify update` → **776 node / 1320 edge / 48 community** pada saat
verifikasi task ini (graph kini **801 node / 1347 edge / 54 community**
setelah rebuild 2026-09-28 — lihat *Issue 9*).

**Task sebelumnya (source code, SUDAH ter-push `368d947` + `6accd2a`,
LIVE di production): struktur galeri PROGRAM → TAHUN → FOTO**

- **Database**: `GalleryImage.year Int?` (`prisma/schema.prisma` +
  `npm run db:push` — aman, nullable; tidak ada baris/file dihapus).
  Backfill `prisma/backfill-gallery-year.ts` (idempoten) membaca sinyal
  tahun **hanya dari caption** (`"YYYY: "` / `Tahun YYYY`, range-check):
  **22 foto terisi** (2026:5, 2025:4, 2024:7, 2023:5, 2022:1), **8 dibiarkan
  `NULL`** (ids 2,5,7–12; `uploadedAt` sengaja tidak dipakai — semua foto
  diunggah 2026 tapi kegiatannya 2022–2026).
- **Validasi** `lib/schemas.ts`: `TAHUN_MIN=1990`, `TAHUN_MAKS=tahun+1`,
  `year` wajib di Zod (coerce → int → min → max) dengan pesan ramah.
  Teruji langsung ke `POST /api/upload`: `99999` → "Tahun maksimal 2027.",
  `0`/`""`/tidak terkirim/`1899`/`abc` → "Tahun wajib dipilih." (semua 400,
  tidak ada data dibuat).
- **Persist**: `app/api/upload/route.ts` (create) dan
  `app/admin/actions.ts::updateGalleryImage` (edit) ikut menyimpan `year`.
- **Admin `/admin/galeri`**: `tahunTersedia` = data ∪ tahun berjalan ∪ +1
  (urut turun, dihitung server); UploadForm jadi grid **Kategori · Program ·
  Tahun** (default tahun berjalan); form Edit punya select Tahun wajib;
  kartu menampilkan "Tahun : 2026" atau "belum diatur — klik Edit"; ringkasan
  "2 kategori · 2 program · 30 foto · **8 belum punya tahun**".
  Filter admin **tidak ditambahkan** (30 foto — grouping + ringkasan cukup).
- **Galeri publik** (`components/site/GalleryGrid.tsx` ditulis ulang):
  level program (fallback `category.name` → "Lainnya") → level tahun
  (`year` desc, "Tanpa Tahun" di bawah) → foto. Tahun terbaru per program
  default terbuka (sisanya ciut, tidak merender DOM/gambar); grup/tahun
  kosong tidak dirender; jumlah dari data; chips program dari data;
  caption lightbox `Program · Tahun · caption (n/total)`.
- **Homepage**: N section galeri per kategori → **satu** section
  `id="galeri-utama"` di `<div id="galeri">`; `Header` `/#galeri-lainnya` →
  `/#galeri`; `getGalleryGroups()` dihapus dari `lib/data.ts`.

Verifikasi task ini:

| Aspek | Hasil |
|---|---|
| `npx tsc --noEmit` | **0 error** |
| `npm run build` | **hijau**, 22 routes (2×: sebelum & sesudah ubah terakhir; server lokal dimatikan dulu) |
| Upload batch 2 foto (Kelas Komputer/Kursus Komputer/2025) | "Berhasil"; chip **baru** "Kursus Komputer (2)" + grup tahun muncul **tanpa ubah kode** |
| Edit tahun (foto → 2024) | "Foto diperbarui."; kartu & grup publik langsung pindah (`▼ 2024 · 2 Foto`) |
| Edit program (→ tanpa program) | foto pindah ke grup fallback "Kelas Komputer" (6→7), tahun tetap |
| Hapus 2 foto uji | DB kembali **30 foto** `{"2022":1,"2023":5,"2024":7,"2025":4,"2026":5,"NULL":8}`; file uji terhapus (0 yatim); publik kembali `Semua (30)` + 3 chip |
| Keyboard | Tab antar tombol tahun; Enter → `aria-expanded=true` + kartu muncul; lightbox Enter/→/←/Escape + **fokus kembali ke kartu** |
| Validasi API (6 kasus) | semua 400 + pesan ramah |
| Hierarki SEO | H1→H2→H3 tanpa lompatan; alt 0 kosong; `sizes` + `lazy` |
| Regresi | 10 rute publik + 2 rute `/program/*` + 9 halaman admin: tanpa 404, **0 console error**, tanpa overflow |
| Breakpoint 8 lebar | 4/4/4/3/2/2/2/2 kolom, rasio 1.33, tanpa overflow; `/kelas/barista` & `/kelas/kelas-komputer` ok di 390/360 |
| `graphify update .` | hijau — **766 node / 1303 edge / 45 community** |

**Task sebelumnya (source code, sudah ter-push): redesign UI/UX galeri publik**

- `app/globals.css`: modifier `.wrap-gallery` (**1360px**, container global
  `.wrap` 1180px tidak diubah) + `.gallery-section` (padding 64px/44px,
  header margin 28px); `.gallery-grid` jadi **4/3/2 kolom** (≥1181 / 861–1180 /
  ≤860) dengan gap 14px (10px ≤420px); `.gallery-item` radius 20→**14px**,
  hover scale 1.08→**1.03**, transisi .6s→**.25s**; `.gallery-caption`
  dipadatkan (13px, padding 14px 12px 10px, line-clamp 2).
- `components/site/GalleryGrid.tsx`: atribut `sizes` diselaraskan agar
  `next/image` memilih ukuran srcset yang benar. Filter + lightbox utuh.
- `app/(public)/page.tsx`: section galeri (per kategori + "Galeri Lainnya")
  memakai `wrap wrap-gallery` + `gallery-section`.
- `app/(public)/kelas/[slug]/page.tsx`: section Galeri dipisah ke container
  `wrap wrap-gallery` sendiri (JSX dipecah menjadi tiga blok `.wrap`).

Verifikasi (localhost, diukur dengan iframe pada lebar CSS asli):

| Breakpoint | Kolom | Lebar grid | Lebar foto | Rasio | Overflow |
|---|---|---|---|---|---|
| 1920 | **4** | 1296 | 314 | 1.33 | tidak |
| 1440 | **4** | 1296 | 314 | 1.33 | tidak |
| 1366 | **4** | 1287 | 311 | 1.33 | tidak |
| 1024 | **3** | 945 | 306 | 1.33 | tidak |
| 768 | **2** | 689 | 338 | 1.33 | tidak |
| 430 | **2** | 375 | 181 | 1.33 | tidak |
| 390 | **2** | 335 | 163 | 1.33 | tidak |
| 360 | **2** | 305 | 148 | 1.33 | tidak |

- Isolasi terverifikasi: di 1920px semua `.wrap` biasa tetap **1180px**,
hanya `.wrap-gallery` = 1360px, grid 1296px.
- Foto terlihat dalam viewport 1920×1080: **20 foto (5 baris)**; 1366×768 → 16.
- `sizes` benar: srcset `w=384` terpilih untuk kartu 266px.
- Lightbox: buka (klik), gambar 1056×792 termuat, caption + counter + tombol
  nav ada, Escape menutup ✓
- Regresi: `/`, `/kelas/barista`, `/kelas`, `/program/[slug]` → semua 200,
  section Programs/Jadwal utuh, **0 console error**, tanpa horizontal overflow.
- `npx tsc --noEmit` 0 error; `npm run build` hijau (22 routes).

**Catatan:** screenshot "sebelum" yang dikirim user ter-render **zoom-out** di
browser (grid sebenarnya 1116px/3 kolom, bukan sempit). Keluhan whitespace
masih valid: 3 kolom di 1116px + 740px kosong di 1920px. Setelah redesign:
4 kolom di 1296px (16% lebih lebar, 33% lebih banyak foto per baris).

- `sizes` benar: srcset `w=384` terpilih untuk kartu 266px.

**Task sebelumnya (source code, sudah ter-push): grouping Galeri admin**

- `components/admin/GaleriList.tsx`: grouping murni di klien via
  `buildGroups(items)` (useMemo, tanpa query tambahan), section kategori +
  sub-section program yang bisa di-expand/collapse (state "ciut",
  `aria-expanded`, chevron), ringkasan "N kategori · M program · K foto",
  tombol "Buka semua"/"Ciutkan semua". Badge kategori/program per kartu
  dihapus (sudah tercermin di judul section). Label "Tanpa Kategori" dan
  "Tanpa Program" untuk foto tanpa relasi.
- `app/admin/actions.ts`: `moveGalleryImage` kini menerima `targetId` —
  menukar `urutan` dua foto **di dalam subgroup** yang sama (sebelumnya
  membalik daftar global, jadi tombol ↑/↓ terasa melompat kategori).
- `app/admin/(dashboard)/galeri/page.tsx`: teks pengantar menjelaskan
  grouping (query tetap satu, sudah include category & program).

Verifikasi (localhost, 8 foto uji + 12 foto asli = 20):

| Aspek | Hasil |
|---|---|
| Grouping multi kategori | 4 kategori: Barista 6, Kelas Komputer 7/9, Keselamatan Maritim 5, Tanpa Kategori 1 |
| Multi program dalam 1 kategori | Keselamatan Maritim → Basic Fire & First Aid (3) + BOSIET (1) + Tanpa Program (1) |
| Foto tanpa program | tampil di sub-section "Tanpa Program" (bukan hilang) |
| Foto tanpa kategori | tampil di section "Tanpa Kategori", selalu di urutan akhir |
| Jumlah foto kategori & program | akurat dari data aktual (6+7+5+1=20) |
| Sorting/order | dalam subgroup ikut urutan publik (`urutan` asc dari server) |
| Tombol ↑/↓ | scoped subgroup: foto pertama ↑ nonaktif, terakhir ↓ nonaktif; klik ↓ menukar #13↔#14 hanya di subgroup itu |
| Edit kategori/program | foto berpindah grup setelah simpan (BOSIET → Basic Fire & First Aid) |
| Delete | jumlah ikut turun; subsection kosong **tidak** dirender (Kursus Komputer hilang saat kosong) |
| Upload | foto baru langsung masuk grup Basic Fire & First Aid/BOSIET sesuai pilihan |
| Sidebar | tetap fixed: top 0, tinggi = viewport, account section gap 24px |
| Overflow | tidak ada horizontal scroll; `body` tidak scroll |
| Console | 0 error |
| Regresi publik | `/`, `/kelas`, `/kelas/[slug]`, `/program/[slug]` tetap 200 + gambar render |
| Kebersihan data | data uji dihapus (7 baris + 1 file), urutan dirapikan 1..12, total kembali 12 |

**Task sebelumnya (source code, sudah ter-push): upload Galeri di production**

- **Root cause**: di production `BLOB_READ_WRITE_TOKEN` kosong →
  `storeImage()` jatuh ke fallback `public/uploads`; filesystem Vercel
  serverless hanya-baca/ephemeral → `mkdir`/`writeFile` gagal → `catch`
  lama mengembalikan satu pesan generik untuk semua penyebab.
- **Bukti**:
  - File yang sama (PNG 965 KB) → lokal **200**, production **500** generik.
  - Production: bahkan PNG **1,5 KB** gagal 500 → bukan soal ukuran/format.
  - Validasi (400) & halaman lain tetap jalan → route dieksekusi, gagalnya
    di dalam `try` (sharp/storeImage/DB).
  - Simulasi lokal (folder dikunci `icacls /deny W`) → **gejala identik**:
    500 generik; server log: `EPERM ... open '...\public\uploads\galeri-*.webp'`.
  - Platform production: `oversize.png` (10,6 MB) → **413
    `FUNCTION_PAYLOAD_TOO_LARGE`** → terkonfirmasi Vercel.
  - Footer production: "Mode penyimpanan foto: lokal (public/uploads)".
- **Fix**:
  - `lib/storage.ts`: `StorageUnavailableError` + `StorageFailCode`
    (`blob-not-configured` / `readonly-fs` / `no-permission` / `disk-full` /
    `unknown`), `isEphemeralFs()` (VERCEL/AWS_LAMBDA/NETLIFY),
    `describeStorageFailure()` (pesan aman, tanpa path/stack/credential),
    `assertStorageReady()` (gagal cepat sebelum kompres), dan
    `classifyStorageError()` (EROFS→readonly, EACCES/EPERM→no-permission,
    ENOSPC→disk-full).
  - `app/api/upload/route.ts`: pre-flight `assertStorageReady()` → **503**
    + pesan penyebab; `catch` dipetakan: storage→503, Prisma (`P…`)→500
    "gagal menyimpan data", sharp/lain→422 "Gagal memproses gambar";
    detail penuh tetap `console.error` di server.
  - `components/admin/UploadForm.tsx`: `pesanFromStatus()` untuk balasan
    non-JSON/platform: 413 (batas ±4,5 MB Vercel), 401/403 (sesi), 503
    (storage), 5xx. Tidak ada perubahan desain/auth/schema.
- **Verifikasi**: `tsc` 0 error; build hijau; matriks 7 file lokal
  (PNG/JPG/WebP/AVIF 200, >8MB 400, non-image 400); `VERCEL=1` → 503
  "Penyimpanan foto belum dikonfigurasi…"; folder dikunci → 503
  "folder upload tidak bisa ditulis"; UI menampilkan pesan baru per file;
  file tidak sempat ditulis saat gagal; data uji dibersihkan (kembali 12
  foto, 0 file yatim).

**Task sebelumnya (source code, sudah ter-push): 4 perbaikan minor admin**

1. **Email admin tidak lagi terpotong** — `break-all` + `text-xs` →
   `text-[11px] break-words min-w-0` + `title`. Diuji empiris: tersedia
   160px, teks 148px → **1 baris** di 9/9 halaman (sebelumnya 2 baris dengan
   "m" sendirian). Alternatif split di "@` (2 baris) tidak dipakai.
2. **Ikon theme toggle kini terlihat di sidebar** — akar masalah: `.theme-toggle`
   memakai `color: var(--navy)` dan ikon SVG `stroke="currentColor"`, jadi
   di sidebar navy ikon jadi navy-di-atas-navy (tidak terlihat). Fix: aturan
   `.admin-sidebar .theme-toggle{color:#E9EDF9;border-color:rgba(255,255,255,.4)}`
   di `app/globals.css` + class `admin-sidebar` pada `<aside>`. Terverifikasi:
   ikon `theme-icon-moon`/`sun` `display:block`, 18×18, warna terang.
   **Situs publik tidak berubah** (hanya di-scope `.admin-sidebar`).
3. **Mobile & tablet terverifikasi dengan media query nyata** — harness
   mengunci viewport 878px dan `window.resizeTo` tidak berefek, jadi dipakai
   **iframe same-origin** (375px & 820px) sehingga media query benar-benar
   dievaluasi:
   - 375px: `aside display:none`, nav mobile `display:flex`, wrapper
     `overflow:visible` & tumbuh (5136px), area konten `overflow-y:visible`,
     **body scrollable** → identik dengan perilaku lama.
   - 820px: `aside display:flex` `top:0` `height:698` (= iframe height),
     nav mobile `display:none`, wrapper `overflow:hidden`, area konten
     `overflow-y:auto`, body tidak scrollable.
   - Scroll di tablet: `sideTop [0,0]`, `acctGap [24,24]`, konten 4235/4236px.
4. **`EPERM` buildketika server jalan** — sudah dipecahkan & didokumentasikan
   di `AGENTS.md` → *Testing Rules* langkah 0: `taskkill /F /IM node.exe`
   sebelum `npm run build` (DLL Prisma terkunci di Windows).

Verifikasi ulang setelah keempatnya: 9/9 halaman `sideTop [0,0]`,
`acctGap [24,24]`, email 1 baris tanpa overflow, tanpa horizontal scrollbar,
`bodyScroll false`, console **0 error**, `npx tsc --noEmit` 0 error,
`npm run build` hijau (22 routes).

**Task sebelumnya (source code, sudah ter-push): sidebar admin fixed + account
section global**

- File: `app/admin/(dashboard)/layout.tsx` (satu-satunya file diubah).
- Wrapper `min-h-screen md:min-h-0 md:h-dvh flex md:overflow-hidden`;
  `aside` dapat `md:h-full`; `nav` `md:flex-1 md:min-h-0 md:overflow-y-auto`;
  kolom konten `md:h-full md:flex md:flex-col`; area dalam
  `md:flex-1 md:min-h-0 md:overflow-y-auto`. Semua class scroll di-scope `md:`
  → mobile tidak berubah.
- Verifikasi (browser, viewport 878×814, ter-login):
  - **9/9 halaman** (`/admin`, `/admin/galeri`, `/admin/testimoni`,
    `/admin/program`, `/admin/jadwal`, `/admin/pendaftaran`, `/admin/materi`,
    `/admin/kategori`, `/admin/pesan`): `aside.getBoundingClientRect().top`
    = `[0, 0]` sebelum **dan** sesudah content di-scroll penuh; `left` = 0;
    tinggi sidebar = tinggi viewport (814 = 814).
  - Account section: jarak ke bawah viewport = `[24, 24]` px (=`p-6`) di semua
    halaman, email `info@talentaciptakarya.com` + tombol `Keluar` +
    `button.theme-toggle` terdeteksi di semua halaman. Email memakai
    `text-[11px] break-words min-w-0` + atribut `title` agar muat **1 baris**
    (148px dari 160px tersedia; sebelumnya 2 baris dan terpotong).
  - `ThemeToggle` dapat override `.admin-sidebar .theme-toggle` (warna terang
    + border putih transparan) karena warna default `var(--navy)` membuat ikon
    SVG `currentColor` tak terlihat di atas sidebar navy.
  - `window.scrollY` = 0 (window tidak ikut scroll), `scrollWidth ≤ clientWidth`
    (tanpa horizontal scrollbar), `body` tidak scrollable.
  - Content benar-benar bisa scroll: galeri 2116px, program 4096px,
    kategori 2425px, jadwal 128px, materi 62px, testimoni 495px.
  - Tombol **Keluar** → redirect ke `/admin/login` ✓ (logout berfungsi).
  - Console: **0 error**.
  - `npx tsc --noEmit` 0 error; `npm run build` hijau (22 routes).
  - `graphify update .` → 713 node / 1187 edge, tanpa warning;
    `grep '<aside'` di `app/` + `components/` → **hanya 1** (di layout),
    jadi tidak ada sidebar duplikat.

**Task sebelumnya (source code, sudah ter-push): `fix: escape & di teks JSX`**

- Masalah: `&` mentah di teks JSX → tidak valid XML → parser graphify berhenti,
  sehingga `kategori/page.tsx` (3 simbol) dan `JadwalManager.tsx` (11 simbol)
  ter-ekstrak sebagian.
- Solusi: `&` → `&amp;` (render identik) di 2 baris teks.
- Verifikasi:
  - `npx tsc --noEmit` → **0 error**
  - `npm run build` → **hijau, 22 routes** (`EXIT=0`)
  - `graphify update .` → **warning 2 file HILANG**; node 709 → **713**
    (4 simbol yang sebelumnya hilang masuk), edge 1180 → **1187**
  - Teks ter-decode di build output: `"Kelola kategori kelas. Nama & slug unik;
    slug dibuat otomatis dari nama."` dan `"…sisa kursi tampil & tombol Daftar
    nonaktif otomatis saat penuh."` → **tidak ada perubahan visual**, dan tidak
    ada `amp;amp` (double-escape) di seluruh `.next/server`.

**Commit terakhir yang ter-push: `fd32dae` (2026-09-26) —
`fix: modal pendaftaran via portal ke body`**

- Masalah: modal pendaftaran (`FormPendaftaran`) menimpa tabel jadwal karena
  ancestor `.reveal` punya `transform: translateY(26px)` — `transform`
  membuat `position: fixed` ter-parenting ke elemen itu, bukan ke viewport.
- Solusi: render modal via `createPortal(..., document.body)` + state
  `mounted`.
- Terverifikasi di browser pada `/` (section `#jadwal-terdekat`),
  `/program/pelatihan-barista`, `/kelas/barista`: modal terpusat, z-index
  benar, tutup via ×/backdrop/Escape.
- Sudah di-push (butuh fallback: `git -c http.version=HTTP/1.1 push`).

Sebelumnya pada hari yang sama: `08f8123` (tsconfig `jsx: "preserve"`),
`c1bd70b` (contoh `CONTACT_EMAIL_FROM`), `7973d8a` (refresh graphify-out).

Status verifikasi:

- `npx tsc --noEmit` → **0 error** (dijalankan setelah fix `&` di atas).
- `npm run build` → **hijau, 22 routes** (dijalankan setelah fix `&` di atas).
- Git status: HEAD `fd32dae`; perubahan setelahnya = fix `&` di 2 file
  (`app/admin/(dashboard)/kategori/page.tsx`,
  `components/admin/JadwalManager.tsx`) + dokumentasi (`AGENTS.md`, folder
  `AI_CONTEXT/`) — **belum di-commit**.

## Currently In Progress

Task **Admin Email Center** (2026-09-28) selesai diimplementasikan &
diverifikasi lokal, **BELUM di-commit** (detail di *Last Completed Work*).
Menunggu kredensial `MAIL_IMAP_*` untuk menguji Inbox secara nyata
(syarat eksplisit user: tanpa mock/fake inbox).

Task **active state menu sidebar admin** (2026-09-28, spesifikasi 12
bagian user) selesai diimplementasikan & diverifikasi, **BELUM di-commit** —
`components/admin/AdminNav.tsx` (baru, client, `usePathname`),
`app/admin/(dashboard)/layout.tsx` (menu + `Link` dihapus),
`app/globals.css` (`.admin-nav-link` / `.is-active`). `tsc` 0, build hijau
22 routes; logika active state 17/17 kasus; **9/9 route admin** tepat 1 menu
aktif yang benar + `aria-current="page"`; child route
`/admin/galeri/edit/[id]` terbukti (route QA sementara, sudah dihapus);
nav mobile 390px benar & counter tetap; sidebar tetap fixed (top 0, tetap 0
setelah scroll 4493px); gap account section 24px & email 1 baris; tanpa
horizontal overflow; 0 console error (React #418 = pre-existing).

Task **ganti logo ke artwork baru** (2026-09-28) selesai & terverifikasi,
**juga BELUM di-commit** — `public/logo.png` (teks gelap) +
`public/logo-inverse.png` (teks putih), `Header` merender 2 varian + tukar
CSS, `Footer` memakai varian inverse, `favicon.png` + `app/icon.png`
feather saja 512×512, plus `apple-touch-icon.png` 180×180 latar putih, dan
**plat putih di footer dihapus** (`.footer-brand` tanpa
background/padding/shadow → logo varian putih duduk langsung di atas navy).
`tsc` 0, build hijau, E2E kedua mode (tinggi header tetap 240px, logo
201×200, sampel piksel wordmark 83 terang / 151 gelap, footer brand 85×84
tanpa plat, 0 overflow, 0 console
error), keenam aset 200 dengan link tag benar. Aturan regenerasi varian di
`DECISIONS.md` → *Logo dipakai dalam 2 varian*.

Task **bersihkan fragment anchor dari address bar** sudah **di-commit &
ter-push** (`6cf75de` + `19a2d3c`) dan **terverifikasi live** di
`https://talentaciptakarya.com`: 6 link nav → hash kosong, URL tetap `/`,
tiap section 170px dari atas, **0 console error**; deep-link tetap
berfungsi, tombol Back memulihkan posisi. Task sebelumnya (redesign galeri
+ fix 2 bug) juga sudah live (`c318627`, `b61d5c4`).

Catatan lingkungan:

- Server lokal (`npm run start`) **sedang berjalan** di port 3000 (shell
  background); hentikan dengan `taskkill /F /IM node.exe` sebelum
  `npm run build` (EPERM Prisma DLL). **Jangan jalankan `npm run dev`
  bersamaan** dengan `npm run start` — keduanya berbagi folder `.next/`;
  insiden 2026-09-28: `next dev` menghapus chunk produksi → semua
  `/_next/static/*` balas 400 → `/admin` "Application error"
  (`DECISIONS.md` → *Hanya SATU server Next pada satu waktu*).
- **Key event trusted (Tab/Enter/Escape) tidak terkirim** selama desktop
  window tak terlihat oleh harness (`browser.screenshot` pun gagal) —
  uji keyboard dilakukan via dispatch sintetis ke `document` (jalur
  `addEventListener`) atau menunggu window terlihat.
- `graphify-out/` sudah di-update (2026-09-28: **798 node / 1339 edge /
  50 community** — rebuild terakhir oleh hook `post-commit` setelah cache
  AST dipindah aside; angka edge/community bergeser tipis antar rebuild,
  backup `graphify-out/2026-09-28/`); sudah ter-commit.
- Skrip temporer (`prisma/tmp-*.ts`) sudah dihapus; hanya
  `prisma/backfill-gallery-year.ts` yang dipertahankan (berguna untuk
  backfill ulang bila perlu).

## Current Problems

### Issue 1 — `RESEND_API_KEY` tidak valid (401 "API key is invalid")

**Symptoms**

- Email reset password tidak terkirim (link reset hanya muncul di log server
  sebagai `[resend:debug]`).
- Email notifikasi pendaftaran tidak terkirim; log menampilkan
  `[pendaftaran] email notifikasi gagal — pendaftaran #N tetap tersimpan di /admin/pendaftaran`.
- Kolom `statusEmail` di `Pendaftaran`/`ContactMessage` menjadi `failed`.

**Suspected Cause**

Nilai `RESEND_API_KEY` di `.env` lokal (dan kemungkinan juga di Vercel
Environment Variables) adalah key lama yang sudah dicabut/di-regenerate di
dashboard Resend.

**Investigation Already Done**

- Error Resend terbaca langsung: `401 API key is invalid`.
- Kode sudah dipastikan benar: `lib/resend.ts` menangani error dan tidak
  melempar — data tetap tersimpan (sesuai PRD §8).

**Current Status**

**Open, tapi Email Center sudah punya key valid sendiri.** User menambahkan
env baru **`PANEL_RESEND_API_KEY`** (2026-09-28) yang dipakai khusus Admin
Email Center; nilainya **terverifikasi valid** (`GET https://api.resend.com/domains`
→ **HTTP 200**). `RESEND_API_KEY` yang lama masih ada dan masih tidak valid,
jadi notifikasi aplikasi (kontak/pendaftaran/reset password) belum terkirim.
`lib/resend.ts` memakai `PANEL_RESEND_API_KEY` → fallback `RESEND_API_KEY`.

**Recommended Next Investigation**

Aksi (user): salin `PANEL_RESEND_API_KEY` yang sama ke Vercel Environment
Variables (Email Center di produksi tidak bisa kirim tanpa itu), lalu isi
`RESEND_API_KEY` dengan key valid agar notifikasi aplikasi ikut jalan.

### Issue 2 — Email `info@` belum tentu menerima mail (MX belum di-add ulang)

**Symptoms**

Setelah nameserver domain dipindah ke `ns1/ns2.vercel-dns.com`, record MX
bawaan Hostinger ikut hilang sehingga email masuk ke `info@` berisiko tidak
diterima.

**Suspected Cause**

Zone DNS sekarang dikelola Vercel; record MX Titan (`mx1.titan.email`,
`mx2.titan.email`) belum dibuat ulang di sana.

**Investigation Already Done**

Dicek langsung lewat DNS publik (2026-09-28):

| Record | Nilai | Pref |
| --- | --- | --- |
| MX | `inbound-smtp.sa-east-1.amazonaws.com` (Amazon SES inbound) | **9** |
| MX | `mx1.titan.email` | 10 |
| MX | `mx2.titan.email` | 20 |

Artinya **MX Titan sudah ada lagi** (Issue 2 sebagian tertutup), tetapi
**pref 9 milik Amazon SES lebih 우선** → email masuk kemungkinan besar
diterima **Amazon SES**, bukan langsung ke mailbox Hostinger.

**Current Status**

**Closed — bukan blocker.** Terbukti lewat percobaan nyata: 3 email yang
dikirim Resend ke `info@talentaciptakarya.com` **benar-benar masuk ke
mailbox Hostinger** (IMAP berhasil membacanya, termasuk salinan berisi
lampiran). Jadi mail dari Resend diterima normal; kekhawatiran "inbox
kosong" tidak terjadi. Record SES tetap perlu dicermati bila
mailbox tiba-tiba kosong di kemudian hari.

**Recommended Next Investigation**

Tidak ada aksi wajib. Kalau suatu saat Inbox kosong padahal sync sukses,
periksa kembali aturan inbound di AWS SES `sa-east-1`.

### Issue 3 — Domain pengirim Resend belum terverifikasi

**Symptoms**

`CONTACT_EMAIL_FROM` memakai `info@talentaciptakarya.com`, tetapi Resend
butuh record SPF/DKIM/DMARC di DNS sebelum domain boleh dipakai sebagai
pengirim (selain `onboarding@resend.dev`).

**Suspected Cause**

Record verifikasi Resend belum ditambahkan di Vercel DNS.

**Investigation Already Done**

Dicek langsung lewat API Resend memakai `PANEL_RESEND_API_KEY` (2026-09-28):
`GET /domains` → **HTTP 200** dengan hasil
`domain: talentaciptakarya.com | status: verified | created 2026-09-23`.

**Current Status**

**SELESAI / Closed.** Domain sudah **verified**, jadi
`from: Talenta Cipta Karya <info@talentaciptakarya.com>` diterima Resend.
Dikonfirmasi juga lewat pengiriman nyata dari Email Center (Ref
`01a0e6be-8515-7e3e-b028-9a0ebb20067c`).

**Recommended Next Investigation**

Tidak ada. Lanjut ke Email Center: isi `MAIL_IMAP_*` (Issue baru di bawah) dan
`RESEND_WEBHOOK_SECRET` agar status delivered/bounced tercatat.

### Issue 4 — Verifikasi live production untuk perbaikan modal

**Symptoms**

Fix `fd32dae` sudah ter-push, tetapi belum dikonfirmasi di
`https://talentaciptakarya.com` setelah auto-redeploy Vercel.

**Suspected Cause**

Belum dicek (Vercel biasanya auto-deploy ±1–2 menit setelah push).

**Investigation Already Done**

Sudah diverifikasi hanya di lokal (`localhost:3000`).

**Current Status**

**Open**, satu langkah verifikasi.

**Recommended Next Investigation**

Buka `https://talentaciptakarya.com` → klik **Daftar** pada tabel jadwal →
modal harus terpusat dan tidak menimpa tabel.

### Issue 5 — Dokumentasi menyimpang dari kondisi sebenarnya (doc drift)

**Symptoms**

- `DEPLOY.md` menjelaskan deploy ke **Hostinger** (hPanel, opsi ZIP), padahal
  produksi sekarang **Vercel**.
- `.env.example` masih menulis "Lokal: SQLite sudah jalan otomatis lewat file
  `prisma/dev.db`", padahal provider sudah `postgresql`.
- `README.md` merujuk file `PRD-Talenta-Cipta-Karya.md v2.1` yang **tidak
  ada** di repo.

**Suspected Cause**

Dokumen ditulis sebelum keputusan pindah ke Vercel/PostgreSQL dan belum
diperbarui.

**Investigation Already Done**

Dicek langsung: isi `DEPLOY.md`, `.env.example`, dan pencarian file PRD
(ketemu nihil).

**Current Status**

**Open** (dokumentasi saja, tidak memengaruhi runtime).

**Recommended Next Investigation**

Perbarui `DEPLOY.md`/`.env.example`/`README.md` **hanya bila user meminta** —
jangan ubah file di luar scope tugas.

### Issue 6 — Warning ekstraksi graphify pada 2 file (`&` di teks JSX)

**Symptoms**

`graphify update .` melaporkan:

- `app/admin/(dashboard)/kategori/page.tsx` (error pertama di baris 19,
  3 simbol ter-ekstrak)
- `components/admin/JadwalManager.tsx` (baris 504, 11 simbol ter-ekstrak)

**Suspected Cause — sudah terkonfirmasi**

Kedua baris itu memuat karakter `&` **di dalam teks JSX**:

- `kategori/page.tsx:19` → "Nama **&** slug unik; slug dibuat otomatis…"
- `JadwalManager.tsx:504` → "…sisa kursi tampil **&** tombol Daftar nonaktif…"

`&` mentah legal di JSX/React (dirender apa adanya) tetapi **tidak valid
XML**, dan parser graphify gagal di titik itu. Baris lain yang memuat `&`
(mis. `{... && (`) aman karena berada di ekspresi, bukan di teks.

**Investigation Already Done**

- Lokasi error = lokasi `&` persis (dibandingkan dengan isi kedua file).
- `npx tsc --noEmit` = 0 error → murni masalah parser, bukan kode rusak.
- Hanya 2 file yang dilaporkan, jadi hanya 2 titik ini yang bermasalah.

**Current Status**

**FIXED (2026-09-26, sudah ter-push).** `&` → `&amp;` di dua titik teks JSX:

- `app/admin/(dashboard)/kategori/page.tsx:19`
- `components/admin/JadwalManager.tsx:504`

Bukti: `graphify update .` tidak lagi melaporkan 2 file itu (node 709 → 713,
edge 1180 → 1187); `npx tsc --noEmit` 0 error; `npm run build` hijau 22 routes;
teks di build output ter-decode tetap `&` sehingga tampilan tidak berubah.

**Catatan preventif:** jangan menulis `&` mentah di teks JSX. `&&` di dalam
ekspresi aman; hanya `&` di dalam teks yang invalidate XML untuk parser.

### Issue 7 — 5 vulnerability di `npm audit` (sengaja dibiarkan)

**Symptoms**

`npm audit` melaporkan 5 vulnerability.

**Suspected Cause**

Tersembunyi di dependensi Next/Prisma versi yang sekarang.

**Investigation Already Done**

`npm audit fix --force` akan menarik `next@16` dan `prisma` versi lebih lama
→ breaking change (riwayat: Next 16 pernah ter-install tidak sengaja dan
merusak build).

**Current Status**

**Open, disengaja.** Jangan di-force.

**Recommended Next Investigation**

Hanya audit ulang bila user menaikkan versi Next/Prisma secara sadar.

### Issue 8 — Kredensial Git pernah terekspos di percakapan

**Symptoms**

Token GitHub untuk akun `Tciptakarya` sempat terlihat dalam riwayat percakapan
(nilainya **tidak** ditulis ulang di file mana pun).

**Suspected Cause**

Proses push manual.

**Investigation Already Done**

Kredensial disimpan di Windows Git Credential Manager (username `Tciptakarya`).

**Current Status**

**Open (keamanan).**

**Recommended Next Investigation**

Sarankan user **memutar (rotate) token GitHub** tersebut bila masih aktif.

### Issue 9 — `graphify update .` crash `0xC0000005` — penyebab BELUM teridentifikasi (intermiten ~37%)

**Symptoms**

- 2026-09-26: 1 dari 2 percobaan mati tanpa output, exit `-1073741819`
  = `0xC0000005` (access violation Windows); retry langsung berhasil.
- 2026-09-28 (pagi): **4× berturut-turut** crash, lalu beberapa kali hijau.
- 2026-09-28 (siang): eksperimen terkontrol 16 run → **6 crash (~37%)**,
  tersebar merata (lihat tabel). Gejalanya selalu sama: **0 baris output**,
  proses hilang begitu saja, file `graphify-out/` tidak berubah.

**Eksperimen terkontrol (2026-09-28, 16 run `graphify update .`)**

| Kondisi | Run | Crash | Sukses | Rate crash |
|---|---|---|---|---|
| A: `graphify-out/cache` **ada** | 5 | 2 | 3 | 40% |
| B: `graphify-out/cache` **dipindah** | 5 | 2 | 3 | 40% |
| C: hook `PreToolUse` **dimatikan** (`hooks.json` di-rename) | 6 | 2 | 4 | 33% |
| **Total** | **16** | **6** | **10** | **~37%** |

**Kesimpulan — hipotesis lama DIBATASI (2026-09-28)**

- ❌ **Cache AST bukan penyebab.** Dulu terlihat "mewani" karena 4 crash
  beruntun terjadi saat cache ada, dan 2 run sesudah memindahkan cache
  kebetulan hijau. Data 16 run membuktikan rate crash **identik** dengan
  dan tanpa cache (40% vs 40%). Memindahkan cache **tidak menolong**.
- ❌ **Hook `PreToolUse` bukan penyebab.** Hook `.codex/hooks.json`
  (`graphify hook-check`, matcher `Bash`) dinonaktifkan → crash rate
  tetap 33%. Dugaan lama "bentrok hook" **salah**.
- ❌ **Bentrok proses lain bukan penyebab.** Saat crash, `Get-Process`
  menunjukkan tidak ada `graphify`/`uv`/`python` lain yang berjalan.
- ⚠️ **Windows Event Log tidak mencatat crash ini** (hanya `Explorer.EXE`
  yang crash) → access violation terjadi di dalam shim/uv tanpa WER
  entry, jadi tidak ada stack trace yang bisa diambil.
- ✅ Subcommand lain **tidak pernah** crash: `graphify --version`,
  `god-nodes --top 3`, `check-update .` selalu exit 0 → masalahnya
  spesifik di jalur `update` (bukan install/graph.json yang rusak).

**Current Status**

**OPEN, sudah terkarakterisasi** (bukan solved). Workaround satu-satunya
yang terbukti: **ulang `graphify update .` sampai exit 0** (rata-rata
~2,7 run). Tidak perlu memindahkan cache. Status graph saat ini:
**801 node / 1347 edge / 54 community** (angka bergeser tiap rebuild,
jadi bukan acuan tetap — yang penting `update` exit 0).

**Recommended Next Investigation**

- Ultimate fix: `uv tool upgrade graphifyy` (terpasang 0.9.67) → uji
  apakah crash `0xC0000005` di jalur `update` hilang. Ini bug upstream
  (shim uv + Windows), bukan bug project.
- Untuk agent berikutnya: jangan memoalsikan cache sebagai "perbaikan" —
  sudah terbukti tidak berpengaruh; cukup retry.

### Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong)

**Symptoms**

Semua upload galeri di `https://talentaciptakarya.com` gagal. Sebelumnya
pesan generic "Upload gagal. Coba lagi dengan foto lain."; setelah fix pesan
503 "Penyimpanan foto belum dikonfigurasi di server ini…".

**Suspected Cause — terkonfirmasi**

`BLOB_READ_WRITE_TOKEN` tidak ada di Vercel → `storeImage()` memakai fallback
`public/uploads` → filesystem Vercel hanya-baca/ephemeral → write gagal.
Lokal tetap aman karena disk Windows writable.

**Investigation Already Done**

Lihat *Last Completed Work* (bukti lengkap: file identik 200 lokal vs 500
production, reproduksi dengan `icacls /deny W`, `VERCEL=1` simulation,
`FUNCTION_PAYLOAD_TOO_LARGE` = Vercel).

**Current Status**

**RESOLVED (2026-09-27).** Upload di production sudah terverifikasi bekerja
penuh dengan Vercel Blob.

Bukti verifikasi production (`https://talentaciptakarya.com`):

- Footer `/admin/galeri`: **"Mode penyimpanan foto: Vercel Blob"**
- Matriks upload: PNG 1,5 KB / JPG 1118 KB / WebP 920 KB / AVIF 468 KB /
  PNG 2832 KB → **semuanya HTTP 200** dengan URL
  `https://aeiuzxqqxeye5usv.public.blob.vercel-storage.com/galeri-*.webp`
- File blob bisa diakses publik: **HTTP 200, `content-type: image/webp`,
  728.992 byte** (JPG 1118 KB → WebP 728 KB, kompresi `sharp` bekerja)
- Foto hasil upload **muncul di galeri beranda** publik
- File non-image tetap 400, file > 8 MB tetap 413 (lihat Issue 11)
- Data uji dibersihkan lewat UI admin: total galeri kembali **12**,
  **0** record ber-URL blob, **0** file yatim (file ikut terhapus dari store)

**Catatan operasional (penting untuk agent berikutnya):**

- UI Vercel 2026 **tidak lagi menampilkan read-write token** di halaman store;
  hanya ada "Rotate Credentials". Karena itu `blobEnabled()` kini menerima
  **OIDC** (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`) selain
  `BLOB_READ_WRITE_TOKEN`.
- Jejak troubleshoot yang berhasil: `RESEND_API_KEY`-style error "Upload
  gagal" → cek footer `/admin/galeri` → 503 "belum dikonfigurasi" → cek
  `Vercel → Settings → Environment Variables` (ada env var `BLOB_READ_WRITE_TOKEN`
  **lama** dari store yang sudah dihapus) → **hapus env var lama** → putar
  kredensial → Redeploy.
- "Rotate Credentials" bisa gagal dengan *"Env vars cannot be safely rotated"*
  karena env var lama bertipe **Secret** (write-only) sehingga Vercel tidak bisa
  memverifikasinya. Solusinya: hapus dulu env var lama, lalu rotate lagi.

### Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB

**Symptoms**

File 4,5–8 MB ditolak platform dengan 413 `FUNCTION_PAYLOAD_TOO_LARGE` —
route tidak pernah dipanggil. Terbukti: `oversize.png` 10,6 MB → 413 dari
Vercel (bukan 400 dari aplikasi).

**Suspected Cause**

Request multipart lewat serverless function; Vercel membatasi body ±4,5 MB.
Tidak ada bedanya dengan/ tanpa Vercel Blob — file tetap melewati function.

**Investigation Already Done**

- 413 datang dari platform (`sin1::…`), body aplikasi tidak pernah jalan.
- `pesanFromStatus()` di `UploadForm.tsx` sudah memetakan 413 ke pesan
  yang jelas.

**Current Status**

**Open, keputusan dibutuhkan user** (batas 8 MB tidak diubah tanpa persetujuan).

**Recommended Next Investigation**

Pilih: (a) turunkan batas ke ~4 MB + sesuaikan teks UI; (b) client-side
upload langsung ke Vercel Blob agar body tidak lewat function; atau
(c) biarkan 8 MB dengan pesan 413 yang sudah ada.

### Issue 12 - `MAIL_IMAP_*` belum diisi (RESOLVED 2026-09-28)

**Symptoms (sebelum diisi)**

- `/admin/email` menampilkan banner "Email masuk belum aktif" dan daftar
  Inbox kosong (bukan error).
- Tombol `Refresh` nonaktif.
- Tidak ada badge unread di sidebar.

**Suspected Cause**

Nilai kredensial IMAP Hostinger tidak pernah ada di project. Kode
`lib/mail/imap.ts` mengembalikan `null` bila `MAIL_IMAP_HOST`/
`MAIL_IMAP_USER`/`MAIL_IMAP_PASSWORD` kosong - itu perilaku yang disengaja,
bukan crash.

**Investigation Already Done**

- Jalur **outgoing** sudah terverifikasi dengan key Resend nyata lebih dulu
  (compose, lampiran, status `sent` + Ref).
- Jalur **inbound** hanya bisa diuji bila mailbox bisa diakses; tidak ada
  mock/fake data yang dibuat (dilarang di bagian 28 spesifikasi).
- TCP ke `imap.hostinger.com:993` dan `:143` terbuka dari mesin ini,
  jadi hanya kredensial yang kurang.

**Current Status**

**SOLVED.** User mengisi `MAIL_IMAP_*` di `.env` lokal (2026-09-28).
Hasil: 22 email masuk berhasil di-sync, 0 duplikat setelah 3x refresh,
lampiran terunduh (200), flag `\Seen` tersinkron dua arah, dan 3 email
yang dikirim Resend ke `info@` masuk kembali ke Inbox. Detail hasil uji
ada di *Last Completed Work*.

**Catatan tersisa**

- Nilai yang sama **wajib** disalin ke Vercel Environment Variables agar
  Inbox berfungsi di produksi.
- Password IMAP tidak boleh masuk source code/percakapan/commit.

### Issue 13 - Website terasa lambat: fungsi Vercel di region jauh dari database

**Symptoms**

- Halaman utama terasa lambat dibuka, padahal koneksi internet pengunjungnya
  cepat. `/kelas` lebih cepat daripada homepage.

**Investigation Already Done (diukur 2026-09-28, produksi + lokal)**

| Yang diukur | Produksi | Lokal (bandwidth & DB dekat) |
| --- | --- | --- |
| Homepage: byte pertama | **1,26 – 2,18 s** | **0,13 – 0,19 s** |
| `/kelas`: byte pertama | 0,59 s | — |
| HTML homepage | 149,6 KB (72 KB payload RSC + 77,6 KB markup) | — |
| CSS / JS | 15 KB / 9 chunk 207 ms (ringan) | — |
| Cache | `Cache-Control: no-store`, `X-Vercel-Cache: MISS` | — |
| Header region | `X-Vercel-Id: sin1::iad1::…` → **fungsi di US East** | — |
| Database | Neon **`ap-southeast-1` (Singapura)** | — |
| Query DB (`SELECT 1`) | — | **20 ms** |
| Query `program` + relasi | — | 163 ms |

**Suspected Cause — terkonfirmasi**

Fungsi serverless berjalan di **iad1 (US East)** sementara database Neon berada
di **Singapura**, jadi setiap query database melintasi samudra. Selisih TTFB
produksi vs lokal (±1–2 detik) tersebut persis sebesar penalti lintasan
tersebut. Ditambah semua halaman publik memakai `force-dynamic` sehingga tidak
ada cache sama sekali.

**Yang BUKAN penyebab (sudah diukur, jadi jangan dituding)**

- Kecepatan internet pengunjung (CSS 15 KB, JS ringan).
- Database itu sendiri (20 ms dari dekat).
- "Terlalu banyak request image optimizer" — 273 rujukan `/_next/image` itu
 sebenarnya `srcSet`, bukan 273 request; hanya ~2 yang benar-benar dimuat karena
  `loading="lazy"` sudah bekerja. Gambar sudah diberi `sizes` & `priority`
  yang benar.
- Ukuran aset di repo (foto 130–317 KB) hanya masalah bila `sizes` salah.

**Current Status**

**Separuh sudah tertutup dari sisi kode**: 4 halaman publik kini ISR 60 detik
(`revalidate = 60`, dan `force-static` pada 2 rute `[slug]` — tanpa
`force-static` Next 15 tetap mengirim `no-store`, terbukti lewat header).
Hasil lokal: `/` 130–190 ms → **3,5 ms** (`x-nextjs-cache: HIT`),
`/kelas/barista` 520 ms → **5,5 ms**; header jadi
`s-maxage=60, stale-while-revalidate=31535940`. `/admin/*` tetap real-time.

**Sisa = region fungsi Vercel (`iad1` → `sin1`), menunggu tindakan di
dashboard Vercel oleh user.**

**Recommended Next Investigation / Action**

1. **Vercel → Project `web-talenta` → Settings → Functions → Region → `sin1`**
   (atau `sin1` + `hnd1`), lalu **Redeploy**. Tidak ada kode yang perlu diubah;
   ini perbaikan paling besar (±0,5–1 detik).
2. Kalau masih lambat, pertimbangkan `revalidate` (60 detik) untuk `/` dan
   `/kelas` — **ini mengubah keputusan "jangan sampai data basi"** yang
   tercatat di `AGENTS.md`/`DECISIONS.md`, jadi perlu persetujuan user dulu.
3. Peta lokasi memakai `staticmap.openstreetmap.de` yang saat ini **tidak
   terjangkau** (HTTP 000 dari jaringan uji; tile resmi `tile.openstreetmap.org`
   masih 200). Sudah diberi `loading="lazy"` agar tidak memblokir render awal,
   dan menampilkan kartu alamat + "Buka di Maps" bila gagal. Belum ada
   pengganti yang bisa diverifikasi — jangan menukar ke layanan peta lain
   tanpa mengujinya dulu.

### Catatan: `graphify label` tidak butuh API key

Terdeteksi di environment ini:

- `ollama` terpasang dengan model lokal: `qwen2.5-coder:7b`, `qwen3:8b`,
  `qwen2.5-coder:3b`.
- CLI `claude` juga terpasang.
- Tidak ada `GEMINI_API_KEY` / `GOOGLE_API_KEY` / `OPENAI_API_KEY` /
  `ANTHROPIC_API_KEY` di environment.

Jadi nama community semantik bisa dibuat **gratis di lokal**:

```bash
graphify label . --backend=ollama --missing-only   # atau: --backend=claude
```

Alternatif tanpa LLM: `graphify cluster-only . --no-label` (community diberi
placeholder "Community N" — navigasi jadi lebih buruk). Default `graphify
update .` menamai community berdasarkan node hub-nya (mis. `prisma.ts`,
`data.ts`) — itu justru informatif, jadi **tidak wajib** dilabeli LLM.

## Working Features

Semua di bawah ini sudah diverifikasi berjalan (lokal, kecuali yang ditandai):

- **Login admin** `/admin/login` → sesi JWT → redirect `/admin`.
- **Middleware** `/admin/*`: belum login → redirect ke login; sudah login →
  redirect dari login ke `/admin`.
- **Lupa password**: request → token SHA256 30 menit sekali pakai → halaman
  reset → password baru (min 8 + konfirmasi, bcrypt) → redirect sukses ke
  `/admin/login`; respons generik + rate limit.
- **9 halaman admin**: dashboard, kategori, program, galeri, jadwal, materi,
  pendaftaran, pesan, testimoni — semuanya berfungsi (tambah/edit/hapus untuk
  kategori, program, galeri, jadwal, materi, testimoni; pendaftaran & pesan
  = inbox: ubah status/hapus saja, memang tidak ada tombol tambah).
- **Kategori**: slug unik otomatis, hapus kategori terpakai ditolak (PRD §10).
- **Jadwal**: input tanggal → hari otomatis ("Kamis, 15 Okt 2026"), dropdown
  program berkelompok per kategori, kuota + badge sisa kursi.
- **Pendaftaran**: form publik → `/admin/pendaftaran`, hapus dengan dialog
  konfirmasi, status lead bisa diubah.
- **Galeri**: filter chip per program + lightbox navigasi panah
  (mis. `2/6 → 1/6`), edit inline, multi upload, urutan foto.
- **Halaman publik** `/`, `/kelas`, `/kelas/[slug]`, `/program/[slug]`.
- **Modal pendaftaran** terpusat via portal (lokal; live belum dicek).
- **Form kontak** tersimpan ke DB meski email gagal.
- **Dark mode** tidak mengubah mode terang; tema admin navy/white.
- **Upload foto**: kompresi sharp, penyimpanan Blob/lokal.

Kondisi data produksi/lokal terakhir (Neon):

```
categories 8 · programs 11 · gallery 30 · testimonials 2
  (2026-09-28: semua foto SUDAH punya `year` — 2026:13, 2025:4, 2024:7,
   2023:5, 2022:1; tak ada grup "Tanpa Tahun" lagi; chips
   `Pelatihan Barista (24)` + `Kursus Komputer (6)`)
jadwal 0 · pendaftaran 0 · materi 0 · pesan 0
admin 1 · passwordResetToken 2 (sisa uji coba)
```

## Broken Features

- **Kirim email dari Email Center** — **berfungsi** (Resend, key
  `PANEL_RESEND_API_KEY` valid, domain verified).
- **Notifikasi email aplikasi** (kontak, pendaftaran, reset password) —
  masih tidak berfungsi karena `RESEND_API_KEY` lama tidak valid
  (Issue 1). *Penyimpanan data tidak terpengaruh* — fitur pendaftaran/kontak
  tetap bekerja penuh, hanya notifikasi emailnya yang hilang.
- **Inbox Email Center** — belum bisa diuji: `MAIL_IMAP_*` belum diisi
  (Issue 12). UI menampilkan penjelasan, bukan data palsu.
- **Upload foto ke Blob** — `BLOB_READ_WRITE_TOKEN` kosong, jadi foto jatuh ke
  `public/uploads/` (folder ini di-gitignore → foto hilang di produksi bila
  tidak dikonfigurasi). Secara lokal fiturnya jalan.

## Current Blockers

**Tidak ada blokir kode atau kredensial.** `MAIL_IMAP_*` sudah diisi user di
`.env` lokal dan seluruh jalur inbound sudah teruji.

Sisa = **konfigurasi produksi** (butuh akses Vercel/Resend oleh user):

```
PANEL_RESEND_API_KEY     # sudah ada nilainya di lokal, belum di Vercel
MAIL_IMAP_HOST / _PORT / _USER / _PASSWORD / _SECURE   # belum di Vercel
RESEND_WEBHOOK_SECRET    # belum ada sama sekali
```

Plus satu kendala teknis yang **sudah teratasi**: `next dev` milik user
telah dihentikan (2026-09-28) sehingga `prisma db push`, `tsc`, `build`, dan
`npm run start` bisa berjalan normal. Aturannya tetap berlaku: jangan
menjalankan `next dev` bersamaan dengan build/`next start`.

## Exact Next Step

1. **Commit** (menunggu persetujuan user): source Email Center (termasuk
   draft/hapus/pencarian + perbaikan tag `<header>`/`<footer>`) + active
   state sidebar + logo/footer, lalu `graphify update .` (retry sampai
   exit 0) dan commit `chore:` untuk `graphify-out/`. *Sudah ada build
   hijau (24 routes) & `tsc` 0 untuk seluruh perubahan ini — build
   dijalankan 2026-09-28 setelah `next dev` dihentikan.*
2. **Salin `PANEL_RESEND_API_KEY` + `MAIL_IMAP_*` ke Vercel** → Redeploy →
   uji `/admin/email` di `https://talentaciptakarya.com/admin/email`.
3. **Daftarkan webhook** `https://talentaciptakarya.com/api/resend/webhook`
   di dashboard Resend + isi `RESEND_WEBHOOK_SECRET` agar status
   delivered/bounced tercatat nyata.
4. Isi `RESEND_API_KEY` yang valid → notifikasi aplikasi ikut jalan
   (Issue 1).
5. Opsional (sudah tercatat di `TODO.md`): index `pg_trgm` untuk
   pencarian, blokir gambar eksternal (piksel pelacak Resend).
3. ~~Opsional data: isi tahun 8 foto lama~~ — **terpantau selesai**
   (2026-09-28: galeri publik tak punya grup "Tanpa Tahun"; 30 foto
   semua bertahun).
