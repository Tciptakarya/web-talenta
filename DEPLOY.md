# 🚀 Panduan Publish — Hostinger Web Apps + Resend

Panduan lengkap menerbitkan website **talentaciptakarya.com** (Next.js + SQLite)
di **Hostinger Web Apps** (managed Node.js), dengan notifikasi email **Resend**.

## Ringkasan arsitektur produksi

| Komponen | Posisi di produksi | Alasan |
| --- | --- | --- |
| Kode | Folder deploy `~/domains/<domain>/nodejs` (di-clone Hostinger dari GitHub / ZIP) | Di-build & dijalankan otomatis Hostinger |
| **Database SQLite** | `~/domains/<domain>/site.db` — **di LUAR folder deploy** (`DATABASE_URL=file:../../site.db`) | Deploy/redeploy Hostinger hanya menyentuh folder deploy → database **tidak pernah hilang/tertimpa**. Juga tidak bisa diakses dari web (web root hanya `public_html`). |
| Foto seed (12 foto galeri) | `public/images/gallery/` — ikut repo | Sudah di-commit → selalu ikut deploy |
| Foto upload admin | Vercel Blob (disarankan) atau `public/uploads/` | Blob di luar hosting → dijamin aman dari redeploy |
| Akun admin | Dibuat otomatis saat build pertama dari env `ADMIN_EMAIL`/`ADMIN_PASSWORD`, sesudah itu diganti dari dashboard | Hosting managed **tanpa akses shell** — tidak ada script manual |

> Build Hostinger otomatis menjalankan: `npm install` → `prisma generate` →
> `prisma db push` → `seed` → `next build` → `next start`.
> Seed bersifat **create-only** — tidak menimpa editan konten atau password.

---

## Langkah 0 — Prasyarat

1. **Paket hosting yang mendukung Web Apps**: di hPanel → *Websites* harus terbaca
   **Business Web Hosting** atau **Cloud** (Startup/Professional/Enterprise).
   Paket Personal/Premium atau "Email + Domain" saja **belum cukup** — kalau belum,
   upgrade dulu lewat hPanel.
2. Domain `talentaciptakarya.com` siap (di Hostinger atau registrar lain).
3. `git` terpasang di komputer Anda (untuk push; cek: `git --version`).
   Akun **GitHub** gratis — opsional tapi disarankan.

---

## Langkah 1 — Siapkan kode (pilih A atau B)

Kode proyek sudah diinisialisasi Git di komputer Anda (commit lokal).

### Opsi A — GitHub (disarankan: auto-deploy setiap push)

```bash
# buat repo kosong baru di github.com (Public/Private bebas), lalu:
git remote add origin https://github.com/USERNAME_ANDA/talentaciptakarya.git
git push -u origin main
```

Di Hostinger nanti pilih **Import Git repository** → hubungkan akun GitHub → pilih repo.

### Opsi B — ZIP via hPanel (tanpa GitHub)

```powershell
# dari folder proyek — git archive hanya memuat file yang di-commit
git archive -o deploy.zip HEAD
```

File `.env`, `prisma/*.db`, `node_modules`, `.next` **tidak ikut** (sengaja —
nilai produksi diisi lewat hPanel, bukan file).

---

## Langkah 2 — Buat aplikasi di hPanel

1. hPanel → **Websites → Add Website → Node.js web app**.
2. Sumber: **Import Git repository** (Opsi A) atau **Upload your files** → `deploy.zip` (Opsi B).
3. Review settings (sebagian terdeteksi otomatis):

   | Field | Nilai |
   | --- | --- |
   | Framework preset | `Next.js` (deteksi otomatis dari `package.json`) |
   | Branch | `main` |
   | Node.js version | `22` |
   | Root directory | `/` (repo di root) |
   | Build command | `build` (default — script-nya sudah mencakup generate + db push + seed) |
   | Output directory | `.next` |
   | Entry file | biarkan kosong (Hostinger menjalankan `next start` otomatis untuk Next.js) |

4. **Environment variables** — klik *Add* untuk tiap baris (jangan import `.env` lokal!):

   | Key | Value | Keterangan |
   | --- | --- | --- |
   | `AUTH_SECRET` | *(acak, wajib)* | Generate: `npx auth secret` atau `openssl rand -base64 32` |
   | `AUTH_TRUST_HOST` | `true` | Wajib di balik proxy Hostinger |
   | `NEXT_PUBLIC_SITE_URL` | `https://talentaciptakarya.com` | Canonical URL, SEO, og-image |
   | `DATABASE_URL` | `file:../../site.db` | **Penting** — database di luar folder deploy (lihat tabel arsitektur) |
   | `ADMIN_EMAIL` | `info@talentaciptakarya.com` | Hanya dipakai saat akun dibuat (build pertama) |
   | `ADMIN_PASSWORD` | *(password yang Anda catat — jangan `admin1234`)* | Untuk login pertama — sesudah itu ganti dari dashboard |
   | `RESEND_API_KEY` | *(opsional, bisa nanti)* | Kosong = pesan tetap masuk `/admin/pesan`, email dilewati |
   | `CONTACT_EMAIL_FROM` | `info@talentaciptakarya.com` | Isi setelah domain diverifikasi di Resend |
   | `CONTACT_EMAIL_TO` | `info@talentaciptakarya.com` | Tujuan notifikasi |
   | `BLOB_READ_WRITE_TOKEN` | *(opsional, disarankan)* | Foto upload admin → Vercel Blob (Langkah 6) |

5. Klik **Deploy** → tunggu build selesai (lihat log di *Deployments* bila gagal).

**Catatan:** mengubah env kapan pun **wajib diikuti klik Redeploy** agar nilai baru
ter-inject ke runtime.

---

## Langkah 3 — Domain & SSL

- Domain **di Hostinger**: hPanel → domain → arahkan ke hosting (nameserver
  Hostinger sudah benar secara default) → SSL aktif otomatis.
- Domain **di registrar lain**: tambahkan record `A` → `@` = IP hosting Anda
  (tercantum di dashboard Web Apps) dan `CNAME` `www` → domain Anda.
  SSL menyusul otomatis (Let's Encrypt).

> ⚠️ **Penting — email Hostinger Anda:** saat mengatur DNS, **jangan menghapus
> record MX** yang mengarah ke server email (Titan) — supaya
> `info@talentaciptakarya.com` tetap menerima email.

---

## Langkah 4 — Verifikasi pasca-deploy

1. Buka `https://talentaciptakarya.com` → homepage, `/kelas`, `/kelas/barista` normal.
2. Login `https://talentaciptakarya.com/admin/login` dengan `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
3. *(Opsional)* — password sudah Anda tentukan sendiri saat setup. Ubah kapan
   saja lewat kartu **"Keamanan Akun"** di dashboard `/admin` (isi password
   lama + baru, min. 8 → Simpan). Seed tidak akan pernah menimpa password yang
   sudah diganti.
4. Cek: tambah/hapus program & kategori dari dashboard → tampil di situs publik
   **tanpa deploy ulang**.
5. (Kalau memakai `DATABASE_URL` relatif) buka **File Manager** → folder
   `talentaciptakarya.com/` → pastikan **`site.db` ada di situ** (sebaris dengan
   folder `nodejs`), bukan di dalam `nodejs/`. Kalau ada di dalam `nodejs/`,
   hubungi saya — path-nya perlu diganti ke absolute:
   `file:/home/USERNAME_ANDA/domains/talentaciptakarya.com/site.db`.

---

## Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln)

1. Daftar **resend.com** → **Domains → Add Domain** → `talentaciptakarya.com`.
2. Resend menampilkan beberapa record DNS (TXT/DKIM — salin **persis** nilainya).
3. Buka hPanel → **DNS / DNS Zone** domain Anda → tambahkan record tersebut → tunggu Verified.
4. Buat **API key** → salin.
5. hPanel → Web Apps → *Environment variables*: isi `RESEND_API_KEY` +
   `CONTACT_EMAIL_FROM=info@talentaciptakarya.com` → **Redeploy**.
6. Uji: kirim form kontak di website → cek email masuk ke `info@…` dan status
   pesan di `/admin/pesan` = "sent".

> Tanpa Resend sekalipun **semua pesan tetap tersimpan** di `/admin/pesan` (PRD §8).

## Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob)

Tanpa token, foto yang di-upload admin masuk `public/uploads/` (**di dalam**
folder deploy — ada risiko hilang saat redeploy). Dengan Blob, foto disimpan di
layanan eksternal dan **dijamin aman**:

1. Daftar **vercel.com** (gratis) → project bebas → **Storage → Blob → Create**.
2. Salin **`BLOB_READ_WRITE_TOKEN`** → tempel ke env hPanel → **Redeploy**.
3. Upload berikutnya otomatis ke Blob. (Foto lama yang URL-nya `/uploads/…`:
   hapus & upload ulang sekali agar pindah ke Blob.)

---

## Operasi sehari-hari

| Kebutuhan | Cara |
| --- | --- |
| Edit konten (program, kategori, foto, testimoni) | Dashboard `/admin` — **tanpa deploy** |
| Update kode (Opsi A) | `git add -A && git commit -m "…" && git push` → auto build |
| Update kode (Opsi B) | `git archive -o deploy.zip HEAD` → upload ulang di hPanel → Redeploy |
| Backup database | File Manager → `~/domains/talentaciptakarya.com/` → download `site.db` |
| Restore database | Upload `site.db` kembali ke lokasi yang sama (timpa) |
| Ganti password admin | Dashboard `/admin` → "Keamanan Akun" (bukan lewat env) |
| Log build / error | hPanel → Website dashboard → **Deployments** (log build + AI diagnosis) |

**Perilaku wajar:** aplikasi Web Apps berjalan *on-demand* — setelah beberapa
menit sepi, proses dihentikan; pengunjung berikutnya memicu start ulang (≈1–3
detik). Itu normal, bukan error.

## Jika gagal build / site error

- **Gagal build** → *Deployments* → buka log (Hostinger memberi diagnosis AI). Penyebab umum: env `DATABASE_URL` belum diisi, atau script `package.json` berubah.
- **500 / halaman kosong** → pastikan semua env di Langkah 2 terisi + klik **Redeploy**.
- **`site.db` tidak ada** → cek nilai `DATABASE_URL` persis `file:../../site.db`.
- **Foto 404** → baris galeri menunjuk file yang belum ada; hapus & upload ulang foto dari dashboard.
