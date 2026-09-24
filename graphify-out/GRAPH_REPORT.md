# Graph Report - tciptakarya-main  (2026-09-25)

## Corpus Check
- 70 files · ~148,508 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 426 nodes · 757 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29cab506`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- auth.ts
- next
- migrate-categories.ts
- script.js
- package.json
- requestPasswordReset
- data.ts
- MateriManager.tsx
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- dependencies
- (public)/layout.tsx
- AGENTS.md
- reset-password/page.tsx
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
- `MateriEditRow()` --indirect_call--> `updateMateri()`  [INFERRED]
  components/admin/MateriManager.tsx → app/admin/actions.ts
- `TestimoniManager()` --indirect_call--> `createTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `CategoryRow()` --indirect_call--> `updateCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts
- `ProgramRow()` --indirect_call--> `updateProgram()`  [INFERRED]
  components/admin/ProgramManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (19 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (22): dynamic, GalleryGrid(), GalleryItem, LightboxState, About(), Hero(), VisiMisi(), JadwalTerdekat() (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.07
Nodes (20): gantiPassword(), dynamic, metadata, dynamic, metadata, CARDS, dynamic, dynamic (+12 more)

### Community 3 - "actions.ts"
Cohesion: 0.07
Nodes (57): ActionState, categorySlugData(), createCategory(), createJadwal(), createMateri(), createProgram(), createTestimonial(), deleteCategory() (+49 more)

### Community 4 - "auth.ts"
Cohesion: 0.09
Nodes (27): AdminLayout(), dynamic, NAV, POST(), runtime, SignOutButton(), auth, authConfig (+19 more)

### Community 5 - "next"
Cohesion: 0.09
Nodes (14): dynamic, metadata, metadata, app_globals, fraunces, jakarta, metadata, AdminGalleryItem (+6 more)

### Community 6 - "migrate-categories.ts"
Cohesion: 0.38
Nodes (6): DEFAULT_CATEGORIES, ensureCategory(), main(), prisma, resolveSlug(), @prisma/client

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, devDependencies, prisma, tailwindcss (+26 more)

### Community 9 - "requestPasswordReset"
Cohesion: 0.13
Nodes (13): getClientIp(), requestPasswordReset(), metadata, POST(), ForgotPasswordForm(), buckets, isRateLimited(), EmailStatus (+5 more)

### Community 10 - "data.ts"
Cohesion: 0.07
Nodes (43): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, HomePage(), CATEGORIES (+35 more)

### Community 11 - "MateriManager.tsx"
Cohesion: 0.14
Nodes (8): dynamic, metadata, AdminMateri, MateriEditRow(), MateriManager(), ProgramOption, TIPE_BADGE, MATERI_TIPE_LIST

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcryptjs, next, next-auth, @prisma/client, react, react-dom, resend (+3 more)

### Community 14 - "(public)/layout.tsx"
Cohesion: 0.21
Nodes (7): Footer(), NAV_LINKS, Header(), NAV_LINKS, ThemeToggle(), toggle(), ToTop()

### Community 16 - "reset-password/page.tsx"
Cohesion: 0.26
Nodes (7): resetPassword(), metadata, ResetPasswordPage(), ResetPasswordForm(), generateResetToken(), hashToken(), ref_node_crypto

## Knowledge Gaps
- **171 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `dynamic` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 211 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `actions.ts`, `auth.ts`, `package.json`, `requestPasswordReset`, `data.ts`, `(public)/layout.tsx`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `prisma.ts`, `actions.ts`, `next`, `package.json`, `requestPasswordReset`, `MateriManager.tsx`, `(public)/layout.tsx`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `auth.ts`, `next`, `requestPasswordReset`, `data.ts`, `MateriManager.tsx`, `reset-password/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10756302521008404 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07226890756302522 - nodes in this community are weakly interconnected._