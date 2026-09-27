# Graph Report - tciptakarya-main  (2026-09-27)

## Corpus Check
- 83 files · ~175,017 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 743 nodes · 1271 edges · 51 communities (48 shown, 3 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36d26614`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- auth.ts
- requireAdmin
- upload/route.ts
- LoginForm.tsx
- AI HANDOFF
- script.js
- package.json
- next
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- actions.ts
- Project Context
- UploadForm.tsx
- { GET, POST }
- Changelog
- Current Problems
- ProgramManager.tsx
- slugify
- KategoriManager.tsx
- prisma.ts
- TODO
- dependencies
- Decisions
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- Decision: Semua mutasi lewat Server Actions + `requireAdmin()`
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)
- Decision: GitHub Pages dinonaktifkan untuk repo
- Decision: Rate limit in-memory diterima
- Decision: Materi pelatihan disembunyikan dari publik
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- AGENTS.md
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- GaleriList.tsx
- devDependencies
- PendaftaranList.tsx
- scripts
- ActionState
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- TestimoniManager.tsx
- allowScripts

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 35 edges
2. `refresh()` - 25 edges
3. `next` - 24 edges
4. `Decisions` - 21 edges
5. `react` - 20 edges
6. `Project Context` - 18 edges
7. `prisma` - 18 edges
8. `compilerOptions` - 16 edges
9. `Current Problems` - 13 edges
10. `AI HANDOFF` - 13 edges

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

## Communities (51 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (35): Alternatives Considered, Current Implementation, Decision, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason, dynamic, FormPendaftaran() (+27 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "auth.ts"
Cohesion: 0.20
Nodes (10): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, bcryptjs (+2 more)

### Community 3 - "requireAdmin"
Cohesion: 0.25
Nodes (14): Server Actions — `app/admin/actions.ts`, Reason, createJadwal(), deleteCategory(), deleteCategoryAction(), deleteContactMessage(), deleteJadwal(), deleteMateri() (+6 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.09
Nodes (40): Pages & Layout, Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, Alternatives Considered, Current Implementation, Decision (+32 more)

### Community 6 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.14
Nodes (13): name, private, version, prisma, sharp, tailwindcss, @tailwindcss/postcss, tsx (+5 more)

### Community 9 - "next"
Cohesion: 0.06
Nodes (32): Security Rules, Email Architecture, getClientIp(), requestPasswordReset(), resetPassword(), metadata, metadata, ResetPasswordPage() (+24 more)

### Community 10 - "data.ts"
Cohesion: 0.06
Nodes (61): dynamic, metadata, PendaftaranPage(), dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage() (+53 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.15
Nodes (12): dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager(), JadwalRow() (+4 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (8): createMateri(), materiFileFromFormData(), updateMateri(), AdminMateri, MateriEditRow(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 14 - "actions.ts"
Cohesion: 0.12
Nodes (23): ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema, GalleryInput, gallerySchema (+15 more)

### Community 15 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 16 - "UploadForm.tsx"
Cohesion: 0.07
Nodes (25): API Routes (4), Architecture, Backend Architecture, Components, Database Architecture, Field penting, File Structure, File Upload Architecture (galeri & materi) (+17 more)

### Community 19 - "Changelog"
Cohesion: 0.12
Nodes (16): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], Added, Added, Added, Changed (+8 more)

### Community 20 - "Current Problems"
Cohesion: 0.10
Nodes (19): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Currently In Progress, Exact Next Step (+11 more)

### Community 21 - "ProgramManager.tsx"
Cohesion: 0.38
Nodes (6): createProgram(), updateProgram(), AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 22 - "slugify"
Cohesion: 0.17
Nodes (14): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+6 more)

### Community 23 - "KategoriManager.tsx"
Cohesion: 0.39
Nodes (7): categorySlugData(), createCategory(), parseCategory(), updateCategory(), AdminCategory, CategoryRow(), KategoriManager()

### Community 24 - "prisma.ts"
Cohesion: 0.07
Nodes (21): dynamic, metadata, dynamic, metadata, dynamic, metadata, CARDS, dynamic (+13 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcryptjs, next, next-auth, @prisma/client, react, react-dom, resend (+3 more)

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

### Community 36 - "Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason

### Community 37 - "Decision: GitHub Pages dinonaktifkan untuk repo"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: GitHub Pages dinonaktifkan untuk repo, Important, Reason

### Community 38 - "Decision: Rate limit in-memory diterima"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Rate limit in-memory diterima, Important, Reason

### Community 39 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 40 - "Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`, Important, Reason

### Community 41 - "AGENTS.md"
Cohesion: 0.10
Nodes (19): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+11 more)

### Community 42 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 43 - "GaleriList.tsx"
Cohesion: 0.20
Nodes (8): deleteGalleryImage(), moveGalleryImage(), updateGalleryImage(), buildGroups(), GaleriCard(), GaleriList(), Group, SubGroup

### Community 44 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node, @types/react, @types/react-dom (+1 more)

### Community 45 - "PendaftaranList.tsx"
Cohesion: 0.25
Nodes (8): deletePendaftaran(), updateStatusPendaftaran(), AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 46 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 47 - "ActionState"
Cohesion: 0.50
Nodes (4): Form Handling & Validation, ActionState, gantiPassword(), GantiPasswordForm()

### Community 48 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.50
Nodes (4): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important

### Community 50 - "TestimoniManager.tsx"
Cohesion: 0.32
Nodes (6): createTestimonial(), deleteTestimonial(), updateTestimonial(), AdminTestimonial, EditRow(), TestimoniManager()

### Community 53 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

## Knowledge Gaps
- **350 isolated node(s):** `dynamic`, `metadata`, `SubGroup`, `Group`, `PendaftaranTarget` (+345 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 401 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `requireAdmin` to `upload/route.ts`, `AI HANDOFF`, `AGENTS.md`, `next`, `GaleriList.tsx`, `MateriManager.tsx`, `actions.ts`, `Project Context`, `UploadForm.tsx`, `PendaftaranList.tsx`, `TestimoniManager.tsx`, `Changelog`, `ActionState`, `ProgramManager.tsx`, `KategoriManager.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Why does `Decisions` connect `Decisions` to `(public)/page.tsx`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `upload/route.ts`, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Decision: Tidak ada payment gateway`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `slugify`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `(public)/page.tsx`, `auth.ts`, `upload/route.ts`, `LoginForm.tsx`, `package.json`, `data.ts`, `GaleriList.tsx`, `actions.ts`, `UploadForm.tsx`, `prisma.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `metadata`, `SubGroup` to the rest of the system?**
  _350 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06938775510204082 - nodes in this community are weakly interconnected._