# Graph Report - tciptakarya-main  (2026-09-28)

## Corpus Check
- 102 files · ~205,959 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1028 nodes · 1873 edges · 72 communities (69 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 187 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4627a6ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- siteContent.ts
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- PRD — Migrasi Desain Visual
- upload/route.ts
- reset-password/page.tsx
- TestimoniManager.tsx
- script.js
- package.json
- AI HANDOFF
- data.ts
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
- email/page.tsx
- TODO
- refresh
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
- LoginForm.tsx
- Decision: Materi pelatihan disembunyikan dari publik
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- auth.ts
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- Changelog
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Decision: Modal pendaftaran di-portal ke `document.body`
- sync.ts
- prisma.ts
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- webhook/route.ts
- program/[slug]/page.tsx
- scripts
- ProgramManager.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- JadwalTerdekat.tsx
- app/layout.tsx
- drafts.ts
- allowScripts
- ActionState
- Database Architecture
- content.ts
- (public)/page.tsx
- Decision: Tidak ada lapisan auth/role selain Admin
- kelas/[slug]/page.tsx
- Decision: Rate limit in-memory diterima
- Architecture

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 46 edges
2. `Decisions` - 35 edges
3. `next` - 29 edges
4. `textOf()` - 26 edges
5. `refresh()` - 26 edges
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
- `Reason` --references--> `Reveal()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → components/site/Reveal.tsx

## Import Cycles
- None detected.

## Communities (72 total, 3 thin omitted)

### Community 0 - "siteContent.ts"
Cohesion: 0.06
Nodes (63): Pages & Layout, Added, Changed, Currently In Progress, Current Implementation, Decision, Decision: Teks website publik diedit dari Admin > Tampilan Website, Important (+55 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "PRD — Migrasi Desain Visual"
Cohesion: 0.11
Nodes (17): 1. Tujuan, 2. Ruang lingkup, 3.1 Token warna (`app/globals.css:7-20` dan `:root`), 3.2 Tipografi, 3.3 Struktur & pola, 3. Design system saat ini (baseline — fakta terukur), 4.1 Jebakan CSS global tanpa `@layer` (KRITIS), 4.2 Belum ada token ukuran (+9 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.06
Nodes (61): Services / Utilities — `lib/`, [2026-09-26], Added, Changed, Fixed, Technical Notes, Broken Features, Catatan: `graphify label` tidak butuh API key (+53 more)

### Community 5 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (8): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), isExpired(), ref_node_crypto

### Community 6 - "TestimoniManager.tsx"
Cohesion: 0.21
Nodes (8): createTestimonial(), deleteTestimonial(), updateTestimonial(), dynamic, metadata, AdminTestimonial, EditRow(), TestimoniManager()

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, prisma, sharp, tailwindcss, @tailwindcss/postcss, tsx (+7 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.17
Nodes (11): AI HANDOFF, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES, NEXT ACTION (+3 more)

### Community 10 - "data.ts"
Cohesion: 0.16
Nodes (18): dynamic, metadata, PendaftaranPage(), AdminPendaftaran, CategoryRow, formatTanggalYmd(), GalleryRow, getUpcomingJadwal() (+10 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.13
Nodes (16): createJadwal(), deleteJadwal(), updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd() (+8 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "requireAdmin"
Cohesion: 0.37
Nodes (12): Changed, Current Implementation, deleteEmailAction(), requireAdmin(), saveDraftAction(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction() (+4 more)

### Community 14 - "actions.ts"
Cohesion: 0.09
Nodes (29): ALLOWED_MATERI_TYPES, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema, ContactInput, EmailDraftInput, emailDraftSchema, emailSendSchema (+21 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.20
Nodes (11): categorySlugData(), createCategory(), deleteCategory(), deleteCategoryAction(), parseCategory(), updateCategory(), dynamic, metadata (+3 more)

### Community 16 - "outbound.ts"
Cohesion: 0.05
Nodes (49): Email Architecture, [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes (+41 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.16
Nodes (9): createMateri(), deleteMateri(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE (+1 more)

### Community 22 - "next"
Cohesion: 0.27
Nodes (6): dynamic, AdminNav(), NAV, SignOutButton(), nextConfig, next

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.06
Nodes (49): Alternatives Considered, Alternatives Considered, Alternatives Considered, Current Implementation, Decision, Decision, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat (+41 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "refresh"
Cohesion: 0.18
Nodes (11): deleteContactMessage(), deletePendaftaran(), refresh(), updateStatusPendaftaran(), EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp() (+3 more)

### Community 27 - "Decisions"
Cohesion: 0.18
Nodes (10): Alternatives Considered, Current Implementation, Decision, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Decisions, Important (+2 more)

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

### Community 39 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 40 - "Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe, Important, Reason

### Community 41 - "AGENTS.md"
Cohesion: 0.09
Nodes (20): 1. Update `CURRENT_STATE.md`, 2. Update `TODO.md`, 3. Update `CHANGELOG.md`, 4. Update `DECISIONS.md`, 5. Update `ARCHITECTURE.md`, 6. Update `HANDOFF.md`, 7. Verifikasi Context, 8. Git (+12 more)

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

### Community 47 - "Changelog"
Cohesion: 0.10
Nodes (19): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-27], [2026-09-28] — Active state sidebar, logo, dan anchor hash, Added, Added, Added (+11 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 50 - "sync.ts"
Cohesion: 0.11
Nodes (30): dynamic, GET(), RFC-5322, auth, fetchAttachment(), fetchMessageByUid(), fetchRecentMessages(), IMAP_NOT_CONFIGURED (+22 more)

### Community 51 - "prisma.ts"
Cohesion: 0.18
Nodes (8): dynamic, metadata, dynamic, metadata, PesanList(), AdminCounts, globalForPrisma, prisma

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "webhook/route.ts"
Cohesion: 0.60
Nodes (4): dynamic, POST(), statusFromEvent(), verifySignature()

### Community 54 - "program/[slug]/page.tsx"
Cohesion: 0.26
Nodes (11): dynamic, generateMetadata(), ProgramSlugPage(), Props, revalidate, waUrl(), KuotaBadge(), getJadwalByProgram() (+3 more)

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

### Community 60 - "JadwalTerdekat.tsx"
Cohesion: 0.18
Nodes (11): Decision, FormPendaftaran(), PendaftaranTarget, State, DayBadge(), formatTanggalSingkat(), JadwalTerdekat(), labelJadwalPublik() (+3 more)

### Community 61 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): app_globals, fraunces, jakarta, metadata

### Community 62 - "drafts.ts"
Cohesion: 0.32
Nodes (7): Current Implementation, Highlight(), DraftOutcome, dropDraft(), saveDraft(), previewFromText(), EmailSendInput

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "ActionState"
Cohesion: 0.16
Nodes (11): Components, Design System & Halaman, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing, ActionState, gantiPassword() (+3 more)

### Community 65 - "Database Architecture"
Cohesion: 0.40
Nodes (5): Database Architecture, Field penting, Galeri (admin) — grouping KATEGORI lalu PROGRAM, Index, Models & Hubungan (bahasa manusia)

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "(public)/page.tsx"
Cohesion: 0.18
Nodes (15): KelasIndexPage(), metadata, revalidate, HomePage(), revalidate, fallbackCategory(), getActiveCategories(), getAllPrograms() (+7 more)

### Community 68 - "Decision: Tidak ada lapisan auth/role selain Admin"
Cohesion: 0.50
Nodes (4): Decision, Decision: Tidak ada lapisan auth/role selain Admin, Important, Reason

### Community 69 - "kelas/[slug]/page.tsx"
Cohesion: 0.24
Nodes (10): Current Implementation, dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate, waUrl(), getCategoryBySlug() (+2 more)

### Community 71 - "Decision: Rate limit in-memory diterima"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Rate limit in-memory diterima, Important, Reason

### Community 75 - "Architecture"
Cohesion: 0.20
Nodes (9): API Routes (4), Architecture, Backend Architecture, File Structure, High Level Architecture, Important Files, Middleware & Authorization, Payment Architecture (+1 more)

## Knowledge Gaps
- **484 isolated node(s):** `Project`, `Before Making Changes`, `Database Rules`, `Testing Rules`, `Git Rules` (+479 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 536 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `siteContent.ts`, `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `outbound.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `email/page.tsx`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Decision: Tidak ada lapisan auth/role selain Admin`, `Decision: Rate limit in-memory diterima`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `siteContent.ts`, `upload/route.ts`, `TestimoniManager.tsx`, `AI HANDOFF`, `JadwalManager.tsx`, `actions.ts`, `KategoriManager.tsx`, `Project Context`, `MateriManager.tsx`, `refresh`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `AGENTS.md`, `GaleriList.tsx`, `Changelog`, `sync.ts`, `ProgramManager.tsx`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `drafts.ts`, `ActionState`, `Architecture`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `ActionState`, `siteContent.ts`, `(public)/page.tsx`, `upload/route.ts`, `reset-password/page.tsx`, `kelas/[slug]/page.tsx`, `LoginForm.tsx`, `package.json`, `GaleriList.tsx`, `requireAdmin`, `actions.ts`, `auth.ts`, `outbound.ts`, `sync.ts`, `webhook/route.ts`, `program/[slug]/page.tsx`, `JadwalTerdekat.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Project`, `Before Making Changes`, `Database Rules` to the rest of the system?**
  _484 weakly-connected nodes found - possible documentation gaps or missing edges._