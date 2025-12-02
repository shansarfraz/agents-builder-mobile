# 🔄 Database Migrations Guide

## Overview

This project uses **Supabase CLI** for professional database schema management with version-controlled migrations. This is the industry-standard approach for B2B SaaS applications.

## 📁 Migration Structure

```
supabase/
├── config.toml                    # Supabase configuration
└── migrations/                    # Version-controlled migrations
    ├── 20241202000001_create_agents_table.sql
    ├── 20241202000002_add_updated_at_trigger.sql
    ├── 20241202000003_enable_rls.sql
    └── 20241202000004_enable_realtime.sql
```

## 🚀 Quick Start

### 1. Link to Your Supabase Project

```bash
npm run supabase:link
```

This connects your local project to your remote Supabase instance.

### 2. Push Migrations to Production

```bash
npm run db:migrate
```

This applies all migrations in `supabase/migrations/` to your remote database.

### 3. Check Migration Status

```bash
npm run db:status
```

Shows which migrations have been applied and which are pending.

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Push all pending migrations to remote database |
| `npm run db:pull` | Pull the current remote schema as a new migration |
| `npm run db:diff` | Show differences between local and remote schema |
| `npm run db:status` | List all migrations and their status |
| `npm run db:reset` | Reset local database and reapply all migrations |
| `npm run supabase:start` | Start local Supabase (Docker required) |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:link` | Link to remote Supabase project |

## 🏗️ Current Migrations

### Migration 1: Create Agents Table
**File:** `20241202000001_create_agents_table.sql`

Creates the main `agents` table with:
- UUID primary key
- All required fields (name, description, context, instructions, knowledge)
- Timestamps (created_at, updated_at)
- Indexes for performance
- Data validation constraints

### Migration 2: Auto-Update Timestamp
**File:** `20241202000002_add_updated_at_trigger.sql`

Adds a database trigger that automatically updates `updated_at` when any row is modified.

### Migration 3: Row Level Security (RLS)
**File:** `20241202000003_enable_rls.sql`

Enables Row Level Security with policies:
- ✅ Anonymous access (for development)
- ✅ Authenticated user access
- ⚠️ **TODO:** Replace with user-specific policies for production

### Migration 4: Enable Realtime
**File:** `20241202000004_enable_realtime.sql`

Enables real-time subscriptions for the `agents` table so changes sync instantly across all devices.

## 🔄 Development Workflow

### Creating a New Migration

#### Option 1: Manual Migration File

```bash
# Create a new migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name.sql
```

Edit the file and add your SQL:

```sql
-- Migration: Add user_id to agents
-- Description: Associate agents with specific users

ALTER TABLE public.agents ADD COLUMN user_id UUID REFERENCES auth.users(id);
CREATE INDEX idx_agents_user_id ON public.agents(user_id);
```

#### Option 2: Generate from Schema Diff

```bash
# Make changes in Supabase Dashboard
# Then pull those changes as a new migration
npm run db:pull
```

### Applying Migrations

```bash
# Apply to remote database
npm run db:migrate

# Or reset and reapply all migrations locally (requires Docker)
npm run db:reset
```

## 🎯 Best Practices

### ✅ DO

1. **Always use migrations** - Never manually modify production database
2. **Descriptive names** - Use clear migration file names
3. **One logical change per migration** - Keep migrations focused
4. **Include rollback** - Add comments on how to revert changes
5. **Test locally first** - Use `supabase start` for local testing (requires Docker)
6. **Version control** - Commit migrations to git
7. **Review before push** - Check with `db:diff` before migrating

### ❌ DON'T

1. **Don't edit applied migrations** - Create a new migration instead
2. **Don't delete migrations** - They're your schema history
3. **Don't skip migrations** - Apply them in order
4. **Don't modify production directly** - Always use migrations

## 🔐 Production Security Checklist

Before going to production, update RLS policies:

```sql
-- Remove anonymous access
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.agents;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.agents;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.agents;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.agents;

-- Add user_id column
ALTER TABLE public.agents ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create user-specific policies
CREATE POLICY "Users can view their own agents"
  ON public.agents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents"
  ON public.agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents"
  ON public.agents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

## 🐛 Troubleshooting

### Error: "Project not linked"
```bash
npm run supabase:link
```

### Error: "Migration already applied"
Check status and skip if needed:
```bash
npm run db:status
```

### Error: "Permission denied"
Make sure you have the correct database password in your Supabase dashboard credentials.

### Want to see what changed?
```bash
npm run db:diff
```

## 🔗 Connecting to Remote Database

Your database connection details are in `env.md`:

```
Host: db.gwylysqaitmekgpgyrqa.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: 6gSL1ZIkUNG9PQNo
```

**Connection String:**
```
postgresql://postgres:6gSL1ZIkUNG9PQNo@db.gwylysqaitmekgpgyrqa.supabase.co:5432/postgres
```

## 📚 Additional Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🎯 Next Steps

1. **Link your project:** `npm run supabase:link`
2. **Push migrations:** `npm run db:migrate`
3. **Verify:** Check your Supabase dashboard
4. **Test:** Create an agent in your app!

## 🏢 For Teams

### Setting Up New Developer

1. Clone repository
2. Run `npm install`
3. Run `npm run supabase:link`
4. Migrations are automatically applied when linked

### CI/CD Integration

Add to your deployment pipeline:

```yaml
# Example GitHub Actions
- name: Run Supabase Migrations
  run: |
    npm install
    npm run db:migrate
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

**Questions?** Check the [Supabase documentation](https://supabase.com/docs) or create an issue.

