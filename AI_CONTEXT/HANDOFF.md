# AI HANDOFF

## READ THESE FILES FIRST

1. `AGENTS.md` (aturan permanen + graphify)
2. `AI_CONTEXT/PROJECT_CONTEXT.md` (apa project ini, stack, env)
3. `AI_CONTEXT/ARCHITECTURE.md` (arsitektur, DB, API, file penting)
4. `AI_CONTEXT/CURRENT_STATE.md` (kondisi terkini & issue — **paling penting**)
5. `AI_CONTEXT/DECISIONS.md` (keputusan yang wajib dipertahankan)
6. `AI_CONTEXT/TODO.md` (task nyata, bukan asumsi)

Untuk pertanyaan codebase: jalankan `graphify query "<pertanyaan>"` lebih dulu
(lihat `AGENTS.md`).

## PROJECT

Website **Talenta Cipta Karya** v2.1 — situs profil + pendaftaran kelas
pelatihan, dengan dashboard admin. Next.js 15.5.25 App Router + TypeScript +
Tailwind v4 + Prisma 6.19.3 (PostgreSQL/Neon) + NextAuth v5 (1 akun admin) +
Resend. Live di `https://talentaciptakarya.com` (Vercel free), repo
`github.com/Tciptakarya/web-talenta` branch `main`.

## CURRENT STATE

- HEAD `64cd322` **sudah ter-push & live** (active state sidebar +
  penghapusan plat putih footer). Task **redesign galeri editorial + fix 2
  bug** & **anchor hash** juga sudah live (`c318627`/`19a2d3c`).
- **Working tree berisi 3 task baru (BELUM di-commit):**
  3. **Admin Email Center** (`/admin/email`) — `lib/mail/{imap,sync,sanitize,outbound}.ts`,
     `lib/adminCounts.ts`, `components/admin/EmailCenter.tsx`,
     `app/admin/(dashboard)/email/page.tsx`,
     `app/api/admin/email/attachment/[id]/route.ts`,
     `app/api/resend/webhook/route.ts`, `lib/resend.ts` + `sendPanelEmail()`,
     `lib/schemas.ts` + `emailSendSchema`, 3 Server Action baru, 2 model
     Prisma (`EmailMessage`, `EmailAttachment`), dependensi baru
     `imapflow`/`mailparser`/`sanitize-html` (+2 `@types`),
     `components/admin/AdminNav.tsx` (menu "Email" + badge unread),
     `app/admin/(dashboard)/layout.tsx`, `.env.example`,
     `AI_CONTEXT/`. **Outgoing terverifikasi nyata** (2 email terkirim via
     Resend, `sent` + Ref, lampiran terkirim, `.exe` ditolak, 401 tanpa
     sesi, 0 secret di bundle browser, mobile 390px aman).
     **Inbox belum terverifikasi** — `MAIL_IMAP_*` belum diisi.
  1. **Active state menu sidebar admin** — `components/admin/AdminNav.tsx`
     (baru, client, `usePathname`), `app/admin/(dashboard)/layout.tsx`
     (menu + `Link` dihapus), `app/globals.css`. 9/9 route admin terverifikasi
     tepat 1 menu aktif + child route + nav mobile; sidebar tetap fixed.
  2. **Ganti logo ke artwork baru** — `public/logo.png` (teks gelap) +
     `public/logo-inverse.png` (teks putih), `Header` (2 varian + tukar CSS),
     `Footer` (varian inverse), `favicon.png` + `app/icon.png` (feather saja
     512×512), `apple-touch-icon.png` (180×180 latar putih),
     `app/layout.tsx` (icons.apple), `globals.css` (termasuk **plat putih
     footer dihapus**), `ARCHITECTURE.md` & `DECISIONS.md`. Bug lama ikut
     tertutup: logo berteks hitam dulu nyaris tak terlihat di footer navy &
     header mode gelap.
- Task sebelumnya (sudah ter-push & live): **redesign galeri editorial +
  fix 2 bug review** (`c318627` source + `AGENTS.md` + `AI_CONTEXT/`,
  `b61d5c4` `graphify-out/`) — terverifikasi live 0 console error.
  Isi fixnya: (a) kop program galeri `<header>` → `<div>` (rule global
  navbar `header{position:fixed}` membuat kop menumpuk di tepi kiri atas);
  (b) crash `/admin` "Application error" **bukan bug kode** — `npm run
  dev` berjalan bersamaan dengan `npm run start` dan menghapus chunk
  produksi di `.next/`.
- `npx tsc --noEmit` = 0 error; `npm run build` = hijau, 22 routes.
- Server lokal **sedang berjalan** (port 3000) — `taskkill /F /IM node.exe`
  sebelum build. **Jangan jalankan `npm run dev` bersamaan** dengan
  `npm run start` — keduanya berbagi `.next/` (insiden 2026-09-28; lihat
  *Important Decisions* & `DECISIONS.md`).
- Data (Neon, **dipakai juga production**): 8 kategori, 11 program,
  **30 foto galeri** — per 2026-09-28 **semua sudah punya `year`**
  (2026:13, 2025:4, 2024:7, 2023:5, 2022:1; tak ada grup "Tanpa Tahun";
  chips `Pelatihan Barista (24)` + `Kursus Komputer (6)`), 2 testimoni,
  1 admin; **jadwal 0, pendaftaran 0, materi 0, pesan 0**.
- `graphify-out/`: **798 node / 1339 edge / 50 community** (rebuild
  terakhir oleh hook `post-commit` (angka bergeser tiap rebuild; crash
  `graphify update` ~37% bersifat intermiten — workaround: retry, lihat
  *Known Issues* 9);
  angka edge/community bergeser tipis antar rebuild, backup
  `graphify-out/2026-09-28/`; sudah ter-commit).

## LAST COMPLETED

**Task terbaru: Admin Email Center** (2026-09-28, source BELUM di-commit) —
`/admin/email` sesuai spesifikasi user: Inbox (Hostinger IMAP, cache DB),
baca, tandai read/unread, cari, balas (dengan header `In-Reply-To`/
`References` asli), teruskan, tulis email (To/Cc/Bcc), tab Terkirim, lampiran
masuk (stream via route terproteksi) & keluar (serta validasi ukuran/MIME/
nama/ekstensi), filter, pagination 20, refresh, badge unread di sidebar.
Arsitektur: **Hostinger = inbound, Resend = outbound** (dipisah tegas, tanpa
provider baru), cache `EmailMessage`/`EmailAttachment` di database dengan
`messageId @unique` anti-duplikasi, sanitasi HTML email di server
(`sanitize-html`, `cid:` ditulis ulang ke route auth), status jujur
(`sent` = API diterima; `delivered`/`bounced` hanya dari webhook Resend yang
signature-nya diverifikasi). Dependency baru disetujui user:
`imapflow@2.1.0`, `mailparser@3.9.29`, `sanitize-html@2.17.7` (+2 `@types`).
`tsc` 0, build hijau (24 routes), 0 console error. **Bug nyata ditemukan saat
E2E & diperbaiki**: form compose tidak muncul di `?tab=compose` (state awal
tak berlaku karena komponen tak remount) dan `email=1` terhapus dari URL
(aturan reset `page=1` terlalu luas) → email pertama tidak bisa dibuka.
**Outgoing terbukti nyata**: 2 email terkirim (compose + lampiran), status
`sent` + Ref Resend, `virus.exe` ditolak, 401 tanpa sesi pada route lampiran,
503 tanpa secret pada webhook, tidak ada secret di chunk browser, mobile
390px tanpa overflow. **INBOUND juga terbukti setelah user mengisi
`MAIL_IMAP_*`** (semua PASS): 22 email sync dari mailbox Hostinger, **0
duplikat setelah 3× refresh** (anti-duplikasi `messageId` bekerja),
`^ Refresh` mengUpdater, pencarian 4 hasil, **lampiran terunduh 200** dari
IMAP (`Content-Disposition: attachment; filename="catatan-uji.txt"`, isi
identik), **balas memakai header asli** (`inReplyTo`/`References`/`threadId`
= Message-ID email asal, subjek `Re: ...`; compose tetap `null`), read/
unread tersimpan di DB **dan** flag `\Seen` mailbox (badge 7 → 8, bertahan
setelah refresh), **round trip**: 3 email Resend ke `info@` masuk kembali ke
Inbox, dan sanitasi HTML email Vercel (8.186 karakter) menghasilkan 0
script/iframe/form/on-handler dengan semua link dipaksa
`rel="noopener noreferrer nofollow"`. Banner teks juga disederhanakan
menjadi satu kalimat (tanpa nama variabel env).
**Tambahan (permintaan user, 2026-09-28):** **draft** (tab Draft + tombol
"Simpan Draft", tanpa autosave; draft terhapus setelah terkirim; lampiran
tidak ikut disimpan), **hapus email** (keluar & draft permanen; masuk hanya
disembunyikan via `deletedAt` + `sync.ts` melewatinya — terbukti tidak
muncul lagi setelah Refresh), dan **pencarian akurat** (`lib/mail/search.ts`:
AND per kata, To/Cc/Bcc + nama lampiran ikut dicari, operator
`from:`/`to:`/`subjek:`/`dengan:lampiran`, sorotan `<mark>`; "deployment
vercel" dari 0 → 5 hasil). Skema: `EmailMessage.deletedAt`.
**Bug ke-3 yang dilaporkan user via screenshot juga sudah diperbaiki**:
blok kop detail email
(`<header>`) & blok tombol bawah (`<footer>`) kena rule elemen global
`header{position:fixed…z-index:100}` / `footer{background:#0F1836…}`
di `globals.css` milik navbar/footer situs publik → header menimpa sidebar
dan menutupi form Tulis Email, footer jadi kotak navy. Diganti `<div>`;
terverifikasi di 1920px (header `position:static`, footer transparan, 4
kontrol form terdeteksi sebagai elemen teratas & bisa diketik). Lihat
*IMPORTANT DECISIONS* 21 — jangan pakai tag `<header>`/`<footer>` lagi.
**Catatan build**: semua tes ini lewat `next dev` milik user; `tsc` 0, dan
`npm run build` perlu **diulang** sebelum commit/deploy karena `next dev`
sekarang hidup (`next dev` menghapus `BUILD_ID` bila build dijalankan
bersamaan — persis insiden yang sudah terdokumentasi di *Known Issues* 18).

**Task sebelumnya (source code, SUDAH ter-push `6cf75de` + `19a2d3c`, LIVE
& terverifikasi 0 console error): bersihkan fragment anchor dari address
bar** (2026-09-28, keputusan user dari 3 opsi yang dibahas) — link section
(`#visimisi`, `#galeri`, dst) tidak lagi menampilkan `#...` di address bar.
`components/site/AnchorHashCleaner.tsx` (baru, client component render
`null`, satu listener `click` di `document`) memanggil
`history.replaceState` 150 ms setelah navigasi fragment, dimount di
`app/(public)/layout.tsx`; link **tetap** anchor native. Dipertahankan:
smooth scroll + `scroll-margin-top:170px`, deep-link, Ctrl+click, keyboard,
tombol Back. Teruji localhost (4 titik klik, Ctrl+click, `history.back()`,
deep-link, regresi 5 rute) & live (6 link nav, semua section 170px dari
atas, 0 console error). Sekalian **mengkoreksi klaim salah** soal crash
`graphify update` (lihat *Known Issues* 9 — penyebab belum teridentifikasi,
intermiten ~37%).

**Task sebelumnya (source code, SUDAH ter-push `c318627` + `b61d5c4`, LIVE
& terverifikasi 0 console error): fix 2 bug hasil review user** (2026-09-28) —

1. **Kop program galeri tumpang-tindih di tepi kiri atas** — kop ditulis
   `<header className="gallery-program">` kena rule global tak-ber-layer
   `header{position:fixed; top:0; left:0; right:0; z-index:100;
   padding:20px 0}` (khusus navbar) → kedua kop (Pelatihan Barista +
   Kursus Komputer) fixed & menumpuk di kiri atas, garis pembatas jadi
   coretan melintasi navbar. Fix: **`<header>` → `<div>`** di
   `GalleryGrid.tsx`. Teruji: 2 kop `position:static`, docTop 3428/4406
   (flow, tak tumpang-tindih), `left:32px` dalam container, gap chip→kop
   32px, garis→label tahun 27px, mode terang (h3 `rgb(22,33,74)` @30px,
   h2 47.36px) & gelap (h3 `rgb(236,239,249)`), 0 console error.
2. **Crash `/admin` "Application error: a client-side exception"** —
   **bukan bug kode**: `npm run dev` (port 3001) jalan bersamaan dengan
   `npm run start` (port 3000) → `next dev` menimpa `.next/`
   (`.next/static/chunks` tersisa 1 file `polyfills.js`, seluruh chunk
   produksi terhapus) → semua `/_next/static/*` dibalas **400** →
   `ChunkLoadError: Loading chunk 631 failed`
   (`app/admin/(dashboard)/pendaftaran/page-*.js`). Fix: matikan kedua
   server, `npm run build` ulang (40 chunk pulih), jalankan **satu**
   server. Teruji: 8/8 script HTML `/admin/pendaftaran` → 200; navigasi
   klien `/admin` → klik Pendaftaran normal; direct load
   `/admin/pendaftaran` ✓; sapuan `/admin`, `/admin/galeri`,
   `/admin/program`, `/admin/pesan` 0 crash (React #418 pre-existing
   hanya di `/admin/program`); regresi `/kelas/barista` (0 kop, 0 chip,
   H1→H2→H3→H2, 0 error). tsc 0, build hijau. Keputusan baru:
   `DECISIONS.md` → *Kop program galeri memakai `<div>`…* dan *Hanya
   SATU server Next pada satu waktu…*.

**Task sebelumnya (source code, BELUM di-commit — menunggu persetujuan
user): visual galeri editorial/premium minimal** (2026-09-28) —
`GalleryGrid.tsx` + `globals.css` + `kelas/[slug]/page.tsx`: chip
`.gal-chip` (token adaptif dark mode, tinggi 27px, aktif `--color-navy` +
putih); kop program `.gallery-program{,-title,-kategori}` — **class CSS,
bukan utility Tailwind**, karena rule global `h3{font-size:1.17em}`
tak-ber-layer selalu menang (dulu judul program cuma 18,72px); baris
tahun editorial (thumbnail foto pertama 64×48/52×39 `lazy` **tanpa ubah
DB**, garis aktif 2px `--color-navy` + padding dikompensasi → tanpa
layout jump, `:focus-visible` emas); `.gallery-title` clamp 30–48px;
kartu radius 12px + hover 1.02/0.2s + `prefers-reduced-motion`.
**Fix mode gelap**: `var(--navy)` tidak adaptif (tak terlihat di bg
#0E1322) → diganti `text-navy` / `var(--color-navy)` / `var(--blue)`; chip
`bg-white`+`text-navy/70` ≈1,6:1 → `.gal-chip`. Teruji: tsc 0, build
hijau, E2E **gelap & terang** per elemen, akordeon (`scrollYDelta=0`),
filter chips, lightbox (Escape → tutup → body unlock → fokus kembali ke
foto), 8 breakpoint 1920…360 tanpa overflow, regresi `/kelas/barista` +
`/admin/galeri`, **0 console error**; graphify **776 node / 1320 edge /
48 community**.

**Task sebelumnya (source code, SUDAH ter-push `368d947` + `6accd2a`, LIVE):
struktur galeri PROGRAM → TAHUN → FOTO** — kolom `GalleryImage.year Int?` (db push aman,
nullable); backfill idempoten `prisma/backfill-gallery-year.ts` membaca
tahun **hanya dari caption** (22 terisi, **8 dibiarkan NULL** → grup
"Tanpa Tahun" — tidak boleh ditebak, `uploadedAt` terbukti salah);
validasi Zod `year` wajib (1990…tahun+1) di `/api/upload` &
`updateGalleryImage`; admin: select Tahun di UploadForm & Edit, info tahun
per kartu, ringkasan "8 belum punya tahun", `tahunTersedia` dari data;
galeri publik ditulis ulang → program → tahun (accordion, tahun terbaru
default terbuka, sisanya ciut tanpa render DOM) → foto, chips dari data,
caption lightbox `Program · Tahun · caption (n/total)`; homepage jadi satu
section `#galeri`, Header `/#galeri`, `getGalleryGroups()` dihapus.
Teruji penuh: build hijau 2×, tsc 0, upload/edit/hapus E2E (data kembali
persis 30 foto), keyboard + lightbox, 6 kasus validasi 400, regresi 10
rute publik + 9 admin 0 error, 8 breakpoint tanpa overflow, graphify hijau.

**Task sebelumnya (source code, sudah ter-push): redesign UI/UX galeri
publik** — `.wrap-gallery` 1360px (`.wrap` global 1180px tetap), grid 4/3/2
kolom, gap 14px, card radius 14px + hover 1.03, caption compact (line-clamp
2), section padding 64px, `sizes` next/image diselaraskan. Terverifikasi di
1920/1440/1366/1024/768/430/390/360 tanpa overflow; lightbox & filter
program utuh; 0 console error — commit `4ee76d1` + `b0e16be` + `4f08b1d`.

**Task sebelumnya (source code, sudah ter-push): grouping Galeri admin
KATEGORI → PROGRAM** — `GaleriList.tsx` (grouping di klien dari satu query,
accordion kategori + program, jumlah foto dari data aktual, grup "Tanpa
Kategori"/"Tanpa Program", ↑/↓ scoped dalam subgroup) + `moveGalleryImage`
menerima `targetId`. Terverifikasi: 4 kategori, 3 program dalam 1 kategori,
foto tanpa program/kategori, ↑/↓, Edit memindahkan foto, Delete meng-update
jumlah & menyembunyikan subgroup kosong, Upload masuk grup sesuai pilihan,
sidebar tetap fixed, 0 console error, halaman publik 200. Data uji dihapus
(kembali 12 foto, urutan 1..12).

**Task sebelumnya (source code, sudah ter-push): upload Galeri di production** — root cause: `BLOB_READ_WRITE_TOKEN` kosong di Vercel →
fallback `public/uploads` (filesystem hanya-baca) → `writeFile` gagal →
`catch` lama hide penyebab di balik "Upload gagal". Fix: `lib/storage.ts`
(StorageUnavailableError + taksonomi kode + `assertStorageReady()`),
`app/api/upload/route.ts` (pre-flight 503 + pemetaan error 503/500/422),
`components/admin/UploadForm.tsx` (`pesanFromStatus()` untuk 413/401/503/5xx).
Bukti: file identik 200 lokal vs 500 production; reproduksi lokal dengan
`icacls /deny W`; simulasi `VERCEL=1` → 503 pesan jelas; UI menampilkan
pesan per file. Data uji sudah dibersihkan (kembali 12 foto, 0 file yatim).

**Dua isu yang masih perlu keputusan user:**
1. Vercel Blob harus diaktifkan (tanpa itu upload production mustahil).
2. Batas 4,5 MB platform vs 8 MB di UI — belum diubah, hanya pesannya
   yang diperjelas.

**Task sebelumnya (source code, sudah ter-push): 4 perbaikan minor admin** —
(1) email admin kini 1 baris (`text-[11px]` + `title`, 148px dari 160px
tersedia); (2) ikon theme toggle terlihat di sidebar navy
(`.admin-sidebar .theme-toggle`, situs publik tidak berubah); (3) mobile
375px & tablet 820px terverifikasi lewat iframe same-origin; (4) workaround
`EPERM` build (hentikan server sebelum build) didokumentasikan di `AGENTS.md`.
Re-verifikasi: 9/9 halaman `sideTop [0,0]`, `acctGap [24,24]`, email 1 baris,
console 0 error, `tsc` 0 error, build hijau.

**Task sebelumnya (source code, sudah ter-push): sidebar admin fixed + account
section global** — hanya `app/admin/(dashboard)/layout.tsx`. Wrapper
`min-h-screen md:min-h-0 md:h-dvh flex md:overflow-hidden`; konten jadi
container `md:overflow-y-auto`; `nav` `md:overflow-y-auto`; account section
(email + `ThemeToggle` + `SignOutButton`) tetap `mt-auto shrink-0` di dalam
`aside` `md:h-full`. Semua class scroll di-scope `md:` → mobile tidak berubah.
Verifikasi: 9/9 halaman `aside.top = [0,0]` sebelum/sesudah scroll,
`acctGap = [24,24]`, `window.scrollY = 0`, tanpa horizontal scrollbar, 0 error
console, tombol Keluar → `/admin/login`. `tsc` 0 error, build hijau.

Ringkas: **hanya ada 1 `<aside>`** di seluruh project (di layout tersebut) —
sidebar & account section otomatis global untuk semua halaman admin.

**Task sebelumnya (source code, sudah ter-push): `fix: escape & di teks JSX`** —
`&` → `&amp;` di `app/admin/(dashboard)/kategori/page.tsx:19` dan
`components/admin/JadwalManager.tsx:504`. Akar masalah: `&` mentah di teks JSX
tidak valid XML sehingga parser graphify berhenti (3 + 11 simbol hilang dari
graph). Verifikasi: `npx tsc --noEmit` 0 error, `npm run build` hijau 22
routes, `graphify update .` → **warning hilang** (709 → 713 node), teks di
build output ter-decode tetap `&` (tampilan tidak berubah).

**Task dokumentasi (sudah ter-push):** folder `AI_CONTEXT/` (7 file),
aturan wajib *Setelah Menyelesaikan Task* + *Workflow low-token* di
`AGENTS.md`.

**Task source code terakhir yang ter-push:** commit `fd32dae` — fix modal
pendaftaran via `createPortal(..., document.body)` (penyebab: `transform`
pada `.reveal` membuat `position: fixed` ter-parenting).

## CURRENTLY WORKING ON

Task **Tampilan Website** (edit teks publik dari admin, 2026-09-28) selesai &
terverifikasi penuh, **BELUM di-commit** — `/admin/konten` + registry
`lib/siteContent.ts` (68 field, 10 bagian) + `Rich.tsx` (escape HTML lalu
`**tebal**`) + `KontenEditor.tsx` + tabel `SiteContent` + 2 Server Action.
`revalidatePath` membuat perubahan langsung berlaku. XSS diuji: `<script>`
menjadi teks biasa.

Tiga task selesai diimplementasikan & diverifikasi, **ketiganya BELUM
di-commit** — menunggu persetujuan user:

0. **Admin Email Center** (`/admin/email`) — selesai & terverifikasi lokal
   (outgoing nyata via Resend). **Menunggu `MAIL_IMAP_*`** untuk menguji
   inbound. Ringkasan di *LAST COMPLETED*. Berkode di `lib/mail/*`,
   `components/admin/EmailCenter.tsx`,
   `app/admin/(dashboard)/email/page.tsx`,
   `app/api/admin/email/attachment/[id]/route.ts`,
   `app/api/resend/webhook/route.ts`, `lib/adminCounts.ts`.
1. **Active state menu sidebar admin** (spesifikasi 12 bagian) —
   `components/admin/AdminNav.tsx` (baru) + `app/admin/(dashboard)/layout.tsx`
   + `app/globals.css`. `tsc` 0, build hijau 22 routes; logika 17/17 kasus;
   **9/9 route admin** tepat 1 menu aktif yang benar + `aria-current="page"`;
   child route `/admin/galeri/edit/[id]` terbukti (route QA sementara sudah
   dihapus); nav mobile 390px benar; sidebar tetap fixed (top 0, tetap 0
   setelah area konten di-scroll 4493px, window scroll 0); gap account
   section 24px & email 1 baris; counter Galeri "30" tetap; tanpa horizontal
   overflow; 0 console error (React #418 pre-existing).
2. **Ganti logo ke artwork baru** — `tsc` 0, build hijau, E2E kedua mode,
   keenam aset 200, tinggi header tetap 240px, 0 console error.

Task **bersihkan fragment anchor** sudah **di-commit & ter-push**
(`6cf75de` + `19a2d3c`) dan **terverifikasi live** di
`https://talentaciptakarya.com` (6 link nav → hash kosong, URL tetap `/`,
tiap section 170px dari atas, 0 console error). Task **redesign galeri
editorial + fix 2 bug** juga sudah live (`c318627` + `b61d5c4`).

**Operasi**: server lokal (`npm run start`, port 3000) boleh berjalan —
**jangan jalankan `npm run dev` bersamaan** (berbagi `.next/`).
Sisa pekerjaan berikutnya seluruhnya **konfigurasi (ops, bukan kode)**.

## KNOWN ISSUES

1. **`RESEND_API_KEY` (notifikasi aplikasi) tidak valid (401)** → email
   kontak/pendaftaran/reset password gagal terkirim. Data tetap tersimpan
   (PRD §8); kolom `statusEmail` jadi `failed`. **Email Center sudah pakai
   key sendiri** (`PANEL_RESEND_API_KEY`, valid) — jadi perbaiki hanya
   bila notifikasi aplikasi perlu hidup lagi. Jangan lupa: key itu juga
   harus disalin ke Vercel.
2. ~~**`MAIL_IMAP_*` belum diisi**~~ — **TERISI** (user, 2026-09-28).
   Inbox terbukti jalan: 22 email sync, 0 duplikat setelah 3× refresh,
   lampiran terunduh 200, flag `\Seen` bolak-balik, reply threading asli.
   **Sisa:** nilai yang sama harus disalin ke Vercel.
3. **Domain Resend sudah `verified`** (2026-09-28, `GET /domains` → 200);
   pengiriman nyata dari Email Center berhasil. MX Titan juga sudah ada
   (`mx1/mx2.titan.email`). Though ada
   `inbound-smtp.sa-east-1.amazonaws.com` (SES, **pref 9**) yang lebih dulu
   dicoba, **round trip terproof**: 3 email Resend ke `info@` benar-benar
   masuk ke mailbox Hostinger — jadi bukan blocker.
4. **Fix modal belum diverifikasi di live** `talentaciptakarya.com`.
5. **`BLOB_READ_WRITE_TOKEN` kosong** → foto masuk `public/uploads/`
   (di-gitignore) → berisiko hilang di Vercel.
6. **Doc drift**: `DEPLOY.md` masih Hostinger; `.env.example` masih SQLite;
   `README.md` merujuk file PRD yang tidak ada di repo.
7. `npm audit` 5 vulnerability — **sengaja tidak di-force-fix** (akan menarik
   next@16 / breaking change).
8. ~~**Warning parser graphify di 2 file**~~ — **SUDAH DIPERBAIKI**
   (2026-09-26): `&` mentah di teks JSX diganti `&amp;`
   (`kategori/page.tsx:19`, `JadwalManager.tsx:504`). Warning hilang, graph
   713 node. Teks tetap tampil sama.
9. **Crash `graphify update .` (`0xC0000005`) — penyebab BELUM
   teridentifikasi, sifatnya intermiten ~37%** (eksperimen 16 run
   2026-09-28: cache ada 2/5 crash, cache dipindah 2/5, hook dimatikan
   2/6). Cache, hook, dan bentrok proses **sudah terbukti BUKAN
   penyebab** — jangan dibaca ulang sebagai "solusi pindahkan cache".
   **Workaround: ulangi `graphify update .` sampai exit 0** (rata-rata
   ~2,7 run). Subcommand lain tidak pernah crash; Windows Event Log
   tidak mencatat crash ini. Fix upstream: `uv tool upgrade graphifyy`.
   Detail: `AGENTS.md` → *Troubleshooting graphify* &
   `CURRENT_STATE.md` → Issue 9.
10. Nama community graphify = nama node hub (`prisma.ts`, `data.ts`) —
    informatif, tidak wajib LLM. Bisa dilabeli semantik gratis lokal:
    `graphify label . --backend=ollama --missing-only`.
11. ~~**Upload foto di production mustahil**~~ — **SUDAH TERPECAHKAN**
    (2026-09-27): Vercel Blob aktif, upload 4 format terverifikasi 200 ke
    `*.public.blob.vercel-storage.com`, data uji sudah dibersihkan. Kode juga
    mendukung OIDC (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`).
12. Batas upload platform Vercel ±4,5 MB vs 8 MB di UI → file 4,5–8 MB
    ditolak 413. Belum ada keputusan (lihat `CURRENT_STATE.md` Issue 11).
13. Token GitHub `Tciptakarya` sempat terekspos di percakapan — sarankan
    rotasi (tidak pernah ditulis ke file).
14. **React error #418 (hydration)** di console `/admin/kategori` dan
    `/admin/program` — **pre-existing**, sudah dibuktikan identik di
    production (kode lama); bukan regresi task galeri. Halaman tetap jalan.
15. ~~**8 foto galeri belum punya `year`**~~ — **TERPANTAU SELESAI**
    (2026-09-28): galeri publik tak punya grup "Tanpa Tahun" lagi; 30
    foto semua bertahun (2026:13, 2025:4, 2024:7, 2023:5, 2022:1).
    Dilakukan admin via Edit `/admin/galeri` di luar sesi AI. Bila perlu
    dipastikan: ringkasan "belum punya tahun" di admin harus 0.
16. **Race `urutan` batch upload paralel** (`max+1` per request) bisa
    membuat 2 foto memperoleh `urutan` sama — pre-existing, bukan dari
    task tahun.
17. **Console error `staticmap.openstreetmap.de`
    `ERR_TUNNEL_CONNECTION_FAILED`** — gambar peta section Lokasi di
    homepage (resource eksternal; pre-existing, di luar scope galeri).
    Hanya muncul bila jaringan/proxy memblokir domain tersebut.
18. **Insiden 2026-09-28: `next dev` + `next start` bersamaan menghapus
    chunk produksi** — `.next/static/chunks` tinggal 1 file, semua
    `/_next/static/*` dibalas 400 → `/admin` crash "Application error"
    (`ChunkLoadError`). **Sudah diperbaiki** (build ulang + satu server).
    Pencegahan: **jangan jalankan dua server Next**; bila gejala berulang
    cek `Get-Process node` + `Get-ChildItem .next\static\chunks -Recurse
    -File`. Detail: `DECISIONS.md` → *Hanya SATU server Next pada satu
    waktu*.
19. **Status pengiriman email tidak boleh dikarang** — `sent` hanya berarti
    API Resend menerima; `delivered`/`bounced` hanya dari webhook
    (`RESEND_WEBHOOK_SECRET` + signature HMAC). Route webhook menolak semua
    event bila secret belum diisi.
20. **HTML email harus disanitasi server-side** sebelum masuk browser
    (`sanitize-html`); `cid:` ditulis ulang ke route lampiran yang cek
    `auth()` sendiri, karena `middleware.ts` hanya melindungi `/admin/*`.
21. **Jangan pakai tag `<header>` maupun `<footer>` di dalam halaman/komponen**
    (kecuali navbar/footer situs publik). `app/globals.css` punya rule
    elemen global tanpa layer: `header{position:fixed;top:0;left:0;right:0;z-index:100}`
    (± baris 131) dan `footer{background:#0F1836;padding:56px 0 28px}`
    (± baris 646). Elemen `<header>` di dalam konten akan meloncat ke atas
    layar & menutupi sidebar/form, dan `<footer>` akan jadi kotak navy.
    Sudah menimpa dua kali: kop program galeri (`c318627`) dan blok detail
    Email Center (2026-09-28). Detail: `DECISIONS.md` → *Kop program galeri
    memakai `<div>*.
22. **Email inbound tidak boleh di-hard-delete** selama sync IMAP hidup —
    pakai `deletedAt` (sembunyi), dan `lib/mail/sync.ts` harus tetap
    melewati baris itu. Draft hanya boleh menyimpan teks polos; HTML
    dibangun saat kirim. Detail: `DECISIONS.md` → *draft, hapus, dan
    pencarian akurat*.

## IMPORTANT DECISIONS

- **Jangan** pindah dari Vercel, dari PostgreSQL, ke SQLite, atau ke Hostinger.
- **Jangan** naikkan `next` (15.5.25) / `prisma` (6.19.3); pakai `npm ci`.
- Email **tidak boleh** memblokir penyimpanan data — selalu simpan dulu.
- Semua mutasi admin = Server Action di `app/admin/actions.ts` + `requireAdmin()`.
- Kategori & galeri lewat **relasi**; URL pakai **slug**; kategori terpakai
  tidak boleh dihapus (PRD §10).
- **Galeri `year`**: Int nullable di DB, **wajib di Zod** (1990…tahun+1);
  tahun lama **tidak boleh ditebak** (8 foto NULL → "Tanpa Tahun");
  grouping publik = program → tahun → foto, tanpa hardcode program/tahun.
  Detail: `DECISIONS.md` → *Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO*.
- **Style galeri = class CSS di `globals.css`, bukan utility Tailwind**
  (rule global `h1..h4` tak-ber-layer selalu mengalahkan utility; tidak
  semua token `--*` adaptif di mode gelap — `var(--navy)` justru tidak).
  CSS baru **jangan** `color: var(--navy)` → pakai utility `text-navy`
  atau `var(--color-navy)` / `var(--blue)` / `var(--mist)`. Chip jangan
  `bg-white`/`text-navy/70` (rusak di dark). Detail: `DECISIONS.md` →
  *Style galeri berupa class CSS di globals…*.
- **Kop program galeri = `<div>`, bukan `<header>`** — rule global
  `header{position:fixed…}` (`globals.css` ± baris 131) khusus navbar
  `Header.tsx`; komponen lain jangan memakai `<header>`/`<footer>` mentah
  (akan menempel di tepi kiri atas viewport). Detail: `DECISIONS.md` →
  *Kop program galeri memakai `<div>`, bukan `<header>`*.
- **Satu server Next saja** — `npm run dev` dan `npm run start` berbagi
  folder `.next/`; berjalan bersamaan membuat dev menghapus chunk
  produksi → semua `/_next/static/*` balas 400 → `/admin` "Application
  error" (insiden 2026-09-28). Detail: `DECISIONS.md` → *Hanya SATU
  server Next pada satu waktu*.
- Tidak ada payment gateway, tidak ada multi-role.
- Seed tidak boleh menimpa password admin.
- Modal pendaftaran tetap via portal.

## DO NOT CHANGE

Tanpa instruksi eksplisit dari user:

- `prisma/schema.prisma` relasi/onDelete (kecuali memang diminta fitur baru).
- Strategi slug, aturan hapus kategori, pola "simpan dulu, email kemudian".
- `package.json` versi dependensi (pinning) dan build script.
- `tsconfig.json` → `jsx: "preserve"` (jangan dikembalikan).
- `components/site/FormPendaftaran.tsx` (portal) & aturan `.reveal` di CSS.
- `prisma/seed.ts` (jangan dijadikan overwrite).
- Folder `legacy/` (arsip) dan `graphify-out/` (jangan dihapus).
- `.env` / nilai secret — jangan pernah ditulis ke file yang di-commit.
- File di luar scope tugas (mis. `DEPLOY.md`/`README.md` kecuali diminta).

## NEXT ACTION

**1. Commit (menunggu persetujuan user):** source code Email Center +
active state sidebar + logo/footer, lalu `graphify update .` (retry sampai
exit 0) dan commit `chore:` untuk `graphify-out/`.

**2. Pekerjaan non-kode (butuh akses user) - urut dari yang paling membuka
fitur:**

1. **Hentikan `next dev`** lalu `taskkill /F /IM node.exe` →
   `npm run build` (ulang, untuk penyederhanaan teks banner) →
   `npx tsc --noEmit` → `npm run start` → cek ulang `/admin/email`.
   (`next dev` + build bersamaan menghapus `BUILD_ID` - lihat
   *Known Issues* 18.)
2. **Vercel: set `CONTACT_EMAIL_FROM` = `Talenta Cipta Karya
   <info@talentaciptakarya.com>`** (langkah paling penting untuk email —
   sekarang masih `onboarding@resend.dev` → Resend HTTP 403), lalu salin
   `PANEL_RESEND_API_KEY` **dan** `MAIL_IMAP_HOST` / `_PORT` /
   `_USER` / `_PASSWORD` / `_SECURE` ke Vercel Environment Variables
   (tanpa itu Email Center produksi tidak bisa mengirim maupun menarik
   email) → Redeploy → cek `https://talentaciptakarya.com/admin/email`.
3. Daftarkan webhook
   `https://talentaciptakarya.com/api/resend/webhook` di dashboard Resend
   + isi `RESEND_WEBHOOK_SECRET` agar status delivered/bounced tercatat
   nyata.
4. Isi `RESEND_API_KEY` yang valid → notifikasi aplikasi ikut jalan.
5. Verifikasi modal pendaftaran di live.
6. Keputusan: hapus atau pertahankan 3 email uji (2 compose + 1 balas) di
   tab Terkirim beserta salinannya di Inbox.

*(Task redesign galeri + fix 2 bug: `c318627` + `b61d5c4`, live. Anchor
hash: `6cf75de` + `19a2d3c`, live. Active state sidebar + footer:
`1426e01` + `64cd322`, live.)*

## VERIFICATION

Setelah melakukan perubahan (tidak ada `lint`/`test` script di project ini):

1. `npx tsc --noEmit` → harus **0 error**.
2. `npm run build` → harus hijau (build = `prisma generate && prisma db push
   && tsx prisma/seed.ts && next build`; pastikan `DATABASE_URL` valid).
3. Test otomatis: **tidak tersedia** — verifikasi manual lewat browser.
4. `npm run start` → cek rute yang terpengaruh (publik + `/admin/*`).
5. `graphify update .` (wajib setelah ubah kode, lihat `AGENTS.md`).
6. Laporkan persis apa yang berubah, hasil tiap perintah, dan kegagalan apa
   pun apa adanya.

**Perintah gagal?** Jangan ditutupi — laporkan pesan error persisnya.

## GRAPHIFY LOW-TOKEN

Jangan baca puluhan file untuk pertanyaan arsitektur. Urutan murah (lengkap
di `AGENTS.md` → *Workflow low-token*):

```bash
graphify check-update .                                  # 1 baris
graphify god-nodes --top 8                               # ~9 baris
graphify query "<pertanyaan>" --budget 600 --context call # subgraph sempit
graphify explain "<node>"                                # file + semua pemanggil
graphify affected "<file>"                               # dampak sebelum ubah
graphify path "A" "B"                                    # alur antar node
```

Terukur: `query --budget 600 --context call` = 7 baris (vs membaca 4 file
penuh); `explain "FormPendaftaran"` = 16 baris; `god-nodes --top 8` = 9 baris.
Naikkan `--budget` hanya bila output terpotong. `Read`/`Grep` baru dipakai
setelah graph tidak menjawab.

## GIT

- Branch `main`, remote `origin` → `github.com/Tciptakarya/web-talenta`.
- Selalu `git status` + `git log --oneline -10` sebelum mengubah apa pun;
  jangan me-reset/menghapus pekerjaan user.
- Push bisa timeout di HTTP/2 → fallback:
  `git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push origin main`
- Commit message bahasa Indonesia, gaya `feat:`/`fix:`/`chore:`/`docs:`.
