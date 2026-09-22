# Graph Report - tciptakarya-main  (2026-09-23)

## Corpus Check
- 56 files · ~139,808 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 323 nodes · 501 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- (public)/page.tsx
- compilerOptions
- prisma.ts
- actions.ts
- (dashboard)/layout.tsx
- dependencies
- schemas.ts
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
- galeri/page.tsx
- auth.ts

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
- `TestimoniManager()` --indirect_call--> `createTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `EditRow()` --indirect_call--> `updateTestimonial()`  [INFERRED]
  components/admin/TestimoniManager.tsx → app/admin/actions.ts
- `KategoriManager()` --indirect_call--> `createCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts
- `CategoryRow()` --indirect_call--> `updateCategory()`  [INFERRED]
  components/admin/KategoriManager.tsx → app/admin/actions.ts
- `ProgramManager()` --indirect_call--> `createProgram()`  [INFERRED]
  components/admin/ProgramManager.tsx → app/admin/actions.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (21): dynamic, Footer(), NAV_LINKS, GalleryGrid(), GalleryItem, LightboxState, About(), Hero() (+13 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, legacy, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "prisma.ts"
Cohesion: 0.08
Nodes (18): dynamic, metadata, CARDS, dynamic, dynamic, metadata, dynamic, metadata (+10 more)

### Community 3 - "actions.ts"
Cohesion: 0.15
Nodes (27): ActionState, categorySlugData(), createCategory(), createProgram(), createTestimonial(), deleteCategory(), deleteCategoryAction(), deleteContactMessage() (+19 more)

### Community 4 - "(dashboard)/layout.tsx"
Cohesion: 0.19
Nodes (11): AdminLayout(), dynamic, NAV, SignOutButton(), Header(), NAV_LINKS, ThemeToggle(), blobEnabled() (+3 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (21): bcryptjs, next, next-auth, dependencies, bcryptjs, next, next-auth, @prisma/client (+13 more)

### Community 6 - "schemas.ts"
Cohesion: 0.16
Nodes (14): POST(), POST(), runtime, EmailStatus, sendContactNotification(), ALLOWED_IMAGE_TYPES, CategoryInput, categorySchema (+6 more)

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
Cohesion: 0.09
Nodes (36): dynamic, KelasIndexPage(), metadata, generateMetadata(), KelasSlugPage(), Props, HomePage(), CATEGORIES (+28 more)

### Community 11 - "migrate-categories.ts"
Cohesion: 0.53
Nodes (5): DEFAULT_CATEGORIES, ensureCategory(), main(), prisma, resolveSlug()

### Community 12 - "Website Talenta Cipta Karya — v2.1 (Next.js)"
Cohesion: 0.29
Nodes (6): Catatan, Deploy ke Vercel (roadmap PRD §9 langkah 2–6), Konfigurasi (.env), Menjalankan lokal, Struktur, Website Talenta Cipta Karya — v2.1 (Next.js)

### Community 14 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): fraunces, jakarta, metadata

### Community 19 - "galeri/page.tsx"
Cohesion: 0.24
Nodes (6): dynamic, metadata, AdminGalleryItem, GaleriList(), UploadForm(), UploadFormProps

### Community 20 - "auth.ts"
Cohesion: 0.28
Nodes (5): authConfig, credentialsSchema, { handlers, auth, signIn, signOut }, { auth }, config

## Knowledge Gaps
- **138 isolated node(s):** `Props`, `dynamic`, `metadata`, `dynamic`, `dynamic` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `prisma.ts` to `actions.ts`, `(dashboard)/layout.tsx`, `schemas.ts`, `data.ts`, `galeri/page.tsx`, `auth.ts`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `slugify()` connect `actions.ts` to `migrate-categories.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Props`, `dynamic`, `metadata` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08045977011494253 - nodes in this community are weakly interconnected._