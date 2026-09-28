# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 86 files · ~182,248 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 821 nodes · 1377 edges · 57 communities (55 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1426e015`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- Architecture
- upload/route.ts
- prisma.ts
- ActionState
- script.js
- package.json
- AI HANDOFF
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- requireAdmin
- actions.ts
- KategoriManager.tsx
- next
- { GET, POST }
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- Current Problems
- MateriManager.tsx
- auth.ts
- slugify
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
- moveGalleryImage
- GaleriList.tsx
- content.ts
- Changelog
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- Header
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Pages & Layout
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)
- ProgramManager.tsx
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- [2026-09-25]
- Decision: Tidak ada lapisan auth/role selain Admin
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 35 edges
2. `Decisions` - 30 edges
3. `refresh()` - 25 edges
4. `next` - 25 edges
5. `react` - 21 edges
6. `prisma` - 18 edges
7. `Project Context` - 18 edges
8. `compilerOptions` - 16 edges
9. `Last Completed Work` - 14 edges
10. `Current Problems` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Development Rules` --references--> `requireAdmin()`  [INFERRED]
  AGENTS.md → app/admin/actions.ts
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Middleware & Authorization` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `IMPORTANT DECISIONS` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/HANDOFF.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (57 total, 2 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.09
Nodes (28): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason, dynamic, buildGroups(), GalleryGrid() (+20 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "Architecture"
Cohesion: 0.12
Nodes (15): API Routes (4), Architecture, Backend Architecture, Database Architecture, Field penting, File Structure, File Upload Architecture (galeri & materi), Galeri (admin) — grouping KATEGORI lalu PROGRAM (+7 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.10
Nodes (37): Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, Alternatives Considered, Current Implementation, Decision, Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe (+29 more)

### Community 5 - "prisma.ts"
Cohesion: 0.08
Nodes (18): gantiPassword(), dynamic, metadata, CARDS, dynamic, dynamic, metadata, dynamic (+10 more)

### Community 6 - "ActionState"
Cohesion: 0.18
Nodes (11): Components, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, ActionState, createTestimonial(), updateTestimonial() (+3 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (46): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+38 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 10 - "data.ts"
Cohesion: 0.06
Nodes (60): Decision, dynamic, metadata, PendaftaranPage(), dynamic, KelasIndexPage(), metadata, generateMetadata() (+52 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.13
Nodes (14): updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager() (+6 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.21
Nodes (17): Server Actions — `app/admin/actions.ts`, Reason, createJadwal(), createMateri(), deleteCategory(), deleteCategoryAction(), deleteContactMessage(), deleteGalleryImage() (+9 more)

### Community 14 - "actions.ts"
Cohesion: 0.11
Nodes (26): ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema, GalleryInput, gallerySchema (+18 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.24
Nodes (9): categorySlugData(), createCategory(), parseCategory(), updateCategory(), dynamic, metadata, AdminCategory, CategoryRow() (+1 more)

### Community 16 - "next"
Cohesion: 0.06
Nodes (32): Security Rules, Email Architecture, getClientIp(), requestPasswordReset(), resetPassword(), metadata, metadata, ResetPasswordPage() (+24 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Current Problems"
Cohesion: 0.11
Nodes (18): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Exact Next Step, Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.20
Nodes (6): updateMateri(), AdminMateri, MateriEditRow(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 22 - "auth.ts"
Cohesion: 0.15
Nodes (10): metadata, LoginForm(), authConfig, credentialsSchema, handlers, signIn, signOut, { auth } (+2 more)

### Community 23 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 24 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "PendaftaranList.tsx"
Cohesion: 0.40
Nodes (5): EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

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

### Community 42 - "moveGalleryImage"
Cohesion: 0.22
Nodes (11): [2026-09-26], Added, Changed, Technical Notes, Alternatives Considered, Current Implementation, Decision, Decision: Grouping galeri di klien + urutan scoped per subgroup (+3 more)

### Community 43 - "GaleriList.tsx"
Cohesion: 0.08
Nodes (23): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason, updateGalleryImage(), dynamic (+15 more)

### Community 44 - "content.ts"
Cohesion: 0.12
Nodes (17): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+9 more)

### Community 45 - "Changelog"
Cohesion: 0.17
Nodes (11): [2026-09-23], [2026-09-24], [2026-09-27], Added, Added, Changed, Changed, Changed (+3 more)

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "Header"
Cohesion: 0.24
Nodes (9): [2026-09-28], Changed, Fixed, Technical Notes, Currently In Progress, CURRENT STATE, Footer(), NAV_LINKS (+1 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Pages & Layout"
Cohesion: 0.36
Nodes (3): Pages & Layout, AnchorHashCleaner(), ToTop()

### Community 50 - "Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason

### Community 51 - "ProgramManager.tsx"
Cohesion: 0.38
Nodes (6): createProgram(), updateProgram(), AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Important, Reason

### Community 54 - "[2026-09-25]"
Cohesion: 0.40
Nodes (5): [2026-09-25], Added, Changed, Fixed, Technical Notes

### Community 55 - "Decision: Tidak ada lapisan auth/role selain Admin"
Cohesion: 0.50
Nodes (4): Decision, Decision: Tidak ada lapisan auth/role selain Admin, Important, Reason

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

## Knowledge Gaps
- **398 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `Props` (+393 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 450 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `(public)/page.tsx`, `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `slugify`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `moveGalleryImage`, `GaleriList.tsx`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Tidak ada lapisan auth/role selain Admin`, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `Architecture`, `upload/route.ts`, `prisma.ts`, `ActionState`, `AGENTS.md`, `AI HANDOFF`, `moveGalleryImage`, `GaleriList.tsx`, `Changelog`, `actions.ts`, `KategoriManager.tsx`, `next`, `JadwalManager.tsx`, `ProgramManager.tsx`, `MateriManager.tsx`, `Project Context`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **Why does `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` connect `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` to `Decisions`, `requireAdmin`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _398 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._