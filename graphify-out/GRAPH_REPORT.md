# Graph Report - tciptakarya-main  (2026-10-02)

## Corpus Check
- 121 files · ~222,614 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1168 nodes · 2173 edges · 102 communities (99 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 212 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3213d0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- Decision: Galeri publik memakai container & grid sendiri
- PRD — Migrasi Desain Visual
- Services / Utilities — `lib/`
- kelas/[slug]/page.tsx
- ActionState
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
- requireAdmin
- Decisions
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- UploadForm.tsx
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- Decision: GitHub Pages dinonaktifkan untuk repo
- pesan/page.tsx
- BeritaCard.tsx
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- ymdWib
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- moveGalleryImage
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- EmailCenter.tsx
- imap.ts
- prisma.ts
- Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`
- Current Problems
- getActiveCategories
- scripts
- berita/[slug]/page.tsx
- Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)
- Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time
- Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)
- FormPendaftaran.tsx
- drafts.ts
- sync.ts
- allowScripts
- requestPasswordReset
- Changelog
- content.ts
- NotFoundContent.tsx
- BeritaManager.tsx
- (public)/berita/page.tsx
- PendaftaranList.tsx
- reset-password/page.tsx
- [2026-09-28] — Admin Email Center (`/admin/email`)
- resend.ts
- Decision: Semua mutasi lewat Server Actions + `requireAdmin()`
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)
- Decision: Berita - isi teks polos, video client-direct, ID video saja
- Decision: Materi pelatihan disembunyikan dari publik
- next
- Frontend Architecture
- ProgramManager.tsx
- Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database
- [2026-09-25]
- [2026-10-02] — Section Berita (`/admin/berita`, `/berita`)
- Decision: Email Center — draft, hapus, dan pencarian akurat
- Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai
- contact/route.ts
- Decision: Modal pendaftaran di-portal ke `document.body`
- Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO
- [2026-09-26]
- [2026-09-27]
- [2026-10-02] — Artwork favicon: navy rounded-square + feather putih
- [2026-10-02] — Menu "Jadwal" di navbar + empty state Berita
- Decision: Tidak ada lapisan auth/role selain Admin
- [2026-09-23]
- Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya
- Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana
- LoginForm.tsx
- @prisma/client
- Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal
- [2026-10-02] — Perbaikan halaman 404 (ditemukan saat cek bug di `/berita`)
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 49 edges
2. `next` - 39 edges
3. `Decisions` - 38 edges
4. `refresh()` - 29 edges
5. `textOf()` - 28 edges
6. `prisma` - 26 edges
7. `react` - 26 edges
8. `Services / Utilities — `lib/`` - 20 edges
9. `Project Context` - 18 edges
10. `safe()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Alternatives Considered` --references--> `AdminLayout()`  [INFERRED]
  AI_CONTEXT/DECISIONS.md → app/admin/(dashboard)/layout.tsx
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

## Communities (102 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.06
Nodes (66): Field penting, Pages & Layout, Added, Changed, Currently In Progress, Current Implementation, Decision, Decision: Teks website publik diedit dari Admin > Tampilan Website (+58 more)

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
Cohesion: 0.05
Nodes (65): API Routes, Backend Architecture, Middleware & Authorization, Services / Utilities — `lib/`, Fixed, Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), Last Completed Work, 1. 404 bawaan Next.js menyuntik CSS sendiri (+57 more)

### Community 5 - "kelas/[slug]/page.tsx"
Cohesion: 0.16
Nodes (18): dynamic, generateMetadata(), KelasSlugPage(), Props, revalidate, waUrl(), dynamic, ProgramSlugPage() (+10 more)

### Community 6 - "ActionState"
Cohesion: 0.24
Nodes (8): ActionState, createTestimonial(), gantiPassword(), updateTestimonial(), GantiPasswordForm(), AdminTestimonial, EditRow(), TestimoniManager()

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
Cohesion: 0.12
Nodes (26): 6. Draft = `isActive=false`, dan halaman detail ikut 404, HomePage(), generateMetadata(), BERITA_SELECT, beritaRows(), CategoryRow, fallbackCategory(), GalleryRow (+18 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.19
Nodes (9): updateJadwal(), formatTanggalYmd(), JadwalEditRow(), JadwalRow(), labelJadwal(), ProgramCategoryOption, ProgramOption, HARI_LIST (+1 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "Architecture"
Cohesion: 0.17
Nodes (11): Architecture, Database Architecture, File Structure, File Upload Architecture (galeri & materi), Galeri (admin) — grouping KATEGORI lalu PROGRAM, Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), High Level Architecture, Important Files (+3 more)

### Community 14 - "actions.ts"
Cohesion: 0.08
Nodes (33): ALLOWED_MATERI_TYPES, BERITA_ISI_MAKS, BERITA_RINGKASAN_MAKS, BeritaInput, beritaSchema, BLOCKED_EMAIL_EXT, CategoryInput, categorySchema (+25 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.24
Nodes (9): categorySlugData(), createCategory(), parseCategory(), updateCategory(), dynamic, metadata, AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.29
Nodes (10): AttachmentInput, bodyToHtml(), replyContext(), sendFromPanel(), SendOutcome, panelResendKey(), isBlockedEmailFilename(), MAX_EMAIL_ATTACHMENT_BYTES (+2 more)

### Community 19 - "Decision: Galeri dikaitkan lewat relasi, bukan string kategori"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Galeri dikaitkan lewat relasi, bukan string kategori, Important, Reason

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.18
Nodes (7): materiFileFromFormData(), updateMateri(), AdminMateri, MateriEditRow(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 22 - "pendaftaran/route.ts"
Cohesion: 0.36
Nodes (5): POST(), buckets, isRateLimited(), sendPendaftaranNotification(), pendaftaranSchema

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "email/page.tsx"
Cohesion: 0.16
Nodes (21): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+13 more)

### Community 25 - "TODO"
Cohesion: 0.17
Nodes (11): 2. `notFound()` TIDAK merender root layout (Next 15.5.25), Bugs, Completed, Critical, In Progress, Next, Planned, Technical Debt (+3 more)

### Community 26 - "requireAdmin"
Cohesion: 0.18
Nodes (22): Added, Reason, beritaData(), createBerita(), createJadwal(), createMateri(), createProgram(), deleteBerita() (+14 more)

### Community 27 - "Decisions"
Cohesion: 0.18
Nodes (10): Current Implementation, Decision, Decision, Decision: Rate limit in-memory diterima, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Decisions, Important, Important (+2 more)

### Community 28 - "Decision: Platform deploy"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Platform deploy, Important, Reason

### Community 29 - "Decision: Versi Next.js & Prisma di-pin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Versi Next.js & Prisma di-pin, Important, Reason

### Community 30 - "UploadForm.tsx"
Cohesion: 0.21
Nodes (9): AdminGalleryProgram, Antrean, AntreanStatus, formatUkuran(), pesanFromStatus(), UploadForm(), onSubmit(), setStatusFile() (+1 more)

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
Cohesion: 0.29
Nodes (5): dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 39 - "BeritaCard.tsx"
Cohesion: 0.29
Nodes (8): BeritaCard(), BeritaMedia(), embedUrl(), posterUrl(), BeritaRow, BULAN_PENDEK, BULAN_PENUH, formatTanggalIndo()

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
Cohesion: 0.16
Nodes (9): Current Implementation, dynamic, metadata, AdminGalleryItem, buildGroups(), GaleriCard(), GaleriList(), Group (+1 more)

### Community 44 - "slugify"
Cohesion: 0.33
Nodes (8): Current Implementation, slugify(), uniqueSlug(), DEFAULT_CATEGORIES, ensureCategory(), main(), prisma, resolveSlug()

### Community 45 - "ymdWib"
Cohesion: 0.15
Nodes (15): dynamic, JadwalPage(), metadata, dynamic, metadata, PendaftaranPage(), AdminJadwal, JadwalManager() (+7 more)

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "moveGalleryImage"
Cohesion: 0.38
Nodes (7): Alternatives Considered, Current Implementation, Decision, Decision: Grouping galeri di klien + urutan scoped per subgroup, Important, Reason, moveGalleryImage()

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "EmailCenter.tsx"
Cohesion: 0.21
Nodes (16): Changed, Current Implementation, Current Implementation, deleteEmailAction(), saveDraftAction(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction() (+8 more)

### Community 50 - "imap.ts"
Cohesion: 0.21
Nodes (16): dynamic, GET(), fetchAttachment(), fetchMessageByUid(), fetchRecentMessages(), IMAP_NOT_CONFIGURED, imapConfig, MailboxMessage (+8 more)

### Community 51 - "prisma.ts"
Cohesion: 0.09
Nodes (17): dynamic, metadata, CARDS, dynamic, dynamic, metadata, dynamic, metadata (+9 more)

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Current Problems"
Cohesion: 0.10
Nodes (20): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Exact Next Step, Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB (+12 more)

### Community 54 - "getActiveCategories"
Cohesion: 0.40
Nodes (4): KelasIndexPage(), metadata, revalidate, getActiveCategories()

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "berita/[slug]/page.tsx"
Cohesion: 0.29
Nodes (8): BeritaDetailPage(), dynamic, generateMetadata(), Props, revalidate, BeritaBody(), toLines(), getBeritaBySlug()

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

### Community 61 - "drafts.ts"
Cohesion: 0.24
Nodes (8): DraftOutcome, saveDraft(), ALLOWED_STYLES, ALLOWED_TAGS, previewFromText(), SanitizeContext, EmailSendInput, sanitize-html

### Community 62 - "sync.ts"
Cohesion: 0.24
Nodes (11): RFC-5322, Addr, AddrInput, allAddresses(), DEFAULT_SYNC, firstAddress(), MAX_SYNC, norm() (+3 more)

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "requestPasswordReset"
Cohesion: 0.24
Nodes (8): Security Rules, Email Architecture, getClientIp(), requestPasswordReset(), metadata, ForgotPasswordForm(), sendPasswordResetEmail(), siteUrl()

### Community 65 - "Changelog"
Cohesion: 0.25
Nodes (7): [2026-09-24], [2026-09-28] — Active state sidebar, logo, dan anchor hash, Changed, Changelog, Fixed, Important Decisions, Technical Notes

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "NotFoundContent.tsx"
Cohesion: 0.31
Nodes (5): app_globals, fraunces, jakarta, metadata, THEME_BOOTSTRAP_SCRIPT

### Community 68 - "BeritaManager.tsx"
Cohesion: 0.14
Nodes (15): BeritaPage(), dynamic, metadata, AdminBerita, BeritaManager(), EditRow(), formatBytes(), IMAGE_TYPES (+7 more)

### Community 69 - "(public)/berita/page.tsx"
Cohesion: 0.32
Nodes (7): BeritaIndexPage(), dynamic, metadata, revalidate, BeritaList(), getBerita(), getBeritaCategories()

### Community 70 - "PendaftaranList.tsx"
Cohesion: 0.33
Nodes (6): AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 71 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (8): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), isExpired(), ref_node_crypto

### Community 72 - "[2026-09-28] — Admin Email Center (`/admin/email`)"
Cohesion: 0.22
Nodes (9): [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes, Verified (draft, hapus, pencarian) (+1 more)

### Community 73 - "resend.ts"
Cohesion: 0.28
Nodes (8): EmailStatus, PanelAttachment, panelFrom(), PanelSendResult, PanelSendStatus, sendPanelEmail(), textFromHtml(), resend

### Community 74 - "Decision: Semua mutasi lewat Server Actions + `requireAdmin()`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Semua mutasi lewat Server Actions + `requireAdmin()`, Important, Reason

### Community 75 - "Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`), Important, Reason

### Community 76 - "Decision: Berita - isi teks polos, video client-direct, ID video saja"
Cohesion: 0.22
Nodes (9): 1. Isi artikel = teks polos, bukan HTML, 2. Video = unggah (client-direct) ATAU link YouTube/Vimeo, 3. Route upload berita TERPISAH dari route galeri, 4. Hanya ID video yang disimpan, bukan URL penuh, 5. Filter kategori di browser, bukan `?kategori=`, Batas yang belum diperbaiki (ditemukan saat task ini), Decision: Berita - isi teks polos, video client-direct, ID video saja, Jebakan yang terulang (penting!) (+1 more)

### Community 77 - "Decision: Materi pelatihan disembunyikan dari publik"
Cohesion: 0.40
Nodes (5): Current Implementation, Decision, Decision: Materi pelatihan disembunyikan dari publik, Important, Reason

### Community 78 - "next"
Cohesion: 0.22
Nodes (4): metadata, metadata, nextConfig, next

### Community 79 - "Frontend Architecture"
Cohesion: 0.33
Nodes (6): Components, Design System & Halaman, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing

### Community 80 - "ProgramManager.tsx"
Cohesion: 0.29
Nodes (7): Server Actions — `app/admin/actions.ts`, deleteCategoryAction(), deleteProgramAction(), updateProgram(), AdminCategory, AdminProgram, ProgramRow()

### Community 81 - "Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason

### Community 82 - "[2026-09-25]"
Cohesion: 0.40
Nodes (5): [2026-09-25], Added, Changed, Fixed, Technical Notes

### Community 83 - "[2026-10-02] — Section Berita (`/admin/berita`, `/berita`)"
Cohesion: 0.40
Nodes (5): [2026-10-02] — Section Berita (`/admin/berita`, `/berita`), Fixed, Known issues (di luar cakupan task ini), Technical Notes, Verified

### Community 84 - "Decision: Email Center — draft, hapus, dan pencarian akurat"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason

### Community 85 - "Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason

### Community 86 - "contact/route.ts"
Cohesion: 0.67
Nodes (3): POST(), sendContactNotification(), contactSchema

### Community 87 - "Decision: Modal pendaftaran di-portal ke `document.body`"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Current Implementation, Decision: Modal pendaftaran di-portal ke `document.body`, Important, Reason

### Community 88 - "Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO, Important, Reason

### Community 89 - "[2026-09-26]"
Cohesion: 0.50
Nodes (4): [2026-09-26], Added, Changed, Technical Notes

### Community 90 - "[2026-09-27]"
Cohesion: 0.50
Nodes (4): [2026-09-27], Added, Changed, Technical Notes

### Community 91 - "[2026-10-02] — Artwork favicon: navy rounded-square + feather putih"
Cohesion: 0.50
Nodes (4): [2026-10-02] — Artwork favicon: navy rounded-square + feather putih, Added, Changed, Technical Notes

### Community 92 - "[2026-10-02] — Menu "Jadwal" di navbar + empty state Berita"
Cohesion: 0.29
Nodes (7): [2026-10-02] — Menu "Jadwal" di navbar + empty state Berita, Added, Catatan jujur, Changed, Fixed, Technical Notes, Verified

### Community 93 - "Decision: Tidak ada lapisan auth/role selain Admin"
Cohesion: 0.50
Nodes (4): Decision, Decision: Tidak ada lapisan auth/role selain Admin, Important, Reason

### Community 94 - "[2026-09-23]"
Cohesion: 0.67
Nodes (3): [2026-09-23], Added, Changed

### Community 95 - "Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya"
Cohesion: 0.29
Nodes (8): Fixed, Alternatives Considered, Current Implementation, Decision, Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya, Important, Reason, panelErrorMessage()

### Community 96 - "Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana"
Cohesion: 0.33
Nodes (6): 3. Dua file 404, bukan satu, Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana, Isi 404 tidak memakai `getContentMap()`, Jebakan CSS yang saya buat sendiri (catat supaya tidak terulang), Konteks, Paginasi: 404 dipakai untuk berita draft

### Community 98 - "@prisma/client"
Cohesion: 0.47
Nodes (5): main(), prisma, tahunDariCaption(), valid(), @prisma/client

### Community 99 - "Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal"
Cohesion: 0.40
Nodes (5): 1. Menu berbasis anchor harus punya kondisi kosong yang jelas, 2. Menambah menu ke navbar ada batas lebar yang pasti (matematis), 3. Blok drawer 960px adalah SALINAN, bukan pemindahan, 4. Verifikasi layout navbar harus menunggu font & logo, Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal

### Community 100 - "[2026-10-02] — Perbaikan halaman 404 (ditemukan saat cek bug di `/berita`)"
Cohesion: 0.50
Nodes (4): [2026-10-02] — Perbaikan halaman 404 (ditemukan saat cek bug di `/berita`), Added, Fixed, Verified

### Community 101 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.50
Nodes (4): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important

## Knowledge Gaps
- **534 isolated node(s):** `dynamic`, `revalidate`, `Props`, `revalidate`, `metadata` (+529 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 587 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `requireAdmin` to `requestPasswordReset`, `Changelog`, `(public)/page.tsx`, `Services / Utilities — `lib/``, `ActionState`, `AGENTS.md`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `AI HANDOFF`, `JadwalManager.tsx`, `Architecture`, `actions.ts`, `KategoriManager.tsx`, `ProgramManager.tsx`, `EmailCenter.tsx`, `moveGalleryImage`, `Project Context`, `MateriManager.tsx`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `Decisions` connect `Decisions` to `(public)/page.tsx`, `Decision: Galeri publik memakai container & grid sendiri`, `Services / Utilities — `lib/``, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `moveGalleryImage`, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`, `Decision: Berita - isi teks polos, video client-direct, ID video saja`, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database`, `Decision: Email Center — draft, hapus, dan pencarian akurat`, `Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Galeri publik dikelompokkan PROGRAM → TAHUN → FOTO`, `Decision: Tidak ada lapisan auth/role selain Admin`, `Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya`, `Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana`, `Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `(public)/page.tsx`, `Services / Utilities — `lib/``, `kelas/[slug]/page.tsx`, `package.json`, `actions.ts`, `pendaftaran/route.ts`, `UploadForm.tsx`, `BeritaCard.tsx`, `GaleriList.tsx`, `EmailCenter.tsx`, `imap.ts`, `prisma.ts`, `getActiveCategories`, `berita/[slug]/page.tsx`, `requestPasswordReset`, `NotFoundContent.tsx`, `(public)/berita/page.tsx`, `reset-password/page.tsx`, `contact/route.ts`, `LoginForm.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Current Implementation`) actually correct?**
  _`refresh()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `revalidate`, `Props` to the rest of the system?**
  _534 weakly-connected nodes found - possible documentation gaps or missing edges._