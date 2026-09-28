# PRD — Migrasi Desain Visual

**Produk:** Talenta Cipta Karya (LPK & LKP) · **Versi dokumen:** 1.0
**Tanggal:** 2026-09-28 · **Status:** Aktif · **Pemilik:** Admin TCK
**Berlaku untuk:** seluruh halaman publik (`app/(public)/**`) dan panel admin
(`app/admin/**`)

> Dokumen ini adalah kontrak desain untuk project ini. Semua perubahan
> tampilan **wajib** mengikuti dokumen ini. Sebelum mengubah tampilan, baca
> bagian §4 (jebakan teknis) dan §8 (definisi selesai) — keduanya bagian
> yang paling sering menimbulkan bug.

---

## 1. Tujuan

1. **Punya satu bahasa desain yang tertulis** — sehingga pembaruan tampilan
   berikutnya tidak lagi berdasarkan tebakan atau insting, melainkan
   berdasar aturan yang ada di dokumen ini.
2. **Menghilangkan sumber bug tampilan yang sudah terbukti** — ada tiga
   jebakan CSS global yang sudah dua kali merusak halaman (lihat §4.1).
3. **Memudahkan AI agent / developer berikutnya** — aturan, token, dan
   langkah migrasi ada di satu tempat, bukan tersebar di `globals.css`.
4. **Menjaga apa yang sudah baik** — identitas visual navy–gold, tipografi
   Fraunces + Plus Jakarta Sans, dan nuansa "profesional & hangat" tidak
   boleh hilang tanpa keputusan eksplisit.

## 2. Ruang lingkup

**Termasuk:**

- Tampilan halaman publik: hero, tentang kami, visi & misi, layanan,
  jadwal, galeri, lokasi, testimoni, kontak, navbar, footer.
- Panel admin: sidebar, tabel, form, tombol, kartu, status, modal.
- Dark mode (light & dark) untuk keduanya.
- Tipografi, warna, jarak, radius, bayangan, transisi, responsif.

**Tidak termasuk (tetap seperti decided):**

- Isi/data dinamis (program, jadwal, galeri, testimoni, kategori) — itu
  urusan database & Admin, bukan desain.
- Struktur URL, SEO meta yang sudah ada, dan alur registrasi.
- Identitas logo (artwork milik TCK, tidak boleh diganti tanpa persetujuan).

## 3. Design system saat ini (baseline — fakta terukur)

Semua angka di bawah **diukur dari kode**, bukan perkiraan.

### 3.1 Token warna (`app/globals.css:7-20` dan `:root`)

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `--navy` | `#16214A` | Sidebar admin, hero, section gelap, aksen utama |
| `--blue` | `#2C4A9E` | Teks link/aksen terang, `--color-blue` |
| `--blue-bright` | `#4E7FF0` | Hover, state aktif |
| `--gold` | `#D8A23D` | Aksen premium, kicker, indikator aktif, CTA |
| `--gold-dim` | `#f0d9a8` | Latarbadge/peringatan |
| `--paper` | `#F5F7FC` | Latar halaman |
| `--paper-alt` | `#FFFFFF` | Kartu putih, section alternatif |
| `--ink` | `#1C2333` | Teks utama |
| `--mist` | `#7C8AA8` | Teks sekunder/meta |
| `--line` | `#E1E6F2` | Border |
| `--shadow` | `0 20px 50px -25px rgba(22,33,74,0.35)` | Bayangan kartu besar |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Kurva transisi |

Dark mode memakai **kelas** (`:root.dark`, Tailwind `@custom-variant dark`),
bukan `prefers-color-scheme`. Tombol ThemeToggle menulis kelas itu ke `<html>`.

### 3.2 Ikon & favicon

- `app/favicon.ico` — konvensi Next.js, tersaji di `/favicon.ico`. **WAJIB
  ada**: mesin pencari (Google) mengambil favicon lewat `/favicon.ico` di root
  domain, bukan lewat `<link rel="icon">`. Tanpa file ini, hasil pencarian
  menampilkan **ikon globe generik** (insiden 2026-09-28).
- `app/icon.png` + `public/favicon.png` (512×512, feather) — untuk tab browser
  modern.
- `public/apple-touch-icon.png` (180×180, latar putih) — untuk iOS.
- Ukuran dalam `.ico`: 16/32/48/256.
- **Known issue**: artwork feather terlalu tipis sehingga praktis tak terbaca
  pada 16×16. Perbaikannya butuh **artwork favicon khusus ukuran kecil**
  (mis. latar navy + feather putih, atau silhouette yang lebih tebal) — belum
  dikerjakan karena menyangkut keputusan brand.

### 3.3 Tipografi

- Display/judul: **Fraunces** (`--font-display`, variable `--font-fraunces`)
- Body/UI: **Plus Jakarta Sans** (`--font-sans`, variable `--font-jakarta`)
- Dimuat lewat `next/font/google` di `app/layout.tsx` (self-hosted, tanpa
  request ke Google saat runtime).
- Skala judul utama: `clamp()` — contoh `.section-head h2`
  `clamp(30px, 3.6vw, 44px)` (`globals.css:258`).

### 3.4 Struktur & pola

- **Dua sistem styling berjalan berdampingan:**
  - Halaman publik: ~125 selector kelas buatan sendiri di `globals.css`
    (`.hero`, `.about-grid`, `.gal-chip`, `.map-frame`, …).
  - Panel admin: utility Tailwind inline di JSX
    (`rounded-xl border border-line bg-white`, `text-mist`, `font-display`).
- `@theme` Tailwind v4 menyatukan nama warna agar utility
  (`bg-navy`, `text-mist`, `border-line`) tersedia di kedua sisi.
- Breakpoint yang dipakai di media query: **1180, 980, 860, 760, 640, 420px**.
- `section[id], div[id] { scroll-margin-top: 170px }` — wajibffi dipertahankan
  karena navbar `position:fixed`.
- Halaman publik di-cache **ISR 60 detik** (lihat `DECISIONS.md`).
- Teks statis publik bisa diedit dari **Admin > Tampilan Website**
  (registry `lib/siteContent.ts`).

## 4. Masalah yang harus diperbaiki saat migrasi

Bagian ini berbasis insiden nyata, bukan preferensi.

### 4.1 Jebakan CSS global tanpa `@layer` (KRITIS)

`globals.css` memuat selector elemen **di luar layer Tailwind**, jadi
mengalahkan utility class dan ikut memengaruhi elemen mana pun:

| Baris | Rule | Dampak |
| --- | --- | --- |
| `131` | `header{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0}` | Elemen `<header>` **di konten** meloncat ke atas layar & menutupi sidebar/form |
| `646` | `footer{background:#0F1836;color:#8B98BE;padding:56px 0 28px}` | Elemen `<footer>` di konten jadi **kotak navy** |
| `30-35` | `h1..h6{font-size:...}` | Mengalahkan `text-2xl` & sejenisnya |
| `81` | `section{position:relative}` | Berpengaruh pada konteks posisi elemen |
| `62,67,79,80` | `img`, `a`, `p`, `button` | Mempengaruhi spacing/line-height tanpa disengaja |

**Insiden yang sudah terjadi (2×):** kop program galeri (2026-09-27) dan blok
detail email (2026-09-28). Keduanya diperbaiki dengan mengganti tag ke
`<div>`, bukan dengan memperbaiki CSS-nya.

**Aturan untuk selama migrasi:** pakai `<div>`, bukan `<header>`/`<footer>`,
untuk blok di dalam konten. Saat migrasi, rule tersebut harus dipindah ke
`.site-header` / `.site-footer` (lihat §6 Tahap 1).

### 4.2 Belum ada token ukuran

`--radius`, `--space`, `--text-*`, `--font-size` **belum ada**; ukuran
ditulis langsung di dalam class (mis. `padding:104px 0`, `gap:64px`,
`font-size:16.5px`). Akibatnya perubahan skala tampilan haruscca_edit banyak
tempat dan mudah tidak konsisten.

### 4.3 Gaya tersebar

Hanya 5 inline `style={{...}}` tersisa, tetapi masih ada penggunaan warna
hex langsung (mis. `#3B4568`, `#C4CDE8`, `#E9EDF9`) yang tidak bernama token.
Semakin banyak migrasi, semakin besar godaan menambah hex baru.

### 4.4 Dark mode belum lengkap

Beberapa elemen mode gelap ditangani dengan override manual
(`:root.dark .text-navy`, `.logo-on-light`/`.logo-on-dark`), sebagian besar
logika terang/gelap masih di utility `dark:*` per komponen.

## 5. Arah desain yang diocok (prinsip)

1. **Satu sumber kebenaran untuk nilai** — semua warna, radius, jarak, dan
   ukuran font come dari token. Tidak ada hex baru di dalam komponen.
2. **Konsistensi lebih penting daripada membuat komponen baru** - komponen
   yang sama harus
   tampil sama di semua halaman.
3. **Aksesibel sebagai default** — kontras teks minimal 4.5:1, target sentuh
   minimal 44px di mobile, fokus keyboard selalu terlihat, dark mode bukan
   sekadar "warna dibalik".
4. **Gerak punya alasan** — transisi maksimal 200ms, dan
   `prefers-reduced-motion` dihormati.
5. **Perubahan visual harus reversible** — bisa dikembalikan ke tampilan lama
   hanya dengan mengubah token, bukan dengan menulis ulang komponen.
6. **Konten lebih penting daripada dekorasi** — teks yang bisa diedit admin (Tampilan Website)
   tidak boleh pecah format bila diedit (mis. judul tidak boleh terpotong
   karena `white-space:nowrap`).

## 6. Rencana migrasi bertahap

Setiap tahap boleh dikerjakan terpisah & dikirim terpisah.

| Tahap | Isi | Risiko | Selesai bila |
| --- | --- | --- | --- |
| **1. Amankan CSS** | Pindahkan rule `header`/`footer` global ke `.site-header`/`.site-footer`; bungkus `h1..h6` & aturan preflight lain ke `@layer base` | Sedang | Halaman publik & admin identik dengan sebelum (dicek light + dark, desktop + mobile) |
| **2. Token ukuran** | Tambah `--radius-*`, `--space-*`, `--text-*`, `--shadow-*` di `@theme`; ganti pemakaian hardcode bertahap | Sedang | Tidak ada `font-size:`/`padding:` angka yang bisa diganti token, per section |
| **3. Primitif UI** | Bentukkan komponen dasar: `.btn` (primary/ghost/cream), `.card`, `.badge`, `.field`, `.section-head` — dipakai bersama oleh publik & admin | Sedang | Tombol/card/form seragam di kedua sisi |
| **4. Admin** | Rapikan panel admin agar konsisten dengan primitif (bukan utility inline di tiap file) | Sedang | Daftar admin terasa satu sistem |
| **5. Polish visual** | Jarak, rasio, ilustrasi, animasi halus sesuai tujuan brand | Rendah | Tidak ada perubahan fungsional |

> Setiap tahap **wajib** disertai: `npx tsc --noEmit` = 0, `npm run build`
> hijau, dan pemeriksaan browser di **light & dark** serta **desktop (1440px)
> & mobile (390px)**.

## 7. Aturan yang berlaku saat migrasi (wajib dipatuhi)

1. **Jangan pakai tag `<header>` / `<footer>` di dalam konten** — gunakan
   `<div>`. (`DECISIONS.md` → *Kop program galeri memakai `<div>`*.)
2. **Angka ukuran baru wajib pakai token**; hex warna baru wajib ditambah
   sebagai token lebih dulu.
3. **Jangan mengubah perilaku** (scroll, filter, submit, validasi) saat
   redesign —PR dan pemisahan ini disengaja agar mudah di-review.
4. **Teks publik yang bisa diedit admin harus tetap aman** — kalau butuh
   bold/italic, pakai `**tebal**` / `*miring*`; jangan HTML.
5. **Hormati `prefers-reduced-motion`** untuk animasi baru.
6. **Jaga `scroll-margin-top:170px`** pada target anchor selama navbar tetap
   fixed.
7. **Verifikasi dark mode** — perubahan warna tidak boleh membuat teks
   gelap di atas latar gelap (pola yang sudah pernah diperbaiki di
   `.gallery-program`, lihat komentar di `globals.css` §"Teks berwarna navy").

## 8. Definisi selesai (DoD) untuk satu perubahan tampilan

- [ ] `npx tsc --noEmit` → 0 error
- [ ] `npm run build` → hijau
- [ ] Browser: light & dark, desktop & mobile, tanpa horizontal overflow
- [ ] Tidak ada elemen yang menutupi/terpotong (khususnya bug §4.1)
- [ ] `aria-current`, `aria-label`, dan fokus keyboard tetap benar bila
      navigasi berubah
- [ ] Konsol browser bersih (kecuali resource eksternal yang memang sudah
      tercatat bermasalah)
- [ ] `AI_CONTEXT/` diperbarui: `CHANGELOG.md` (Added/Changed/Fixed),
      `ARCHITECTURE.md` bila struktur berubah, `DECISIONS.md` bila ada
      keputusan desain
- [ ] Mockup disimpan di `mockups/` bila perubahannya besar (preseden:
      `mockups/pendaftaran-wireframe.html`)

## 9. Referensi

- `app/globals.css` — implementasi design system saat ini
- `legacy/` — situs statis asal (v0) yang jadi sumber desain v1
- `mockups/` — tempat menyimpan wireframe/rancangan sebelum diprogotiarkan
- `AI_CONTEXT/DECISIONS.md` — keputusan desain yang sudah dikunci
- `AI_CONTEXT/ARCHITECTURE.md` — struktur halaman & komponen
- `AGENTS.md` — aturan kerja wajib untuk AI agent
