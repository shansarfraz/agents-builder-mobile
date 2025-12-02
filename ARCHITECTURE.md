# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Agent Builder Mobile                         │
│                      React Native / Expo                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ @supabase/supabase-js
                              │ Real-time WebSocket
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │   Realtime   │  │     Auth     │         │
│  │   Database   │  │  Pub/Sub     │  │   (Future)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Migrations
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Version Control (Git)                         │
│                  supabase/migrations/*.sql                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Create Agent Flow
```
1. User fills form in CreateAgentScreen
                  ↓
2. StorageService.createAgent()
                  ↓
3. Supabase INSERT query
                  ↓
4. PostgreSQL saves data
                  ↓
5. Realtime publishes INSERT event
                  ↓
6. All subscribed devices receive update
                  ↓
7. HomeScreen automatically shows new agent
```

### Real-time Sync Flow
```
Device A                    Supabase                    Device B
   │                           │                           │
   │──────Create Agent─────────>│                           │
   │                           │                           │
   │<──────Success─────────────│                           │
   │                           │                           │
   │                           │────Realtime Event────────>│
   │                           │                           │
   │                           │                      Updates UI
```

## File Structure

```
agent-builder-mobile/
├── src/
│   ├── config/
│   │   └── supabase.ts              # Supabase client setup
│   ├── services/
│   │   └── StorageService.ts        # Data layer (CRUD + Realtime)
│   ├── screens/
│   │   ├── HomeScreen.tsx           # List agents + realtime subscription
│   │   ├── CreateAgentScreen.tsx    # Create new agents
│   │   └── AgentDetailScreen.tsx    # View/edit agents
│   ├── components/
│   │   └── AgentCard.tsx            # Agent list item
│   └── types/
│       └── Agent.ts                 # TypeScript interfaces
│
├── supabase/
│   ├── config.toml                  # Supabase CLI config
│   ├── seed.sql                     # Sample data
│   └── migrations/                  # Database schema versions
│       ├── 20241202000001_create_agents_table.sql
│       ├── 20241202000002_add_updated_at_trigger.sql
│       ├── 20241202000003_enable_rls.sql
│       └── 20241202000004_enable_realtime.sql
│
└── Documentation/
    ├── QUICK_START.md               # Get started fast
    ├── MIGRATIONS.md                # Migration guide
    ├── SUPABASE_SETUP.md            # Supabase setup
    ├── INTEGRATION_SUMMARY.md       # Integration overview
    ├── DATABASE_MIGRATIONS_SUMMARY.md
    └── ARCHITECTURE.md              # This file
```

## Database Schema

```sql
┌──────────────────────────────────────────────────────┐
│                   public.agents                      │
├──────────────────┬───────────────┬───────────────────┤
│ Column           │ Type          │ Constraints       │
├──────────────────┼───────────────┼───────────────────┤
│ id               │ UUID          │ PRIMARY KEY       │
│ name             │ TEXT          │ NOT NULL          │
│ description      │ TEXT          │ NOT NULL          │
│ context          │ TEXT          │ NOT NULL          │
│ instructions     │ TEXT          │ NOT NULL          │
│ knowledge        │ TEXT          │ NOT NULL          │
│ created_at       │ TIMESTAMPTZ   │ DEFAULT NOW()     │
│ updated_at       │ TIMESTAMPTZ   │ AUTO-UPDATED      │
└──────────────────┴───────────────┴───────────────────┘

Indexes:
  - PRIMARY KEY: id
  - idx_agents_created_at (created_at DESC)
  - idx_agents_name (name)

Triggers:
  - set_updated_at: Auto-updates updated_at on UPDATE

Security:
  - Row Level Security: ENABLED
  - Policies: Anonymous + Authenticated access

Realtime:
  - Publication: supabase_realtime
  - Events: INSERT, UPDATE, DELETE
```

## Technology Stack

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Screen navigation
- **AsyncStorage** - Session persistence

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database (v17)
- **PostgREST** - Auto-generated REST API
- **Realtime** - WebSocket pub/sub

### DevOps
- **Supabase CLI** - Migration management
- **Git** - Version control
- **npm scripts** - Automation

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Transport Layer (HTTPS/WSS)               │
│  All communication encrypted                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: API Key Authentication                    │
│  Anon key for client-side requests                  │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: Row Level Security (RLS)                  │
│  Database-level access control                      │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Layer 4: Data Validation                           │
│  CHECK constraints, NOT NULL, etc.                  │
└─────────────────────────────────────────────────────┘
```

## Deployment Flow

```
Developer                    Git                    Supabase
    │                         │                         │
    │──1. Write Migration────>│                         │
    │                         │                         │
    │──2. Commit & Push──────>│                         │
    │                         │                         │
    │──3. npm run db:migrate──┼────4. Apply SQL───────>│
    │                         │                         │
    │<───────5. Confirmation──┼─────────────────────────│
```

## Future Enhancements

### Authentication
```sql
-- Add user ownership
ALTER TABLE agents ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies
CREATE POLICY "Users see own agents" ON agents
  FOR SELECT USING (auth.uid() = user_id);
```

### Multi-tenancy
```sql
-- Add organization support
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agents ADD COLUMN org_id UUID REFERENCES organizations(id);
```

### Advanced Features
- 📊 Analytics tracking
- 🔍 Full-text search
- 📱 Push notifications
- 🌐 Offline mode with sync queue
- 🤖 AI-powered suggestions
- 📈 Usage metrics

## Performance Considerations

### Database Indexes
- ✅ `created_at` DESC for recent agents
- ✅ `name` for search/sorting
- 🔮 Future: Full-text search on content

### Caching Strategy
- Client-side: React state
- Session: AsyncStorage
- Server: PostgreSQL query cache

### Realtime Optimization
- Selective subscriptions
- Event debouncing
- Connection pooling

## Monitoring & Observability

### Current
- Console logs in app
- Supabase dashboard metrics
- Error tracking in catch blocks

### Recommended (Production)
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Supabase Analytics** - Query performance
- **Custom metrics** - Business KPIs

## Scalability Path

### Phase 1: Current (MVP)
- Single database
- Direct client connections
- Real-time for all operations

### Phase 2: Growth (1K+ users)
- Connection pooling
- Edge functions for heavy logic
- Caching layer (Redis)

### Phase 3: Scale (10K+ users)
- Read replicas
- CDN for static assets
- Background job queue
- Microservices architecture

## Development Workflow

```
1. Local Development
   └─> Make code changes
   └─> Test locally with Expo

2. Database Changes
   └─> Create migration file
   └─> Test with: npm run db:reset
   └─> Apply: npm run db:migrate

3. Code Review
   └─> Commit to git
   └─> Open PR
   └─> Review & approve

4. Deployment
   └─> Merge to main
   └─> CI/CD runs migrations
   └─> App auto-updates via Expo
```

## Best Practices Implemented

✅ **Separation of Concerns**
- UI components separate from business logic
- StorageService abstracts data layer

✅ **Type Safety**
- TypeScript throughout
- Supabase type generation

✅ **Database Migrations**
- Version-controlled schema
- Repeatable deployments

✅ **Real-time Updates**
- Optimistic UI updates
- Automatic sync

✅ **Security First**
- RLS enabled
- Prepared for authentication

✅ **Documentation**
- Inline code comments
- Comprehensive guides
- Architecture docs

---

**Want to contribute?** Follow the patterns established in this architecture!

