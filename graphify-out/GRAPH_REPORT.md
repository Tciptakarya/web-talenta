# Graph Report - tciptakarya-main  (2026-10-02)

## Corpus Check
- 103 files · ~208,852 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1040 nodes · 1887 edges · 87 communities (84 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 183 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `080c3b77`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- siteContent.ts
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- PRD — Migrasi Desain Visual
- upload/route.ts
- reset-password/page.tsx
- refresh
- script.js
- package.json
- AI HANDOFF
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- Architecture
- actions.ts
- KategoriManager.tsx
- outbound.ts
- { GET, POST }
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- Project Context
- MateriManager.tsx
- pendaftaran/route.ts
- dependencies
- email/page.tsx
- TODO
- PendaftaranList.tsx
- Decisions
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- @prisma/client
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- Decision: GitHub Pages dinonaktifkan untuk repo
- pesan/page.tsx
- requireAdmin
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- search.ts
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- Changelog
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Decision: Modal pendaftaran di-portal ke `document.body`
- imap.ts
- prisma.ts
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- webhook/route.ts
- program/[slug]/page.tsx
- scripts
- ProgramManager.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- FormPendaftaran.tsx
- next
- sync.ts
- allowScripts
- requestPasswordReset
- pendaftaran/page.tsx
- content.ts
- getActiveCategories
- auth.ts
- kelas/[slug]/page.tsx
- (dashboard)/layout.tsx
- Decision: Rate limit in-memory diterima
- [2026-09-28] — Admin Email Center (`/admin/email`)
- resend.ts
- Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya
- adminNavCounts
- drafts.ts
- Decision: Semua mutasi lewat Server Actions + `requireAdmin()`
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- LoginForm.tsx
- [id]/route.ts
- Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database
- Decision: Email Center — draft, hapus, dan pencarian akurat
- Backend Architecture
- Decision: `tsconfig.json` `jsx: "preserve"` di-commit
- ActionState
- contact/route.ts

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 46 edges
2. `Decisions` - 35 edges
3. `next` - 29 edges
4. `textOf()` - 26 edges
5. `refresh()` - 26 edges
6. `prisma` - 25 edges
7. `react` - 23 edges
8. `Project Context` - 18 edges
9. `Services / Utilities — `lib/`` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Important Decisions` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts
- `IMPORTANT DECISIONS` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/HANDOFF.md → app/admin/actions.ts
- `Reason` --references--> `Reveal()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → components/site/Reveal.tsx
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Middleware & Authorization` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (87 total, 3 thin omitted)

### Community 0 - "siteContent.ts"
Cohesion: 0.06
Nodes (67): Pages & Layout, Added, Changed, Currently In Progress, Current Implementation, Decision, Decision: Teks website publik diedit dari Admin > Tampilan Website, Important (+59 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "PRD — Migrasi Desain Visual"
Cohesion: 0.11
Nodes (18): 1. Tujuan, 2. Ruang lingkup, 3.1 Token warna (`app/globals.css:7-20` dan `:root`), 3.2 Ikon & favicon, 3.3 Tipografi, 3.4 Struktur & pola, 3. Design system saat ini (baseline — fakta terukur), 4.1 Jebakan CSS global tanpa `@layer` (KRITIS) (+10 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.06
Nodes (56): Services / Utilities — `lib/`, Fixed, Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State (+48 more)

### Community 5 - "reset-password/page.tsx"
Cohesion: 0.29
Nodes (7): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), isExpired()

### Community 6 - "refresh"
Cohesion: 0.23
Nodes (10): createTestimonial(), deleteGalleryImage(), deleteJadwal(), deleteMateri(), deleteTestimonial(), refresh(), updateTestimonial(), AdminTestimonial (+2 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.13
Nodes (14): name, private, version, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/mailparser (+6 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 10 - "data.ts"
Cohesion: 0.17
Nodes (15): CategoryRow, fallbackCategory(), GalleryRow, getAllPrograms(), getCategories(), getCategoriesWithCounts(), getMateriByCategory(), JadwalRow (+7 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.15
Nodes (14): createJadwal(), updateJadwal(), dynamic, metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager() (+6 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "Architecture"
Cohesion: 0.12
Nodes (16): Architecture, Components, Database Architecture, Design System & Halaman, Field penting, File Structure, Form Handling & Validation, Frontend Architecture (+8 more)

### Community 14 - "actions.ts"
Cohesion: 0.09
Nodes (29): ALLOWED_MATERI_TYPES, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema, ContactInput, EmailDraftInput, emailDraftSchema, emailSendSchema (+21 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.29
Nodes (9): categorySlugData(), createCategory(), deleteCategory(), deleteCategoryAction(), parseCategory(), updateCategory(), AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.29
Nodes (10): AttachmentInput, bodyToHtml(), replyContext(), sendFromPanel(), SendOutcome, panelResendKey(), isBlockedEmailFilename(), MAX_EMAIL_ATTACHMENT_BYTES (+2 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (8): createMateri(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 22 - "pendaftaran/route.ts"
Cohesion: 0.36
Nodes (5): POST(), buckets, isRateLimited(), sendPendaftaranNotification(), pendaftaranSchema

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.15
Nodes (18): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+10 more)

### Community 25 - "TODO"
Cohesion: 0.22
Nodes (8): Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt, TODO

### Community 26 - "PendaftaranList.tsx"
Cohesion: 0.25
Nodes (8): deletePendaftaran(), updateStatusPendaftaran(), AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 27 - "Decisions"
Cohesion: 0.18
Nodes (10): Current Implementation, Decision, Decision, Decision: Materi pelatihan disembunyikan dari publik, Decision: Tidak ada lapisan auth/role selain Admin, Decisions, Important, Important (+2 more)

### Community 28 - "Decision: Platform deploy"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Platform deploy, Important, Reason

### Community 29 - "Decision: Versi Next.js & Prisma di-pin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Versi Next.js & Prisma di-pin, Important, Reason

### Community 30 - "@prisma/client"
Cohesion: 0.47
Nodes (5): main(), prisma, tahunDariCaption(), valid(), @prisma/client

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

### Community 38 - "pesan/page.tsx"
Cohesion: 0.25
Nodes (6): deleteContactMessage(), dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 39 - "requireAdmin"
Cohesion: 0.37
Nodes (12): Changed, Current Implementation, deleteEmailAction(), requireAdmin(), saveDraftAction(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction() (+4 more)

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
Cohesion: 0.08
Nodes (25): File Upload Architecture (galeri & materi), Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason (+17 more)

### Community 44 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 45 - "search.ts"
Cohesion: 0.33
Nodes (8): buildEmailWhere(), contains(), OPERATORS, ParsedQuery, parseSearchQuery(), SEARCH_HELP, splitToken(), termCondition()

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "Changelog"
Cohesion: 0.06
Nodes (34): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-27], [2026-09-28] — Active state sidebar, logo, dan anchor hash, [2026-10-02] — Artwork favicon: navy rounded-square + feather putih, Added (+26 more)

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 50 - "imap.ts"
Cohesion: 0.24
Nodes (13): fetchAttachment(), fetchMessageByUid(), MailboxMessage, MailError, sanitizeImapError(), setSeenFlag(), TIMEOUT_MS, timeoutError() (+5 more)

### Community 51 - "prisma.ts"
Cohesion: 0.12
Nodes (11): dynamic, metadata, dynamic, metadata, CARDS, dynamic, dynamic, metadata (+3 more)

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "webhook/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, POST(), statusFromEvent(), verifySignature(), ref_node_crypto

### Community 54 - "program/[slug]/page.tsx"
Cohesion: 0.24
Nodes (12): dynamic, generateMetadata(), ProgramSlugPage(), Props, revalidate, waUrl(), KuotaBadge(), getJadwalByProgram() (+4 more)

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

### Community 59 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Important, Reason

### Community 60 - "FormPendaftaran.tsx"
Cohesion: 0.25
Nodes (5): Decision, FormPendaftaran(), PendaftaranTarget, State, react-dom

### Community 61 - "next"
Cohesion: 0.22
Nodes (6): app_globals, fraunces, jakarta, metadata, nextConfig, next

### Community 62 - "sync.ts"
Cohesion: 0.23
Nodes (12): RFC-5322, fetchRecentMessages(), Addr, AddrInput, allAddresses(), DEFAULT_SYNC, firstAddress(), MAX_SYNC (+4 more)

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "requestPasswordReset"
Cohesion: 0.27
Nodes (7): Email Architecture, getClientIp(), requestPasswordReset(), metadata, ForgotPasswordForm(), sendPasswordResetEmail(), siteUrl()

### Community 65 - "pendaftaran/page.tsx"
Cohesion: 0.23
Nodes (11): JadwalPage(), dynamic, metadata, PendaftaranPage(), formatTanggalYmd(), getUpcomingJadwal(), hhmmToMinutes(), tanggalJamMinutes() (+3 more)

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "getActiveCategories"
Cohesion: 0.40
Nodes (4): KelasIndexPage(), metadata, revalidate, getActiveCategories()

### Community 68 - "auth.ts"
Cohesion: 0.24
Nodes (8): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, next-auth

### Community 69 - "kelas/[slug]/page.tsx"
Cohesion: 0.24
Nodes (10): Current Implementation, dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate, waUrl(), getCategoryBySlug() (+2 more)

### Community 70 - "(dashboard)/layout.tsx"
Cohesion: 0.27
Nodes (6): dynamic, AdminNav(), NAV, SignOutButton(), ThemeToggle(), toggle()

### Community 71 - "Decision: Rate limit in-memory diterima"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Rate limit in-memory diterima, Important, Reason

### Community 72 - "[2026-09-28] — Admin Email Center (`/admin/email`)"
Cohesion: 0.22
Nodes (9): [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes, Verified (draft, hapus, pencarian) (+1 more)

### Community 73 - "resend.ts"
Cohesion: 0.28
Nodes (8): EmailStatus, PanelAttachment, panelFrom(), PanelSendResult, PanelSendStatus, sendPanelEmail(), textFromHtml(), resend

### Community 74 - "Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya"
Cohesion: 0.29
Nodes (8): Fixed, Alternatives Considered, Current Implementation, Decision, Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya, Important, Reason, panelErrorMessage()

### Community 75 - "adminNavCounts"
Cohesion: 0.25
Nodes (8): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason, AdminLayout(), adminNavCounts()

### Community 76 - "drafts.ts"
Cohesion: 0.32
Nodes (7): Current Implementation, Highlight(), DraftOutcome, dropDraft(), saveDraft(), previewFromText(), EmailSendInput

### Community 77 - "Decision: Semua mutasi lewat Server Actions + `requireAdmin()`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Semua mutasi lewat Server Actions + `requireAdmin()`, Important, Reason

### Community 78 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.33
Nodes (6): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important, Reason, KuotaAware

### Community 80 - "[id]/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, GET(), auth, IMAP_NOT_CONFIGURED, imapConfig

### Community 81 - "Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason

### Community 82 - "Decision: Email Center — draft, hapus, dan pencarian akurat"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason

### Community 83 - "Backend Architecture"
Cohesion: 0.50
Nodes (4): API Routes (4), Backend Architecture, Middleware & Authorization, Server Actions — `app/admin/actions.ts`

### Community 84 - "Decision: `tsconfig.json` `jsx: "preserve"` di-commit"
Cohesion: 0.50
Nodes (4): Decision, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Important, Reason

### Community 85 - "ActionState"
Cohesion: 0.67
Nodes (3): ActionState, gantiPassword(), GantiPasswordForm()

### Community 86 - "contact/route.ts"
Cohesion: 0.67
Nodes (3): POST(), sendContactNotification(), contactSchema

## Knowledge Gaps
- **490 isolated node(s):** `Changed`, `Added`, `Technical Notes`, `Fixed`, `Changed` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 540 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `siteContent.ts`, `Decision: Galeri publik memakai container & grid sendiri`, `upload/route.ts`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Changelog`, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Rate limit in-memory diterima`, `Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya`, `adminNavCounts`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database`, `Decision: Email Center — draft, hapus, dan pencarian akurat`, `Decision: `tsconfig.json` `jsx: "preserve"` di-commit`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `siteContent.ts`, `refresh`, `AI HANDOFF`, `JadwalManager.tsx`, `Architecture`, `actions.ts`, `KategoriManager.tsx`, `Project Context`, `MateriManager.tsx`, `PendaftaranList.tsx`, `pesan/page.tsx`, `AGENTS.md`, `GaleriList.tsx`, `Changelog`, `ProgramManager.tsx`, `drafts.ts`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `[id]/route.ts`, `Backend Architecture`, `ActionState`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` connect `Decision: Semua mutasi lewat Server Actions + `requireAdmin()`` to `Decisions`, `requireAdmin`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Changed`, `Added`, `Technical Notes` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._