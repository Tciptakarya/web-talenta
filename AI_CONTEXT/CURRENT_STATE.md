# Current State

> Dokumen ini mencerminkan kondisi **source code & infrastruktur per
> 2026-09-26** (commit `fd32dae`). Diperbarui setelah pekerjaan signifikan.

## Current Development Status

Tidak ada fitur baru yang sedang dikerjakan. Semua fitur PRD v2.1 yang
diprioritaskan sudah diimplementasi, di-commit, dan ter-push ke `main`.

Pekerjaan yang tersisa bersifat **operasional/konfigurasi** (email & DNS),
bukan penulisan kode:

1. Mengganti `RESEND_API_KEY` yang tidak valid.
2. Menambah ulang record MX Titan di Vercel DNS.
3. Verifikasi fitur pendaftaran yang sudah di-push di production.

## Last Completed Work

**Task terbaru (source code, belum di-commit): redesign UI/UX galeri publik**

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

**Tidak ada pekerjaan kode yang sedang berjalan.**

Catatan lingkungan:

- Server lokal (`npm run start`) **tidak berjalan** — shell background-nya
  dibatalkan saat restart. Jalankan ulang bila perlu verifikasi browser.
- `graphify-out/` sudah sinkron (update terakhir: tidak ada perubahan topologi).

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

**Open.** Menunggu user membuat API key baru di resend.com.

**Recommended Next Investigation**

Bukan investigasi — aksi: ganti nilai di `.env` lokal **dan** di Vercel
(Environment Variables) → restart server lokal / Redeploy → uji kirim email
reset password dan email pendaftaran. Verifikasi `statusEmail` menjadi `sent`.

### Issue 2 — Email `info@` belum tentu menerima mail (MX belum di-add ulang)

**Symptoms**

Setelah nameserver domain dipindah ke `ns1/ns2.vercel-dns.com`, record MX
bawaan Hostinger ikut hilang sehingga email masuk ke `info@` berisiko tidak
diterima.

**Suspected Cause**

Zone DNS sekarang dikelola Vercel; record MX Titan (`mx1.titan.email`,
`mx2.titan.email`) belum dibuat ulang di sana.

**Investigation Already Done**

Diketahui dari proses migrasi DNS (keputusan pindah ke Vercel, lihat
`DECISIONS.md`). Belum diverifikasi ulang dari sisi Vercel Dashboard.

**Current Status**

**Open**, menunggu akses dashboard Vercel oleh user.

**Recommended Next Investigation**

Buka Vercel → Domains → DNS Records, cek apakah MX Titan sudah ada; jika
belum, tambahkan. Lalu kirim email uji ke `info@`.

### Issue 3 — Domain pengirim Resend belum terverifikasi

**Symptoms**

`CONTACT_EMAIL_FROM` memakai `info@talentaciptakarya.com`, tetapi Resend
butuh record SPF/DKIM/DMARC di DNS sebelum domain boleh dipakai sebagai
pengirim (selain `onboarding@resend.dev`).

**Suspected Cause**

Record verifikasi Resend belum ditambahkan di Vercel DNS.

**Investigation Already Done**

Status perekaman Resend belum dicek di dashboard Resend.

**Current Status**

**Open.** Terkait Issue 1 — keduanya harus beres agar email berfungsi penuh.

**Recommended Next Investigation**

Dashboard Resend → Domains → pilih talentaciptakarya.com → salin record yang
diminta → tambahkan di Vercel DNS → tunggu status Verified.

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

### Issue 9 — `graphify update .` sesekali crash (`0xC0000005`)

**Symptoms**

Satu kali dari dua percobaan, `graphify update .` mati tanpa output dengan
exit `-1073741819` = `0xC0000005` (access violation Windows). Percobaan
ulang langsung berhasil (`EXIT=0`).

**Suspected Cause**

Bentrok proses graphify yang sama-sama menulis `graphify-out/`:

- `.codex/hooks.json` menjalankan `graphify hook-check` pada **setiap**
  panggilan Bash.
- Git hooks `post-commit` + `post-checkout` juga terpasang
  (`graphify hook status`: post-commit installed, post-checkout installed,
  merge driver registered).
- `graphify` sendiri adalah **uv tool** (`uv tool list` → `graphifyy v0.9.67`);
  `graphify.EXE` di `~/.local/bin` hanya shim 47 KB. Kegagalan ACCESS_VIOLATION
  datang dari lapisan shim/native, bukan dari kode project.

**Investigation Already Done**

- Dua kali jalankan perintah identik → 1× crash, 1× sukses, tanpa perubahan
  file di antaranya.
- Tidak ada data yang rusak: graph lama tetap tersimpan di
  `graphify-out/2026-09-26/` (backup otomatis saat rebuild).

**Current Status**

**Open, transien.** Tidak ada yang rusak: graph lama tetap tersimpan di
`graphify-out/2026-09-26/` (backup otomatis saat rebuild).

**Recommended Next Investigation**

- Ulangi perintahnya bila crash (aman, sudah terbukti idempoten).
- Bila sering terjadi: jalankan `graphify update .` di luar panggilan tool
  lain, atau nonaktifkan hook sementara
  (edit `.codex/hooks.json` / `graphify hook status`) agar tidak ada dua
  proses graphify bersamaan.
- Bila berulang: `uv tool upgrade graphifyy` (terpasang 0.9.67).

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
categories 8 · programs 11 · gallery 12 · testimonials 2
jadwal 0 · pendaftaran 0 · materi 0 · pesan 0
admin 1 · passwordResetToken 2 (sisa uji coba)
```

## Broken Features

- **Kirim email (semua jenis)** — tidak berfungsi karena `RESEND_API_KEY`
  tidak valid (Issue 1). *Penyimpanan data tidak terpengaruh* — fitur
  pendaftaran/kontak tetap bekerja penuh, hanya notifikasi emailnya yang
  hilang.
- **Upload foto ke Blob** — `BLOB_READ_WRITE_TOKEN` kosong, jadi foto jatuh ke
  `public/uploads/` (folder ini di-gitignore → foto hilang di produksi bila
  tidak dikonfigurasi). Secara lokal fiturnya jalan.

## Current Blockers

**No known blockers.**

(Tidak ada yang menghalangi pengembangan kode. Issue di atas bersifat
konfigurasi luar: API key Resend dan record DNS.)

## Exact Next Step

**Ganti `RESEND_API_KEY` lama dengan key baru dari resend.com, di dua tempat:
`.env` lokal dan Vercel Environment Variables, lalu Redeploy.**

Urutan konkret:

1. User membuat API key baru di dashboard resend.com (dan menyelesaikan
   verifikasi domain → Issue 3).
2. Update nilai `RESEND_API_KEY` di `.env` lokal → restart server lokal.
3. Update env yang sama di Vercel → **Redeploy**.
4. Uji: minta reset password di `/admin/forgot-password` → email harus
   terkirim; isi form pendaftaran → cek `/admin/pendaftaran` →
   `statusEmail` = `sent`.
5. Sambil di sana, verifikasi fix modal di live
   `https://talentaciptakarya.com` (Issue 4) dan tambahkan MX Titan
   (Issue 2).

Setelah itu, kembali ke `TODO.md` bagian **Next**.
