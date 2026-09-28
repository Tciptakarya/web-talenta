# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 84 files · ~184,000 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 798 nodes · 1339 edges · 50 communities (48 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `425efa10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- Architecture
- upload/route.ts
- ActionState
- AI HANDOFF
- script.js
- package.json
- next
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- actions.ts
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- prisma.ts
- { GET, POST }
- moveGalleryImage
- Current Problems
- ProgramManager.tsx
- content.ts
- slugify
- Project Context
- TODO
- KategoriManager.tsx
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
- GaleriList.tsx
- Aturan Setelah Menyelesaikan Task
- PendaftaranList.tsx
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- requireAdmin
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- refresh
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 35 edges
2. `Decisions` - 27 edges
3. `refresh()` - 25 edges
4. `next` - 24 edges
5. `react` - 20 edges
6. `prisma` - 18 edges
7. `Project Context` - 18 edges
8. `compilerOptions` - 16 edges
9. `Last Completed Work` - 14 edges
10. `Current Problems` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB` --references--> `pesanFromStatus()`  [INFERRED]
  AI_CONTEXT/CURRENT_STATE.md → components/admin/UploadForm.tsx
- `IMPORTANT DECISIONS` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/HANDOFF.md → app/admin/actions.ts
- `Reason` --references--> `Reveal()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → components/site/Reveal.tsx
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (50 total, 2 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (34): Pages & Layout, [2026-09-27], Added, Changed, Technical Notes, dynamic, Footer(), NAV_LINKS (+26 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "Architecture"
Cohesion: 0.15
Nodes (12): Architecture, Database Architecture, Field penting, File Structure, File Upload Architecture (galeri & materi), Galeri (admin) — grouping KATEGORI lalu PROGRAM, Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), High Level Architecture (+4 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.11
Nodes (36): Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, Alternatives Considered, Alternatives Considered, Current Implementation, Decision (+28 more)

### Community 5 - "ActionState"
Cohesion: 0.18
Nodes (10): Components, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, ActionState, gantiPassword(), CARDS (+2 more)

### Community 6 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (47): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+39 more)

### Community 9 - "next"
Cohesion: 0.07
Nodes (24): resetPassword(), metadata, metadata, ResetPasswordPage(), app_globals, fraunces, jakarta, metadata (+16 more)

### Community 10 - "data.ts"
Cohesion: 0.05
Nodes (65): Alternatives Considered, Alternatives Considered, Current Implementation, Current Implementation, Decision, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Decision: Modal pendaftaran di-portal ke `document.body` (+57 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.19
Nodes (10): createJadwal(), updateJadwal(), formatTanggalYmd(), JadwalEditRow(), JadwalRow(), labelJadwal(), ProgramCategoryOption, ProgramOption (+2 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "MateriManager.tsx"
Cohesion: 0.14
Nodes (10): createMateri(), updateMateri(), dynamic, metadata, AdminMateri, MateriEditRow(), MateriManager(), ProgramOption (+2 more)

### Community 14 - "actions.ts"
Cohesion: 0.12
Nodes (24): ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema, GalleryInput, gallerySchema, GantiPasswordInput (+16 more)

### Community 15 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.33
Nodes (6): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important, Reason, KuotaAware

### Community 16 - "prisma.ts"
Cohesion: 0.06
Nodes (37): Email Architecture, deleteContactMessage(), getClientIp(), requestPasswordReset(), dynamic, JadwalPage(), metadata, dynamic (+29 more)

### Community 19 - "moveGalleryImage"
Cohesion: 0.08
Nodes (27): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-28], Added, Added, Added (+19 more)

### Community 20 - "Current Problems"
Cohesion: 0.10
Nodes (19): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Currently In Progress, Exact Next Step (+11 more)

### Community 21 - "ProgramManager.tsx"
Cohesion: 0.19
Nodes (10): createProgram(), deleteProgram(), deleteProgramAction(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram (+2 more)

### Community 22 - "content.ts"
Cohesion: 0.12
Nodes (17): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+9 more)

### Community 23 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 24 - "Project Context"
Cohesion: 0.12
Nodes (16): Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks, Important Dependencies (+8 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "KategoriManager.tsx"
Cohesion: 0.39
Nodes (7): categorySlugData(), createCategory(), parseCategory(), updateCategory(), AdminCategory, CategoryRow(), KategoriManager()

### Community 27 - "Decisions"
Cohesion: 0.20
Nodes (9): Decision, Decision, Decision: Tidak ada lapisan auth/role selain Admin, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Decisions, Important, Important, Reason (+1 more)

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
Cohesion: 0.20
Nodes (8): Before Making Changes, Database Rules, Git Rules, graphify, Important Principle, Project, Testing Rules, Workflow low-token (WAJIB)

### Community 43 - "GaleriList.tsx"
Cohesion: 0.08
Nodes (24): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason, deleteGalleryImage(), updateGalleryImage() (+16 more)

### Community 44 - "Aturan Setelah Menyelesaikan Task"
Cohesion: 0.20
Nodes (10): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+2 more)

### Community 45 - "PendaftaranList.tsx"
Cohesion: 0.29
Nodes (7): deletePendaftaran(), updateStatusPendaftaran(), EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "requireAdmin"
Cohesion: 0.22
Nodes (11): Development Rules, Security Rules, API Routes (4), Backend Architecture, Middleware & Authorization, Server Actions — `app/admin/actions.ts`, Authentication, User Roles (+3 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 50 - "refresh"
Cohesion: 0.18
Nodes (11): createTestimonial(), deleteJadwal(), deleteMateri(), deleteTestimonial(), refresh(), updateTestimonial(), dynamic, metadata (+3 more)

### Community 52 - "Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason

## Knowledge Gaps
- **387 isolated node(s):** `Changed`, `Fixed`, `Technical Notes`, `Added`, `Technical Notes` (+382 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 438 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `requireAdmin` to `Architecture`, `upload/route.ts`, `ActionState`, `AI HANDOFF`, `JadwalManager.tsx`, `GaleriList.tsx`, `MateriManager.tsx`, `actions.ts`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `prisma.ts`, `PendaftaranList.tsx`, `refresh`, `moveGalleryImage`, `ProgramManager.tsx`, `KategoriManager.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `Decisions` connect `Decisions` to `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `data.ts`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `moveGalleryImage`, `slugify`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` connect `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` to `Decisions`, `requireAdmin`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Changed`, `Fixed`, `Technical Notes` to the rest of the system?**
  _387 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06745098039215686 - nodes in this community are weakly interconnected._