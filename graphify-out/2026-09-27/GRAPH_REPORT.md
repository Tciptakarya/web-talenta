# Graph Report - tciptakarya-main  (2026-09-27)

## Corpus Check
- 84 files · ~177,367 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 766 nodes · 1303 edges · 45 communities (43 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f08b1dd`
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
- auth.ts
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- actions.ts
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- next
- { GET, POST }
- moveGalleryImage
- Current Problems
- ActionState
- content.ts
- KategoriManager.tsx
- Project Context
- TODO
- Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai
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
- AGENTS.md
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- GaleriList.tsx
- PendaftaranList.tsx
- requireAdmin

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 35 edges
2. `refresh()` - 25 edges
3. `next` - 24 edges
4. `Decisions` - 23 edges
5. `react` - 20 edges
6. `prisma` - 18 edges
7. `Project Context` - 18 edges
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

## Communities (45 total, 2 thin omitted)

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
Cohesion: 0.14
Nodes (13): API Routes (4), Architecture, Backend Architecture, Database Architecture, Field penting, File Structure, Galeri (admin) — grouping KATEGORI lalu PROGRAM, High Level Architecture (+5 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.17
Nodes (27): Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, Alternatives Considered, Current Implementation, Decision, Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe (+19 more)

### Community 5 - "prisma.ts"
Cohesion: 0.07
Nodes (21): gantiPassword(), dynamic, metadata, dynamic, metadata, CARDS, dynamic, dynamic (+13 more)

### Community 6 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (46): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+38 more)

### Community 9 - "auth.ts"
Cohesion: 0.06
Nodes (30): Pages & Layout, Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason, AdminLayout() (+22 more)

### Community 10 - "data.ts"
Cohesion: 0.06
Nodes (59): Decision, dynamic, metadata, PendaftaranPage(), dynamic, KelasIndexPage(), metadata, generateMetadata() (+51 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.15
Nodes (12): dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager(), JadwalRow() (+4 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (9): createMateri(), materiFileFromFormData(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE (+1 more)

### Community 14 - "actions.ts"
Cohesion: 0.10
Nodes (28): createJadwal(), updateJadwal(), ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema (+20 more)

### Community 15 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.50
Nodes (4): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important

### Community 16 - "next"
Cohesion: 0.07
Nodes (31): Email Architecture, getClientIp(), requestPasswordReset(), resetPassword(), metadata, metadata, ResetPasswordPage(), POST() (+23 more)

### Community 19 - "moveGalleryImage"
Cohesion: 0.09
Nodes (23): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], Added, Added, Added, Changed (+15 more)

### Community 20 - "Current Problems"
Cohesion: 0.10
Nodes (19): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Currently In Progress, Exact Next Step (+11 more)

### Community 21 - "ActionState"
Cohesion: 0.18
Nodes (11): Components, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, ActionState, createProgram(), updateProgram() (+3 more)

### Community 22 - "content.ts"
Cohesion: 0.09
Nodes (22): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+14 more)

### Community 23 - "KategoriManager.tsx"
Cohesion: 0.27
Nodes (10): Current Implementation, categorySlugData(), createCategory(), parseCategory(), updateCategory(), AdminCategory, CategoryRow(), KategoriManager() (+2 more)

### Community 24 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason

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

### Community 41 - "AGENTS.md"
Cohesion: 0.09
Nodes (20): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+12 more)

### Community 42 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 43 - "GaleriList.tsx"
Cohesion: 0.10
Nodes (18): File Upload Architecture (galeri & materi), Galeri publik (redesign 2026-09-27), dynamic, metadata, AdminGalleryItem, AdminGalleryProgram, buildGroups(), GaleriCard() (+10 more)

### Community 45 - "PendaftaranList.tsx"
Cohesion: 0.25
Nodes (8): deletePendaftaran(), updateStatusPendaftaran(), AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 50 - "requireAdmin"
Cohesion: 0.18
Nodes (18): Server Actions — `app/admin/actions.ts`, Reason, createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteContactMessage(), deleteGalleryImage(), deleteJadwal() (+10 more)

## Knowledge Gaps
- **362 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `Props` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 413 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `requireAdmin` to `Architecture`, `prisma.ts`, `AI HANDOFF`, `AGENTS.md`, `auth.ts`, `MateriManager.tsx`, `actions.ts`, `PendaftaranList.tsx`, `moveGalleryImage`, `ActionState`, `KategoriManager.tsx`, `Project Context`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Why does `Decisions` connect `Decisions` to `(public)/page.tsx`, `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `auth.ts`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `moveGalleryImage`, `Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `(public)/page.tsx`, `upload/route.ts`, `prisma.ts`, `package.json`, `auth.ts`, `data.ts`, `GaleriList.tsx`, `actions.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._