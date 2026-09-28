# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 97 files · ~199,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 980 nodes · 1708 edges · 76 communities (73 shown, 3 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5da64e8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database
- upload/route.ts
- ActionState
- refresh
- script.js
- package.json
- AI HANDOFF
- Header
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
- (dashboard)/layout.tsx
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
- Decision: Rate limit in-memory diterima
- Decision: Materi pelatihan disembunyikan dari publik
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- auth.ts
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- moveGalleryImage
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- next
- sync.ts
- pesan/page.tsx
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- prisma.ts
- program/[slug]/page.tsx
- scripts
- ProgramManager.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- FormPendaftaran.tsx
- search.ts
- (dashboard)/page.tsx
- allowScripts
- LoginForm.tsx
- Pages & Layout
- content.ts
- data.ts
- pendaftaran/route.ts
- kelas/[slug]/page.tsx
- webhook/route.ts
- drafts.ts
- sanitize.ts
- Decision: Email Center — draft, hapus, dan pencarian akurat
- backfill-gallery-year.ts
- Backend Architecture

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 43 edges
2. `Decisions` - 34 edges
3. `next` - 28 edges
4. `refresh()` - 26 edges
5. `prisma` - 24 edges
6. `react` - 22 edges
7. `Project Context` - 18 edges
8. `compilerOptions` - 16 edges
9. `Last Completed Work` - 15 edges
10. `Current Problems` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `Current Implementation` --references--> `refresh()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → app/admin/actions.ts
- `Current Implementation` --references--> `getGalleryByCategory()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → lib/data.ts
- `Reason` --references--> `Reveal()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → components/site/Reveal.tsx
- `Decision` --references--> `refresh()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (76 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (23): revalidate, buildGroups(), GalleryGrid(), GalleryItem, GalleryProgram, KelompokProgram, KelompokTahun, About() (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database"
Cohesion: 0.50
Nodes (4): Alternatives Considered, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason

### Community 4 - "upload/route.ts"
Cohesion: 0.07
Nodes (51): Services / Utilities — `lib/`, Fixed, Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State (+43 more)

### Community 5 - "ActionState"
Cohesion: 0.07
Nodes (31): Security Rules, Architecture, Components, Database Architecture, Email Architecture, Field penting, File Structure, Form Handling & Validation (+23 more)

### Community 6 - "refresh"
Cohesion: 0.18
Nodes (11): createTestimonial(), deleteJadwal(), deleteMateri(), deleteTestimonial(), refresh(), updateTestimonial(), dynamic, metadata (+3 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, imapflow, mailparser, prisma, tailwindcss, @tailwindcss/postcss (+8 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 10 - "Header"
Cohesion: 0.20
Nodes (12): [2026-09-27], [2026-09-28] — Active state sidebar, logo, dan anchor hash, Added, Changed, Changed, Fixed, Technical Notes, Technical Notes (+4 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.14
Nodes (15): createJadwal(), updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow() (+7 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.39
Nodes (11): Changed, Current Implementation, deleteEmailAction(), requireAdmin(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction(), EmailCenter() (+3 more)

### Community 14 - "actions.ts"
Cohesion: 0.09
Nodes (29): ALLOWED_MATERI_TYPES, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema, ContactInput, EmailDraftInput, emailDraftSchema, emailSendSchema (+21 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.20
Nodes (11): categorySlugData(), createCategory(), deleteCategory(), deleteCategoryAction(), parseCategory(), updateCategory(), dynamic, metadata (+3 more)

### Community 16 - "outbound.ts"
Cohesion: 0.07
Nodes (38): [2026-09-28] — Admin Email Center (`/admin/email`), Added, Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes (+30 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (8): createMateri(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 22 - "(dashboard)/layout.tsx"
Cohesion: 0.23
Nodes (7): dynamic, AdminNav(), NAV, SignOutButton(), NAV_LINKS, ThemeToggle(), toggle()

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.18
Nodes (16): Decision, addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams (+8 more)

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

### Community 45 - "auth.ts"
Cohesion: 0.24
Nodes (8): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, next-auth

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "moveGalleryImage"
Cohesion: 0.09
Nodes (23): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], Added, Added, Added, Changed (+15 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "next"
Cohesion: 0.18
Nodes (7): app_globals, fraunces, jakarta, metadata, NAV_LINKS, nextConfig, next

### Community 50 - "sync.ts"
Cohesion: 0.09
Nodes (35): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason, AdminLayout(), dynamic (+27 more)

### Community 51 - "pesan/page.tsx"
Cohesion: 0.25
Nodes (6): deleteContactMessage(), dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "prisma.ts"
Cohesion: 0.28
Nodes (5): dynamic, metadata, AdminCounts, globalForPrisma, prisma

### Community 54 - "program/[slug]/page.tsx"
Cohesion: 0.19
Nodes (16): dynamic, generateMetadata(), ProgramSlugPage(), Props, revalidate, waUrl(), DayBadge(), formatTanggalSingkat() (+8 more)

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "ProgramManager.tsx"
Cohesion: 0.19
Nodes (10): createProgram(), deleteProgram(), deleteProgramAction(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram (+2 more)

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

### Community 58 - "Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time, Important, Reason

### Community 59 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.33
Nodes (6): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important, Reason, KuotaAware

### Community 60 - "FormPendaftaran.tsx"
Cohesion: 0.15
Nodes (10): Alternatives Considered, Current Implementation, Decision, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason, FormPendaftaran(), PendaftaranTarget (+2 more)

### Community 61 - "search.ts"
Cohesion: 0.33
Nodes (8): buildEmailWhere(), contains(), OPERATORS, ParsedQuery, parseSearchQuery(), SEARCH_HELP, splitToken(), termCondition()

### Community 62 - "(dashboard)/page.tsx"
Cohesion: 0.38
Nodes (4): gantiPassword(), CARDS, dynamic, GantiPasswordForm()

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 65 - "Pages & Layout"
Cohesion: 0.18
Nodes (9): Pages & Layout, Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Important, Reason, AnchorHashCleaner() (+1 more)

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "data.ts"
Cohesion: 0.15
Nodes (24): HomePage(), CategoryRow, fallbackCategory(), GalleryRow, getAllPrograms(), getCategories(), getCategoriesWithCounts(), getGallery() (+16 more)

### Community 68 - "pendaftaran/route.ts"
Cohesion: 0.23
Nodes (10): dynamic, metadata, PendaftaranPage(), POST(), formatTanggalYmd(), ymdWib(), buckets, isRateLimited() (+2 more)

### Community 69 - "kelas/[slug]/page.tsx"
Cohesion: 0.17
Nodes (12): KelasIndexPage(), metadata, revalidate, dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate (+4 more)

### Community 70 - "webhook/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, POST(), statusFromEvent(), verifySignature(), ref_node_crypto

### Community 71 - "drafts.ts"
Cohesion: 0.31
Nodes (8): Current Implementation, saveDraftAction(), Highlight(), DraftOutcome, dropDraft(), saveDraft(), previewFromText(), EmailSendInput

### Community 72 - "sanitize.ts"
Cohesion: 0.33
Nodes (5): ALLOWED_STYLES, ALLOWED_TAGS, SanitizeContext, @prisma/client, sanitize-html

### Community 73 - "Decision: Email Center — draft, hapus, dan pencarian akurat"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason

### Community 74 - "backfill-gallery-year.ts"
Cohesion: 0.60
Nodes (4): main(), prisma, tahunDariCaption(), valid()

### Community 75 - "Backend Architecture"
Cohesion: 0.50
Nodes (4): API Routes (4), Backend Architecture, Middleware & Authorization, Server Actions — `app/admin/actions.ts`

## Knowledge Gaps
- **463 isolated node(s):** `Added`, `Changed`, `Verified (draft, hapus, pencarian)`, `Performance`, `Performance — cache 60 detik untuk halaman publik` (+458 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 516 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `Decision: Galeri publik memakai container & grid sendiri`, `Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database`, `upload/route.ts`, `outbound.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Rate limit in-memory diterima`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `moveGalleryImage`, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `sync.ts`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `FormPendaftaran.tsx`, `Pages & Layout`, `Decision: Email Center — draft, hapus, dan pencarian akurat`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `ActionState`, `refresh`, `AI HANDOFF`, `JadwalManager.tsx`, `actions.ts`, `KategoriManager.tsx`, `Project Context`, `MateriManager.tsx`, `PendaftaranList.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `AGENTS.md`, `GaleriList.tsx`, `moveGalleryImage`, `sync.ts`, `pesan/page.tsx`, `ProgramManager.tsx`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `(dashboard)/page.tsx`, `drafts.ts`, `Backend Architecture`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `LoginForm.tsx`, `(public)/page.tsx`, `pendaftaran/route.ts`, `ActionState`, `webhook/route.ts`, `upload/route.ts`, `kelas/[slug]/page.tsx`, `package.json`, `GaleriList.tsx`, `requireAdmin`, `actions.ts`, `auth.ts`, `outbound.ts`, `sync.ts`, `(dashboard)/layout.tsx`, `program/[slug]/page.tsx`, `(dashboard)/page.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Added`, `Changed`, `Verified (draft, hapus, pencarian)` to the rest of the system?**
  _463 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._