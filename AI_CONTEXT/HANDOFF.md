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

- HEAD `b61d5c4` **sudah ter-push & live**; isi: `chore:` refresh
  `graphify-out/` (`b61d5c4`) dan task **redesign galeri editorial +
  fix 2 bug review** (`c318627` source + `AGENTS.md` + `AI_CONTEXT/`).
  Ter-deploy ke `talentaciptakarya.com` & terverifikasi live (0 console
  error).
- **Working tree berisi 1 task baru (BELUM di-commit): bersihkan fragment
  anchor dari address bar** — `components/site/AnchorHashCleaner.tsx`
  (baru) + `app/(public)/layout.tsx`, plus `AGENTS.md` & `AI_CONTEXT/`.
  Teruji penuh di localhost, menunggu persetujuan user untuk commit.
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

**Task terbaru (source code, SUDAH ter-push `c318627` + `b61d5c4`, LIVE
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

Tidak ada task kode yang sedang dikerjakan. Task **redesign galeri
editorial + fix 2 bug** sudah **di-commit** (`c318627` + `b61d5c4`),
**ter-push**, dan **terverifikasi live** di
`https://talentaciptakarya.com` (3 kop program `position: static` tanpa
tumpang-tindih, 7 baris tahun / 3 terbuka, tanpa overflow, 0 console
error). `git status` bersih.

**Operasi**: server lokal (`npm run start`, port 3000) boleh berjalan —
**jangan jalankan `npm run dev` bersamaan** (berbagi `.next/`).
Sisa pekerjaan berikutnya seluruhnya **konfigurasi (ops, bukan kode)**.

## KNOWN ISSUES

1. **`RESEND_API_KEY` tidak valid (401)** → semua email gagal. Data tetap
   tersimpan (PRD §8); kolom `statusEmail` jadi `failed`. Perlu key baru di
   `.env` lokal **dan** Vercel → Redeploy.
2. **MX Titan belum di-add ulang di Vercel DNS** → email `info@` berisiko
   tidak diterima setelah pindah nameserver.
3. **Domain Resend belum terverifikasi** (record SPF/DKIM/DMARC belum ada di
   Vercel DNS) → `CONTACT_EMAIL_FROM` `info@` belum boleh dipakai.
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

**1. Pekerjaan non-kode (butuh akses user):** ganti `RESEND_API_KEY`
(resend.com) di `.env` lokal dan di Vercel, lalu Redeploy → uji email
reset password di `/admin/forgot-password` → email terkirim; isi form
pendaftaran → `/admin/pendaftaran` → kolom `statusEmail = sent`; tambah
MX Titan di Vercel DNS (Issue 2) + verifikasi domain Resend (Issue 3);
sambil memverifikasi modal pendaftaran di live.

*(Task redesign galeri + fix 2 bug selesai: `c318627` + `b61d5c4`, sudah
ter-push dan terverifikasi live. Task galeri `PROGRAM → TAHUN → FOTO`
sebelumnya: `368d947` + `6accd2a`, juga live.)*

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
