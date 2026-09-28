# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 85 files · ~180,705 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 813 nodes · 1367 edges · 59 communities (57 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 122 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1921ee6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- Architecture
- upload/route.ts
- prisma.ts
- AI HANDOFF
- script.js
- package.json
- react
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- requireAdmin
- actions.ts
- KategoriManager.tsx
- resend.ts
- { GET, POST }
- next
- Current Problems
- MateriManager.tsx
- content.ts
- Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai
- Project Context
- TODO
- PendaftaranList.tsx
- Decisions
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- Decision: Semua mutasi lewat Server Actions + `requireAdmin()`
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- Decision: GitHub Pages dinonaktifkan untuk repo
- Decision: Rate limit in-memory diterima
- Decision: Materi pelatihan disembunyikan dari publik
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- pendaftaran/route.ts
- GaleriList.tsx
- auth.ts
- Decision: Tidak ada lapisan auth/role selain Admin
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- moveGalleryImage
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- ActionState
- requestPasswordReset
- ProgramManager.tsx
- pesan/page.tsx
- Layanan.tsx
- jadwal/page.tsx
- [2026-09-28]
- GalleryGrid.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 35 edges
2. `Decisions` - 29 edges
3. `refresh()` - 25 edges
4. `next` - 24 edges
5. `react` - 21 edges
6. `Project Context` - 18 edges
7. `prisma` - 18 edges
8. `compilerOptions` - 16 edges
9. `Last Completed Work` - 14 edges
10. `Services / Utilities — `lib/`` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Services / Utilities — `lib/`` --references--> `isExpired()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → lib/passwordReset.ts
- `Middleware & Authorization` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB` --references--> `pesanFromStatus()`  [INFERRED]
  AI_CONTEXT/CURRENT_STATE.md → components/admin/UploadForm.tsx

## Import Cycles
- None detected.

## Communities (59 total, 2 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.23
Nodes (9): dynamic, About(), Hero(), VisiMisi(), Kontak(), Status, Lokasi(), Reveal() (+1 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "Architecture"
Cohesion: 0.11
Nodes (17): API Routes (4), Architecture, Backend Architecture, Components, Database Architecture, Field penting, File Structure, Frontend Architecture (+9 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.10
Nodes (40): Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, Alternatives Considered, Alternatives Considered, Current Implementation, Current Implementation (+32 more)

### Community 5 - "prisma.ts"
Cohesion: 0.13
Nodes (10): dynamic, metadata, dynamic, metadata, dynamic, metadata, dynamic, metadata (+2 more)

### Community 6 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (46): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+38 more)

### Community 9 - "react"
Cohesion: 0.20
Nodes (11): Pages & Layout, Changed, Currently In Progress, Important, CURRENT STATE, AnchorHashCleaner(), Footer(), Header() (+3 more)

### Community 10 - "data.ts"
Cohesion: 0.05
Nodes (66): Alternatives Considered, Alternatives Considered, Current Implementation, Current Implementation, Decision, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Decision: Modal pendaftaran di-portal ke `document.body` (+58 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.17
Nodes (12): createJadwal(), updateJadwal(), AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager(), JadwalRow(), labelJadwal() (+4 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.24
Nodes (15): Server Actions — `app/admin/actions.ts`, Reason, deleteCategory(), deleteCategoryAction(), deleteContactMessage(), deleteGalleryImage(), deleteJadwal(), deleteMateri() (+7 more)

### Community 14 - "actions.ts"
Cohesion: 0.10
Nodes (26): ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema, GalleryInput, gallerySchema (+18 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.27
Nodes (10): Current Implementation, categorySlugData(), createCategory(), parseCategory(), updateCategory(), AdminCategory, CategoryRow(), KategoriManager() (+2 more)

### Community 16 - "resend.ts"
Cohesion: 0.27
Nodes (9): Email Architecture, POST(), EmailStatus, sendContactNotification(), sendPasswordResetEmail(), sendPendaftaranNotification(), siteUrl(), contactSchema (+1 more)

### Community 19 - "next"
Cohesion: 0.09
Nodes (19): gantiPassword(), resetPassword(), CARDS, dynamic, metadata, ResetPasswordPage(), app_globals, fraunces (+11 more)

### Community 20 - "Current Problems"
Cohesion: 0.11
Nodes (18): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Exact Next Step, Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (9): createMateri(), materiFileFromFormData(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE (+1 more)

### Community 22 - "content.ts"
Cohesion: 0.09
Nodes (22): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+14 more)

### Community 23 - "Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason

### Community 24 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "PendaftaranList.tsx"
Cohesion: 0.33
Nodes (6): AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 27 - "Decisions"
Cohesion: 0.20
Nodes (9): Current Implementation, Decision, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Decisions, Important, Important (+1 more)

### Community 28 - "Decision: Platform deploy"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Platform deploy, Important, Reason

### Community 29 - "Decision: Versi Next.js & Prisma di-pin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Versi Next.js & Prisma di-pin, Important, Reason

### Community 30 - "Decision: Semua mutasi lewat Server Actions + `requireAdmin()`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Semua mutasi lewat Server Actions + `requireAdmin()`, Important, Reason

### Community 31 - "Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Email tidak boleh memblokir penyimpanan data (PRD §8), Important, Reason

### Community 32 - "Decision: Seed idempoten, tidak pernah menimpa password admin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Seed idempoten, tidak pernah menimpa password admin, Important, Reason

### Community 33 - "Decision: Tidak ada payment gateway"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Tidak ada payment gateway, Important, Reason

### Community 34 - "Decision: Database PostgreSQL (Neon), bukan SQLite"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Database PostgreSQL (Neon), bukan SQLite, Important, Reason

### Community 35 - "Decision: Prisma `db push` tanpa file migrasi"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Prisma `db push` tanpa file migrasi, Important, Reason

### Community 36 - "Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`, Important, Reason

### Community 37 - "Decision: GitHub Pages dinonaktifkan untuk repo"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: GitHub Pages dinonaktifkan untuk repo, Important, Reason

### Community 38 - "Decision: Rate limit in-memory diterima"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Rate limit in-memory diterima, Important, Reason

### Community 39 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 40 - "Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe, Important, Reason

### Community 41 - "AGENTS.md"
Cohesion: 0.10
Nodes (19): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+11 more)

### Community 42 - "pendaftaran/route.ts"
Cohesion: 0.27
Nodes (8): dynamic, metadata, PendaftaranPage(), POST(), formatTanggalYmd(), ymdWib(), buckets, isRateLimited()

### Community 43 - "GaleriList.tsx"
Cohesion: 0.08
Nodes (25): File Upload Architecture (galeri & materi), Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason (+17 more)

### Community 44 - "auth.ts"
Cohesion: 0.14
Nodes (11): metadata, LoginForm(), authConfig, credentialsSchema, handlers, signIn, signOut, { auth } (+3 more)

### Community 45 - "Decision: Tidak ada lapisan auth/role selain Admin"
Cohesion: 0.50
Nodes (4): Decision, Decision: Tidak ada lapisan auth/role selain Admin, Important, Reason

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "moveGalleryImage"
Cohesion: 0.08
Nodes (27): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-27], Added, Added, Added (+19 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "ActionState"
Cohesion: 0.28
Nodes (7): Form Handling & Validation, ActionState, createTestimonial(), updateTestimonial(), AdminTestimonial, EditRow(), TestimoniManager()

### Community 50 - "requestPasswordReset"
Cohesion: 0.32
Nodes (5): Security Rules, getClientIp(), requestPasswordReset(), metadata, ForgotPasswordForm()

### Community 51 - "ProgramManager.tsx"
Cohesion: 0.38
Nodes (6): createProgram(), updateProgram(), AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 52 - "pesan/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 53 - "Layanan.tsx"
Cohesion: 0.29
Nodes (6): Layanan(), LayananCategory, LayananProgram, ProgramIcon(), Props, stroke

### Community 54 - "jadwal/page.tsx"
Cohesion: 0.50
Nodes (3): dynamic, JadwalPage(), metadata

### Community 55 - "[2026-09-28]"
Cohesion: 0.67
Nodes (3): [2026-09-28], Fixed, Technical Notes

### Community 56 - "GalleryGrid.tsx"
Cohesion: 0.33
Nodes (6): buildGroups(), GalleryGrid(), GalleryItem, GalleryProgram, KelompokProgram, KelompokTahun

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

### Community 58 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Reason

## Knowledge Gaps
- **393 isolated node(s):** `High Level Architecture`, `Routing`, `Components`, `Hooks & State Management`, `API Routes (4)` (+388 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 445 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `data.ts`, `Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `Decision: Tidak ada lapisan auth/role selain Admin`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `moveGalleryImage`, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `Architecture`, `upload/route.ts`, `AI HANDOFF`, `AGENTS.md`, `JadwalManager.tsx`, `GaleriList.tsx`, `actions.ts`, `moveGalleryImage`, `KategoriManager.tsx`, `ActionState`, `requestPasswordReset`, `ProgramManager.tsx`, `next`, `MateriManager.tsx`, `Project Context`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **Why does `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` connect `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` to `Decisions`, `requireAdmin`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `High Level Architecture`, `Routing`, `Components` to the rest of the system?**
  _393 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._