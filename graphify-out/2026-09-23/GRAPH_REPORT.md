# Graph Report - tciptakarya-main  (2026-09-23)

## Corpus Check
- 55 files · ~139,567 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 496 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- upload/route.ts
- dependencies
- content.ts
- script.js
- scripts
- devDependencies
- data.ts
- migrate-categories.ts
- Website Talenta Cipta Karya — v2.1 (Next.js)
- login/page.tsx
- app/layout.tsx
- AGENTS.md
- next.config.ts
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `prisma` - 13 edges
3. `requireAdmin()` - 12 edges
4. `refresh()` - 12 edges
5. `safe()` - 9 edges
6. `getActiveCategories()` - 9 edges
7. `updateCategory()` - 8 edges
8. `Reveal()` - 8 edges
9. `slugify()` - 8 edges
10. `scripts` - 8 edges

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
Nodes (23): dynamic, Footer(), NAV_LINKS, GalleryGrid(), GalleryItem, LightboxState, Header(), NAV_LINKS (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, legacy, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "prisma.ts"
Cohesion: 0.06
Nodes (23): dynamic, metadata, dynamic, metadata, CARDS, dynamic, dynamic, metadata (+15 more)

### Community 3 - "actions.ts"
Cohesion: 0.10
Nodes (37): ActionState, categorySlugData(), createCategory(), createProgram(), createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteContactMessage() (+29 more)

### Community 4 - "upload/route.ts"
Cohesion: 0.11
Nodes (18): AdminLayout(), dynamic, NAV, POST(), runtime, SignOutButton(), authConfig, credentialsSchema (+10 more)

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
Cohesion: 0.14
Nodes (24): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, HomePage(), CategoryRow (+16 more)

### Community 11 - "migrate-categories.ts"
Cohesion: 0.53
Nodes (5): DEFAULT_CATEGORIES, ensureCategory(), main(), prisma, resolveSlug()

### Community 12 - "Website Talenta Cipta Karya — v2.1 (Next.js)"
Cohesion: 0.29
Nodes (6): Catatan, Deploy ke Vercel (roadmap PRD §9 langkah 2–6), Konfigurasi (.env), Menjalankan lokal, Struktur, Website Talenta Cipta Karya — v2.1 (Next.js)

### Community 14 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): fraunces, jakarta, metadata

## Knowledge Gaps
- **138 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `dynamic` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `prisma.ts` to `data.ts`, `actions.ts`, `upload/route.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `slugify()` connect `actions.ts` to `migrate-categories.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0641025641025641 - nodes in this community are weakly interconnected._