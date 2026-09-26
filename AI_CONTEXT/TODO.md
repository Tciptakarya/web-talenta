# TODO

Disusun dari kondisi source code, konfigurasi, dokumentasi, dan riwayat git
yang ada — **bukan dari asumsi**. Terakhir dicek: 2026-09-26 (HEAD `fd32dae`).

## Critical

- [ ] **Ganti `RESEND_API_KEY` yang tidak valid** — di `.env` lokal **dan** di
      Vercel Environment Variables, lalu Redeploy. Saat ini semua email
      (reset password, notifikasi kontak & pendaftaran) gagal dengan
      `401 API key is invalid`. Data tetap tersimpan, hanya notifikasinya
      hilang. (`CURRENT_STATE.md` → Issue 1)
- [ ] **Tambah ulang record MX Titan (`mx1.titan.email`, `mx2.titan.email`) di
      Vercel DNS** — setelah pindah nameserver ke Vercel, email masuk ke
      `info@` berisiko tidak diterima. (`CURRENT_STATE.md` → Issue 2)
- [ ] **Selesaikan verifikasi domain Resend di Vercel DNS** (record
      SPF/DKIM/DMARC) — syarat agar `CONTACT_EMAIL_FROM`
      `info@talentaciptakarya.com` boleh dipakai. (`CURRENT_STATE.md` → Issue 3)

## In Progress

- Tidak ada pekerjaan yang sedang berjalan.

## Next

- [ ] **Verifikasi fix modal pendaftaran di production** — buka
      `https://talentaciptakarya.com`, klik **Daftar** pada tabel jadwal:
      modal harus terpusat dan tidak menimpa tabel. (Sudah diverifikasi hanya
      di `localhost:3000`; commit `fd32dae` sudah ter-push.)
- [ ] **Uji kirim email end-to-end setelah key diganti** —
      1) `/admin/forgot-password` → email reset masuk;
      2) isi form pendaftaran → cek `/admin/pendaftaran` → kolom
      `statusEmail` = `sent` (bukan `failed`).
- [ ] **Uji alur pendaftaran di production** — saat ini row `JadwalPelatihan`
      di database = 0, jadi tabel jadwal publik kosong dan alur pendaftaran
      belum bisa dicoba end-to-end tanpa membuat jadwal dulu di
      `/admin/jadwal`.

## Planned

- [ ] **Konfigurasi `BLOB_READ_WRITE_TOKEN` di Vercel** — token lokal masih
      kosong (`""`), sehingga foto jatuh ke `public/uploads/` yang masuk
      `.gitignore`. Di Vercel (filesystem ephemeral) foto hasil upload bisa
      hilang. Buka Vercel → Storage → Blob → Environment Variables → Redeploy.
- [ ] **Perbarui dokumentasi yang menyimpang** (hanya bila diminta):
      `DEPLOY.md` masih menjelaskan deploy Hostinger, `.env.example` masih
      menyebut SQLite/`prisma/dev.db`, `README.md` merujuk file
      `PRD-Talenta-Cipta-Karya.md` yang tidak ada di repo.
      (`CURRENT_STATE.md` → Issue 5)

## Bugs

- [ ] `npm audit` melaporkan 5 vulnerability. **Sengaja tidak
      di-force-fix** — `npm audit fix --force` menarik `next@16` dan versi
      Prisma yang menyebabkan breaking change. Audit ulang hanya jika versi
      Next/Prisma dinaikkan secara sadar.
- [ ] `graphify update .` sesekali crash `0xC0000005` — transien, aman diulang;
      dugaan akar: `graphify hook-check` (PreToolUse hook di `.codex/hooks.json`)
      berjalan bersamaan dengan `graphify update .`.
      (`CURRENT_STATE.md` → Issue 9)
- [ ] Nama community graphify diganti otomatis sesuai node hub (`prisma.ts`,
      `data.ts`, dst). **Opsional**: bisa diberi nama semantik gratis di lokal
      dengan `graphify label . --backend=ollama --missing-only` (model
      `qwen2.5-coder:7b` sudah terpasang) — tanpa API key.
- [ ] 2 baris `PasswordResetToken` lama masih ada di database (sisa uji coba)
      — bisa dibersihkan; tidak berbahaya karena token sudah kedaluwarsa/terpakai.
- [ ] Token GitHub akun `Tciptakarya` sempat terekspos di riwayat percakapan —
      disarankan user memutarnya (tidak pernah ditulis ke file mana pun).

## Technical Debt

- [ ] Tidak ada perintah `lint` dan `test` di `package.json` — verifikasi
      harus memakai `npx tsc --noEmit` + `npm run build` + pemeriksaan browser.
      Pertimbangkan menambahkan ESLint bila diinginkan.
- [ ] `prisma/dev.db` (SQLite) masih ada di disk tapi sudah tidak dipakai —
      sisa dari sebelum pindah ke PostgreSQL.
- [ ] Semua mutasi admin menumpuk di satu file `app/admin/actions.ts`
      (26 export) — mulai besar; bisa dipecah per resource bila terus bertambah.
- [ ] `lib/rateLimit.ts` in-memory per-instance → reset saat cold start
      (sudah disengaja; lihat `DECISIONS.md`).
- [ ] Dokumentasi dipisah 3 tempat (`README.md`, `DEPLOY.md`, `AI_CONTEXT/`)
      dengan informasi tumpang tindih — sumber kebenaran baru adalah
      `AI_CONTEXT/`.

## Completed

Berdasarkan history git (terverifikasi):

- [x] **4 perbaikan minor admin** (belum di-commit):
      1. Email admin 1 baris (`text-[11px]` + `title`,.ukur empiris 148/160px)
      2. Ikon theme toggle terlihat di sidebar navy
        (`.admin-sidebar .theme-toggle` di `app/globals.css`)
      3. Mobile 375px & tablet 820px terverifikasi via iframe same-origin
      4. Workaround `EPERM` build didokumentasikan di `AGENTS.md`
- [x] **Sidebar admin fixed + account section global**
      (`app/admin/(dashboard)/layout.tsx`) — wrapper `md:h-dvh` +
      `md:overflow-hidden`, konten scroll independen, account section
      menempel bawah di **9/9 halaman** terverifikasi di browser; tombol
      Keluar berfungsi; mobile tidak berubah (belum di-commit)

- [x] **Dokumentasi handoff `AI_CONTEXT/` (7 file) + aturan
      "Setelah Menyelesaikan Task" di `AGENTS.md`** (belum di-commit)
- [x] **Workflow low-token graphify** (8 langkah + cheatsheet flag) di
      `AGENTS.md`, `HANDOFF.md`, `DECISIONS.md` (belum di-commit)
- [x] **Fix parser graphify: `&` → `&amp;` di teks JSX**
      (`app/admin/(dashboard)/kategori/page.tsx`,
      `components/admin/JadwalManager.tsx`) — warning 2 file hilang, graph
      709 → 713 node, tsc 0 error, build hijau 22 routes, teks ter-render
      identik (belum di-commit)

- [x] Layout publik: navbar + footer, CRUD jadwal/materi, materi disembunyikan
      dari publik, audit visual — `cce1a08` (2026-09-25)
- [x] Fix CSS `/kelas` (judul center, chip aktif putih) — `f0e8cd6` (2026-09-25)
- [x] Input tanggal jadwal sekali jalan, hari diturunkan otomatis —
      `054d5dc`, `5778886`, `e861792` (2026-09-25)
- [x] Halaman detail `/program/[slug]` (perbaiki 404 link Selengkapnya) —
      `2ee5844` (2026-09-25)
- [x] Fitur pendaftaran jadwal: form publik, kuota kursi, inbox admin —
      `87f0e9b` + wireframe `af975b7` (2026-09-25)
- [x] Admin galeri: edit inline, multi upload, urutan foto — `9b82ae2` (2026-09-25)
- [x] Galeri publik: filter per program + navigasi lightbox — `256c2dc` (2026-09-25)
- [x] Lupa password admin: token aman 30 menit sekali pakai + rate limit +
      email Resend — `c5f9298` (2026-09-23)
- [x] Login admin → `info@talentaciptakarya.com`; seed hanya membuat akun
      bila belum ada — `5f69ea4` (2026-09-23)
- [x] Provider Prisma diganti ke `postgresql` untuk deploy Vercel —
      `8e9393f` (2026-09-23)
- [x] Kategori dinamis, dark mode, ganti password admin — `b975fd7` (2026-09-23)
- [x] Graphify 0.9.36 → 0.9.67 + git hooks + merge driver — `8d0e33f` (2026-09-24)
- [x] `tsconfig.json` `jsx: "preserve"` — `08f8123` (2026-09-26)
- [x] Contoh `CONTACT_EMAIL_FROM` disesuaikan spec §8 — `c1bd70b` (2026-09-26)
- [x] Refresh graphify-out — `7973d8a`, `3902062`, `1a3dd33`, `c4195fe`,
      `a7208e0`, `00ce248`, `29cab50`, `12a1b6f`
- [x] **Fix modal pendaftaran via portal ke body** — `fd32dae` (2026-09-26)
- [x] Terdeploy live di `https://talentaciptakarya.com` (Vercel free, DNS
      nameserver Vercel; GitHub Pages repo dinonaktifkan)
- [x] Verifikasi menyeluruh: `npx tsc --noEmit` 0 error, `npm run build`
      hijau (22 routes), alur login/lupa-password/9 halaman admin/publik
      dicek di browser
