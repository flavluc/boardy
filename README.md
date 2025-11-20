## Project Architecture

### Stack

- Front-End Framework / App Architecture
  - Next.js
- Styling & UI Components
  - Tailwind, shadcn/ui
- Forms & Validation
  - React Hook Form + Zod
- State Management
  - Zustand
- Data Fetching & Server State
  - React Query (TanStack Query)
- Backend Framework
  - Express
- Database ORM
  - Postgres, TypeORM
- Deployment / Hosting
  - Vercel, Supabase
- Infrastructure / Production Ops (only overview of concepts)
  - Kubernetes, Terraform, Prometheus, Grafana, Sentry
- Testing
  - Vitest, Playwright, MSW
- Tooling
  - TypeScript, pnpm, Turborepo
- Editor / Extensions
  - VS Code, (what more?)

### Overview

This is a **monorepo** project using **Turborepo** made to study modern TypeScript stack.

### Monorepo Structure

```
boardy/
├── apps/
│   ├── api/          # Express backend API
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared TypeScript types and Zod schemas
└── exercises/        # Practice exercises
```

### Backend Architecture (`apps/api`)

**Framework**: Express.js with TypeScript  
**Database**: PostgreSQL with TypeORM  
**Authentication**: JWT-based with refresh token rotation

#### Layered Architecture

```
src/
├── config/           # Environment configuration
├── db/
│   ├── entities/     # TypeORM database models
│   ├── migrations/   # Database migrations
│   └── data-source.ts
├── middlewares/      # Express middleware (auth, error handling)
├── modules/          # Feature modules
│   ├── auth/
│   │   ├── controller.ts   # HTTP handlers
│   │   ├── service.ts      # Business logic
│   │   ├── repository.ts   # Data access
│   │   └── router.ts       # Route definitions
│   ├── project/
│   └── user/
├── utils/            # Shared utilities (JWT, password hashing, errors)
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

### Frontend Architecture (`apps/web`)

**Framework**: Next.js 15 with App Router  
**Styling**: Tailwind CSS + shadcn/ui components  
**State Management**: React Query (server) + Zustand (client)

#### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Protected dashboard page
│   ├── login/              # Authentication pages
│   ├── register/
│   ├── layout.tsx          # Root layout with providers
│   └── providers.tsx       # React Query + token initialization
├── components/
│   ├── layout/             # Layout components (Toolbar)
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── api.ts              # Centralized API client
│   ├── token.ts            # Token management utilities
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript type definitions
```

### Shared Package (`packages/shared`)

**Purpose**: Type-safe contracts between frontend and backend

```
src/
├── schemas/              # Zod schemas
│   ├── auth.ts           # Login, register, refresh
│   ├── user.ts           # User CRUD schemas
│   ├── project.ts        # Project CRUD schemas
│   └── task.ts           # Task schemas
├── primitives.ts         # Common primitives (Id, ISODate, etc.)
└── index.ts              # Public API
```
