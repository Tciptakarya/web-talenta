# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 101 files · ~204,242 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1009 nodes · 1842 edges · 72 communities (70 shown, 2 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 187 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85db230f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- siteContent.ts
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- adminNavCounts
- upload/route.ts
- prisma.ts
- refresh
- script.js
- package.json
- AI HANDOFF
- ymdWib
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- requireAdmin
- actions.ts
- KategoriManager.tsx
- outbound.ts
- { GET, POST }
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- Project Context
- MateriManager.tsx
- getActiveCategories
- dependencies
- email/page.tsx
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
- deleteCategory
- Decision: Materi pelatihan disembunyikan dari publik
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- next
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- moveGalleryImage
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Decision: Modal pendaftaran di-portal ke `document.body`
- sync.ts
- PesanList.tsx
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- Decision: `tsconfig.json` `jsx: "preserve"` di-commit
- program/[slug]/page.tsx
- scripts
- ProgramManager.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- FormPendaftaran.tsx
- search.ts
- allowScripts
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- content.ts
- data.ts
- pendaftaran/page.tsx
- kelas/[slug]/page.tsx
- sanitize.ts
- Decision: Email Center — draft, hapus, dan pencarian akurat
- backfill-gallery-year.ts
- Architecture

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 46 edges
2. `Decisions` - 35 edges
3. `next` - 29 edges
4. `refresh()` - 26 edges
5. `textOf()` - 26 edges
6. `prisma` - 25 edges
7. `react` - 23 edges
8. `Services / Utilities — `lib/`` - 18 edges
9. `Project Context` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Services / Utilities — `lib/`` --references--> `isExpired()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → lib/passwordReset.ts
- `Middleware & Authorization` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `Current Implementation` --references--> `refresh()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (72 total, 2 thin omitted)

### Community 0 - "siteContent.ts"
Cohesion: 0.06
Nodes (65): Pages & Layout, Added, Changed, Currently In Progress, Current Implementation, Decision, Decision: Teks website publik diedit dari Admin > Tampilan Website, Important (+57 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "adminNavCounts"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason, adminNavCounts()

### Community 4 - "upload/route.ts"
Cohesion: 0.07
Nodes (50): Services / Utilities — `lib/`, Fixed, Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State (+42 more)

### Community 5 - "prisma.ts"
Cohesion: 0.08
Nodes (24): gantiPassword(), resetPassword(), CARDS, dynamic, dynamic, metadata, dynamic, metadata (+16 more)

### Community 6 - "refresh"
Cohesion: 0.13
Nodes (17): Components, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, Reason, ActionState, createTestimonial() (+9 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, imapflow, mailparser, prisma, sharp, tailwindcss (+9 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 10 - "ymdWib"
Cohesion: 0.21
Nodes (11): dynamic, JadwalPage(), metadata, AdminJadwal, JadwalManager(), getUpcomingJadwal(), hhmmToMinutes(), tanggalJamMinutes() (+3 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.17
Nodes (11): createJadwal(), deleteJadwal(), updateJadwal(), formatTanggalYmd(), JadwalEditRow(), JadwalRow(), labelJadwal(), ProgramCategoryOption (+3 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.23
Nodes (17): Changed, Current Implementation, Current Implementation, deleteEmailAction(), requireAdmin(), saveDraftAction(), sendEmailAction(), setEmailReadAction() (+9 more)

### Community 14 - "actions.ts"
Cohesion: 0.09
Nodes (29): ALLOWED_MATERI_TYPES, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema, ContactInput, EmailDraftInput, emailDraftSchema, emailSendSchema (+21 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.24
Nodes (9): categorySlugData(), createCategory(), parseCategory(), updateCategory(), dynamic, metadata, AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.05
Nodes (50): Security Rules, Email Architecture, [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik (+42 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.14
Nodes (10): createMateri(), updateMateri(), dynamic, metadata, AdminMateri, MateriEditRow(), MateriManager(), ProgramOption (+2 more)

### Community 22 - "getActiveCategories"
Cohesion: 0.40
Nodes (4): KelasIndexPage(), metadata, revalidate, getActiveCategories()

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.21
Nodes (14): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+6 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "PendaftaranList.tsx"
Cohesion: 0.25
Nodes (8): deletePendaftaran(), updateStatusPendaftaran(), AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 27 - "Decisions"
Cohesion: 0.18
Nodes (10): Current Implementation, Decision, Decision, Decision: Rate limit in-memory diterima, Decision: Tidak ada lapisan auth/role selain Admin, Decisions, Important, Important (+2 more)

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

### Community 38 - "deleteCategory"
Cohesion: 0.40
Nodes (5): Server Actions — `app/admin/actions.ts`, deleteCategory(), deleteCategoryAction(), deleteProgram(), deleteProgramAction()

### Community 39 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 40 - "Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe, Important, Reason

### Community 41 - "AGENTS.md"
Cohesion: 0.10
Nodes (19): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+11 more)

### Community 42 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/mailparser, @types/node, @types/react (+3 more)

### Community 43 - "GaleriList.tsx"
Cohesion: 0.08
Nodes (25): File Upload Architecture (galeri & materi), Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason (+17 more)

### Community 44 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 45 - "next"
Cohesion: 0.06
Nodes (29): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason, AdminLayout(), dynamic (+21 more)

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "moveGalleryImage"
Cohesion: 0.07
Nodes (30): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-27], [2026-09-28] — Active state sidebar, logo, dan anchor hash, Added, Added (+22 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 50 - "sync.ts"
Cohesion: 0.12
Nodes (30): dynamic, GET(), RFC-5322, auth, saveDraft(), fetchAttachment(), fetchMessageByUid(), fetchRecentMessages() (+22 more)

### Community 51 - "PesanList.tsx"
Cohesion: 0.50
Nodes (3): deleteContactMessage(), AdminMessage, STATUS_LABEL

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Decision: `tsconfig.json` `jsx: "preserve"` di-commit"
Cohesion: 0.50
Nodes (4): Decision, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Important, Reason

### Community 54 - "program/[slug]/page.tsx"
Cohesion: 0.24
Nodes (12): dynamic, generateMetadata(), ProgramSlugPage(), Props, revalidate, waUrl(), KuotaBadge(), getJadwalByProgram() (+4 more)

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "ProgramManager.tsx"
Cohesion: 0.24
Nodes (8): createProgram(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

### Community 58 - "Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time, Important, Reason

### Community 59 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.50
Nodes (4): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important

### Community 60 - "FormPendaftaran.tsx"
Cohesion: 0.25
Nodes (5): Decision, FormPendaftaran(), PendaftaranTarget, State, react-dom

### Community 61 - "search.ts"
Cohesion: 0.33
Nodes (8): buildEmailWhere(), contains(), OPERATORS, ParsedQuery, parseSearchQuery(), SEARCH_HELP, splitToken(), termCondition()

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 65 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Important, Reason

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "data.ts"
Cohesion: 0.15
Nodes (19): HomePage(), CategoryRow, fallbackCategory(), GalleryRow, getAllPrograms(), getCategories(), getCategoriesWithCounts(), getGallery() (+11 more)

### Community 68 - "pendaftaran/page.tsx"
Cohesion: 0.50
Nodes (4): dynamic, metadata, PendaftaranPage(), formatTanggalYmd()

### Community 69 - "kelas/[slug]/page.tsx"
Cohesion: 0.29
Nodes (8): dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate, waUrl(), getCategoryBySlug(), getJadwalByCategory()

### Community 72 - "sanitize.ts"
Cohesion: 0.33
Nodes (5): ALLOWED_STYLES, ALLOWED_TAGS, SanitizeContext, @prisma/client, sanitize-html

### Community 73 - "Decision: Email Center — draft, hapus, dan pencarian akurat"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason

### Community 74 - "backfill-gallery-year.ts"
Cohesion: 0.60
Nodes (4): main(), prisma, tahunDariCaption(), valid()

### Community 75 - "Architecture"
Cohesion: 0.14
Nodes (13): API Routes (4), Architecture, Backend Architecture, Database Architecture, Field penting, File Structure, Galeri (admin) — grouping KATEGORI lalu PROGRAM, High Level Architecture (+5 more)

## Knowledge Gaps
- **469 isolated node(s):** `Project`, `Before Making Changes`, `Database Rules`, `Testing Rules`, `Git Rules` (+464 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 520 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `siteContent.ts`, `Decision: Galeri publik memakai container & grid sendiri`, `adminNavCounts`, `upload/route.ts`, `outbound.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `next`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `moveGalleryImage`, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: `tsconfig.json` `jsx: "preserve"` di-commit`, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Email Center — draft, hapus, dan pencarian akurat`?**
  _High betweenness centrality (0.217) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `siteContent.ts`, `prisma.ts`, `refresh`, `AI HANDOFF`, `JadwalManager.tsx`, `actions.ts`, `KategoriManager.tsx`, `outbound.ts`, `Project Context`, `MateriManager.tsx`, `PendaftaranList.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `deleteCategory`, `AGENTS.md`, `GaleriList.tsx`, `moveGalleryImage`, `sync.ts`, `PesanList.tsx`, `ProgramManager.tsx`, `Architecture`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `siteContent.ts`, `upload/route.ts`, `prisma.ts`, `kelas/[slug]/page.tsx`, `package.json`, `GaleriList.tsx`, `requireAdmin`, `actions.ts`, `outbound.ts`, `sync.ts`, `getActiveCategories`, `program/[slug]/page.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Project`, `Before Making Changes`, `Database Rules` to the rest of the system?**
  _469 weakly-connected nodes found - possible documentation gaps or missing edges._