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

**Key Benefits:**

- **Code sharing**: Type-safe contracts between frontend and backend via `@boardy/shared`
- **Unified builds**: Turborepo orchestrates builds, tests, and dev servers
- **Type safety**: End-to-end TypeScript with shared validation schemas

---

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

#### Key Patterns

1. **Controller-Service-Repository Pattern**
   - **Controllers**: Handle HTTP requests/responses, validate input
   - **Services**: Contain business logic, orchestrate operations
   - **Repositories**: Abstract database operations using TypeORM

2. **Module-Based Organization**
   - Each feature (auth, project, user) is self-contained
   - Clear boundaries and responsibilities

3. **Middleware Pipeline**
   - `authGuard`: JWT validation and user identification
   - `errorHandler`: Centralized error handling with proper HTTP status codes

4. **Type-Safe Error Handling**
   - Custom `ApiError` class with error codes
   - Consistent error responses via `ErrorEnvelope`

#### Authentication Flow

```
1. Register/Login → Generate access token (15m) + refresh token (7d)
2. Access token → Stored in memory, sent via Authorization header
3. Refresh token → HttpOnly cookie, stored in database
4. Token rotation → Old refresh tokens revoked on use (prevents replay attacks)
5. Logout → Revokes refresh token in database
```

#### Database Entities

- **User**: Email, hashed password, timestamps
- **Project**: Title, owner relation, timestamps
- **RefreshToken**: JWT ID (jti), user relation, revoked flag
- **Task**: (Planned) Assignee, status, columns
- **Column**: (Planned) Board structure

---

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

#### Key Patterns

1. **Server-State Management (React Query)**
   - Handles all API data fetching, caching, and synchronization
   - Automatic background refetching and cache invalidation
   - Optimistic updates for better UX

2. **Client-State Management (Zustand)**
   - Lightweight store for UI state (modals, selected items, etc.)
   - Simple, boilerplate-free API

3. **API Client Pattern**
   - Centralized `api.ts` handles all HTTP requests
   - Automatic token injection from cookies
   - Request/response interceptors for auth handling

4. **Form Handling**
   - React Hook Form for form state
   - Zod schemas from `@boardy/shared` for validation
   - Type-safe form inputs and error messages

5. **Component Architecture**
   - shadcn/ui for base components (customizable, not a library)
   - Custom components in `components/` for business logic
   - Layout components for page structure

---

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

#### Benefits

- **Single source of truth**: One schema definition for both ends
- **Runtime validation**: Zod validates at runtime (frontend forms, backend requests)
- **Type inference**: TypeScript types automatically inferred from schemas
- **API contracts**: Request/response shapes guaranteed to match

**Example:**

```typescript
// Defined once in shared package
export const CreateProject = z.object({
  title: z.string().min(1),
  ownerId: Id,
})

// Used in backend service
const { title, ownerId } = CreateProject.parse(data)

// Used in frontend form
type CreateProjectForm = z.infer<typeof CreateProject>
```

---

### Development Workflow

#### Running the Application

```bash
# Install dependencies
pnpm install

# Run both frontend and backend in parallel
pnpm dev

# Run individually
cd apps/api && pnpm dev    # Backend on http://localhost:3001
cd apps/web && pnpm dev    # Frontend on http://localhost:3000
```

#### Testing

```bash
# Run all tests across the monorepo
pnpm test

# Run tests for specific package
cd apps/api && pnpm test

# Test types:
# - Unit tests (utils, helpers)
# - Service tests (business logic)
# - Integration tests (full HTTP flow)
```

#### Database Migrations

```bash
cd apps/api

# Generate migration from entity changes
pnpm db:generate

# Run migrations
pnpm db:run

# Revert last migration
pnpm db:revert
```

---

### Key Design Decisions

#### 1. **Why Monorepo?**

- Shared code reduces duplication
- Atomic changes across frontend/backend
- Simplified dependency management

#### 2. **Why TypeORM?**

- TypeScript-first ORM with decorators
- Migration system built-in
- Active Record pattern familiar to developers

#### 3. **Why JWT with Refresh Tokens?**

- Stateless access tokens (no DB lookup per request)
- Refresh tokens allow revocation and session management
- Token rotation prevents replay attacks

#### 4. **Why React Query?**

- Eliminates boilerplate for server state
- Built-in caching, retries, background updates
- Better developer experience with DevTools

#### 5. **Why Module-Based Backend?**

- Clear feature boundaries
- Easier to navigate and maintain
- Natural fit for team scaling

---

### Future Improvements

1. **Security**
   - Add rate limiting to auth endpoints
   - Implement CSRF protection
   - Add request logging/audit trail

2. **Features**
   - Complete Task and Column entities
   - Real-time updates via WebSockets
   - File uploads for project attachments

3. **Infrastructure**
   - Add API documentation (Swagger/OpenAPI)
   - Implement caching layer (Redis)
   - Set up CI/CD pipelines

4. **Testing**
   - Add E2E tests with Playwright
   - Increase unit test coverage
   - Add API contract tests

---

### Environment Variables

#### Backend (`apps/api/.env`)

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/boardy
JWT_ACCESS_SECRET=your-access-secret-min-16-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-16-chars
WEB_URL=http://localhost:3000
```

#### Frontend (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```
