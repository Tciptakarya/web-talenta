# Changelog

Semua entri di bawah berasal dari **history git yang terverifikasi**
(`git log`, 26 commit, 2026-09-23 → 2026-09-26). Riwayat sebelum
2026-09-23 tidak ada di repo ini, jadi tidak dicatat agar tidak mengarang.

Format: tanggal · isi · hash commit.

---

## [2026-10-02] — Artwork favicon: navy rounded-square + feather putih

### Changed

- **Favicon di-redesign** (user pilih **opsi A** dari tiga pilihan yang
  ditawarkan): navy rounded-square `#16214A` (radius 112/512) + feather
  **putih** di dalamnya. Alasan: feather biru di atas dasar transparan praktis tak
  terbaca di 16×16 — ukuran yang dipakai mesin pencari di hasil pencarian.
  Aset yang di-generate ulang: `public/favicon.png` + `app/icon.png` (512),
  `public/apple-touch-icon.png` (180, **full-bleed** karena iOS sendiri yang
  memotong sudutnya), `app/favicon.ico` (16/32/48/256).
- **Logo header/footer tidak disentuh** — `public/logo.png` (80.838 B) dan
  `public/logo-inverse.png` (77.126 B) diverifikasi tetap sama setelah
  perubahan.

### Added

- `assets/favicon-feather.png` — artwork feather asli (biru + goresan)
  disimpan sebagai sumber. Folder `assets/` **tidak ter-deploy** (bukan
  `public/`), hanya untuk regenerasi.
- `prisma/generate-favicon-assets.ts` — skrip generator (idempoten, memakai
  `sharp` yang sudah jadi dependensi project). Jalankan manual:
  `npx tsx prisma/generate-favicon-assets.ts`. Preseden:
  `prisma/backfill-gallery-year.ts`.

### Technical Notes

- **Jebakan sharp yang sudah dilewati:** `extractChannel(3)` mengembalikan
  gambar *grayscale* 1 kanal — nilainya ada di channel abu-abu, **bukan** di
  alpha. Kalau langsung dipakai sebagai mask dengan blend `dest-in`, hasilnya
  **kotak putih solid** (alpha mask selalu opaque). Yang benar: ambil alpha
  sebagai data mentah (`raw().toBuffer({ resolveWithObject: true })`), lalu
  susun ulang jadi RGBA putih dengan alpha = data tersebut.
- Skrip tidak bisa memakai tipe `sharp.OverlayOptions` karena `sharp`
  memakai `export =` (bukan namespace import) — pakai `const parts = []` saja.
- Verifikasi lokal: `/favicon.ico` → 200 `image/x-icon` 15.049 B,
  `/favicon.png` & `/icon.png` → 200 `image/png` 22.617 B,
  `/apple-touch-icon.png` → 200 `image/png` 4.357 B. `npx tsc --noEmit` 0
  error, `npm run build` hijau.

---

## [2026-09-28] — Admin Email Center (`/admin/email`)

### Fixed

- **Ikon globe generik di hasil pencarian Google** (dilaporkan user via
  screenshot) — penyebabnya bukan gambar logo: **`/favicon.ico` di domain
  mengembalikan 404** karena tidak pernah ada file `.ico`. Mesin pencari
  mengambil favicon lewat jalur `/favicon.ico` di root domain (bukan lewat
  `<link rel="icon">`), lalu jatuh ke ikon default. `public/favicon.png`
  sendiri sehat (200, `image/png`).
  Perbaikan: `app/favicon.ico` (konvensi Next.js → tersaji di `/favicon.ico`),
  dibuat dari `public/favicon.png` dengan 4 ukuran (16/32/48/256, PNG di dalam
  ICO). Verifikasi lokal: `/favicon.ico` → **200 `image/x-icon` 12,5 KB**, dan
  Next menyuntik `<link rel="icon" href="/favicon.ico" sizes="16x16">`.
  **Catatan jujur**: feather biru di atas dasar transparan nyaris tak
  terbaca pada 16×16 (terbukti lewat render 16/32/48 yang diperbesar 8×) —
  itu sebabnya artwork favicon dibuat ulang pada 2026-10-02 (lihat entri
  berikutnya). Perubahan di hasil pencarian baru terlihat setelah Google
  meng-crawl ulang (biasanya beberapa hari–minggu), bukan seketika.

### Added

- **`AI_CONTEXT/PRD_DESIGN_MIGRASI.md`** — kontrak desain untuk pembaruan
  tampilan berikutnya. Isinya: design system saat ini **terukur dari kode**
  (12 token warna, Fraunces + Plus Jakarta Sans, 2 sistem styling berdampingan,
  breakpoint yang dipakai), **empat masalah nyata** yang harus diperbaiki
  (jebakan CSS global tanpa `@layer` yang sudah merusak halaman 2×, token
  ukuran yang belum ada, gaya tersebar, dark mode parsial), 6 prinsip desain,
  **rencana migrasi 5 tahap** (aman → polish), 7 aturan wajib saat migrasi,
  dan checklist *definisi selesai*. Dihubungkan dari `README.md` (sekalian
  menutup doc drift: README sebelumnya merujuk `PRD-Talenta-Cipta-Karya.md`
  yang tidak ada di repo), `AGENTS.md` (wajib dibaca sebelum kerja tampilan),
  dan `ARCHITECTURE.md`.

- **Admin > Tampilan Website** (`/admin/konten`) — seluruh **teks statis
  website publik** bisa diedit dari panel admin tanpa menyentuh kode.
  10 bagian / **68 field**: Hero, Tentang Kami, Visi & Misi, Layanan, Jadwal,
  Galeri, Lokasi, Testimoni, Kontak, Navbar & Footer (label menu + hak cipta).
  - Nilai bawaan = isi website saat ini, jadi tabel `SiteContent` boleh tetap
    kosong dan situs tidak pernah gagal render. Hanya nilai yang **berbeda**
    dari bawaan yang disimpan (mengosongkan = kembali ke bawaan).
  - Format aman: `**tebal**`, `*miring*`, baris baru = pemisah baris.
    `renderInline()` melakukan escape HTML **lebih dulu** — dibuktikan
    `<script>alert(1)</script>` tampil sebagai teks biasa, 0 elemen
    `<script>` di DOM, 0 console error.
  - Perubahan langsung berlaku karena `revalidatePath("/", "layout")` membuang
    cache ISR saat admin menyimpan (terverifikasi: teks baru tampil tanpa
    menunggu jendela 60 detik).
  - Kolom diisi **nilai efektif** (nilai tersimpan bila ada, kalau tidak nilai
    bawaan) + badge "diubah" + tombol "Kembalikan ke bawaan".
  - Skema `SiteContent { key @id, value, updatedAt, updatedBy? }` (additive);
    registry + fungsi di `lib/siteContent.ts`; komponen render `Rich.tsx`;
    komponen admin `KontenEditor.tsx`; 2 Server Action
    (`saveContentAction`, `resetContentAction`).
  - Komponen publik yang sekarang menerima prop `c: ContentMap`:
    `HeroAbout`, `Layanan`, `JadwalTerdekat`, `Kontak`, `Lokasi`,
    `Testimoni`, `Header`, `Footer`, `app/(public)/page.tsx`,
    `app/(public)/layout.tsx`.

- **Draft** — tab baru **Draft** (dengan jumlah draft di label), tombol
  **"Simpan Draft"** pada form compose/reply/teruskan, dan **"Edit Draft"**
  (membuka draft langsung mengisi form To/Cc/Bcc/Subjek/Isi). Draft
  **dihapus otomatis setelah berhasil terkirim**. Draft hanya menyimpan
  teks polos (HTML dibangun saat kirim) dan **tidak menyimpan lampiran** —
  UI memberi tahu kalau ada lampiran saat draft disimpan. Tanpa autosave
  (keputusan user).
- **Hapus email** — tombol **Hapus** di panel detail dengan konfirmasi.
  Email **masuk** hanya *disembunyikan* (`deletedAt`) karena aslinya masih
  ada di mailbox; bila dihapus permanen, email itu muncul lagi setiap
  Refresh. Email **keluar** & **draft** dihapus permanen (lampiran ikut
  terhapus). `lib/mail/sync.ts` kini melewati baris yang punya `deletedAt`,
  jadi email tersembunyi tidak pernah dibangkitkan lagi.
- **Pencarian akurat** (`lib/mail/search.ts`) — kata kunci dipecah per spasi
  dan digabung **AND** (dulu frasa utuh sehingga "deployment vercel" = 0
  hasil); setiap kata boleh cocok di subjek, pengirim, **To/Cc/Bcc**, isi,
  pratinjau, atau **nama lampiran**; operator `from:`, `to:`,
  `subjek:`/`subject:`, `dengan:lampiran`, `lampiran:ya|tidak` (nilai boleh
  berkutip); kata yang cocok **disorot** dengan elemen React `<mark>` (bukan
  `dangerouslySetInnerHTML`); ringkasan jumlah hasil & bantuan operator
  ditampilkan di bawah kolom cari.
- `EmailMessage.deletedAt DateTime?` + index baru (additive).

### Changed

- Tab Email Center: Inbox · **Terkirim** · **Draft**; total per tab ikut
  pencarian; pesan "Tidak ada email yang cocok" saat pencarian nihil.


  detail email, tab **Terkirim**, form **Tulis Email** (To/Cc/Bcc/Subjek/
  Lampiran), **Balas** (penerima + subjek `Re:` terisi otomatis), dan
  **Teruskan**. Ditambah pencarian (pengirim, subjek, isi), filter
  (Semua / Belum Dibaca / Sudah Dibaca; Semua / Berhasil / Gagal), pagination
  20 per halaman, tombol `↻ Refresh`, dan penanda read/unread.
- **Cache email masuk di database**: model `EmailMessage`
  (`messageId` @unique anti-duplikasi, `direction`, `status`, `isRead`,
  `htmlBody`, `resendId`, `referencesText`) + `EmailAttachment` (metadata
  lampiran; isi file diambil on-demand dari IMAP, tidak disimpan di DB).
  Sync IMAP → DB dengan batas 50, default 20 pesan.
- **Lampiran**: masuk — download lewat route terproteksi auth yang
  mengambil file dari IMAP; keluar — validasi jumlah (maks 5), ukuran
  (maks 8 MB/berkas), nama file, dan ekstensi berisiko (`.exe`, `.bat`,
  `.js`, `.apk`, dll. ditolak).
- **Status pengiriman yang jujur**: `sent` = API Resend menerima;
  `delivered`/`bounced`/`failed` hanya diisi dari webhook Resend
  (`/api/resend/webhook`, verifikasi HMAC `resend-signature`).
- **Route API terproteksi**: `/api/admin/email/attachment/[id]` (401 tanpa
  sesi admin) dan `/api/resend/webhook` (503 bila secret belum diisi).
- **Badge unread** pada menu "Email" di sidebar admin, bersumber dari
  `lib/adminCounts.ts` (sumber tunggal untuk semua badge admin).
- **Dependensi** (disetujui user): `imapflow@2.1.0`, `mailparser@3.9.29`,
  `sanitize-html@2.17.7`, `@types/mailparser`, `@types/sanitize-html`.
- Env baru didokumentasikan di `.env.example`: `PANEL_RESEND_API_KEY`,
  `RESEND_WEBHOOK_SECRET`, `MAIL_IMAP_*`, `MAIL_IMAP_TIMEOUT_MS`.

### Changed

- `lib/resend.ts` — ditambah `sendPanelEmail()` (To/Cc/Bcc, attachment,
  header `In-Reply-To`/`References` untuk threading sungguhan) memakai key
  `PANEL_RESEND_API_KEY` → fallback `RESEND_API_KEY`. Modul email existing
  dipakai ulang, tidak ada service/provider kedua.
- `app/admin/actions.ts` — 3 Server Action baru: `syncEmailInboxAction`,
  `setEmailReadAction`, `sendEmailAction` (semua lewat `requireAdmin()`).
- `lib/schemas.ts` — `emailSendSchema` + batas lampiran + pembersihan nama
  berkas.
- `app/admin/(dashboard)/layout.tsx` & `components/admin/AdminNav.tsx` —
  menu "Email" + badge unread; angka badge sekarang dari `adminNavCounts()`.
- `prisma/schema.prisma` — 2 model baru (additive, `prisma db push` tanpa
  kehilangan data).

### Fixed

- **"Email gagal dikirim." tanpa penjelasan** (dilaporkan user via
  screenshot, 2026-09-28) — semua kegagalan Resend (401/403/422/429)
  sebelumnya ditampilkan sebagai kalimat generik yang sama, sehingga admin
  tidak tahu harus memperbaiki apa. Sekarang `panelErrorMessage()` di
  `lib/resend.ts` memberi pesan yang menunjuk perbaikannya (mis. "API key
  Resend tidak valid. Perbarui `PANEL_RESEND_API_KEY`…" untuk 401, dan
  "Alamat pengirim ditolak Resend. Ganti `CONTACT_EMAIL_FROM`…" untuk 403),
  pesan asli tetap di-log server, dan alasannya tersimpan di
  `EmailMessage.errorMessage`. Ditambah **peringatan sebelum kirim** di form
  compose bila `CONTACT_EMAIL_FROM` masih `onboarding@resend.dev`
  (pengirim uji yang hanya boleh mengirim ke email pemilik akun).
  **Akar masalah di production (dibuktikan lewat uji API Resend):**
  `from: onboarding@resend.dev` → **403** *"You can only send testing emails
  to your own email address (info@…). …change the `from` address to an
  email using this domain"*, dan `RESEND_API_KEY` lama → **401** *"API key
  is invalid"*. Verifikasi lokal: banner muncul saat `CONTACT_EMAIL_FROM`
  di-override ke `onboarding@resend.dev`; pesan 403 & 422 tampil spesifik;
  setelah dikembalikan ke `info@…` banner hilang dan kirim nyata kembali
  berhasil. 0 console error.
- **Bug 1**: `?tab=compose` tidak menampilkan form compose — navigasi
  client-side tidak me-remount komponen sehingga nilai `useState` awal tidak
  berlaku. Mode form sekarang di-derive dari prop `tab`.
- **Bug 2**: parameter `email=1` ikut terhapus dari URL (aturan "reset
  `page=1`" ikut diterapkan ke semua key), sehingga email **pertama** di
  daftar tidak bisa dibuka.
- **Bug 3 (dilaporkan user via screenshot)**: panel detail email menimpa
  sidebar admin dan form Tulis Email tidak bisa diketik. Penyebab: blok
  kop email memakai `<header>` dan blok tombol bawah memakai `<footer>`,
  yang keduanya kena rule elemen global di `app/globals.css`
  (`header{position:fixed;top:0;left:0;right:0;z-index:100}` dan
  `footer{background:#0F1836;padding:56px 0 28px}`) milik navbar/footer
  situs publik. Akibatnya `<header>` melompat ke `0,0` selebar layar
  (teks From/To/Received/Status tergambar di atas menu sidebar) dan
  menutupi form saat di-scroll, sedangkan `<footer>` berubah jadi kotak navy
  gelap. Keduanya diganti `<div>` + komentar penjelas. Terverifikasi pada
  viewport 1920px: blok header `position:static` di dalam panel (tidak lagi
  menimpa sidebar), footer transparan, dan keempat kontrol form
  (`To`, `Subject`, `Message`, `Kirim`) terdeteksi sebagai elemen teratas di
  titiknya (`elementFromPoint`) serta bisa diketik.

### Verified (draft, hapus, pencarian)

- **Draft**: "Simpan Draft" → pesan "Draft tersimpan", pindah ke tab Draft,
  draft tampil dengan penerima+subjek benar; dibuka → form "Edit Draft"
  terisi lengkap (To, Cc, Subjek, Isi, `draftId`); ditambah isi lalu
  "Kirim Email" → terkirim, pindah ke tab Terkirim, dan **draft hilang**
  (dihapus otomatis). Draft dengan lampiran → peringatan "Lampiran tidak
  ikut tersimpan di draft".
- **Hapus**: email terkirim → "Email terkirim dihapus dari daftar" (permanen);
  draft → "Draft dihapus" + daftar kosong dengan pesan "Belum ada draft";
  email masuk → "Email disembunyikan dari daftar" lalu **setelah Refresh
  (20 email diproses) email itu tidak muncul lagi**.
- **Pencarian**: "deployment vercel" → **5 hasil** + 19 kata tersorot
  (sebelumnya 0); "mensch" → 0; `from:notifications` → 5;
  `from:notifications deployment` → 4 (AND); `dengan:lampiran` → 1;
  "catatan-uji" (nama lampiran) → 1; "zzzqqq" → 0 + pesan nihil.
- **Regresi**: detail email tetap benar (header `DIV`/static, footer
  transparan, tanpa overlap sidebar, tanpa horizontal overflow di 1920px),
  tombol detail = Balas/Teruskan/Tandai/Hapus, badge unread = 6,
  mobile 390px tanpa overflow dengan tombol Simpan Draft ada,
  0 console error (kecuali 1 resource eksternal, lihat Known Issues).

### Performance

- Peta lokasi (`components/site/Lokasi.tsx`) diberi `loading="lazy"` — sebelumnya
  request ke `staticmap.openstreetmap.de` berada di jalur render awal padahal
  petanya ada di bawah lipatan; sekarang tidak menghambat render dan tetap
  jatuh ke kartu alamat + "Buka di Maps" bila gagal dimuat.
- **Hasil investigasi kecepatan situs** (diukur, bukan dugaan; detail di
  `CURRENT_STATE.md` → Issue 13): penyebab sebenarnya adalah **fungsi Vercel
  berjalan di `iad1` (US East) sementara database Neon berada di Singapura**,
  jadi setiap query database melintasi samudra. Bukti: TTFB homepage produksi
  **1,26–2,18 s** vs lokal **0,13–0,19 s** dengan kode yang sama. Yang
  **bukan** penyebab: bandwidth pengunjung, database itu sendiri (20 ms), dan
  "banyak request image optimizer" (273 rujukan `_next/image` itu `srcSet`,
  bukan 273 request). Sisa perbaikannya di dashboard Vercel (set region fungsi
  ke `sin1`), bukan di kode.

### Performance — cache 60 detik untuk halaman publik

- Empat halaman publik (`/`, `/kelas`, `/kelas/[slug]`, `/program/[slug]`)
  sekarang memakai `export const revalidate = 60`; dua rute `[slug]` juga
  memakai `dynamic = "force-static"` — **tanpa itu Next 15 tetap mengirim
  `no-store`** (terbukti lewat header sebelum/sesudah). `/admin/*` tetap
  `force-dynamic`.
- **Hasil (lokal)**: `/` 130–190 ms → **3,5 ms** (`x-nextjs-cache: HIT`);
  `/kelas/barista` 520 ms → **5,5 ms**. Header:
  `s-maxage=60, stale-while-revalidate=31535940`.
- **Data tetap segar**: `revalidatePath("/", "layout")` di
  `app/admin/actions.ts` sudah dipanggil pada setiap mutasi admin, jadi
  perubahan dari Admin langsung membuang cache. Basi hanya mungkin bila tidak
  ada perubahan admin selama 60 detik.
- Verifikasi: 404 untuk slug ngawur tetap 404 di kedua rute; 4 halaman
  publik benar di browser (judul, header/footer, galeri, jadwal, tanpa
  horizontal overflow) dan **0 console error**; hanya rute publik yang masuk
  `prerender-manifest`, rute admin tidak.

### Technical Notes

- Arsitektur: **Hostinger = inbound (IMAP), Resend = outbound** — dipisah
  tegas, tanpa provider baru dan tanpa SMTP kedua. Admin UI hanya bicara
  dengan database, tidak pernah IMAP dari browser. Keputusan lengkap di
  `DECISIONS.md`.
- HTML email tidak dipercaya: disanitasi di **server** dengan
  `sanitize-html` (buang `script`, `iframe`, `form`, `on*`,
  `javascript:`, CSS berbahaya); gambar `cid:` ditulis ulang ke route
  lampiran yang cek `auth()` sendiri karena `middleware.ts` hanya
  melindungi `/admin/*`.
- `middleware.ts` hanya melindungi `/admin/:path*`, jadi route
  `/api/admin/email/*` melakukan cek `auth()` sendiri (terverifikasi 401).
- Verifikasi lokal (`npm run start` + sesi admin): `tsc` 0; build hijau
  (24 routes); 2 email terkirim nyata (`Status: Terkirim · Ref
  01a0e6be-8515-7e3e-b028-9a0ebb20067c`); lampiran `catatan-uji.txt`
  terkirim; `virus.exe` ditolak; pencarian benar; `PANEL_RESEND_API_KEY`
  valid (`GET /domains` → 200) dan domain `talentaciptakarya.com`
  **verified**; tidak ada pola `re_*`/`PANEL_RESEND_API_KEY`/
  `MAIL_IMAP_PASSWORD` di chunk browser; mobile 390px tanpa horizontal
  overflow; 0 console error.
- **Belum terverifikasi**: ~~Inbox, read/unread, reply threading, dan
  download lampiran inbound~~ — **SUDAH terverifikasi** setelah user mengisi
  `MAIL_IMAP_*` (lihat di bawah). Tidak ada mock/fake data.

### Verified (INBOUND, setelah kredensial IMAP diisi user)

- **Sync nyata**: 22 email terbaca dari mailbox Hostinger
  (`notifications@vercel.com`, `info@`, dst.). **0 duplikat setelah 3×
  refresh** → `messageId` unik bekerja; 0 email tanpa Message-ID.
- **Lampiran inbound terunduh** dari IMAP: HTTP **200**,
  `Content-Disposition: attachment; filename="catatan-uji.txt"`,
  `text/plain`, isi identik dengan berkas yang diunggah.
- **Balas (reply)** terisi otomatis (To terkunci, subjek dari email asal) dan
  terkirim dengan header threading **asli**: `inReplyTo`, `referencesText`,
  dan `threadId` = Message-ID email asal; subjek menjadi `Re: ...`. Email
  compose tetap `inReplyTo = null` (tidak ada threading palsu).
- **Read/unread** tersimpan di database **dan** disinkronkan ke flag `\Seen`
  mailbox: menandai "belum dibaca" menaikkan badge sidebar 7 → 8 dan state
  bertahan setelah refresh.
- **Round trip terproof**: 3 email yang dikirim lewat Resend ke
  `info@talentaciptakarya.com` **masuk kembali ke Inbox** (salah satunya
  menjadi inbound "Re: Tes Email Center dengan lampiran") → outgoing Resend
  benar-benar diterima mailbox Hostinger, sehingga kekhawatiran MX
  (`inbound-smtp.sa-east-1.amazonaws.com` pref 9) bukan blocker.
- **Sanitasi HTML dunia nyata** (email notifikasi Vercel, 8.186 karakter):
  0 `<script>`, 0 `<iframe>`, 0 `<form>`, 0 handler `on*`, tanpa
  `javascript:`, 0 `<style>`; 6 link dipaksa
  `rel="noopener noreferrer nofollow" target="_blank"`.
- Pencarian "deployment" → 4 hasil; `↻ Refresh` → "Inbox diperbarui
  (20 email diproses)"; 0 console error.
- Banner "email masuk belum aktif" disederhanakan menjadi satu kalimat
  (tanpa nama variabel env, tanpa pengulangan).

### Known Issues (Email Center)

- **Gambar eksternal di body email dimuat browser** — email yang dikirim
  lewat Resend berisi piksel pelacak
  (`https://tck.talentaciptakarya.com/CI0/...`); saat admin membuka detail,
  browser mencoba memuatnya. Bila domain tersebut tidak terjangkau →
  1 `ERR_CONNECTION_CLOSED` di console, dan secara teknis membocorkan IP +
  waktu buka email ke pengirim. Belum diblokir (sengaja: belum diminta);
  pilihan perbaikan = blokir `img` eksternal & tampilkan tautan "tampilkan
  gambar".
- Widget React #418 di `/admin/program` & `/admin/kategori` tetap
  pre-existing, tidak terkait fitur ini.
- Temuan DNS: MX `inbound-smtp.sa-east-1.amazonaws.com` (pref 9) lebih dulu
  dicoba daripada MX Titan (pref 10/20) → perlu dipastikan ke mana email
  masuk benar-benar mendarat.
- `npm audit` tetap 5 vulnerability (tidak bertambah).

Belum di-commit (menunggu persetujuan user).

---

## [2026-09-28] — Active state sidebar, logo, dan anchor hash

Commit: `c318627` + `b61d5c4` (redesign galeri + fix 2 bug),
`6cf75de` + `19a2d3c` (bersihkan fragment anchor),
`1426e01` + `64cd322` (active state sidebar + plat putih footer) —
semuanya ter-push ke `main` & terverifikasi live di
`https://talentaciptakarya.com` (0 console error).

### Changed

- **Active state menu sidebar admin ditambahkan** (spesifikasi 12 bagian
  user) — sebelumnya menu admin **tidak punya active state sama sekali**
  (hanya `hover:bg-white/10`), jadi user tidak bisa pasti sedang di halaman
  mana. Menu admin dipindah dari `app/admin/(dashboard)/layout.tsx` ke
  **client component `components/admin/AdminNav.tsx`** — sumber tunggal untuk
  sidebar desktop (`variant="sidebar"`) dan nav mobile
  (`variant="mobile"`), jadi tidak ada copy-paste gaya per halaman.
  Active state dari **`usePathname()`** (App Router yang sudah dipakai, tanpa
  sistem routing baru): `/admin` aktif hanya persis, menu lain juga untuk
  child route-nya (`/admin/galeri/edit/123` → Galeri), dari kandidat yang
  cocok diambil yang **terpanjang** sehingga tidak pernah ada dua menu aktif,
  path dinormalisasi (garis miring akhir dibuang), plus
  `aria-current="page"`. Ganya di `app/globals.css` (tak-ber-layer, satu
  pola): aktif = `rgba(255,255,255,.14)` di atas navy yang sudah ada (palette
  sidebar tidak diganti), teks `#fff`, weight 700, radius 8px, transisi
  `.18s`; **indikator Option A** = garis vertikal 3×18px `var(--gold)` di
  sisi kiri (satu jenis saja, tanpa dot); hover `rgba(255,255,255,.07)`
  **sengaja lebih lemah** dari active; fokus keyboard
  `outline:2px solid var(--gold)`; `prefers-reduced-motion` sudah ikut dari
  rule global. Counter (angka Galeri + badge emas Pesan/Pendaftaran) tidak
  berubah — hanya warnanya naik kontras saat aktif (`.admin-nav-count`).
  Verifikasi: `npx tsc --noEmit` 0 error, `npm run build` hijau 22 routes;
  logika active state **17/17 kasus** lolos (termasuk trailing slash, route
  tak dikenal, dan prefix mirip yang tidak boleh aktif); **9/9 route admin**
  → tepat 1 menu aktif yang benar + `aria-current` sesuai; **child route
  `/admin/galeri/edit/[id]` terbukti** memakai route QA sementara yang
  sudah dihapus; nav mobile 390px → aktif benar, counter tetap,
  sidebar tersembunyi; sidebar tetap fixed (top 0, tinggi = viewport, tetap
  0 setelah area konten di-scroll 4493px, window scroll 0); gap account
  section 24px & email 1 baris (tidak berubah); tanpa horizontal overflow;
  0 console error (React #418 di `/admin/program` = pre-existing). Regresi
  publik `/` & `/kelas/barista` tetap 0 error.
- **Logo situs diganti ke artwork baru (2 varian)** — `public/logo.png`
  (wordmark **teks gelap**, untuk latar terang) dan
  `public/logo-inverse.png` (wordmark **teks putih** + biru di-*mixing* 40%
  ke putih, untuk latar gelap). Keduanya 805×800 PNG transparan, ±80 KB,
  dari sumber `Downloads/Logo Talenta/Logo no background.png`
  (5226×5226, sudah ada alpha) → `trim` → `resize({height: 800})`.
  `Header` merender keduanya lalu menukar via CSS
  (`.logo-on-light` / `.logo-on-dark` + `:root.dark`); `Footer` memakai
  varian inverse karena footer selalu navy `#0F1836` di kedua mode.
  **Bug lama ikut tertutup**: sebelumnya logo berteks hampir hitam
  nyaris tak terlihat di footer navy (dan di header saat mode gelap),
  karena `header` transparan di atas latar gelap. Terverifikasi: mode
  terang → `logo.png` (sampel piksel wordmark 83), mode gelap →
  `logo-inverse.png` (sampel 151), footer → inverse; tinggi header tetap
  240px (tanpa layout shift), 201×200 px, tanpa overflow, 0 console
  error.
  **Plat putih di footer dihapus** (requested user setelah lihat hasilnya):
  `.footer-brand` sebelumnya punya `background:#fff` + `padding:14px 26px` +
  `border-radius:18px` + `box-shadow` — sisa desain lama saat logo masih
  ber-teks gelap. Setelah footer memakai varian logo **putih**, plat putih
  membuat wordmark putih tak terlihat (hanya feather biru yang tampak).
  Sekarang `.footer-brand` hanya `display:flex; align-items:center;
  width:fit-content` → logo duduk langsung di atas navy `#0F1836`. Terverifikasi
  mode gelap & terang (footer navy di keduanya): `background:transparent`,
  `box-shadow:none`, `padding:0`, kotak brand pas seukuran logo (85×84),
  wordmark putih (sampel piksel 151–160), tanpa overflow, 0 console error.
  **Favicon ikut diperbarui** (keputusan user): `public/favicon.png` +
  `app/icon.png` → 512×512 transparan berisi **feather saja** (potongan
  atas artwork; lockup penuh tidak terbaca di 32px), dan
  `public/apple-touch-icon.png` → 180×180 **latar putih opak** untuk iOS
  (tidak mendukung transparan), dipakai lewat `icons.apple` di
  `app/layout.tsx`. Kelima aset terverifikasi 200 dari server lokal
  (`/favicon.png`, `/apple-touch-icon.png`, `/logo.png`,
  `/logo-inverse.png`, `/icon.png`) dan link tag ikon di HTML benar.
- **Fragment anchor dibersihkan dari address bar** — klik link section
  (`#visimisi`, `#galeri`, dst) tidak lagi menampilkan `#...` di address
  bar; URL tetap `https://talentaciptakarya.com`. Keputusan user; detail
  di `DECISIONS.md`. Cara: link **tetap** anchor native + komponen baru
  `components/site/AnchorHashCleaner.tsx` (client component, render
  `null`, satu listener `click` di `document`) memanggil
  `history.replaceState` 150 ms setelah navigasi fragment; dimount di
  `app/(public)/layout.tsx`. Yang dipertahankan: smooth scroll +
  `scroll-margin-top:170px`, deep-link (`/#galeri` masih bisa
  dibuka/share), Ctrl+click buka tab baru, navigasi keyboard, dan tombol
  Back yang memulihkan posisi. Dilewati: link ke section **halaman lain**
  (`/kelas/foo#jadwal`) serta klik dengan modifier. Teruji localhost: 4
  titik klik (nav header, nav footer, tombol hero, CTA "Hubungi Kami")
  → hash kosong & section mendarat 170px dari atas; Ctrl+click hash tetap;
  `history.back()` memulihkan posisi (5983 → 0); deep-link `/#galeri`
  tetap membawa hash; regresi `/`, `/kelas`, `/kelas/barista`,
  `/program/pelatihan-barista`, `/admin` → 0 crash, 0 overflow,
  0 console error.
- **Redesain visual galeri publik ke gaya editorial/premium minimal**
  (`components/site/GalleryGrid.tsx`, `app/globals.css`,
  `app/(public)/kelas/[slug]/page.tsx`) mengikuti spesifikasi 21 bagian
  user — struktur/data/lightbox/filter tidak berubah, hanya tampilan:
  - **Chip filter** pindah dari utility Tailwind ke class **`.gal-chip`**:
    tinggi 27px, padding 6×14px, idle `--paper-alt` + border `--line` +
    `--ink`, hover `--paper` + border `--color-navy`, aktif
    `--color-navy` + putih, `:focus-visible` outline `--gold`.
  - **Kop program editorial** — `.gallery-program` (garis `--line`),
    `.gallery-program-title` (Fraunces uppercase **clamp 22–30px**,
    600, tracking .05em), `.gallery-program-kategori` ("Kategori · …"
    11px uppercase tracking .16em, `--blue`).
  - **Baris tahun editorial** — thumbnail foto pertama tiap tahun
    (64×48 desktop / 52×39 mobile, `loading="lazy"`, **tanpa perubahan
    DB**), label Fraunces 18–20px, jumlah foto `--mist`, panah `→`/`↑`
    (geser 3px saat hover), hover tint netral, garis dasar 1px `--line`,
    **garis aktif 2px `--color-navy`** dengan `padding-bottom`
    dikompensasi (13+2 = 14+1 = 15px → tidak ada layout jump), `:focus-visible`
    emas.
  - **Judul galeri** `.gallery-title` → `clamp(30px, 4vw, 48px)`
    (spesifikasi: 40–52 desktop / 30–36 mobile); aturan `color` dihapus
    — warna diserahkan ke utility `text-navy` / `:root.dark h2`.
  - Kartu foto radius 14 → **12px**, hover scale 1.03 → **1.02 (0.2s)**,
    caption dilemaskan (12,5px/600 + gradient lebih pendek), aturan
    `prefers-reduced-motion` (animasi & transisi dimatikan).

### Fixed

- **Judul program tidak memakai ukuran/berat yang dituju** — rule global
  **tak-ber-layer** `h3{font-size:1.17em}` dan `h1..h4{font-weight:700;
  letter-spacing:-0.01em}` di `globals.css` selalu mengalahkan utility
  Tailwind (ber-layer) berapa pun spesifikasinya → h3 terukur
  18,72px/700. Solusi: pindahkan tipografi kop program ke class CSS
  tak-ber-layer `.gallery-program-title`/`.gallery-program-kategori`
  (terukur 25,6px @800px, 30px @≥1024px, 600, uppercase ✓).
- **Warna tak terlihat di mode gelap** — `.year-label`, garis baris
  terbuka, jumlah & panah aktif memakai `var(--navy)` yang **tidak ikut
  di-reset blok `:root.dark`** (#16214A di atas bg #0E1322 = tak
  terbaca; garis aktif juga sempat tak membedakan diri). Diperbaiki:
  label → utility `text-navy` (`:root.dark .text-navy` → putih),
  garis/jumlah/panah aktif → `var(--color-navy)` / `var(--blue)` yang
  **memang adaptif**; spesifikasi hover label dinaikkan
  (`.year-row .year-toggle:hover .year-label`, 4 komponen) agar menang
  atas override `:root.dark`.
- **Chip idle tidak terbaca di mode gelap** — `text-navy/70` (≈1,6:1)
  + `bg-white` yang diblokir `:root.dark .bg-white` (hover jadi mati)
  → diganti `.gal-chip` dengan token yang ikut berubah.
- **Kop program galeri menumpuk di tepi kiri atas viewport** — kop
  ditulis sebagai `<header className="gallery-program">` dan kena rule
  global tak-ber-layer `header{position:fixed; top:0; left:0; right:0;
  z-index:100; padding:20px 0}` (khusus navbar `components/site/Header.tsx`)
  → kedua kop (Pelatihan Barista + Kursus Komputer) jadi fixed di kiri
  atas, saling menumpuk, dan garis pembatasnya tampak seperti coretan
  melintasi teks navbar. Fix: elemen diganti **`<div>`** (di dalam
  `<section aria-label>` sudah cukup untuk struktur; `<header>` di posisi
  ini tidak memberi nilai aksesibilitas). Teruji: 2 kop `position:
  static`, docTop 3428 & 4406 (flow, tidak tumpang-tindih), `left:32px`
  dalam container, gap chip→kop 32px, garis→label tahun 27px; mode
  terang h3 `rgb(22,33,74)` @30px + h2 47.36px / mode gelap h3
  `rgb(236,239,249)`; **0 console error**.
- **Crash `/admin` "Application error: a client-side exception has
  occurred while loading"** — **bukan bug kode**: `npm run dev` (port
  3001) dijalankan bersamaan dengan `npm run start` (port 3000) di folder
  yang sama → `next dev` menimpa `.next/` (±12:30:33: `.next/static/chunks`
  tersisa 1 file `polyfills.js`, seluruh chunk produksi terhapus) → server
  produksi membalas **400** untuk semua `/_next/static/*` → reproduksi:
  `ChunkLoadError: Loading chunk 631 failed`
  (`app/admin/(dashboard)/pendaftaran/page-1b3be6771a0b55c3.js`). Fix:
  `taskkill /F /IM node.exe` (kedua server), `npm run build` ulang (40
  file chunk pulih), jalankan **hanya satu** server. Teruji: 8/8 script di
  HTML `/admin/pendaftaran` → **200** (sebelumnya 400 semua), navigasi
  klien `/admin` → klik "Pendaftaran" normal, direct load
  `/admin/pendaftaran` ✓, sapuan `/admin`, `/admin/galeri`,
  `/admin/program`, `/admin/pesan` → **0 crash** (hanya React #418
  pre-existing di `/admin/program`).

### Technical Notes

- Verifikasi: `npx tsc --noEmit` **0 error**; `npm run build` **hijau**
  (`taskkill /F /IM node.exe` lebih dulu); browser E2E localhost:
  pengukuran per elemen di **mode gelap DAN terang** (chip, h3, label,
  garis, jumlah, panah, kop, thumb — semua terbaca di kedua mode),
  akordeon (default tahun terbaru terbuka; klik 2025 → panel + 4 foto,
  `scrollYDelta = 0`), filter chip (section tersaring → kembali "Semua"),
  lightbox (klik foto → fokus pindah ke close → Escape → tertutup,
  body unlock, **fokus kembali ke foto**), regresi `/kelas/barista`
  (single group: tanpa chip & kop program, H1→H2→H3→H2, 0 alt kosong)
  dan `/admin/galeri` (30 kartu) → **0 console error**.
- 8 breakpoint via iframe same-origin (1920/1440/1366/1024/768/430/390/
  360): kolom **4/4/4/3/2/2/2/2**, h2 48→30px, h3 program 30→22px,
  label 20/18px, thumb 64/52px, gap 14/10px, chip wrap 2 baris di
  mobile, container 1360px, **tanpa horizontal overflow di semua lebar**.
- Limitasi environment: **key event trusted (Tab/Enter/Escape) tidak
  terkirim** selama desktop window tak terlihat oleh harness (sama dengan
  `browser.screenshot` yang gagal) — handler Escape divalidasi via
  dispatch KeyboardEvent ke `document` (jalur
  `document.addEventListener("keydown")` yang sama); jalur Enter = native
  `<button onClick>` yang identik dengan klik teruji & sudah lolos uji
  trusted key di task sebelumnya.
- Console error non-galeri: `staticmap.openstreetmap.de`
  `ERR_TUNNEL_CONNECTION_FAILED` (section Lokasi — pre-existing, di luar
  scope, tidak disentuh).
- **Data berubah di luar sesi ini**: 8 foto `year = NULL` tampaknya sudah
  diisi admin via Edit — galeri tak punya grup "Tanpa Tahun" lagi
  (2026:13, 2025:4, 2024:7, 2023:5, 2022:1 = 30); grouping beradaptasi
  otomatis tanpa ubah kode (bukti requirement "tanpa hardcode").
- **Insiden operasional (pelajaran untuk agent berikutnya)**: `next dev`
  dan `next start` **berbagi folder `.next/`** — berjalan bersamaan membuat
  dev menghapus chunk produksi → 400/`ChunkLoadError` yang menyerupai bug
  kode ("client-side exception"). Bedakan: kalau **SEMUA** `/_next/static/*`
  membalas 400 dan `Get-ChildItem .next\static\chunks -Recurse -File`
  tinggal sedikit → aset build hilang, bukan kode. Aturan: **satu server
  Next saja** (`DECISIONS.md` → *Hanya SATU server Next pada satu waktu*).
- Elemen `<header>` mentah kena rule global navbar `header{position:fixed…}`
  (`globals.css` ± baris 131) — di komponen lain pakai `<div>`;
  `components/site/Header.tsx` satu-satunya pemakai `<header>` yang sah.
- E2E awal tidak menangkap bug kop karena pengukuran hanya mengecek
  computed style (font/warna) **bukan posisi elemen**, dan screenshot
  harness gagal (window tak terlihat). Untuk elemen struktural, verifikasi
  `getComputedStyle(...).position` + `getBoundingClientRect` (docTop/
  tumpang-tindih) — bukan gaya saja.
- Komentar JSX `{/* … */}` **tidak boleh** ditaruh di dalam ekspresi
  `{kondisi && ( … )}` — di posisi expression itu di-parse sebagai object
  literal → `npx tsc` gagal (TS1005/TS1382). Pindahkan komentar ke atas
  ekspresinya.
- **Crash `graphify update .` (`0xC0000005`) — dikarakterisasi, penyebab
  belum teridentifikasi**: 16 run terkontrol (2026-09-28) → 6 crash
  (~37%): cache ada 2/5, cache dipindah 2/5, hook `PreToolUse` dimatikan
  2/6 → rate **identik**, jadi cache & hook **terbukti bukan penyebab**
  (hipotesis "pindahkan cache" yang sempat ditulis sebelumnya
  **dibatalkan**). Gejala selalu sama: 0 baris output, `graphify-out/`
  tidak berubah; Windows Event Log tidak mencatatnya; subcommand lain
  (`--version` / `god-nodes` / `check-update .`) tidak pernah crash.
  Workaround: **ulang sampai exit 0** (rata-rata ~2,7 run); fix upstream
  `uv tool upgrade graphifyy`. `AGENTS.md` → *Troubleshooting graphify* &
  `CURRENT_STATE.md` → Issue 9.
- `graphify update .` exit-1 transien sekali (crash `0xC0000005` yang
  sudah diketahui) → retry hijau: **776 node / 1320 edge / 48 community**,
  backup `graphify-out/2026-09-28/`.
- Terverifikasi live di `talentaciptakarya.com`: 6 link nav (`Tentang
  Kami`, `Visi & Misi`, `Layanan`, `Galeri`, `Lokasi`, `Testimoni`) →
  hash kosong, URL tetap `/`, tiap section 170px dari atas,
  **0 console error**.

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
- Commit `368d947` (source + `AI_CONTEXT/`) + `6accd2a` (graphify-out) —
  **sudah ter-push & ter-deploy**; live diverifikasi di
  `talentaciptakarya.com` (publik: `#galeri-utama` + chips `Semua (30)` +
  accordion tahun; admin: 30 kartu bertahun, ringkasan "8 belum punya
  tahun"; 0 console error).

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
