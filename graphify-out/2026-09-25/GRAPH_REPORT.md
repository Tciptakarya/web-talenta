# Graph Report - tciptakarya-main  (2026-09-25)

## Corpus Check
- 76 files · ~155,659 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 477 nodes · 891 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af975b79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- auth.ts
- next
- content.ts
- script.js
- package.json
- pendaftaran/route.ts
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- (public)/layout.tsx
- AGENTS.md
- schemas.ts
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `next` - 24 edges
2. `requireAdmin()` - 22 edges
3. `refresh()` - 20 edges
4. `react` - 19 edges
5. `prisma` - 18 edges
6. `compilerOptions` - 16 edges
7. `safe()` - 12 edges
8. `ymdWib()` - 11 edges
9. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
10. `KelasSlugPage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `JadwalEditRow()` --indirect_call--> `updateJadwal()`  [INFERRED]
  components/admin/JadwalManager.tsx → app/admin/actions.ts
- `MateriEditRow()` --indirect_call--> `updateMateri()`  [INFERRED]
  components/admin/MateriManager.tsx → app/admin/actions.ts
- `JadwalPage()` --calls--> `ymdWib()`  [EXTRACTED]
  app/admin/(dashboard)/jadwal/page.tsx → lib/data.ts
- `TestimoniManager()` --indirect_call--> `createTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (19 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.12
Nodes (20): dynamic, GalleryGrid(), GalleryItem, LightboxState, About(), Hero(), VisiMisi(), Kontak() (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.06
Nodes (23): dynamic, metadata, dynamic, metadata, CARDS, dynamic, dynamic, metadata (+15 more)

### Community 3 - "actions.ts"
Cohesion: 0.11
Nodes (41): ActionState, categorySlugData(), createCategory(), createJadwal(), createMateri(), createProgram(), createTestimonial(), deleteCategory() (+33 more)

### Community 4 - "auth.ts"
Cohesion: 0.09
Nodes (25): AdminLayout(), dynamic, NAV, POST(), runtime, auth, authConfig, credentialsSchema (+17 more)

### Community 5 - "next"
Cohesion: 0.10
Nodes (15): resetPassword(), metadata, metadata, ResetPasswordPage(), app_globals, fraunces, jakarta, metadata (+7 more)

### Community 6 - "content.ts"
Cohesion: 0.11
Nodes (18): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+10 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (45): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+37 more)

### Community 9 - "pendaftaran/route.ts"
Cohesion: 0.12
Nodes (16): getClientIp(), requestPasswordReset(), metadata, POST(), POST(), ForgotPasswordForm(), buckets, isRateLimited() (+8 more)

### Community 10 - "data.ts"
Cohesion: 0.06
Nodes (58): dynamic, metadata, PendaftaranPage(), dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage() (+50 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.15
Nodes (12): dynamic, JadwalPage(), metadata, AdminJadwal, formatTanggalYmd(), JadwalEditRow(), JadwalManager(), JadwalRow() (+4 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "MateriManager.tsx"
Cohesion: 0.14
Nodes (8): dynamic, metadata, AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 14 - "(public)/layout.tsx"
Cohesion: 0.21
Nodes (7): Footer(), NAV_LINKS, Header(), NAV_LINKS, ThemeToggle(), toggle(), ToTop()

### Community 16 - "schemas.ts"
Cohesion: 0.08
Nodes (25): AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), ALLOWED_MATERI_TYPES, CategoryInput, categorySchema (+17 more)

## Knowledge Gaps
- **183 isolated node(s):** `Menjalankan lokal`, `Konfigurasi (.env)`, `Deploy ke produksi`, `Struktur`, `Catatan` (+178 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 224 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `actions.ts`, `auth.ts`, `package.json`, `pendaftaran/route.ts`, `data.ts`, `(public)/layout.tsx`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `prisma.ts`, `actions.ts`, `next`, `package.json`, `pendaftaran/route.ts`, `data.ts`, `JadwalManager.tsx`, `MateriManager.tsx`, `(public)/layout.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `auth.ts`, `next`, `pendaftaran/route.ts`, `data.ts`, `JadwalManager.tsx`, `MateriManager.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `Menjalankan lokal`, `Konfigurasi (.env)`, `Deploy ke produksi` to the rest of the system?**
  _183 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06153846153846154 - nodes in this community are weakly interconnected._