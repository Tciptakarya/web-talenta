# Graph Report - tciptakarya-main  (2026-09-25)

## Corpus Check
- 76 files · ~158,076 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 489 nodes · 926 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `256c2dc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- next
- reset-password/page.tsx
- content.ts
- script.js
- package.json
- pendaftaran/route.ts
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- schemas.ts
- AGENTS.md
- GaleriList.tsx
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 24 edges
2. `next` - 24 edges
3. `refresh()` - 22 edges
4. `react` - 20 edges
5. `prisma` - 18 edges
6. `compilerOptions` - 16 edges
7. `safe()` - 12 edges
8. `ymdWib()` - 11 edges
9. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
10. `ActionState` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GaleriCard()` --indirect_call--> `updateGalleryImage()`  [INFERRED]
  components/admin/GaleriList.tsx → app/admin/actions.ts
- `JadwalEditRow()` --indirect_call--> `updateJadwal()`  [INFERRED]
  components/admin/JadwalManager.tsx → app/admin/actions.ts
- `MateriEditRow()` --indirect_call--> `updateMateri()`  [INFERRED]
  components/admin/MateriManager.tsx → app/admin/actions.ts
- `JadwalPage()` --calls--> `ymdWib()`  [EXTRACTED]
  app/admin/(dashboard)/jadwal/page.tsx → lib/data.ts
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (19 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.12
Nodes (20): dynamic, GalleryGrid(), GalleryItem, GalleryProgram, About(), Hero(), VisiMisi(), Kontak() (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.09
Nodes (16): CARDS, dynamic, dynamic, metadata, dynamic, metadata, dynamic, metadata (+8 more)

### Community 3 - "actions.ts"
Cohesion: 0.07
Nodes (56): ActionState, categorySlugData(), createCategory(), createJadwal(), createMateri(), createProgram(), createTestimonial(), deleteCategory() (+48 more)

### Community 4 - "next"
Cohesion: 0.06
Nodes (27): dynamic, NAV, metadata, app_globals, fraunces, jakarta, metadata, LoginForm() (+19 more)

### Community 5 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (7): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), ref_node_crypto

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
Cohesion: 0.15
Nodes (13): getClientIp(), requestPasswordReset(), metadata, POST(), ForgotPasswordForm(), buckets, isRateLimited(), EmailStatus (+5 more)

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

### Community 14 - "schemas.ts"
Cohesion: 0.07
Nodes (31): runtime, AdminPendaftaran, EMAIL_STYLE, PendaftaranList(), STATUS_STYLE, waFollowUp(), ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES (+23 more)

### Community 16 - "GaleriList.tsx"
Cohesion: 0.14
Nodes (13): dynamic, metadata, AdminGalleryItem, AdminGalleryProgram, GaleriCard(), GaleriList(), Antrean, AntreanStatus (+5 more)

## Knowledge Gaps
- **185 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `Props` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 227 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `actions.ts`, `reset-password/page.tsx`, `package.json`, `pendaftaran/route.ts`, `data.ts`, `schemas.ts`, `GaleriList.tsx`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `actions.ts`, `next`, `reset-password/page.tsx`, `package.json`, `pendaftaran/route.ts`, `data.ts`, `JadwalManager.tsx`, `MateriManager.tsx`, `GaleriList.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `next`, `reset-password/page.tsx`, `pendaftaran/route.ts`, `data.ts`, `JadwalManager.tsx`, `MateriManager.tsx`, `schemas.ts`, `GaleriList.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09401709401709402 - nodes in this community are weakly interconnected._