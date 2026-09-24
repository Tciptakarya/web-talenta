# Graph Report - tciptakarya-main  (2026-09-24)

## Corpus Check
- 69 files · ~148,463 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 425 nodes · 759 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d0e33f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- (dashboard)/layout.tsx
- next
- content.ts
- script.js
- package.json
- requestPasswordReset
- data.ts
- JadwalManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- dependencies
- devDependencies
- AGENTS.md
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `next` - 22 edges
2. `requireAdmin()` - 20 edges
3. `refresh()` - 18 edges
4. `react` - 18 edges
5. `prisma` - 16 edges
6. `compilerOptions` - 16 edges
7. `safe()` - 12 edges
8. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
9. `ActionState` - 9 edges
10. `Reveal()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `JadwalEditRow()` --indirect_call--> `updateJadwal()`  [INFERRED]
  components/admin/JadwalManager.tsx → app/admin/actions.ts
- `TestimoniManager()` --indirect_call--> `createTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `KategoriManager()` --indirect_call--> `createCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts
- `CategoryRow()` --indirect_call--> `updateCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.08
Nodes (29): dynamic, Footer(), NAV_LINKS, GalleryGrid(), GalleryItem, LightboxState, Header(), NAV_LINKS (+21 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.05
Nodes (28): gantiPassword(), dynamic, metadata, dynamic, metadata, dynamic, metadata, CARDS (+20 more)

### Community 3 - "actions.ts"
Cohesion: 0.07
Nodes (56): ActionState, categorySlugData(), createCategory(), createJadwal(), createMateri(), createProgram(), createTestimonial(), deleteCategory() (+48 more)

### Community 4 - "(dashboard)/layout.tsx"
Cohesion: 0.14
Nodes (17): AdminLayout(), dynamic, NAV, POST(), runtime, SignOutButton(), auth, ALLOWED_IMAGE_TYPES (+9 more)

### Community 5 - "next"
Cohesion: 0.10
Nodes (15): resetPassword(), metadata, metadata, ResetPasswordPage(), app_globals, fraunces, jakarta, metadata (+7 more)

### Community 6 - "content.ts"
Cohesion: 0.12
Nodes (17): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+9 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (35): authConfig, credentialsSchema, handlers, signIn, signOut, { auth }, config, allowScripts (+27 more)

### Community 9 - "requestPasswordReset"
Cohesion: 0.13
Nodes (13): getClientIp(), requestPasswordReset(), metadata, POST(), ForgotPasswordForm(), buckets, isRateLimited(), EmailStatus (+5 more)

### Community 10 - "data.ts"
Cohesion: 0.11
Nodes (33): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, TIPE_BADGE, HomePage() (+25 more)

### Community 11 - "JadwalManager.tsx"
Cohesion: 0.17
Nodes (7): dynamic, metadata, AdminJadwal, JadwalEditRow(), JadwalManager(), ProgramOption, HARI_LIST

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcryptjs, next, next-auth, @prisma/client, react, react-dom, resend (+3 more)

### Community 14 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node, @types/react, @types/react-dom (+1 more)

## Knowledge Gaps
- **172 isolated node(s):** `TIPE_BADGE`, `Props`, `dynamic`, `metadata`, `dynamic` (+167 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 211 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `actions.ts`, `(dashboard)/layout.tsx`, `package.json`, `requestPasswordReset`, `data.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `prisma.ts`, `actions.ts`, `next`, `package.json`, `requestPasswordReset`, `JadwalManager.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `(dashboard)/layout.tsx`, `next`, `package.json`, `requestPasswordReset`, `data.ts`, `JadwalManager.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `TIPE_BADGE`, `Props`, `dynamic` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05230496453900709 - nodes in this community are weakly interconnected._