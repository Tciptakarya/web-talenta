# Graph Report - tciptakarya-main  (2026-10-02)

## Corpus Check
- 121 files · ~226,429 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1198 nodes · 2217 edges · 84 communities (81 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 228 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc823f44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- PRD — Migrasi Desain Visual
- Services / Utilities — `lib/`
- ymdWib
- Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper
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
- sync.ts
- requireAdmin
- MateriManager.tsx
- reset-password/page.tsx
- dependencies
- email/page.tsx
- NotFoundContent.tsx
- refresh
- Decision: Rate limit in-memory diterima
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- next
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- Decision: GitHub Pages dinonaktifkan untuk repo
- kelas/[slug]/page.tsx
- TODO
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- ActionState
- Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- FormPendaftaran.tsx
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- LoginForm.tsx
- imap.ts
- prisma.ts
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- Current Problems
- berita/[slug]/page.tsx
- scripts
- (dashboard)/layout.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- program/[slug]/page.tsx
- Decision: Galeri dikaitkan lewat relasi, bukan string kategori
- auth.ts
- allowScripts
- requestPasswordReset
- Changelog
- content.ts
- Decision: Tidak ada lapisan auth/role selain Admin
- BeritaManager.tsx
- Decisions
- PendaftaranList.tsx
- [2026-09-28] — Admin Email Center (`/admin/email`)
- resend.ts
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)
- Decision: Modal pendaftaran di-portal ke `document.body`
- Decision: Materi pelatihan disembunyikan dari publik
- contact/route.ts
- Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram
- ProgramManager.tsx
- Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database
- Frontend Architecture
- search.ts
- Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya
- @prisma/client

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 49 edges
2. `Decisions` - 40 edges
3. `next` - 39 edges
4. `refresh()` - 31 edges
5. `textOf()` - 28 edges
6. `react` - 26 edges
7. `prisma` - 26 edges
8. `Services / Utilities — `lib/`` - 20 edges
9. `Project Context` - 18 edges
10. `Last Completed Work` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Pages & Layout` --references--> `Pesan`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → components/admin/BeritaManager.tsx
- `Services / Utilities — `lib/`` --references--> `isExpired()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → lib/passwordReset.ts
- `Middleware & Authorization` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Important Files` --references--> `requireAdmin()`  [INFERRED]
  AI_CONTEXT/ARCHITECTURE.md → app/admin/actions.ts
- `Catatan operasional` --references--> `refresh()`  [INFERRED]
  AI_CONTEXT/CHANGELOG.md → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (84 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.06
Nodes (72): Field penting, Pages & Layout, Added, Changed, Verified, Verified, Currently In Progress, Current Implementation (+64 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Decision: Galeri publik memakai container & grid sendiri"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik memakai container & grid sendiri, Important, Reason

### Community 3 - "PRD — Migrasi Desain Visual"
Cohesion: 0.11
Nodes (18): 1. Tujuan, 2. Ruang lingkup, 3.1 Token warna (`app/globals.css:7-20` dan `:root`), 3.2 Ikon & favicon, 3.3 Tipografi, 3.4 Struktur & pola, 3. Design system saat ini (baseline — fakta terukur), 4.1 Jebakan CSS global tanpa `@layer` (KRITIS) (+10 more)

### Community 4 - "Services / Utilities — `lib/`"
Cohesion: 0.07
Nodes (58): API Routes, Backend Architecture, Middleware & Authorization, Services / Utilities — `lib/`, Added, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work (+50 more)

### Community 5 - "ymdWib"
Cohesion: 0.13
Nodes (18): dynamic, metadata, PendaftaranPage(), POST(), AdminPendaftaran, getUpcomingJadwal(), hhmmToMinutes(), tanggalJamMinutes() (+10 more)

### Community 6 - "Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper"
Cohesion: 0.33
Nodes (6): Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper, ISR perlu dua request setelah perubahan data, Konsekuensi yang harus ditangani: warna background, Permintaan, Urutan navbar ikut, karena diminta terpisah, Yang dipindahkan

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, imapflow, mailparser, prisma, tailwindcss, @tailwindcss/postcss (+7 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 10 - "data.ts"
Cohesion: 0.14
Nodes (20): 6. Draft = `isActive=false`, dan halaman detail ikut 404, BERITA_SELECT, CategoryRow, fallbackCategory(), GalleryRow, getAllPrograms(), getBeritaAdmin(), getCategories() (+12 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.13
Nodes (16): createJadwal(), deleteJadwal(), updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd() (+8 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "Architecture"
Cohesion: 0.17
Nodes (11): Architecture, Database Architecture, File Structure, File Upload Architecture (galeri & materi), Galeri (admin) — grouping KATEGORI lalu PROGRAM, Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), High Level Architecture, Important Files (+3 more)

### Community 14 - "actions.ts"
Cohesion: 0.06
Nodes (41): HOST_PREFIX, ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, BERITA_IMAGE_BYTES, BERITA_IMAGE_TYPES, BERITA_ISI_MAKS, BERITA_RINGKASAN_MAKS, BeritaInput (+33 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.24
Nodes (9): categorySlugData(), createCategory(), parseCategory(), updateCategory(), dynamic, metadata, AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.27
Nodes (10): AttachmentInput, bodyToHtml(), replyContext(), sendFromPanel(), SendOutcome, EmailSendInput, isBlockedEmailFilename(), MAX_EMAIL_ATTACHMENT_BYTES (+2 more)

### Community 19 - "sync.ts"
Cohesion: 0.18
Nodes (14): RFC-5322, DraftOutcome, saveDraft(), previewFromText(), Addr, AddrInput, allAddresses(), DEFAULT_SYNC (+6 more)

### Community 20 - "requireAdmin"
Cohesion: 0.05
Nodes (52): Changed, Alternatives Considered, Alternatives Considered, Current Implementation, Current Implementation, Current Implementation, Current Implementation, Decision (+44 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.16
Nodes (9): createMateri(), deleteMateri(), updateMateri(), AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE (+1 more)

### Community 22 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (8): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), isExpired(), ref_node_crypto

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.15
Nodes (18): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+10 more)

### Community 25 - "NotFoundContent.tsx"
Cohesion: 0.21
Nodes (9): 2. `notFound()` TIDAK merender root layout (Next 15.5.25), Completed, app_globals, fraunces, jakarta, metadata, NotFoundContent(), ThemeEnforcer() (+1 more)

### Community 26 - "refresh"
Cohesion: 0.12
Nodes (17): Server Actions — `app/admin/actions.ts`, createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteContactMessage(), deleteProgram(), deleteProgramAction(), deleteTestimonial() (+9 more)

### Community 27 - "Decision: Rate limit in-memory diterima"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Rate limit in-memory diterima, Important, Reason

### Community 28 - "Decision: Platform deploy"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Platform deploy, Important, Reason

### Community 29 - "Decision: Versi Next.js & Prisma di-pin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Versi Next.js & Prisma di-pin, Important, Reason

### Community 30 - "next"
Cohesion: 0.22
Nodes (4): metadata, metadata, nextConfig, next

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

### Community 38 - "kelas/[slug]/page.tsx"
Cohesion: 0.17
Nodes (12): KelasIndexPage(), metadata, revalidate, dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate (+4 more)

### Community 39 - "TODO"
Cohesion: 0.25
Nodes (7): Bugs, Critical, In Progress, Next, Planned, Technical Debt, TODO

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
Nodes (29): [2026-09-27], Added, Changed, Technical Notes, Alternatives Considered, Current Implementation, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO (+21 more)

### Community 44 - "ActionState"
Cohesion: 0.32
Nodes (5): ActionState, gantiPassword(), CARDS, dynamic, GantiPasswordForm()

### Community 45 - "Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana"
Cohesion: 0.33
Nodes (6): 3. Dua file 404, bukan satu, Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana, Isi 404 tidak memakai `getContentMap()`, Jebakan CSS yang saya buat sendiri (catat supaya tidak terulang), Konteks, Paginasi: 404 dipakai untuk berita draft

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "FormPendaftaran.tsx"
Cohesion: 0.25
Nodes (5): Decision, FormPendaftaran(), PendaftaranTarget, State, react-dom

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 50 - "imap.ts"
Cohesion: 0.21
Nodes (16): dynamic, GET(), fetchAttachment(), fetchMessageByUid(), fetchRecentMessages(), IMAP_NOT_CONFIGURED, imapConfig, MailboxMessage (+8 more)

### Community 51 - "prisma.ts"
Cohesion: 0.15
Nodes (11): dynamic, metadata, dynamic, metadata, dynamic, POST(), statusFromEvent(), verifySignature() (+3 more)

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Current Problems"
Cohesion: 0.10
Nodes (20): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Exact Next Step, Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB (+12 more)

### Community 54 - "berita/[slug]/page.tsx"
Cohesion: 0.13
Nodes (20): BeritaIndexPage(), dynamic, metadata, revalidate, BeritaDetailPage(), dynamic, generateMetadata(), Props (+12 more)

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "(dashboard)/layout.tsx"
Cohesion: 0.24
Nodes (8): 1. 404 bawaan Next.js menyuntik CSS sendiri, Riwayat sebelumnya, dynamic, AdminNav(), NAV, SignOutButton(), ThemeToggle(), toggle()

### Community 57 - "Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih), Important, Reason

### Community 58 - "Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time, Important, Reason

### Community 59 - "Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B), Important, Reason

### Community 60 - "program/[slug]/page.tsx"
Cohesion: 0.24
Nodes (12): dynamic, generateMetadata(), ProgramSlugPage(), Props, revalidate, waUrl(), KuotaBadge(), getJadwalByProgram() (+4 more)

### Community 61 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 62 - "auth.ts"
Cohesion: 0.22
Nodes (8): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, next-auth

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "requestPasswordReset"
Cohesion: 0.24
Nodes (8): Security Rules, Email Architecture, getClientIp(), requestPasswordReset(), metadata, ForgotPasswordForm(), sendPasswordResetEmail(), siteUrl()

### Community 65 - "Changelog"
Cohesion: 0.04
Nodes (47): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-28] — Active state sidebar, logo, dan anchor hash, [2026-10-02] — Artwork favicon: navy rounded-square + feather putih, [2026-10-02] — Menu "Jadwal" di navbar + empty state Berita, [2026-10-02] — Orientasi video vertikal (9:16) + dukungan Instagram Reels (+39 more)

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "Decision: Tidak ada lapisan auth/role selain Admin"
Cohesion: 0.50
Nodes (4): Decision, Decision: Tidak ada lapisan auth/role selain Admin, Important, Reason

### Community 68 - "BeritaManager.tsx"
Cohesion: 0.06
Nodes (38): [2026-10-02] — Section Berita (`/admin/berita`, `/berita`), Added, Fixed, Known issues (di luar cakupan task ini), Technical Notes, Verified, Alternatives Considered, Current Implementation (+30 more)

### Community 69 - "Decisions"
Cohesion: 0.18
Nodes (10): 1. Menu berbasis anchor harus punya kondisi kosong yang jelas, 2. Menambah menu ke navbar ada batas lebar yang pasti (matematis), 3. Blok drawer 960px adalah SALINAN, bukan pemindahan, 4. Verifikasi layout navbar harus menunggu font & logo, Decision, Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Decisions (+2 more)

### Community 70 - "PendaftaranList.tsx"
Cohesion: 0.29
Nodes (7): deletePendaftaran(), updateStatusPendaftaran(), EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 72 - "[2026-09-28] — Admin Email Center (`/admin/email`)"
Cohesion: 0.22
Nodes (9): [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes, Verified (draft, hapus, pencarian) (+1 more)

### Community 73 - "resend.ts"
Cohesion: 0.27
Nodes (9): EmailStatus, PanelAttachment, panelFrom(), panelResendKey(), PanelSendResult, PanelSendStatus, sendPanelEmail(), textFromHtml() (+1 more)

### Community 75 - "Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason

### Community 76 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 77 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 78 - "contact/route.ts"
Cohesion: 0.67
Nodes (3): POST(), sendContactNotification(), contactSchema

### Community 79 - "Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram"
Cohesion: 0.22
Nodes (9): 1. Embed Instagram - fakta yang mengubah jawaban, 2. Permalink pakai `/p/`, bukan `/reel/`, 3. Prefix host: `yt:` / `vm:` / `ig:`, 4. Orientation default-nya "horizontal", dan kartu tetap 16:9, 5. Risiko yang diterima secara sadar, 6. Batas fisik yang tidak bisa dihilangkan, 7. Yang belum terverifikasi, Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram (+1 more)

### Community 80 - "ProgramManager.tsx"
Cohesion: 0.24
Nodes (8): createProgram(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 81 - "Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason

### Community 83 - "Frontend Architecture"
Cohesion: 0.33
Nodes (6): Components, Design System & Halaman, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing

### Community 84 - "search.ts"
Cohesion: 0.33
Nodes (8): buildEmailWhere(), contains(), OPERATORS, ParsedQuery, parseSearchQuery(), SEARCH_HELP, splitToken(), termCondition()

### Community 95 - "Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya"
Cohesion: 0.29
Nodes (8): Fixed, Alternatives Considered, Current Implementation, Decision, Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya, Important, Reason, panelErrorMessage()

### Community 98 - "@prisma/client"
Cohesion: 0.47
Nodes (5): main(), prisma, tahunDariCaption(), valid(), @prisma/client

## Knowledge Gaps
- **552 isolated node(s):** `High Level Architecture`, `Routing`, `Design System & Halaman`, `Components`, `Hooks & State Management` (+547 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 607 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `(public)/page.tsx`, `Decision: Galeri publik memakai container & grid sendiri`, `Services / Utilities — `lib/``, `Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper`, `requireAdmin`, `Decision: Rate limit in-memory diterima`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Changelog`, `Decision: Tidak ada lapisan auth/role selain Admin`, `BeritaManager.tsx`, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram`, `Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database`, `Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `requestPasswordReset`, `Changelog`, `(public)/page.tsx`, `Services / Utilities — `lib/``, `BeritaManager.tsx`, `PendaftaranList.tsx`, `AGENTS.md`, `AI HANDOFF`, `JadwalManager.tsx`, `GaleriList.tsx`, `Architecture`, `actions.ts`, `KategoriManager.tsx`, `ProgramManager.tsx`, `ActionState`, `MateriManager.tsx`, `refresh`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `(public)/page.tsx`, `Services / Utilities — `lib/``, `ymdWib`, `package.json`, `actions.ts`, `requireAdmin`, `reset-password/page.tsx`, `NotFoundContent.tsx`, `kelas/[slug]/page.tsx`, `GaleriList.tsx`, `ActionState`, `LoginForm.tsx`, `imap.ts`, `prisma.ts`, `berita/[slug]/page.tsx`, `(dashboard)/layout.tsx`, `program/[slug]/page.tsx`, `auth.ts`, `requestPasswordReset`, `contact/route.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Catatan operasional`) actually correct?**
  _`refresh()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `High Level Architecture`, `Routing`, `Design System & Halaman` to the rest of the system?**
  _552 weakly-connected nodes found - possible documentation gaps or missing edges._