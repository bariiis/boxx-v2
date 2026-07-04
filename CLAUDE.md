# STUUX BOXX - Project Guidelines

## Project Overview
STUUX is a high-performance workstation, GPU server, storage, and networking hardware company.
This is a full-stack web application with:
- **Public website**: Product pages, configurator, e-commerce, solutions pages
- **Admin panel**: CRM, quotes, support tickets, serial number tracking, product management
- **Customer portal**: Quote approval, support tickets, order tracking

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js v5 (NextAuth) with JWT strategy, role-based (ADMIN/EMPLOYEE/CUSTOMER)
- **State**: Zustand (for complex client-side state like configurator)
- **i18n**: next-intl (TR + EN + extensible)
- **Payment**: iyzico
- **Email**: Nodemailer with per-user SMTP support
- **PDF**: @react-pdf/renderer

## Project Structure
```
src/
├── app/
│   ├── (admin)/admin/    # Admin panel routes
│   ├── (auth)/           # Login, register
│   ├── (public)/         # Public website
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin-specific components
│   ├── ui/               # shadcn/ui components
│   └── public/           # Public site components
├── lib/
│   ├── actions/          # Server actions (CRUD operations)
│   ├── auth.ts           # Auth configuration
│   └── db.ts             # Prisma client singleton
├── types/                # TypeScript type extensions
└── generated/prisma/     # Prisma generated client
```

## Conventions
- **Language**: UI text is in Turkish. Code (variables, functions, comments) is in English.
- **Server Actions**: All CRUD operations use server actions in `src/lib/actions/`
- **Forms**: Client components with `"use client"`, using native form handling + server actions
- **Search**: Debounced AJAX search using server actions (e.g., `searchOrganizations`)
- **Components**: Reuse shadcn/ui primitives. Admin forms follow Card-based layout pattern.
- **Delete confirmations**: Always use Dialog-based confirmation before delete operations.
- **File naming**: kebab-case for files, PascalCase for components

## Database
- Schema is in `prisma/schema.prisma`
- Run `npx prisma migrate dev` for migrations
- Run `npx prisma db seed` for seed data
- Prisma client is generated to `src/generated/prisma/`

## Commands
```bash
npm run dev          # Start development server
npx prisma studio    # Open Prisma Studio (DB browser)
npx prisma migrate dev --name <name>  # Create migration
npx prisma db seed   # Seed database
npm run build        # Production build
```

## Key Patterns
- Admin routes: `/admin/*` protected by middleware (ADMIN or EMPLOYEE role required)
- Organization-Contact relationship: Contacts belong to one Organization (Ajax combobox search)
- Quote system: Versioned, with public token for customer-facing view
- Configurator: Rule-based hardware compatibility engine (admin-managed rules)

## Important Notes
- `.env` contains DATABASE_URL and AUTH_SECRET — never commit real secrets
- Default admin: admin@stuux.com / admin123 (change in production)
- Prisma output is in `src/generated/prisma` (not default `node_modules`)

























































<!-- cloude-code-toolbox:mcp-skills-awareness-begin -->

### MCP & Skills awareness (Cloude Code ToolBox)

_Last synced: 2026-07-04T20:54:37.475Z._

- **Full report:** `.claude/cloude-code-toolbox-mcp-skills-awareness.md` in this workspace (auto-overwritten on each scan). Use it as ground truth for configured servers and skill folders.
- **MCP:** For **live tools** in Claude Code, enable the matching server via `/mcp`. Servers are configured in `~/.claude.json` (user) and `.mcp.json` (project).
- **When the user’s task matches a server** (e.g. Confluence work and a **Confluence** / **Atlassian** MCP is listed), **prefer that server id** and plan on tool use—not only file search.
- **Skills:** Folders below contain `SKILL.md`; attach or cite paths in chat when relevant.

#### Workspace MCP

- `c:\Users\Baris\Projelerim\boxx\.mcp.json` _(workspace: boxx)_ — _file missing_

_No active workspace servers in mcp.json._

#### User MCP

- `C:\Users\Baris\.claude.json` — _servers defined_

| Server id | Kind | Detail |
|-----------|------|--------|
| magic | stdio | cmd /c npx -y @21st-dev/magic@latest |
| stitch | http | https://stitch.googleapis.com/mcp |
| Sanity | http | https://mcp.sanity.io |
| pencil | stdio | C:\Program Files\Pencil\resources\app.asar.unpacked\out\mcp-server-windows-x64.exe --app desktop |
| composio | http | https://connect.composio.dev/mcp |

#### Project skills

- **accessibility** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\accessibility` — Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- **composition-patterns** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\composition-patterns` — React composition patterns that scale. Use when refactoring components with

- **frontend-design** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\frontend-design` — Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing

- **gsap-core** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-core` — Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, 

- **gsap-frameworks** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-frameworks` — Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelt

- **gsap-performance** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-performance` — Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smoot

- **gsap-plugins** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-plugins` — Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, CustomWiggle, CustomBounce,

- **gsap-react** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-react` — Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount. Recommend GSAP for React 

- **gsap-scrolltrigger** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-scrolltrigger` — Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, 

- **gsap-timeline** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-timeline` — Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animat

- **gsap-utils** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\gsap-utils` — Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities 

- **next-best-practices** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\next-best-practices` — Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling

- **next-cache-components** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\next-cache-components` — Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag

- **next-upgrade** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\next-upgrade` — Upgrade Next.js to the latest version following official migration guides and codemods

- **nodejs-backend-patterns** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\nodejs-backend-patterns` — Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js serve

- **nodejs-best-practices** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\nodejs-best-practices` — Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- **prisma-cli** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\prisma-cli` — Prisma CLI commands reference covering all available commands, options, and usage patterns. Use when running Prisma CLI commands, setting up projects, generating client, running migrations, managing databases, or startin

- **prisma-client-api** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\prisma-client-api` — Prisma Client API reference covering model queries, filters, operators, and client methods. Use when writing database queries, using CRUD operations, filtering data, or configuring Prisma Client. Triggers on "prisma quer

- **prisma-database-setup** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\prisma-database-setup` — Guides for configuring Prisma with different database providers (PostgreSQL, MySQL, SQLite, MongoDB, etc.). Use when setting up a new project, changing databases, or troubleshooting connection issues. Triggers on "config

- **prisma-postgres** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\prisma-postgres` — Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db/cre

- **react-best-practices** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\react-best-practices` — React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on task

- **react-three-fiber** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\react-three-fiber` — React Three Fiber 3D renderer for json-render. Use when working with @json-render/react-three-fiber, building 3D scenes from JSON specs, rendering meshes/lights/models/environments, or integrating Three.js with json-rend

- **remotion** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\remotion` — Best practices for Remotion - Video creation in React

- **seo** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\seo` — Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- **shadcn** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\shadcn` — Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component regis

- **tailwind-css-patterns** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\tailwind-css-patterns` — Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svel

- **tailwind-v4-shadcn** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\tailwind-v4-shadcn` — | Production-tested setup for Tailwind CSS v4 with shadcn/ui, Vite, and React. Use when: initializing React projects with Tailwind v4, setting up shadcn/ui, implementing dark mode, debugging CSS variable issues, fixing t

- **threejs-animation** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-animation` — Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. Use when animating objects, playing GLTF animations, creating procedural motion, or blending animations.

- **threejs-fundamentals** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-fundamentals` — Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems. Use when setting up 3D scenes, creating cameras, configuring renderers, managing object hierarchies, or working with transforms.

- **threejs-geometry** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-geometry` — Three.js geometry creation - built-in shapes, BufferGeometry, custom geometry, instancing. Use when creating 3D shapes, working with vertices, building custom meshes, or optimizing with instanced rendering.

- **threejs-interaction** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-interaction` — Three.js interaction - raycasting, controls, mouse/touch input, object selection. Use when handling user input, implementing click detection, adding camera controls, or creating interactive 3D experiences.

- **threejs-lighting** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-lighting` — Three.js lighting - light types, shadows, environment lighting. Use when adding lights, configuring shadows, setting up IBL, or optimizing lighting performance.

- **threejs-loaders** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-loaders` — Three.js asset loading - GLTF, textures, images, models, async patterns. Use when loading 3D models, textures, HDR environments, or managing loading progress.

- **threejs-materials** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-materials` — Three.js materials - PBR, basic, phong, shader materials, material properties. Use when styling meshes, working with textures, creating custom shaders, or optimizing material performance.

- **threejs-postprocessing** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-postprocessing` — Three.js post-processing - EffectComposer, bloom, DOF, screen effects. Use when adding visual effects, color grading, blur, glow, or creating custom screen-space shaders.

- **threejs-shaders** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-shaders` — Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials.

- **threejs-textures** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\threejs-textures` — Three.js textures - texture types, UV mapping, environment maps, texture settings. Use when working with images, UV coordinates, cubemaps, HDR environments, or texture optimization.

- **typescript-advanced-types** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\typescript-advanced-types` — Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating r

- **ui-ux-pro-max** — `c:\Users\Baris\Projelerim\boxx\.claude\skills\ui-ux-pro-max` — UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 9 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Actions: plan, build, create, design, implement

- **accessibility** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\accessibility` — Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- **composition-patterns** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\composition-patterns` — React composition patterns that scale. Use when refactoring components with

- **frontend-design** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\frontend-design` — Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing

- **gsap-core** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-core` — Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, 

- **gsap-frameworks** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-frameworks` — Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelt

- **gsap-performance** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-performance` — Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smoot

- **gsap-plugins** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-plugins` — Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, CustomWiggle, CustomBounce,

- **gsap-react** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-react` — Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount. Recommend GSAP for React 

- **gsap-scrolltrigger** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-scrolltrigger` — Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, 

- **gsap-timeline** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-timeline` — Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animat

- **gsap-utils** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\gsap-utils` — Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities 

- **next-best-practices** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\next-best-practices` — Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling

- **next-cache-components** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\next-cache-components` — Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag

- **next-upgrade** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\next-upgrade` — Upgrade Next.js to the latest version following official migration guides and codemods

- **nodejs-backend-patterns** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\nodejs-backend-patterns` — Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js serve

- **nodejs-best-practices** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\nodejs-best-practices` — Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- **prisma-cli** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\prisma-cli` — Prisma CLI commands reference covering all available commands, options, and usage patterns. Use when running Prisma CLI commands, setting up projects, generating client, running migrations, managing databases, or startin

- **prisma-client-api** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\prisma-client-api` — Prisma Client API reference covering model queries, filters, operators, and client methods. Use when writing database queries, using CRUD operations, filtering data, or configuring Prisma Client. Triggers on "prisma quer

- **prisma-database-setup** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\prisma-database-setup` — Guides for configuring Prisma with different database providers (PostgreSQL, MySQL, SQLite, MongoDB, etc.). Use when setting up a new project, changing databases, or troubleshooting connection issues. Triggers on "config

- **prisma-postgres** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\prisma-postgres` — Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db/cre

- **react-best-practices** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\react-best-practices` — React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on task

- **react-three-fiber** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\react-three-fiber` — React Three Fiber 3D renderer for json-render. Use when working with @json-render/react-three-fiber, building 3D scenes from JSON specs, rendering meshes/lights/models/environments, or integrating Three.js with json-rend

- **remotion** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\remotion` — Best practices for Remotion - Video creation in React

- **seo** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\seo` — Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- **shadcn** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\shadcn` — Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component regis

- **tailwind-css-patterns** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\tailwind-css-patterns` — Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svel

- **tailwind-v4-shadcn** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\tailwind-v4-shadcn` — | Production-tested setup for Tailwind CSS v4 with shadcn/ui, Vite, and React. Use when: initializing React projects with Tailwind v4, setting up shadcn/ui, implementing dark mode, debugging CSS variable issues, fixing t

- **threejs-animation** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-animation` — Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. Use when animating objects, playing GLTF animations, creating procedural motion, or blending animations.

- **threejs-fundamentals** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-fundamentals` — Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems. Use when setting up 3D scenes, creating cameras, configuring renderers, managing object hierarchies, or working with transforms.

- **threejs-geometry** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-geometry` — Three.js geometry creation - built-in shapes, BufferGeometry, custom geometry, instancing. Use when creating 3D shapes, working with vertices, building custom meshes, or optimizing with instanced rendering.

- **threejs-interaction** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-interaction` — Three.js interaction - raycasting, controls, mouse/touch input, object selection. Use when handling user input, implementing click detection, adding camera controls, or creating interactive 3D experiences.

- **threejs-lighting** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-lighting` — Three.js lighting - light types, shadows, environment lighting. Use when adding lights, configuring shadows, setting up IBL, or optimizing lighting performance.

- **threejs-loaders** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-loaders` — Three.js asset loading - GLTF, textures, images, models, async patterns. Use when loading 3D models, textures, HDR environments, or managing loading progress.

- **threejs-materials** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-materials` — Three.js materials - PBR, basic, phong, shader materials, material properties. Use when styling meshes, working with textures, creating custom shaders, or optimizing material performance.

- **threejs-postprocessing** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-postprocessing` — Three.js post-processing - EffectComposer, bloom, DOF, screen effects. Use when adding visual effects, color grading, blur, glow, or creating custom screen-space shaders.

- **threejs-shaders** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-shaders` — Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials.

- **threejs-textures** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\threejs-textures` — Three.js textures - texture types, UV mapping, environment maps, texture settings. Use when working with images, UV coordinates, cubemaps, HDR environments, or texture optimization.

- **typescript-advanced-types** — `c:\Users\Baris\Projelerim\boxx\.agents\skills\typescript-advanced-types` — Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating r

#### User skills

- **clone-website** — `C:\Users\Baris\.claude\skills\clone-website` — Reverse-engineer and clone a website in one shot — extracts assets, CSS, and content section-by-section and proactively dispatches parallel builder agents in worktrees as it goes. Use this whenever the user wants to clon

- **frontend-slides** — `C:\Users\Baris\.claude\skills\frontend-slides` — Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. Use when the user wants to build a presentation, convert a PPT/PPTX to web, or create slides for a talk/pitch. Helps non-

- **graphify** — `C:\Users\Baris\.claude\skills\graphify` — any input (code, docs, papers, images) → knowledge graph → clustered communities → HTML + JSON + audit report

<!-- cloude-code-toolbox:mcp-skills-awareness-end -->
