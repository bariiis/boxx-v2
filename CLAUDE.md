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
