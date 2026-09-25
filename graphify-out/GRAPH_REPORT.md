# Graph Report - tciptakarya-main  (2026-09-25)

## Corpus Check
- 71 files · ~150,555 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 446 nodes · 805 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ee58442`
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
- requestPasswordReset
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- MateriManager.tsx
- (public)/layout.tsx
- AGENTS.md
- schemas.ts
- { GET, POST }
- reset-password/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 23 edges
2. `requireAdmin()` - 20 edges
3. `refresh()` - 18 edges
4. `react` - 18 edges
5. `compilerOptions` - 16 edges
6. `prisma` - 16 edges
7. `safe()` - 12 edges
8. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
9. `getActiveCategories()` - 9 edges
10. `ActionState` - 9 edges

## Surprising Connections (you probably didn't know these)
- `JadwalEditRow()` --indirect_call--> `updateJadwal()`  [INFERRED]
  components/admin/JadwalManager.tsx → app/admin/actions.ts
- `MateriEditRow()` --indirect_call--> `updateMateri()`  [INFERRED]
  components/admin/MateriManager.tsx → app/admin/actions.ts
- `JadwalPage()` --calls--> `ymdWib()`  [EXTRACTED]
  app/admin/(dashboard)/jadwal/page.tsx → lib/data.ts
- `JadwalManager()` --indirect_call--> `createJadwal()`  [INFERRED]
  components/admin/JadwalManager.tsx → app/admin/actions.ts
- `MateriManager()` --indirect_call--> `createMateri()`  [INFERRED]
  components/admin/MateriManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (20 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.10
Nodes (26): dynamic, GalleryGrid(), GalleryItem, LightboxState, About(), Hero(), VisiMisi(), DayBadge() (+18 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.08
Nodes (17): dynamic, metadata, CARDS, dynamic, dynamic, metadata, dynamic, metadata (+9 more)

### Community 3 - "actions.ts"
Cohesion: 0.10
Nodes (45): ActionState, categorySlugData(), createCategory(), createJadwal(), createMateri(), createProgram(), createTestimonial(), deleteCategory() (+37 more)

### Community 4 - "auth.ts"
Cohesion: 0.13
Nodes (16): AdminLayout(), dynamic, NAV, POST(), SignOutButton(), auth, authConfig, credentialsSchema (+8 more)

### Community 5 - "next"
Cohesion: 0.09
Nodes (14): dynamic, metadata, metadata, app_globals, fraunces, jakarta, metadata, AdminGalleryItem (+6 more)

### Community 6 - "content.ts"
Cohesion: 0.12
Nodes (17): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+9 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (45): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+37 more)

### Community 9 - "requestPasswordReset"
Cohesion: 0.13
Nodes (13): getClientIp(), requestPasswordReset(), metadata, POST(), ForgotPasswordForm(), buckets, isRateLimited(), EmailStatus (+5 more)

### Community 10 - "data.ts"
Cohesion: 0.09
Nodes (42): dynamic, KelasIndexPage(), metadata, formatTanggalYmd(), generateMetadata(), KelasSlugPage(), Props, HomePage() (+34 more)

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
Cohesion: 0.10
Nodes (21): runtime, ALLOWED_IMAGE_TYPES, ALLOWED_MATERI_TYPES, CategoryInput, categorySchema, ContactInput, forgotPasswordSchema, GantiPasswordInput (+13 more)

### Community 19 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (7): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), ref_node_crypto

## Knowledge Gaps
- **174 isolated node(s):** `Props`, `CategoryRow`, `ProgramRow`, `GalleryRow`, `JadwalRow` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 212 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `actions.ts`, `auth.ts`, `package.json`, `requestPasswordReset`, `data.ts`, `(public)/layout.tsx`, `schemas.ts`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `actions.ts`, `next`, `package.json`, `requestPasswordReset`, `JadwalManager.tsx`, `MateriManager.tsx`, `(public)/layout.tsx`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `auth.ts`, `next`, `requestPasswordReset`, `data.ts`, `JadwalManager.tsx`, `MateriManager.tsx`, `schemas.ts`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `Props`, `CategoryRow`, `ProgramRow` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08374384236453201 - nodes in this community are weakly interconnected._