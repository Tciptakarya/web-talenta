# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 97 files · ~197,193 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 960 nodes · 1682 edges · 76 communities (74 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a298e4df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- Architecture
- upload/route.ts
- email/page.tsx
- refresh
- script.js
- package.json
- AI HANDOFF
- safe
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
- next
- dependencies
- reset-password/page.tsx
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
- devDependencies
- GaleriList.tsx
- slugify
- [2026-09-28] — Admin Email Center (`/admin/email`)
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- pesan/page.tsx
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Pages & Layout
- sync.ts
- ProgramManager.tsx
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- Layanan.tsx
- scripts
- (dashboard)/page.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- GalleryGrid.tsx
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- JadwalTerdekat.tsx
- Decision: Modal pendaftaran di-portal ke `document.body`
- webhook/route.ts
- allowScripts
- prisma.ts
- [2026-09-28] — Active state sidebar, logo, dan anchor hash
- content.ts
- data.ts
- program/[slug]/page.tsx
- kelas/[slug]/page.tsx
- sanitize.ts
- drafts.ts
- search.ts
- ActionState
- Database Architecture
- Decision: Email Center — draft, hapus, dan pencarian akurat

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 43 edges
2. `Decisions` - 32 edges
3. `next` - 28 edges
4. `refresh()` - 25 edges
5. `prisma` - 24 edges
6. `react` - 22 edges
7. `Project Context` - 18 edges
8. `compilerOptions` - 16 edges
9. `Last Completed Work` - 15 edges
10. `Current Problems` - 14 edges

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

## Communities (76 total, 2 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.24
Nodes (9): dynamic, About(), Hero(), VisiMisi(), Kontak(), Status, Lokasi(), Reveal() (+1 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "Architecture"
Cohesion: 0.20
Nodes (9): API Routes (4), Architecture, Backend Architecture, File Structure, High Level Architecture, Important Files, Middleware & Authorization, Payment Architecture (+1 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.06
Nodes (60): Services / Utilities — `lib/`, [2026-09-26], Added, Changed, Fixed, Technical Notes, Broken Features, Catatan: `graphify label` tidak butuh API key (+52 more)

### Community 5 - "email/page.tsx"
Cohesion: 0.21
Nodes (14): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+6 more)

### Community 6 - "refresh"
Cohesion: 0.18
Nodes (11): createTestimonial(), deleteJadwal(), deleteMateri(), deleteTestimonial(), refresh(), updateTestimonial(), dynamic, metadata (+3 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, prisma, sharp, tailwindcss, @tailwindcss/postcss, tsx (+7 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 10 - "safe"
Cohesion: 0.17
Nodes (14): dynamic, KelasIndexPage(), metadata, HomePage(), fallbackCategory(), getActiveCategories(), getAllPrograms(), getCategories() (+6 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.14
Nodes (15): createJadwal(), updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow() (+7 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.31
Nodes (13): Changed, Current Implementation, deleteEmailAction(), requireAdmin(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction(), EmailCenter() (+5 more)

### Community 14 - "actions.ts"
Cohesion: 0.09
Nodes (29): ALLOWED_MATERI_TYPES, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema, ContactInput, EmailDraftInput, emailDraftSchema, emailSendSchema (+21 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.29
Nodes (9): categorySlugData(), createCategory(), deleteCategory(), deleteCategoryAction(), parseCategory(), updateCategory(), AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.06
Nodes (39): Security Rules, Email Architecture, Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason, getClientIp() (+31 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (8): createMateri(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 22 - "next"
Cohesion: 0.06
Nodes (30): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason, AdminLayout(), dynamic (+22 more)

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "reset-password/page.tsx"
Cohesion: 0.29
Nodes (7): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), isExpired()

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "PendaftaranList.tsx"
Cohesion: 0.25
Nodes (8): deletePendaftaran(), updateStatusPendaftaran(), AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

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
Cohesion: 0.10
Nodes (19): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+11 more)

### Community 42 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/mailparser, @types/node, @types/react (+3 more)

### Community 43 - "GaleriList.tsx"
Cohesion: 0.07
Nodes (26): File Upload Architecture (galeri & materi), Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason (+18 more)

### Community 44 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 45 - "[2026-09-28] — Admin Email Center (`/admin/email`)"
Cohesion: 0.08
Nodes (24): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-27], [2026-09-28] — Admin Email Center (`/admin/email`), Added, Added, Added (+16 more)

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "pesan/page.tsx"
Cohesion: 0.25
Nodes (6): deleteContactMessage(), dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Pages & Layout"
Cohesion: 0.18
Nodes (11): Pages & Layout, Changed, Currently In Progress, Important, CURRENT STATE, AnchorHashCleaner(), Footer(), NAV_LINKS (+3 more)

### Community 50 - "sync.ts"
Cohesion: 0.11
Nodes (30): dynamic, GET(), RFC-5322, auth, fetchAttachment(), fetchMessageByUid(), fetchRecentMessages(), IMAP_NOT_CONFIGURED (+22 more)

### Community 51 - "ProgramManager.tsx"
Cohesion: 0.19
Nodes (10): createProgram(), deleteProgram(), deleteProgramAction(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram (+2 more)

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Reason

### Community 54 - "Layanan.tsx"
Cohesion: 0.29
Nodes (6): Layanan(), LayananCategory, LayananProgram, ProgramIcon(), Props, stroke

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "(dashboard)/page.tsx"
Cohesion: 0.38
Nodes (4): gantiPassword(), CARDS, dynamic, GantiPasswordForm()

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

### Community 58 - "GalleryGrid.tsx"
Cohesion: 0.33
Nodes (6): buildGroups(), GalleryGrid(), GalleryItem, GalleryProgram, KelompokProgram, KelompokTahun

### Community 59 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.33
Nodes (6): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important, Reason, KuotaAware

### Community 60 - "JadwalTerdekat.tsx"
Cohesion: 0.18
Nodes (11): Decision, FormPendaftaran(), PendaftaranTarget, State, DayBadge(), formatTanggalSingkat(), JadwalTerdekat(), labelJadwalPublik() (+3 more)

### Community 61 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 62 - "webhook/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, POST(), statusFromEvent(), verifySignature(), ref_node_crypto

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "prisma.ts"
Cohesion: 0.22
Nodes (6): dynamic, metadata, dynamic, metadata, globalForPrisma, prisma

### Community 65 - "[2026-09-28] — Active state sidebar, logo, dan anchor hash"
Cohesion: 0.67
Nodes (3): [2026-09-28] — Active state sidebar, logo, dan anchor hash, Fixed, Technical Notes

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "data.ts"
Cohesion: 0.20
Nodes (13): CategoryRow, GalleryRow, getUpcomingJadwal(), hhmmToMinutes(), JadwalRow, MateriRow, ProgramRow, RawUpcomingJadwal (+5 more)

### Community 68 - "program/[slug]/page.tsx"
Cohesion: 0.26
Nodes (11): dynamic, metadata, PendaftaranPage(), generateMetadata(), ProgramSlugPage(), Props, waUrl(), formatTanggalYmd() (+3 more)

### Community 69 - "kelas/[slug]/page.tsx"
Cohesion: 0.27
Nodes (10): generateMetadata(), KelasSlugPage(), Props, waUrl(), KuotaBadge(), getCategoryBySlug(), getGalleryByCategory(), getJadwalByCategory() (+2 more)

### Community 70 - "sanitize.ts"
Cohesion: 0.22
Nodes (9): ALLOWED_STYLES, ALLOWED_TAGS, SanitizeContext, main(), prisma, tahunDariCaption(), valid(), @prisma/client (+1 more)

### Community 71 - "drafts.ts"
Cohesion: 0.31
Nodes (8): Current Implementation, saveDraftAction(), Highlight(), DraftOutcome, dropDraft(), saveDraft(), previewFromText(), EmailSendInput

### Community 72 - "search.ts"
Cohesion: 0.33
Nodes (8): buildEmailWhere(), contains(), OPERATORS, ParsedQuery, parseSearchQuery(), SEARCH_HELP, splitToken(), termCondition()

### Community 73 - "ActionState"
Cohesion: 0.33
Nodes (6): Components, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, ActionState

### Community 74 - "Database Architecture"
Cohesion: 0.40
Nodes (5): Database Architecture, Field penting, Galeri (admin) — grouping KATEGORI lalu PROGRAM, Index, Models & Hubungan (bahasa manusia)

### Community 75 - "Decision: Email Center — draft, hapus, dan pencarian akurat"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason

## Knowledge Gaps
- **450 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `Props` (+445 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 503 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `outbound.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `next`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Email Center — draft, hapus, dan pencarian akurat`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `Architecture`, `upload/route.ts`, `refresh`, `AI HANDOFF`, `JadwalManager.tsx`, `actions.ts`, `KategoriManager.tsx`, `outbound.ts`, `Project Context`, `MateriManager.tsx`, `PendaftaranList.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `AGENTS.md`, `GaleriList.tsx`, `[2026-09-28] — Admin Email Center (`/admin/email`)`, `pesan/page.tsx`, `sync.ts`, `ProgramManager.tsx`, `(dashboard)/page.tsx`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `drafts.ts`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `(public)/page.tsx`, `upload/route.ts`, `kelas/[slug]/page.tsx`, `program/[slug]/page.tsx`, `package.json`, `safe`, `GaleriList.tsx`, `requireAdmin`, `actions.ts`, `outbound.ts`, `Pages & Layout`, `sync.ts`, `(dashboard)/page.tsx`, `reset-password/page.tsx`, `GalleryGrid.tsx`, `JadwalTerdekat.tsx`, `webhook/route.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _450 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._