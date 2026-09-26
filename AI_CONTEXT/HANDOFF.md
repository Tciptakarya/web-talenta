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

- HEAD `fd32dae` (2026-09-26) sudah ter-push; perubahan terbaru = dokumentasi
  `AI_CONTEXT/` + `AGENTS.md` (**belum di-commit**, tanpa source code).
- `npx tsc --noEmit` = 0 error; `npm run build` = hijau, 22 routes.
- Server lokal **tidak berjalan** (shell background-nya dibatalkan).
- Data (Neon): 8 kategori, 11 program, 12 foto, 2 testimoni, 1 admin;
  **jadwal 0, pendaftaran 0, materi 0, pesan 0** (2 token reset sisa uji coba).

## LAST COMPLETED

**Task terbaru (source code, belum di-commit): 4 perbaikan minor admin** —
(1) email admin kini 1 baris (`text-[11px]` + `title`, 148px dari 160px
tersedia); (2) ikon theme toggle terlihat di sidebar navy
(`.admin-sidebar .theme-toggle`, situs publik tidak berubah); (3) mobile
375px & tablet 820px terverifikasi lewat iframe same-origin; (4) workaround
`EPERM` build (hentikan server sebelum build) didokumentasikan di `AGENTS.md`.
Re-verifikasi: 9/9 halaman `sideTop [0,0]`, `acctGap [24,24]`, email 1 baris,
console 0 error, `tsc` 0 error, build hijau.

**Task sebelumnya (source code, belum di-commit): sidebar admin fixed + account
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

**Task sebelumnya (source code, belum di-commit): `fix: escape & di teks JSX`** —
`&` → `&amp;` di `app/admin/(dashboard)/kategori/page.tsx:19` dan
`components/admin/JadwalManager.tsx:504`. Akar masalah: `&` mentah di teks JSX
tidak valid XML sehingga parser graphify berhenti (3 + 11 simbol hilang dari
graph). Verifikasi: `npx tsc --noEmit` 0 error, `npm run build` hijau 22
routes, `graphify update .` → **warning hilang** (709 → 713 node), teks di
build output ter-decode tetap `&` (tampilan tidak berubah).

**Task dokumentasi (belum di-commit):** folder `AI_CONTEXT/` (7 file),
aturan wajib *Setelah Menyelesaikan Task* + *Workflow low-token* di
`AGENTS.md`.

**Task source code terakhir yang ter-push:** commit `fd32dae` — fix modal
pendaftaran via `createPortal(..., document.body)` (penyebab: `transform`
pada `.reveal` membuat `position: fixed` ter-parenting).

## CURRENTLY WORKING ON

Tidak ada pekerjaan kode berjalan. Sisa pekerjaan bersifat **konfigurasi
(ops, bukan kode)**.

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
9. `graphify update .` sesekali crash `0xC0000005` (transien, aman diulang;
   dugaan: bentrok dengan `graphify hook-check` dari PreToolUse hook).
10. Nama community graphify = nama node hub (`prisma.ts`, `data.ts`) —
    informatif, tidak wajib LLM. Bisa dilabeli semantik gratis lokal:
    `graphify label . --backend=ollama --missing-only`.
11. Token GitHub `Tciptakarya` sempat terekspos di percakapan — sarankan
    rotasi (tidak pernah ditulis ke file).

## IMPORTANT DECISIONS

- **Jangan** pindah dari Vercel, dari PostgreSQL, ke SQLite, atau ke Hostinger.
- **Jangan** naikkan `next` (15.5.25) / `prisma` (6.19.3); pakai `npm ci`.
- Email **tidak boleh** memblokir penyimpanan data — selalu simpan dulu.
- Semua mutasi admin = Server Action di `app/admin/actions.ts` + `requireAdmin()`.
- Kategori & galeri lewat **relasi**; URL pakai **slug**; kategori terpakai
  tidak boleh dihapus (PRD §10).
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

Ganti `RESEND_API_KEY` (resend.com) di `.env` lokal dan di Vercel, lalu
Redeploy. Setelah itu uji email reset password dan kolom `statusEmail` =
`sent`, sambil memverifikasi modal pendaftaran di
`https://talentaciptakarya.com` dan menambahkan MX Titan di Vercel DNS.
Detail urutan: `CURRENT_STATE.md` → *Exact Next Step*.

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
