# 🚀 Supabase Integration Setup Guide

## Step 1: Get Your Supabase Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **gwylysqaitmekgpgyrqa**
3. Navigate to: **Settings** → **API**
4. Copy the **`anon` `public`** key (it's a long string starting with `eyJ...`)

## Step 2: Update the Supabase Configuration

Open the file: `src/config/supabase.ts`

Replace this line:
```typescript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With your actual anon key:
```typescript
const SUPABASE_ANON_KEY = 'eyJhbGc...your-actual-key';
```

## Step 3: Create the Database Table

1. Go to: https://supabase.com/dashboard/project/gwylysqaitmekgpgyrqa/editor
2. Click on **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-setup.sql`
5. Click **Run** or press `Cmd/Ctrl + Enter`

This will create:
- ✅ `agents` table with proper schema
- ✅ Auto-updating `updated_at` timestamp
- ✅ Row Level Security (RLS) policies
- ✅ Real-time enabled for live updates

## Step 4: Verify Setup

Run these queries in SQL Editor to verify:

```sql
-- Check if table exists
SELECT * FROM agents;

-- Check if realtime is enabled
SELECT * FROM pg_publication_tables WHERE tablename = 'agents';
```

## Step 5: Test the App

1. Make sure your Expo server is running: `npm start`
2. Open the app on your device or simulator
3. Create a new agent
4. Open the app on another device (or browser)
5. You should see the agent appear in real-time! 🎉

## What Changed?

### ✅ Before (AsyncStorage)
- Data stored locally on device only
- No sync across devices
- Lost if app is uninstalled

### ✅ After (Supabase)
- Data stored in cloud (PostgreSQL)
- Real-time sync across all devices
- Persistent and backed up
- Multi-user support ready

## Real-time Features

Your app now has real-time subscriptions! When any device:
- **Creates** an agent → All devices see it instantly
- **Updates** an agent → Changes appear everywhere
- **Deletes** an agent → Removed from all screens

## Security Notes

⚠️ **Current Setup:** All users can read/write all agents

For production B2B SaaS, you should:
1. Add authentication (Supabase Auth)
2. Add user_id column to agents table
3. Update RLS policies to restrict access:
   ```sql
   -- Only see your own agents
   CREATE POLICY "Users can only see their own agents" ON agents
     FOR SELECT USING (auth.uid() = user_id);
   ```

## Troubleshooting

### Error: "relation 'agents' does not exist"
- Run the `supabase-setup.sql` in SQL Editor

### Error: "Invalid API key"
- Double-check your anon key in `src/config/supabase.ts`
- Make sure you copied the **anon/public** key, not the service_role key

### Real-time not working
- Verify realtime is enabled: `ALTER PUBLICATION supabase_realtime ADD TABLE agents;`
- Check your internet connection
- Look for errors in the console

## Next Steps

Consider adding:
- 🔐 User authentication
- 👥 Team/organization support
- 📊 Analytics and usage tracking
- 🔍 Search and filtering
- 📱 Push notifications
- 🌐 Offline mode with sync

## Support

- Supabase Docs: https://supabase.com/docs
- Your Project: https://supabase.com/dashboard/project/gwylysqaitmekgpgyrqa

