# boxx — Development Setup

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 14+ (running locally on port 5432) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in secrets
cp .env.example .env   # (or create .env manually — see below)

# 3. Run database migrations
npx prisma migrate deploy

# 4. Start dev server
npm run dev
```

App runs at **http://localhost:3000**

---

## Environment Variables

Create `.env` in the project root:

```env
# PostgreSQL connection string — database "boxx" must exist
DATABASE_URL="postgresql://postgres@localhost:5432/boxx?schema=public"

# Auth — generate a real secret for any non-local environment:
#   openssl rand -hex 32
AUTH_SECRET="change-this-to-a-secure-random-string-in-production"

# NextAuth callback base URL
NEXTAUTH_URL="http://localhost:3000"
```

**Notes:**
- `AUTH_SECRET` must be changed before deploying to any shared/production environment.
- SMTP credentials are stored per-user in the database (`SmtpConfig` model) — no env var required.
- No external API keys are required to run the admin CRM locally.

---

## Database Setup

PostgreSQL must be running. Create the database if it doesn't exist:

```sql
CREATE DATABASE boxx;
```

Then apply all migrations:

```bash
npx prisma migrate deploy
```

To check migration status:

```bash
npx prisma migrate status
```

To open Prisma Studio (GUI browser for the database):

```bash
npx prisma studio
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (Turbopack, hot reload) |
| `npm run build` | Production build (type-checks + bundle) |
| `npm run start` | Start production server (requires `build` first) |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Create a new migration from schema changes |
| `npx prisma migrate deploy` | Apply pending migrations |
| `npx prisma studio` | Open database GUI |

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5**
- **Tailwind CSS 4 + shadcn/ui**
- **Prisma 7** with PostgreSQL (pg adapter)
- **NextAuth v5 (beta)** — credential + session auth
- **Zustand** — client state
- **Tiptap 3** — rich text editing
- **Recharts** — charts/analytics
- **@react-three/fiber** + **Three.js** — 3D product viewer
- **Remotion** — animation components (public marketing pages)

---

## Project Structure

```
src/
├── app/
│   ├── (admin)/admin/   # CRM admin: organizations, contacts, products, tickets, quotes, solutions
│   ├── (public)/        # Public website: home, cozumler (solutions), urunler (products)
│   ├── portal/          # Customer self-service portal
│   ├── quote/[token]    # Public quote view (share link)
│   └── api/             # Route handlers
├── components/
│   ├── ui/              # shadcn/ui + custom base components
│   ├── admin/           # Admin-only UI
│   ├── public/          # Public website components
│   └── landing/         # Marketing/landing page components
├── lib/                 # Prisma client, auth config, utilities
└── generated/prisma/    # Auto-generated Prisma client (do not edit)
prisma/
├── schema.prisma        # Single source of truth for all models
└── migrations/          # 15 migrations (up to date)
```

---

## Known Issues / Notes

- **No `.env.example`** — the `.env` template above is the reference; a `.env.example` should be committed.
- **Auth secret** — the default `AUTH_SECRET` in `.env` is a placeholder. It works locally but must be rotated for any deployment.
- **No Docker Compose** — PostgreSQL is expected to run natively. A `docker-compose.yml` would simplify onboarding.
- **Remotion Player** — `st-marquee.tsx` uses `@remotion/player` which requires the `component` prop to be cast; this is a known Remotion v4 typing limitation.
- **sample-data.json** (`src/components/public/home/`) — only contains `hero`, `featuredProducts`, and `customerLogos`. The remaining fields (`featuredCategories`, `featuredSolutions`, etc.) resolve to `undefined` at runtime; real data should come from the API.

---

## First-Time Setup Checklist

- [ ] PostgreSQL running locally on port 5432
- [ ] `boxx` database created
- [ ] `.env` file created with correct `DATABASE_URL`
- [ ] `npm install` completed
- [ ] `npx prisma migrate deploy` run — should show "Database schema is up to date"
- [ ] `npm run dev` starts without errors at http://localhost:3000
- [ ] `npm run build` passes (production build)
