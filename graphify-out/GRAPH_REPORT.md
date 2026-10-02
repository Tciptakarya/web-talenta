# Graph Report - tciptakarya-main  (2026-10-02)

## Corpus Check
- 121 files · ~226,429 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1198 nodes · 2218 edges · 92 communities (89 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 228 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc823f44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
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
- Project Context
- MateriManager.tsx
- webhook/route.ts
- dependencies
- prisma.ts
- NotFoundContent.tsx
- refresh
- Decisions
- Decision: Platform deploy
- Decision: Versi Next.js & Prisma di-pin
- berita/route.ts
- Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)
- Decision: Seed idempoten, tidak pernah menimpa password admin
- Decision: Tidak ada payment gateway
- Decision: Database PostgreSQL (Neon), bukan SQLite
- Decision: Prisma `db push` tanpa file migrasi
- Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT`
- Decision: GitHub Pages dinonaktifkan untuk repo
- kelas/[slug]/page.tsx
- requireAdmin
- Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe
- AGENTS.md
- devDependencies
- GaleriList.tsx
- slugify
- BeritaCard.tsx
- Decision: Kop program galeri memakai `<div>`, bukan `<header>`
- FormPendaftaran.tsx
- Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)
- Decision: Berita - isi teks polos, video client-direct, ID video saja
- imap.ts
- pesan/page.tsx
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
- generate-favicon-assets.ts
- BeritaManager.tsx
- Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal
- PendaftaranList.tsx
- pendaftaran/route.ts
- [2026-09-28] — Admin Email Center (`/admin/email`)
- resend.ts
- auth
- Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)
- Decision: Modal pendaftaran di-portal ke `document.body`
- Decision: Materi pelatihan disembunyikan dari publik
- contact/route.ts
- Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram
- ProgramManager.tsx
- Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database
- Decision: Semua mutasi lewat Server Actions + `requireAdmin()`
- Frontend Architecture
- search.ts
- Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe
- Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)
- Decision: `tsconfig.json` `jsx: "preserve"` di-commit
- Backend Architecture
- lib_data_ymdwib
- Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya
- backfill-gallery-year.ts

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 49 edges
2. `Decisions` - 40 edges
3. `next` - 39 edges
4. `refresh()` - 31 edges
5. `textOf()` - 28 edges
6. `prisma` - 26 edges
7. `react` - 26 edges
8. `Services / Utilities — `lib/`` - 20 edges
9. `Project Context` - 18 edges
10. `Last Completed Work` - 17 edges

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

## Communities (92 total, 3 thin omitted)

### Community 0 - "next"
Cohesion: 0.05
Nodes (72): Pages & Layout, Added, Changed, Currently In Progress, Current Implementation, Decision, Decision: Teks website publik diedit dari Admin > Tampilan Website, Important (+64 more)

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
Cohesion: 0.29
Nodes (17): Services / Utilities — `lib/`, Fixed, Last Completed Work, Decision, POST(), isPrismaError(), POST(), runtime (+9 more)

### Community 5 - "ymdWib"
Cohesion: 0.18
Nodes (13): dynamic, metadata, PendaftaranPage(), AdminPendaftaran, getUpcomingJadwal(), hhmmToMinutes(), tanggalJamMinutes(), wibNow() (+5 more)

### Community 6 - "Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper"
Cohesion: 0.33
Nodes (6): Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper, ISR perlu dua request setelah perubahan data, Konsekuensi yang harus ditangani: warna background, Permintaan, Urutan navbar ikut, karena diminta terpisah, Yang dipindahkan

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.14
Nodes (13): name, private, version, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/mailparser (+5 more)

### Community 9 - "AI HANDOFF"
Cohesion: 0.15
Nodes (12): AI HANDOFF, CURRENT STATE, CURRENTLY WORKING ON, DO NOT CHANGE, GIT, GRAPHIFY LOW-TOKEN, IMPORTANT DECISIONS, KNOWN ISSUES (+4 more)

### Community 10 - "data.ts"
Cohesion: 0.14
Nodes (20): 6. Draft = `isActive=false`, dan halaman detail ikut 404, BERITA_SELECT, CategoryRow, fallbackCategory(), GalleryRow, getAllPrograms(), getBeritaAdmin(), getCategories() (+12 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.14
Nodes (15): createJadwal(), updateJadwal(), dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow() (+7 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "Architecture"
Cohesion: 0.18
Nodes (10): Architecture, Database Architecture, Field penting, File Structure, Galeri (admin) — grouping KATEGORI lalu PROGRAM, High Level Architecture, Important Files, Index (+2 more)

### Community 14 - "actions.ts"
Cohesion: 0.06
Nodes (41): HOST_PREFIX, ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, BERITA_IMAGE_BYTES, BERITA_IMAGE_TYPES, BERITA_ISI_MAKS, BERITA_RINGKASAN_MAKS, BeritaInput (+33 more)

### Community 15 - "KategoriManager.tsx"
Cohesion: 0.24
Nodes (9): categorySlugData(), createCategory(), parseCategory(), updateCategory(), dynamic, metadata, AdminCategory, CategoryRow() (+1 more)

### Community 16 - "outbound.ts"
Cohesion: 0.31
Nodes (9): AttachmentInput, bodyToHtml(), replyContext(), sendFromPanel(), SendOutcome, isBlockedEmailFilename(), MAX_EMAIL_ATTACHMENT_BYTES, MAX_EMAIL_ATTACHMENTS (+1 more)

### Community 19 - "sync.ts"
Cohesion: 0.21
Nodes (13): RFC-5322, saveDraft(), previewFromText(), Addr, AddrInput, allAddresses(), DEFAULT_SYNC, firstAddress() (+5 more)

### Community 20 - "Project Context"
Cohesion: 0.11
Nodes (18): Authentication, Business Goal, Current Project Status, Database, Deployment, Development Environment, External Services, Frameworks (+10 more)

### Community 21 - "MateriManager.tsx"
Cohesion: 0.14
Nodes (10): createMateri(), updateMateri(), dynamic, metadata, AdminMateri, MateriEditRow(), MateriManager(), ProgramOption (+2 more)

### Community 22 - "webhook/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, POST(), statusFromEvent(), verifySignature(), ref_node_crypto

### Community 23 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, imapflow, mailparser, next, next-auth, @prisma/client, react (+6 more)

### Community 24 - "prisma.ts"
Cohesion: 0.14
Nodes (20): addresses(), AdminEmailPage(), buildDetail(), dynamic, listRows(), parseTab(), SearchParams, Tab (+12 more)

### Community 25 - "NotFoundContent.tsx"
Cohesion: 0.07
Nodes (24): 2. `notFound()` TIDAK merender root layout (Next 15.5.25), 3. Dua file 404, bukan satu, Decision: Halaman 404 perlu mandiri, dan root layout tidak dirender di sana, Isi 404 tidak memakai `getContentMap()`, Jebakan CSS yang saya buat sendiri (catat supaya tidak terulang), Konteks, Paginasi: 404 dipakai untuk berita draft, Bugs (+16 more)

### Community 26 - "refresh"
Cohesion: 0.13
Nodes (16): Server Actions — `app/admin/actions.ts`, createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteJadwal(), deleteMateri(), deleteProgram(), deleteProgramAction() (+8 more)

### Community 27 - "Decisions"
Cohesion: 0.18
Nodes (10): Current Implementation, Decision, Decision, Decision: Rate limit in-memory diterima, Decision: Tidak ada lapisan auth/role selain Admin, Decisions, Important, Important (+2 more)

### Community 28 - "Decision: Platform deploy"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Platform deploy, Important, Reason

### Community 29 - "Decision: Versi Next.js & Prisma di-pin"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Versi Next.js & Prisma di-pin, Important, Reason

### Community 30 - "berita/route.ts"
Cohesion: 0.14
Nodes (18): [2026-10-02] — Orientasi video vertikal (9:16) + dukungan Instagram Reels, [2026-10-02] — Section Berita (`/admin/berita`, `/berita`), Added, Fixed, Fixed, Known issues (di luar cakupan task ini), Technical Notes, Technical Notes (+10 more)

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

### Community 39 - "requireAdmin"
Cohesion: 0.21
Nodes (17): Changed, Current Implementation, deleteEmailAction(), requireAdmin(), saveDraftAction(), sendEmailAction(), setEmailReadAction(), syncEmailInboxAction() (+9 more)

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
Cohesion: 0.06
Nodes (31): File Upload Architecture (galeri & materi), Galeri publik — PROGRAM → TAHUN → FOTO (2026-09-27), [2026-09-27], Added, Changed, Technical Notes, Alternatives Considered, Current Implementation (+23 more)

### Community 44 - "slugify"
Cohesion: 0.19
Nodes (13): Alternatives Considered, Current Implementation, Decision, Decision: Kategori dinamis dari DB + slug unik otomatis + larangan hapus bila terpakai, Important, Reason, slugify(), uniqueSlug() (+5 more)

### Community 45 - "BeritaCard.tsx"
Cohesion: 0.42
Nodes (6): BeritaCard(), BeritaMedia(), embedUrl(), posterUrl(), BeritaRow, formatTanggalIndo()

### Community 46 - "Decision: Kop program galeri memakai `<div>`, bukan `<header>`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Kop program galeri memakai `<div>`, bukan `<header>`, Important, Reason

### Community 47 - "FormPendaftaran.tsx"
Cohesion: 0.25
Nodes (5): Decision, FormPendaftaran(), PendaftaranTarget, State, react-dom

### Community 48 - "Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`), Important, Reason

### Community 49 - "Decision: Berita - isi teks polos, video client-direct, ID video saja"
Cohesion: 0.22
Nodes (9): 1. Isi artikel = teks polos, bukan HTML, 2. Video = unggah (client-direct) ATAU link YouTube/Vimeo, 3. Route upload berita TERPISAH dari route galeri, 4. Hanya ID video yang disimpan, bukan URL penuh, 5. Filter kategori di browser, bukan `?kategori=`, Batas yang belum diperbaiki (ditemukan saat task ini), Decision: Berita - isi teks polos, video client-direct, ID video saja, Jebakan yang terulang (penting!) (+1 more)

### Community 50 - "imap.ts"
Cohesion: 0.18
Nodes (18): dynamic, GET(), fetchAttachment(), fetchMessageByUid(), fetchRecentMessages(), IMAP_NOT_CONFIGURED, imapConfig, MailboxMessage (+10 more)

### Community 51 - "pesan/page.tsx"
Cohesion: 0.25
Nodes (6): deleteContactMessage(), dynamic, metadata, AdminMessage, PesanList(), STATUS_LABEL

### Community 52 - "Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link`, Important, Reason

### Community 53 - "Current Problems"
Cohesion: 0.10
Nodes (20): Broken Features, Catatan: `graphify label` tidak butuh API key, Current Blockers, Current Development Status, Current Problems, Current State, Exact Next Step, Issue 11 — Batas 4,5 MB Vercel vs UI yang menulis 8 MB (+12 more)

### Community 54 - "berita/[slug]/page.tsx"
Cohesion: 0.16
Nodes (15): 4. Orientation default-nya "horizontal", dan kartu tetap 16:9, BeritaIndexPage(), dynamic, metadata, revalidate, BeritaDetailPage(), dynamic, generateMetadata() (+7 more)

### Community 55 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:push, db:seed, db:setup, db:studio, dev, start

### Community 56 - "(dashboard)/layout.tsx"
Cohesion: 0.19
Nodes (10): Issue 10 — Upload foto mustahil di production (`BLOB_READ_WRITE_TOKEN` kosong), 1. 404 bawaan Next.js menyuntik CSS sendiri, AdminLayout(), dynamic, AdminNav(), NAV, SignOutButton(), ThemeToggle() (+2 more)

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
Cohesion: 0.24
Nodes (8): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, next-auth

### Community 63 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3

### Community 64 - "requestPasswordReset"
Cohesion: 0.24
Nodes (8): Security Rules, Email Architecture, getClientIp(), requestPasswordReset(), metadata, ForgotPasswordForm(), sendPasswordResetEmail(), siteUrl()

### Community 65 - "Changelog"
Cohesion: 0.05
Nodes (44): [2026-09-23], [2026-09-24], [2026-09-25], [2026-09-26], [2026-09-28] — Active state sidebar, logo, dan anchor hash, [2026-10-02] — Artwork favicon: navy rounded-square + feather putih, [2026-10-02] — Menu "Jadwal" di navbar + empty state Berita, [2026-10-02] — Perbaikan halaman 404 (ditemukan saat cek bug di `/berita`) (+36 more)

### Community 66 - "content.ts"
Cohesion: 0.16
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 67 - "generate-favicon-assets.ts"
Cohesion: 0.33
Nodes (8): composeIcon(), main(), roundedSquare(), whiteSilhouette(), writeIco(), ref_node_fs, ref_node_path, sharp

### Community 68 - "BeritaManager.tsx"
Cohesion: 0.07
Nodes (32): Added, ActionState, beritaData(), createBerita(), deleteBerita(), gantiPassword(), resetPassword(), updateBerita() (+24 more)

### Community 69 - "Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal"
Cohesion: 0.40
Nodes (5): 1. Menu berbasis anchor harus punya kondisi kosong yang jelas, 2. Menambah menu ke navbar ada batas lebar yang pasti (matematis), 3. Blok drawer 960px adalah SALINAN, bukan pemindahan, 4. Verifikasi layout navbar harus menunggu font & logo, Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal

### Community 70 - "PendaftaranList.tsx"
Cohesion: 0.29
Nodes (7): deletePendaftaran(), updateStatusPendaftaran(), EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), PENDAFTARAN_STATUS_LIST

### Community 71 - "pendaftaran/route.ts"
Cohesion: 0.36
Nodes (5): POST(), buckets, isRateLimited(), sendPendaftaranNotification(), pendaftaranSchema

### Community 72 - "[2026-09-28] — Admin Email Center (`/admin/email`)"
Cohesion: 0.22
Nodes (9): [2026-09-28] — Admin Email Center (`/admin/email`), Changed, Fixed, Known Issues (Email Center), Performance, Performance — cache 60 detik untuk halaman publik, Technical Notes, Verified (draft, hapus, pencarian) (+1 more)

### Community 73 - "resend.ts"
Cohesion: 0.27
Nodes (9): EmailStatus, PanelAttachment, panelFrom(), panelResendKey(), PanelSendResult, PanelSendStatus, sendPanelEmail(), textFromHtml() (+1 more)

### Community 74 - "auth"
Cohesion: 0.33
Nodes (6): POST(), runtime, auth, BERITA_VIDEO_BYTES, BERITA_VIDEO_TYPES, @vercel/blob

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
Cohesion: 0.25
Nodes (8): 1. Embed Instagram - fakta yang mengubah jawaban, 2. Permalink pakai `/p/`, bukan `/reel/`, 3. Prefix host: `yt:` / `vm:` / `ig:`, 5. Risiko yang diterima secara sadar, 6. Batas fisik yang tidak bisa dihilangkan, 7. Yang belum terverifikasi, Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram, Konteks

### Community 80 - "ProgramManager.tsx"
Cohesion: 0.24
Nodes (8): createProgram(), updateProgram(), dynamic, metadata, AdminCategory, AdminProgram, ProgramManager(), ProgramRow()

### Community 81 - "Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database"
Cohesion: 0.40
Nodes (5): Alternatives Considered, Decision, Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database, Important, Reason

### Community 82 - "Decision: Semua mutasi lewat Server Actions + `requireAdmin()`"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision, Decision: Semua mutasi lewat Server Actions + `requireAdmin()`, Important, Reason

### Community 83 - "Frontend Architecture"
Cohesion: 0.33
Nodes (6): Components, Design System & Halaman, Form Handling & Validation, Frontend Architecture, Hooks & State Management, Routing

### Community 84 - "search.ts"
Cohesion: 0.17
Nodes (16): Alternatives Considered, Current Implementation, Decision, Decision: Email Center — draft, hapus, dan pencarian akurat, Important, Reason, dropDraft(), buildEmailWhere() (+8 more)

### Community 85 - "Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe"
Cohesion: 0.33
Nodes (6): Alternatives Considered, Current Implementation, Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe, Important, Reason, materiFileFromFormData()

### Community 86 - "Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)"
Cohesion: 0.33
Nodes (6): Current Implementation, Decision, Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token), Important, Reason, KuotaAware

### Community 87 - "Decision: `tsconfig.json` `jsx: "preserve"` di-commit"
Cohesion: 0.50
Nodes (4): Decision, Decision: `tsconfig.json` `jsx: "preserve"` di-commit, Important, Reason

### Community 88 - "Backend Architecture"
Cohesion: 0.67
Nodes (3): API Routes, Backend Architecture, Middleware & Authorization

### Community 95 - "Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya"
Cohesion: 0.29
Nodes (8): Fixed, Alternatives Considered, Current Implementation, Decision, Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya, Important, Reason, panelErrorMessage()

### Community 98 - "backfill-gallery-year.ts"
Cohesion: 0.60
Nodes (4): main(), prisma, tahunDariCaption(), valid()

## Knowledge Gaps
- **552 isolated node(s):** `dynamic`, `revalidate`, `Props`, `revalidate`, `metadata` (+547 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Decisions` connect `Decisions` to `next`, `Decision: Galeri publik memakai container & grid sendiri`, `Decision: Posisi section "Kabar Terbaru" di atas "Tentang Kami" + latar paper`, `NotFoundContent.tsx`, `Decision: Platform deploy`, `Decision: Versi Next.js & Prisma di-pin`, `Decision: Email tidak boleh memblokir penyimpanan data (PRD §8)`, `Decision: Seed idempoten, tidak pernah menimpa password admin`, `Decision: Tidak ada payment gateway`, `Decision: Database PostgreSQL (Neon), bukan SQLite`, `Decision: Prisma `db push` tanpa file migrasi`, `Decision: Sinkronisasi `SOURCE CODE` + `AI_CONTEXT``, `Decision: GitHub Pages dinonaktifkan untuk repo`, `Decision: Style galeri berupa class CSS di globals (bukan utility Tailwind) + aturan warna dark-safe`, `GaleriList.tsx`, `slugify`, `Decision: Kop program galeri memakai `<div>`, bukan `<header>``, `Decision: Hanya SATU server Next pada satu waktu (`next dev` ≠ bersamaan dengan `next start`)`, `Decision: Berita - isi teks polos, video client-direct, ID video saja`, `Decision: Active state menu admin dari `usePathname()` + satu pola `.admin-nav-link``, `Decision: Logo dipakai dalam 2 varian (teks gelap & teks putih)`, `Decision: Halaman publik di-cache 60 detik (ISR), admin tetap real-time`, `Decision: Fragment anchor dibersihkan dari address bar setelah klik (Opsi B)`, `Decision: Galeri dikaitkan lewat relasi, bukan string kategori`, `Changelog`, `Decision: Menu anchor di navbar wajib punya empty state; 8 menu memaksa drawer lebih awal`, `Decision: Sidebar admin fixed lewat flex + `h-dvh` (bukan `position: fixed`)`, `Decision: Modal pendaftaran di-portal ke `document.body``, `Decision: Materi pelatihan disembunyikan dari publik`, `Decision: Video vertikal butuh mode orientasi sendiri; embed pakai pola Instagram`, `Decision: Email Center — Hostinger (inbound IMAP) + Resend (outbound), cache di database`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `search.ts`, `Decision: Penyimpanan foto wajib Vercel Blob di hosting ephemeral + error bertipe`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Decision: `tsconfig.json` `jsx: "preserve"` di-commit`, `Decision: Kegagalan kirim email Resend harus menampilkan penyebabnya`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `requireAdmin` to `next`, `AI HANDOFF`, `JadwalManager.tsx`, `Architecture`, `actions.ts`, `KategoriManager.tsx`, `Project Context`, `MateriManager.tsx`, `refresh`, `AGENTS.md`, `GaleriList.tsx`, `pesan/page.tsx`, `requestPasswordReset`, `Changelog`, `BeritaManager.tsx`, `PendaftaranList.tsx`, `auth`, `ProgramManager.tsx`, `Decision: Semua mutasi lewat Server Actions + `requireAdmin()``, `search.ts`, `Decision: tools graphify dipakai untuk navigasi codebase (dengan disiplin token)`, `Backend Architecture`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `Services / Utilities — `lib/``, `package.json`, `actions.ts`, `webhook/route.ts`, `NotFoundContent.tsx`, `berita/route.ts`, `kelas/[slug]/page.tsx`, `requireAdmin`, `GaleriList.tsx`, `BeritaCard.tsx`, `imap.ts`, `berita/[slug]/page.tsx`, `(dashboard)/layout.tsx`, `program/[slug]/page.tsx`, `auth.ts`, `requestPasswordReset`, `BeritaManager.tsx`, `pendaftaran/route.ts`, `auth`, `contact/route.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `requireAdmin()` (e.g. with `Development Rules` and `Security Rules`) actually correct?**
  _`requireAdmin()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `refresh()` (e.g. with `Form Handling & Validation` and `Catatan operasional`) actually correct?**
  _`refresh()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `textOf()` (e.g. with `Services / Utilities — `lib/`` and `Current Implementation`) actually correct?**
  _`textOf()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `revalidate`, `Props` to the rest of the system?**
  _552 weakly-connected nodes found - possible documentation gaps or missing edges._