# Graph Report - tciptakarya-main  (2026-09-23)

## Corpus Check
- 58 files · ~141,826 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 342 nodes · 527 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12a1b6f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- (dashboard)/layout.tsx
- dependencies
- content.ts
- script.js
- scripts
- devDependencies
- data.ts
- 🚀 Panduan Publish — Hostinger Web Apps + Resend
- login/page.tsx
- app/layout.tsx
- AGENTS.md
- next.config.ts
- { GET, POST }
- galeri/page.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `requireAdmin()` - 13 edges
3. `prisma` - 13 edges
4. `refresh()` - 12 edges
5. `🚀 Panduan Publish — Hostinger Web Apps + Resend` - 11 edges
6. `safe()` - 9 edges
7. `getActiveCategories()` - 9 edges
8. `updateCategory()` - 8 edges
9. `Reveal()` - 8 edges
10. `slugify()` - 8 edges

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

## Communities (19 total, 4 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.10
Nodes (22): dynamic, Footer(), NAV_LINKS, GalleryGrid(), GalleryItem, LightboxState, About(), Hero() (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, legacy, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "prisma.ts"
Cohesion: 0.08
Nodes (19): dynamic, metadata, CARDS, dynamic, dynamic, metadata, dynamic, metadata (+11 more)

### Community 3 - "actions.ts"
Cohesion: 0.09
Nodes (43): ActionState, categorySlugData(), createCategory(), createProgram(), createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteContactMessage() (+35 more)

### Community 4 - "(dashboard)/layout.tsx"
Cohesion: 0.09
Nodes (21): AdminLayout(), dynamic, NAV, POST(), runtime, SignOutButton(), Header(), NAV_LINKS (+13 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (21): bcryptjs, next, next-auth, dependencies, bcryptjs, next, next-auth, @prisma/client (+13 more)

### Community 6 - "content.ts"
Cohesion: 0.21
Nodes (12): CATEGORIES, DefaultCategory, DefaultGalleryImage, DefaultProgram, DefaultTestimonial, GALLERY_IMAGES, PROGRAMS, TESTIMONIALS (+4 more)

### Community 7 - "script.js"
Cohesion: 0.11
Nodes (16): form, header, lightbox, lightboxCaption, lightboxClose, lightboxImage, mainNav, menuIcon (+8 more)

### Community 8 - "scripts"
Cohesion: 0.12
Nodes (16): allowScripts, esbuild@0.28.2, prisma@6.19.3, @prisma/client@6.19.3, @prisma/engines@6.19.3, name, private, scripts (+8 more)

### Community 9 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node, @types/react, @types/react-dom (+9 more)

### Community 10 - "data.ts"
Cohesion: 0.15
Nodes (23): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, HomePage(), CategoryRow (+15 more)

### Community 12 - "🚀 Panduan Publish — Hostinger Web Apps + Resend"
Cohesion: 0.10
Nodes (19): Jika gagal build / site error, Langkah 0 — Prasyarat, Langkah 1 — Siapkan kode (pilih A atau B), Langkah 2 — Buat aplikasi di hPanel, Langkah 3 — Domain & SSL, Langkah 4 — Verifikasi pasca-deploy, Langkah 5 — Aktifkan email notifikasi (Resend, gratis 3.000/bln), Langkah 6 (disarankan) — Foto upload permanen (Vercel Blob) (+11 more)

### Community 14 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): fraunces, jakarta, metadata

### Community 19 - "galeri/page.tsx"
Cohesion: 0.22
Nodes (7): deleteGalleryImage(), dynamic, metadata, AdminGalleryItem, GaleriList(), UploadForm(), UploadFormProps

## Knowledge Gaps
- **150 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `dynamic` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `prisma.ts` to `galeri/page.tsx`, `data.ts`, `actions.ts`, `(dashboard)/layout.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07765151515151515 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08597285067873303 - nodes in this community are weakly interconnected._