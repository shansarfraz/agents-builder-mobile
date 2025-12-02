# 🚀 Quick Start - 4 Steps to Get Running

## ⚡ Step 1: Get Your Supabase Anon Key (2 minutes)

1. Visit: https://supabase.com/dashboard/project/gwylysqaitmekgpgyrqa/settings/api
2. Find **"Project API keys"** section
3. Copy the **"anon" "public"** key (starts with `eyJ...`)

## ⚡ Step 2: Update Config (30 seconds)

Open: `src/config/supabase.ts`

Replace this line:
```typescript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With:
```typescript
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Your actual key
```

## ⚡ Step 3: Link Supabase Project (30 seconds)

```bash
npm run supabase:link
```

This connects your local migrations to your remote database.

## ⚡ Step 4: Run Database Migrations (30 seconds)

```bash
npm run db:migrate
```

This creates your database schema automatically! ✨

## ✅ Done! Test It:

```bash
npm start
```

Open app on your device with Expo Go and create an agent!

---

**Need help?** 
- Migrations: Read `MIGRATIONS.md`
- Supabase: Read `SUPABASE_SETUP.md`

