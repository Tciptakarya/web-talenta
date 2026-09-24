# Graph Report - tciptakarya-main  (2026-09-24)

## Corpus Check
- 64 files · ~143,696 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 371 nodes · 639 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e9393f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- requireAdmin
- (dashboard)/layout.tsx
- galeri/page.tsx
- slugify
- script.js
- package.json
- actions.ts
- data.ts
- next
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- auth.ts
- AGENTS.md
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `next` - 21 edges
2. `react` - 16 edges
3. `compilerOptions` - 16 edges
4. `requireAdmin()` - 14 edges
5. `prisma` - 14 edges
6. `refresh()` - 12 edges
7. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
8. `safe()` - 9 edges
9. `getActiveCategories()` - 9 edges
10. `updateCategory()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `CategoryRow()` --indirect_call--> `updateCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts
- `ProgramRow()` --indirect_call--> `updateProgram()`  [INFERRED]
  components/admin/ProgramManager.tsx → app/admin/actions.ts
- `generateMetadata()` --calls--> `getCategoryBySlug()`  [EXTRACTED]
  app/(public)/kelas/[slug]/page.tsx → lib/data.ts
- `KelasIndexPage()` --calls--> `getActiveCategories()`  [EXTRACTED]
  app/(public)/kelas/page.tsx → lib/data.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (22): dynamic, Footer(), NAV_LINKS, GalleryGrid(), GalleryItem, LightboxState, About(), Hero() (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "prisma.ts"
Cohesion: 0.10
Nodes (16): ActionState, deleteContactMessage(), gantiPassword(), CARDS, dynamic, dynamic, metadata, dynamic (+8 more)

### Community 3 - "requireAdmin"
Cohesion: 0.09
Nodes (29): categorySlugData(), createCategory(), createProgram(), createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteProgram(), deleteProgramAction() (+21 more)

### Community 4 - "(dashboard)/layout.tsx"
Cohesion: 0.11
Nodes (22): AdminLayout(), dynamic, NAV, POST(), runtime, SignOutButton(), Header(), NAV_LINKS (+14 more)

### Community 5 - "galeri/page.tsx"
Cohesion: 0.20
Nodes (7): deleteGalleryImage(), dynamic, metadata, AdminGalleryItem, GaleriList(), UploadForm(), UploadFormProps

### Community 6 - "slugify"
Cohesion: 0.36
Nodes (7): slugify(), uniqueSlug(), DEFAULT_CATEGORIES, ensureCategory(), main(), prisma, resolveSlug()

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "package.json"
Cohesion: 0.04
Nodes (45): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, dependencies, bcryptjs, next (+37 more)

### Community 9 - "actions.ts"
Cohesion: 0.10
Nodes (23): getClientIp(), requestPasswordReset(), metadata, POST(), ForgotPasswordForm(), buckets, isRateLimited(), EmailStatus (+15 more)

### Community 10 - "data.ts"
Cohesion: 0.08
Nodes (37): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, HomePage(), CATEGORIES (+29 more)

### Community 11 - "next"
Cohesion: 0.13
Nodes (13): resetPassword(), metadata, ResetPasswordPage(), app_globals, fraunces, jakarta, metadata, ResetPasswordForm() (+5 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 13 - "auth.ts"
Cohesion: 0.15
Nodes (10): metadata, LoginForm(), authConfig, credentialsSchema, handlers, signIn, signOut, { auth } (+2 more)

## Knowledge Gaps
- **158 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `dynamic` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(public)/page.tsx`, `prisma.ts`, `(dashboard)/layout.tsx`, `galeri/page.tsx`, `package.json`, `actions.ts`, `data.ts`, `auth.ts`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `react` connect `(public)/page.tsx` to `prisma.ts`, `requireAdmin`, `(dashboard)/layout.tsx`, `galeri/page.tsx`, `package.json`, `actions.ts`, `next`, `auth.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `prisma` connect `prisma.ts` to `requireAdmin`, `(dashboard)/layout.tsx`, `galeri/page.tsx`, `actions.ts`, `data.ts`, `next`, `auth.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._