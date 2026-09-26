# AGENTS.md

File ini adalah instruksi permanen untuk AI coding agent. Baca sebelum
mengubah apa pun.

## Project

Website **Talenta Cipta Karya v2.1** — situs profil perusahaan + sistem
pendaftaran kelas pelatihan, dengan dashboard admin terproteksi. Satu codebase
Next.js 15.5.25 (App Router, TypeScript, Tailwind v4) yang memuat frontend
publik, area admin, API Routes, dan Server Actions. Database PostgreSQL
(Neon) via Prisma 6.19.3, autentikasi NextAuth v5 (1 akun admin), email via
Resend, file via Vercel Blob. Live di `https://talentaciptakarya.com` (Vercel),
repo `github.com/Tciptakarya/web-talenta` branch `main`.

Spesifikasi lengkap (stack, env, dependensi): `AI_CONTEXT/PROJECT_CONTEXT.md`.

## Before Making Changes

AI agent WAJIB:

1. Baca `AGENTS.md` (file ini).
2. Baca `AI_CONTEXT/PROJECT_CONTEXT.md`.
3. Baca `AI_CONTEXT/ARCHITECTURE.md`.
4. Baca `AI_CONTEXT/CURRENT_STATE.md`.
5. Baca `AI_CONTEXT/DECISIONS.md`.
6. Baca `AI_CONTEXT/TODO.md`.
7. Inspeksi file source yang relevan sebelum memodifikasinya.
8. Untuk pertanyaan codebase, jalankan `graphify query "<pertanyaan>"` lebih
   dulu (lihat bagian graphify di bawah).

## Development Rules

- Preserve existing architecture unless explicitly instructed otherwise.
- Reuse existing components and utilities whenever possible
  (`components/site/*`, `components/admin/*`, `lib/*`).
- Do not introduce dependencies unnecessarily; jangan menaikkan versi yang
  di-pin (`next@15.5.25`, `prisma@6.19.3`) dan gunakan `npm ci`, bukan
  `npm install`.
- Do not rewrite working functionality without reason.
- Do not change database schema without understanding existing relations.
- Do not expose secrets.
- Do not hardcode credentials.
- Do not modify unrelated files — keep changes focused on the requested task.
- Pertahankan pola yang sudah ada: mutasi admin = Server Action di
  `app/admin/actions.ts` dengan `requireAdmin()`; validasi = Zod dari
  `lib/schemas.ts`; email tidak boleh memblokir penyimpanan data (PRD §8).
- Halaman publik dirender per-request (`export const dynamic = "force-dynamic"`
  di `/` dan `/kelas`; `/kelas/[slug]` & `/program/[slug]` dinamis via segmen
  `[slug]` tanpa `generateStaticParams`) — jangan menambah ISR/`revalidate`
  yang membuat data basi tanpa keputusan eksplisit.

## Database Rules

- Inspect `prisma/schema.prisma` (atau `graphify query`) sebelum mengubah
  kode terkait database.
- Preserve existing relationships (`Category→Program`, `Program→Jadwal/`
  `Materi/Gallery`, `JadwalPelatihan→Pendaftaran`, `AdminUser→PasswordResetToken`)
  beserta perilaku `onDelete` (`SetNull` / `Cascade`).
- Do not delete or rename fields without checking their usage
  (`lib/data.ts`, `app/admin/actions.ts`, `lib/schemas.ts`).
- Sync skema memakai `prisma db push` (project **tidak** memakai folder
  migrasi) — jalankan `npm run db:push`.
- Explain migration impact before performing destructive database changes;
  jangan menghapus data produksi lewat kode.
- Status memakai `String` + validasi Zod, bukan Prisma `enum` — pertahankan.
- Kuota pendaftaran dihitung dari baris dengan `status != "ditolak"`.

## Security Rules

- Never expose API keys, passwords, tokens, atau private keys.
- Never commit `.env` atau file berisi secret (`.env` sudah di-gitignore —
  jangan menambahkannya ke tracking).
- Never write credentials (login admin, token, kredensial DB) ke source code,
  dokumentasi, atau commit message.
- Keep authentication and authorization server-side
  (`middleware.ts` untuk route, `requireAdmin()` untuk tiap mutasi).
- Validate user-controlled input dengan Zod sebelum menyentuh database.
- Respons autentikasi (lupa password) harus generik — jangan membocorkan
  keberadaan akun (anti user-enumeration).
- Rate limit & honeypot yang sudah ada wajib dipertahankan (honeypot +
  rate limit di `POST /api/pendaftaran`; rate limit dobel di
  `requestPasswordReset`). Catatan: `/api/contact` saat ini belum punya
  keduanya — jangan menambah tanpa diminta, kecuali memang diminta.
- Gagal kirim email / hapus file tidak boleh menggagalkan operasi utama.

## Testing Rules

Project ini **tidak punya** perintah `lint` dan `test` di `package.json`.
Setelah perubahan, jalankan berurutan:

0. **Hentikan server lokal lebih dulu** bila sedang berjalan —
   `taskkill /F /IM node.exe`. Jika tidak, `npm run build` gagal di Windows
   dengan `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`
   karena DLL Prisma terkunci oleh proses `next start`.
1. `npx tsc --noEmit` — harus 0 error.
2. `npm run build` — harus hijau (berisi `prisma generate && prisma db push
   && tsx prisma/seed.ts && next build`; butuh `DATABASE_URL` valid).
3. Verifikasi fungsional manual di browser:
   `npm run start` → buka `http://localhost:3000`, cek rute terdampak
   (publik: `/`, `/kelas`, `/kelas/[slug]`, `/program/[slug]`;
   admin: `/admin/login` + halaman terkait).
4. `graphify update .` setelah mengubah kode.

Jika sebuah perintah gagal, **laporkan kegagalan persis** (pesan error,
file, baris) — jangan menyembunyikannya atau mengklaim lolos tanpa
menjalankannya.

## Git Rules

Sebelum perubahan besar:

- Jalankan `git status` dan `git log --oneline -10`.
- Jangan menimpa pekerjaan user yang belum di-commit; jangan `git reset`,
  `git checkout --`, atau menghapus file kecuali diminta secara eksplisit.
- Commit message bahasa Indonesia dengan gaya `feat:`/`fix:`/`chore:`/`docs:`.
- Setelah source code **dan** `AI_CONTEXT` diperbarui: jalankan `git status`
  lalu tampilkan perubahan (detail di *Aturan Setelah Menyelesaikan Task* §8).
- Push bisa timeout di HTTP/2; fallback:
  `git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push origin main`

## Aturan Setelah Menyelesaikan Task

Setiap kali menyelesaikan task yang signifikan, AI agent WAJIB memperbarui
dokumentasi di dalam `AI_CONTEXT/`.

Jangan hanya mengubah source code.

### 1. Update `CURRENT_STATE.md`

Perbarui:

- kondisi project terbaru
- task yang baru selesai
- task yang sedang berjalan
- masalah yang masih ada
- blocker jika ada
- langkah berikutnya

Pastikan bagian `CURRENTLY WORKING ON` dan `NEXT ACTION` selalu
mencerminkan kondisi project yang sebenarnya. (Di `AI_CONTEXT/CURRENT_STATE.md`
judulnya `## Currently In Progress` dan `## Exact Next Step`; di
`AI_CONTEXT/HANDOFF.md` judulnya persis `## CURRENTLY WORKING ON` dan
`## NEXT ACTION` — keduanya wajib sinkron.)

### 2. Update `TODO.md`

Pindahkan task yang sudah selesai ke bagian `Completed`.

Contoh:

- `- [ ] Implement email verification` → `- [x] Implement email verification`

Tambahkan task baru jika ditemukan selama development.
Jangan membuat task berdasarkan asumsi.

### 3. Update `CHANGELOG.md`

Catat perubahan yang dilakukan pada task tersebut. Gunakan format:

```markdown
## [Tanggal]

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

### Technical Notes
- ...
```

### 4. Update `DECISIONS.md`

Jika selama pengerjaan terdapat keputusan teknis atau perubahan arsitektur,
dokumentasikan keputusan tersebut.
Jangan menambahkan keputusan jika tidak benar-benar dibuat.

### 5. Update `ARCHITECTURE.md`

Jika perubahan yang dilakukan mengubah:

- architecture
- database structure
- API structure
- authentication flow
- payment flow
- folder structure
- external service integration

maka `AI_CONTEXT/ARCHITECTURE.md` WAJIB diperbarui.

Jika tidak ada perubahan architecture, jangan mengubah file ini.

### 6. Update `HANDOFF.md`

Setelah task selesai, update `HANDOFF.md` agar AI agent berikutnya dapat
langsung melanjutkan. Pastikan bagian berikut selalu aktual:

- `CURRENT STATE`
- `LAST COMPLETED`
- `CURRENTLY WORKING ON`
- `KNOWN ISSUES`
- `IMPORTANT DECISIONS`
- `DO NOT CHANGE`
- `NEXT ACTION`

### 7. Verifikasi Context

Sebelum menyatakan task selesai:

1. Periksa source code yang telah diubah.
2. Pastikan dokumentasi sesuai dengan source code terbaru.
3. Pastikan tidak ada informasi yang sudah tidak berlaku.
4. Pastikan tidak ada secret atau credential di dalam dokumentasi.
5. Pastikan `TODO.md` sesuai dengan pekerjaan yang benar-benar selesai.
6. Pastikan `HANDOFF.md` dapat digunakan oleh AI agent lain untuk
   melanjutkan project.

### 8. Git

Setelah source code dan `AI_CONTEXT` selesai diperbarui:

Jalankan:

```bash
git status
```

Kemudian tampilkan perubahan yang terjadi.

Jangan melakukan `git reset`, `git checkout`, atau menghapus perubahan
user tanpa izin.

Jika user meminta commit, buat commit yang mencakup source code **dan**
dokumentasi context yang terkait.

### Prinsip Utama

Setiap perubahan signifikan pada project harus menjaga dua hal tetap sinkron:

```
SOURCE CODE  +  AI_CONTEXT
```

`AI_CONTEXT/` harus selalu menggambarkan kondisi project yang sebenarnya,
bukan kondisi sebelum task dikerjakan.

## Important Principle

The `AI_CONTEXT/` directory is the portable memory of this project.
Do not rely exclusively on conversation history.

The project must remain understandable even when a completely different AI
coding agent takes over.

---

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes,
community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or
instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when
  `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for
  relationships and `graphify explain "<concept>"` for focused concepts.
  These return a scoped subgraph, usually much smaller than
  `GRAPH_REPORT.md` or raw grep output.
- Dirty `graphify-out/` files are expected after hooks or incremental
  updates; dirty graph files are not a reason to skip graphify. Only skip
  graphify if the task is about stale or incorrect graph output, or the user
  explicitly says not to use it.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead
  of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or
  when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current
  (AST-only, no API cost).

### Workflow low-token (WAJIB)

Graphify adalah **peta**, bukan pengganti baca file. Ikuti urutan ini agar
hemat token:

1. `graphify check-update .` — graph masih mutakhir? (1 baris)
2. `graphify god-nodes --top 8` — peta hub project (~9 baris)
3. `graphify query "<pertanyaan>" --budget 600 --context call` — subgraph
   sempit. Naikkan `--budget` hanya kalau hasilnya terpotong.
4. `graphify explain "<node>"` — 1 file/symbol + semua pemanggilnya
   (~16 baris; menggantikan grep).
5. `graphify affected "<file>"` — dampak/blast radius sebelum mengubah file.
6. `graphify path "A" "B"` — alur antara dua node.
7. **Baru** baca file sumber dengan `Read`/`Grep` hanya bila: node-nya tidak
   ada di graph, atau Anda butuh baris tepat untuk mengedit.
8. Setelah mengubah kode: `graphify update .`.

Cheatsheet flag: `--budget N` (batas token output, default 2000) ·
`--context C` (filter jenis edge, mis. `call`) · `--graph <path>` · `--top N`
· `--depth N` · `--dfs` · `--missing-only` · `--force` · `--no-cluster` ·
`--no-label`.

**Jangan mengulang `graphify --help`** (output ±110 baris) — pakai tabel di
atas.

Catatan: `AI_CONTEXT/*.md` ikut terindeks, jadi `query` kadang mengembalikan
node dokumen (`Decision: …`). Tambahkan `--context call` agar fokus ke kode.

Known: `graphify update .` melaporkan warning ekstraksi parsial pada
`app/admin/(dashboard)/kategori/page.tsx` dan `components/admin/JadwalManager.tsx`
— itu **bukan** error TypeScript. Akar masalahnya: karakter `&` mentah di
teks JSX (tidak valid XML) membuat parser berhenti. Perbaikan: tulis
`&amp;` (atau "dan") di teks JSX.

Troubleshooting graphify:

- Crash `0xC0000005` (access violation) = transien; ulangi perintahnya.
  Graphify adalah uv tool; `.codex/hooks.json` menjalankan `graphify
  hook-check` pada setiap panggilan Bash, jadi hindari dua proses graphify
  berjalan bersamaan saat `graphify update .`.
- `graphify label` **tidak butuh API key** bila memakai backend lokal:
  `graphify label . --backend=ollama --missing-only` (atau `--backend=claude`).
  Nama community default (nama node hub) justru informatif — tidak wajib
  dilabeli.
- `graphify update .` melakukan rebuild penuh bila topologi berubah dan
  selalu membackup graph lama ke `graphify-out/<tanggal>/`.
